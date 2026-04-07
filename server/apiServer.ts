/**
 * Standalone HTTP API for production: back office, payments, intake, readiness.
 * Static site on cPanel (or CDN) sets VITE_API_ORIGIN to this server's public URL.
 *
 * Run: npm run api
 * Env: PORT (default 8787), API_CORS_ORIGIN (required for browser admin/forms cross-origin),
 *      same secrets as dev (.env + vault/integrations.env).
 */

import fs from "node:fs";
import http from "node:http";
import path from "node:path";
import type { IncomingMessage, ServerResponse } from "node:http";
import { loadEnv } from "vite";
import { attachBackOfficeRoutes } from "./backofficeStore";
import { paymentChargeMiddleware } from "./paymentMiddleware";
import { attachReadinessRoutes } from "./readinessMiddleware";

type Next = () => void;
type Handler = (req: IncomingMessage, res: ServerResponse, next: Next) => void;

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

function applyEnvToProcess(mode: string): void {
  const fromFiles = loadEnv(mode, process.cwd(), "");
  for (const key of Object.keys(fromFiles)) {
    if (process.env[key] === undefined) process.env[key] = fromFiles[key];
  }
  mergeVaultIntegrationsEnv();
}

function corsOrigin(): string {
  const o = process.env.API_CORS_ORIGIN?.trim();
  if (o) return o;
  return "*";
}

function attachCors(middlewares: { use: (h: Handler) => void }): void {
  middlewares.use((req, res, next) => {
    const origin = corsOrigin();
    if (origin !== "") {
      res.setHeader("Access-Control-Allow-Origin", origin);
      res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS");
      res.setHeader(
        "Access-Control-Allow-Headers",
        "Authorization, Content-Type, X-Requested-With"
      );
      res.setHeader("Access-Control-Max-Age", "86400");
    }
    if (req.method === "OPTIONS") {
      res.statusCode = 204;
      res.end();
      return;
    }
    next();
  });
}

function createStack(): { use: (h: Handler) => void; run: (req: IncomingMessage, res: ServerResponse) => void } {
  const handlers: Handler[] = [];
  return {
    use(h) {
      handlers.push(h);
    },
    run(req, res) {
      let i = 0;
      const runNext: Next = () => {
        const h = handlers[i++];
        if (!h) {
          if (!res.headersSent) {
            res.statusCode = 404;
            res.setHeader("Content-Type", "application/json");
            res.end(JSON.stringify({ ok: false, error: "Not found" }));
          }
          return;
        }
        h(req, res, runNext);
      };
      runNext();
    },
  };
}

applyEnvToProcess(process.env.NODE_ENV === "production" ? "production" : "development");

const stack = createStack();
attachCors(stack);
const pay = paymentChargeMiddleware();
stack.use((req, res, next) => {
  void pay(req, res, next);
});
attachBackOfficeRoutes(stack);
attachReadinessRoutes(stack);

stack.use((req, res) => {
  res.statusCode = 404;
  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify({ ok: false, error: "Not found" }));
});

const port = Number(process.env.PORT) || 8787;
http.createServer((req, res) => {
  stack.run(req, res);
})
  .listen(port, () => {
    console.log(`[ori-capital api] listening on http://127.0.0.1:${port}`);
    console.log(
      `[ori-capital api] set API_CORS_ORIGIN to your site origin (e.g. https://oricapitalholdings.com) for browser access`
    );
  });
