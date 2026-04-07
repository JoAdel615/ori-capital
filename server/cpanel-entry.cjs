/**
 * cPanel "Setup Node.js App" — use when the panel only accepts a .js/.cjs startup file
 * (instead of `npx tsx server/apiServer.ts`).
 *
 * Application root: project root (folder that contains package.json and server/).
 * Application startup file (relative to root): server/cpanel-entry.cjs
 *
 * Requires `tsx` (listed in dependencies so npm ci --omit=dev still works if you add it there).
 */

"use strict";

const path = require("node:path");

require("tsx/cjs/api").register();
require(path.join(__dirname, "apiServer.ts"));
