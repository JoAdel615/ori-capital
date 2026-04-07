/** GA4 measurement IDs are `G-` + alphanumeric. */
export function isValidGaMeasurementId(id: string): boolean {
  return /^G-[A-Z0-9]+$/i.test(id.trim());
}

/** Meta Pixel ID is numeric (typically 15–16 digits). */
export function isValidMetaPixelId(id: string): boolean {
  return /^\d{10,20}$/.test(id.trim());
}
