/**
 * Optional API origin for production: static site on cPanel + Node API elsewhere.
 * Set VITE_API_ORIGIN=https://api.yourdomain.com (no trailing slash) at build time.
 */
const origin = (import.meta.env.VITE_API_ORIGIN || "").trim().replace(/\/+$/, "");

export function apiUrl(path: string): string {
  const p = path.startsWith("/") ? path : `/${path}`;
  if (!origin) return p;
  return `${origin}${p}`;
}
