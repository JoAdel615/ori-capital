const NO_INDEX_EXACT_PATHS = new Set([
  "/admin",
  "/partner",
]);

/**
 * Returns true for utility/internal routes that should not be indexed.
 */
export function shouldNoIndexPath(pathname: string): boolean {
  return NO_INDEX_EXACT_PATHS.has(pathname);
}
