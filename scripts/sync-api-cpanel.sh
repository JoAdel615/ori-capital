#!/usr/bin/env bash
set -euo pipefail

# Sync the repo to a cPanel "Setup Node.js App" document root over SSH/rsync.
#
# Required:
#   ORI_CPANEL_API_RSYNC_TARGET — e.g. oricapital@host:api.oricapitalholdings.com/
#
# Notes:
# - This intentionally excludes secrets and large binaries from the upload.
# - If you previously uploaded `vault/`, delete it on the server once, then rotate any exposed secrets.

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

if [[ -z "${ORI_CPANEL_API_RSYNC_TARGET:-}" ]]; then
  echo "Missing ORI_CPANEL_API_RSYNC_TARGET (example: oricapital@host:api.oricapitalholdings.com/)" >&2
  exit 1
fi

exec rsync -az --delete \
  --exclude ".git/" \
  --exclude "node_modules/" \
  --exclude "dist/" \
  --exclude ".data/" \
  --exclude "vault/" \
  --exclude ".env" \
  --exclude ".env.*" \
  --exclude ".htaccess" \
  --exclude "public/videos/professional-10-minute-vsl.mp4" \
  "${ROOT_DIR}/" \
  "${ORI_CPANEL_API_RSYNC_TARGET}"
