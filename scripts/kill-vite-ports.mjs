#!/usr/bin/env node
/**
 * Frees default Vite dev (5173) / preview (4173) ports and common fallbacks
 * so `strictPort` does not fail after stale processes.
 * macOS/Linux: uses lsof. No-op on other platforms.
 */

import { execSync } from "node:child_process";
import { platform } from "node:os";

const PORTS = [5173, 5174, 5175, 4173, 4174];

function killListeners(port) {
  if (platform() === "win32") return;
  try {
    const out = execSync(`lsof -ti:${port}`, { encoding: "utf8" }).trim();
    if (!out) return;
    for (const line of out.split("\n")) {
      const pid = Number(line.trim());
      if (!Number.isFinite(pid) || pid <= 0) continue;
      try {
        process.kill(pid, "SIGKILL");
      } catch {
        // Process may have exited.
      }
    }
  } catch {
    // lsof exits 1 when nothing is listening.
  }
}

for (const p of PORTS) killListeners(p);
