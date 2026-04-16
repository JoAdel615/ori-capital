#!/usr/bin/env node
/**
 * Build and upload `dist/` to cPanel via UAPI Fileman::upload_files.
 * Reads vault/cpanel.env (gitignored). Auth: header `cpanel user:token` (not Basic).
 *
 * Env (in vault/cpanel.env):
 *   CPANEL_HOST, CPANEL_PORT (default 2083), CPANEL_USER, CPANEL_API_TOKEN
 *   CPANEL_UPLOAD_DIR (default public_html) — path under home, no leading slash
 *   CPANEL_INSECURE_SSL=1 — skip TLS verify (debug only)
 *   CPANEL_MAX_UPLOAD_MB — skip files larger than this (default 100). Set 0 for no limit.
 */

import { readdirSync, readFileSync, statSync } from "node:fs";
import { basename, dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";
import undici from "undici";

const { Agent, FormData, fetch: undiciFetch } = undici;

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");

function loadEnvFile(path) {
  const out = {};
  let raw = "";
  try {
    raw = readFileSync(path, "utf8");
  } catch {
    return out;
  }
  for (const line of raw.split("\n")) {
    const t = line.trim();
    if (!t || t.startsWith("#")) continue;
    const eq = t.indexOf("=");
    if (eq <= 0) continue;
    const k = t.slice(0, eq).trim();
    let v = t.slice(eq + 1).trim();
    if (
      (v.startsWith('"') && v.endsWith('"')) ||
      (v.startsWith("'") && v.endsWith("'"))
    ) {
      v = v.slice(1, -1);
    }
    if (k) out[k] = v;
  }
  return out;
}

function walkFiles(dir, base = dir) {
  const out = [];
  for (const name of readdirSync(dir)) {
    if (name === ".DS_Store") continue;
    const full = join(dir, name);
    const st = statSync(full);
    if (st.isDirectory()) out.push(...walkFiles(full, base));
    else out.push(full);
  }
  return out;
}

function posixDir(relFromDist) {
  if (!relFromDist || relFromDist === ".") return "";
  return relFromDist.split(/[/\\]/).join("/");
}

async function main() {
  const vaultPath = join(root, "vault", "cpanel.env");
  const env = loadEnvFile(vaultPath);
  const host = env.CPANEL_HOST?.trim();
  const user = env.CPANEL_USER?.trim();
  const token = env.CPANEL_API_TOKEN?.trim();
  const port = env.CPANEL_PORT?.trim() || "2083";
  const uploadRoot = (env.CPANEL_UPLOAD_DIR || "public_html").replace(/^\/+/, "").replace(/\/+$/, "");

  if (!host || !user || !token) {
    console.error(
      "Missing CPANEL_HOST, CPANEL_USER, or CPANEL_API_TOKEN in vault/cpanel.env"
    );
    process.exit(1);
  }

  const distDir = join(root, "dist");
  /** @type {string[]} */
  let files;
  try {
    files = walkFiles(distDir);
  } catch {
    console.error("No dist/ folder. Run: npm run build");
    process.exit(1);
  }
  if (files.length === 0) {
    console.error("dist/ is empty. Run: npm run build");
    process.exit(1);
  }

  const maxMbRaw = env.CPANEL_MAX_UPLOAD_MB;
  const maxBytes =
    maxMbRaw === "0" || maxMbRaw === ""
      ? Infinity
      : Number(maxMbRaw || 100) * 1024 * 1024;

  const skipped = [];
  files = files.filter((abs) => {
    const sz = statSync(abs).size;
    if (sz <= maxBytes) return true;
    skipped.push({ abs, sz });
    return false;
  });
  for (const { abs, sz } of skipped) {
    console.warn(
      `  skip  ${relative(distDir, abs)} (${(sz / 1024 / 1024).toFixed(1)} MiB > limit — use SFTP/File Manager or CPANEL_MAX_UPLOAD_MB=0)`
    );
  }

  const url = `https://${host}:${port}/execute/Fileman/upload_files`;
  const authHeader = `cpanel ${user}:${token}`;
  const insecure = env.CPANEL_INSECURE_SSL === "1" || env.CPANEL_INSECURE_SSL === "true";

  /** Large MP4 uploads need far more than Node’s default ~300s headers timeout. */
  const uploadAgent = new Agent({
    headersTimeout: 900_000,
    bodyTimeout: 900_000,
    connectTimeout: 120_000,
    ...(insecure ? { connect: { rejectUnauthorized: false } } : {}),
  });

  try {
    /** @type {Map<string, { path: string, name: string }[]>} */
    const byDir = new Map();
    for (const abs of files) {
      const rel = relative(distDir, abs);
      const dirRel = posixDir(dirname(rel));
      const cpanelDir = dirRel ? `${uploadRoot}/${dirRel}` : uploadRoot;
      const fileName = basename(rel);
      if (!byDir.has(cpanelDir)) byDir.set(cpanelDir, []);
      byDir.get(cpanelDir).push({ path: abs, name: fileName });
    }

    /** One file per request avoids huge multipart bodies (e.g. multiple videos) and reduces timeouts. */
    const BATCH = 1;
    let uploaded = 0;

    for (const [cpanelDir, list] of byDir) {
      for (let i = 0; i < list.length; i += BATCH) {
        const chunk = list.slice(i, i + BATCH);
        /** Undici `fetch` expects undici’s FormData/File for reliable multipart encoding. */
        const form = new FormData();
        form.set("dir", cpanelDir);
        form.set("overwrite", "1");
        let n = 1;
        for (const { path: filePath, name } of chunk) {
          const buf = readFileSync(filePath);
          form.set(`file-${n}`, new File([buf], name, { type: "application/octet-stream" }));
          n += 1;
        }

        const res = await undiciFetch(url, {
          method: "POST",
          headers: {
            Authorization: authHeader,
          },
          body: form,
          dispatcher: uploadAgent,
        });

        const text = await res.text();
        let json;
        try {
          json = JSON.parse(text);
        } catch {
          console.error(`HTTP ${res.status} (non-JSON):`, text.slice(0, 500));
          process.exit(1);
        }

        if (!res.ok) {
          console.error(`HTTP ${res.status}:`, JSON.stringify(json, null, 2));
          process.exit(1);
        }

        const status = json.status;
        if (status !== 1) {
          console.error("cPanel API error:", JSON.stringify(json, null, 2));
          process.exit(1);
        }

        for (const { name } of chunk) {
          console.log(`  ok  ${cpanelDir}/${name}`);
          uploaded += 1;
        }
      }
    }

    console.log(`\nUploaded ${uploaded} files to https://${host}/ (${uploadRoot})`);
    if (skipped.length) {
      console.log(`Skipped ${skipped.length} oversized file(s).`);
    }
    console.log(
      "Note: /api/* forms need a backend or VITE_* URLs pointed at a live API — static hosting alone will not run Node middleware."
    );
  } finally {
    // Undici keeps the dispatcher sockets open unless explicitly closed; without this, Node can hang on exit.
    await uploadAgent.close().catch(() => {});
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
