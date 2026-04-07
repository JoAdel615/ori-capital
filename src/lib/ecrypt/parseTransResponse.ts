/**
 * Parses the Payment API body returned by transact.php (URL-encoded key=value pairs).
 */

export function parseTransResponse(body: string): Record<string, string> {
  const out: Record<string, string> = {};
  const trimmed = body.trim();
  if (!trimmed) return out;
  for (const part of trimmed.split("&")) {
    const eq = part.indexOf("=");
    const rawKey = eq === -1 ? part : part.slice(0, eq);
    const rawVal = eq === -1 ? "" : part.slice(eq + 1);
    if (!rawKey) continue;
    try {
      out[decodeURIComponent(rawKey.replace(/\+/g, " "))] = decodeURIComponent(
        rawVal.replace(/\+/g, " ")
      );
    } catch {
      out[rawKey] = rawVal;
    }
  }
  return out;
}

/** Gateway: response=1 indicates an approved transaction. */
export function isGatewayApproved(params: Record<string, string>): boolean {
  return params.response === "1";
}
