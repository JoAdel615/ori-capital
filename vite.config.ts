import fs from "node:fs";
import path from "node:path";
import { defineConfig, loadEnv } from "vite";
import basicSsl from "@vitejs/plugin-basic-ssl";
import react from "@vitejs/plugin-react";
import tailwind from "@tailwindcss/vite";
import type { Connect } from "vite";
import { paymentChargeMiddleware } from "./server/paymentMiddleware";
import { attachBackOfficeRoutes } from "./server/backofficeStore";
import { attachReadinessRoutes } from "./server/readinessMiddleware";

function attachLocalApiMiddleware(middlewares: Connect.Server) {
  const pay = paymentChargeMiddleware();
  middlewares.use((req, res, next) => {
    void pay(req, res, next);
  });
  attachBackOfficeRoutes(middlewares);
  attachReadinessRoutes(middlewares);
}

/** Parse KEY=VAL lines from vault/integrations.env (gitignored). Values override prior env for those keys. */
function mergeVaultIntegrationsEnv(): void {
  const file = path.join(process.cwd(), "vault", "integrations.env");
  if (!fs.existsSync(file)) return;
  const raw = fs.readFileSync(file, "utf8");
  for (const line of raw.split("\n")) {
    const t = line.trim();
    if (!t || t.startsWith("#")) continue;
    const eq = t.indexOf("=");
    if (eq <= 0) continue;
    const key = t.slice(0, eq).trim();
    let val = t.slice(eq + 1).trim();
    if (
      (val.startsWith('"') && val.endsWith('"')) ||
      (val.startsWith("'") && val.endsWith("'"))
    ) {
      val = val.slice(1, -1);
    }
    if (key) process.env[key] = val;
  }
}

// Merge .env into process.env so dev/preview API middleware can read ECRYPT_* (not exposed to client).
function applyEnvToProcess(mode: string) {
  const fromFiles = loadEnv(mode, process.cwd(), "");
  for (const key of Object.keys(fromFiles)) {
    if (process.env[key] === undefined) process.env[key] = fromFiles[key];
  }
  mergeVaultIntegrationsEnv();
}

// https://vite.dev/config/
export default defineConfig(({ mode, command, isPreview }) => {
  applyEnvToProcess(mode);
  /** Dev server only — not `vite preview` (containers / App Platform expect HTTP behind their TLS). */
  const useDevHttps = command === "serve" && !isPreview;
  const previewPort = Number(process.env.PORT) || 4173;
  return {
    server: {
      port: 5173,
      strictPort: true,
      // Default Node/Vite can listen on IPv6 `localhost` only; `127.0.0.1` then fails with connection refused.
      // `true` binds all interfaces so https://127.0.0.1:5173 and https://localhost:5173 both work.
      host: true,
      // API writes `.data/backoffice.json`; watching it triggers a full page reload and wipes React state.
      watch: { ignored: ["**/.data/**"] },
    },
    preview: {
      port: previewPort,
      strictPort: true,
      host: true,
    },
    test: {
      exclude: ["**/node_modules/**", "**/dist/**", "**/e2e/**"],
    },
    plugins: [
      ...(useDevHttps
        ? [
            // HTTPS in local dev only; preview uses HTTP so PaaS health checks (e.g. DigitalOcean :8080) work.
            basicSsl(),
          ]
        : []),
      react(),
      tailwind(),
      {
        name: "local-api",
        configureServer(server) {
          attachLocalApiMiddleware(server.middlewares);
        },
        configurePreviewServer(server) {
          attachLocalApiMiddleware(server.middlewares);
        },
      },
    ],
  };
});
