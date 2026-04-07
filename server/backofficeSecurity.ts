/**
 * Production rules for `/api/admin/login` (Vite dev/preview middleware or any Node host).
 */

export const BACKOFFICE_ADMIN_PASSWORD_MIN_LENGTH = 16;

export type BackofficeAdminAuthResolution = {
  /** Password used for comparison when login is allowed. */
  passwordForComparison: string;
  /** When true, `/api/admin/login` must reject all attempts (503). */
  productionLoginBlocked: boolean;
  /** Log / API message when blocked. */
  blockMessage: string | null;
};

/**
 * In `NODE_ENV=production`, require a strong `BACKOFFICE_ADMIN_PASSWORD` unless
 * `BACKOFFICE_RELAX_AUTH=1` (local `vite preview` / demos only — never in real prod).
 */
export function resolveBackofficeAdminAuth(): BackofficeAdminAuthResolution {
  const raw = process.env.BACKOFFICE_ADMIN_PASSWORD?.trim();
  const nodeEnv = process.env.NODE_ENV ?? "development";
  const relax =
    process.env.BACKOFFICE_RELAX_AUTH === "1" ||
    process.env.BACKOFFICE_RELAX_AUTH === "true";
  const enforceProdRules = nodeEnv === "production" && !relax;

  if (!enforceProdRules) {
    return {
      passwordForComparison: raw || "admin",
      productionLoginBlocked: false,
      blockMessage: null,
    };
  }

  if (!raw) {
    return {
      passwordForComparison: "",
      productionLoginBlocked: true,
      blockMessage:
        "Back office login is disabled: set BACKOFFICE_ADMIN_PASSWORD (min 16 characters, not the word “admin”) or BACKOFFICE_RELAX_AUTH=1 for local preview only.",
    };
  }

  if (raw.length < BACKOFFICE_ADMIN_PASSWORD_MIN_LENGTH) {
    return {
      passwordForComparison: "",
      productionLoginBlocked: true,
      blockMessage: `BACKOFFICE_ADMIN_PASSWORD must be at least ${BACKOFFICE_ADMIN_PASSWORD_MIN_LENGTH} characters when NODE_ENV=production.`,
    };
  }

  if (raw.toLowerCase() === "admin") {
    return {
      passwordForComparison: "",
      productionLoginBlocked: true,
      blockMessage:
        "BACKOFFICE_ADMIN_PASSWORD must not be the default word “admin” when NODE_ENV=production.",
    };
  }

  return {
    passwordForComparison: raw,
    productionLoginBlocked: false,
    blockMessage: null,
  };
}

let cachedAuth: BackofficeAdminAuthResolution | null = null;
let startupWarned = false;

export function getBackofficeAdminAuth(): BackofficeAdminAuthResolution {
  if (!cachedAuth) {
    cachedAuth = resolveBackofficeAdminAuth();
  }
  return cachedAuth;
}

let relaxedAuthWarned = false;

/** Call when attaching HTTP middleware (not during `vite build` graph load). */
export function warnIfBackofficeLoginBlocked(): void {
  const a = getBackofficeAdminAuth();
  if (a.productionLoginBlocked && a.blockMessage && !startupWarned) {
    startupWarned = true;
    console.warn(`[ori-capital backoffice] ${a.blockMessage}`);
  }
  const nodeEnv = process.env.NODE_ENV ?? "development";
  const relax =
    process.env.BACKOFFICE_RELAX_AUTH === "1" ||
    process.env.BACKOFFICE_RELAX_AUTH === "true";
  if (nodeEnv === "production" && relax && !relaxedAuthWarned) {
    relaxedAuthWarned = true;
    console.warn(
      "[ori-capital backoffice] BACKOFFICE_RELAX_AUTH is enabled while NODE_ENV=production. Remove this for real deployments."
    );
  }
}
