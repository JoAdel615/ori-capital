/**
 * Sliding-window limiter keyed by client id (e.g. IP). Counts only explicit failures
 * (e.g. wrong password) so successful logins are not penalized.
 */
export class FailureRateLimiter {
  private readonly buckets = new Map<string, number[]>();
  private readonly maxFailures: number;
  private readonly windowMs: number;

  constructor(maxFailures: number, windowMs: number) {
    this.maxFailures = maxFailures;
    this.windowMs = windowMs;
  }

  private prune(key: string, now: number): number[] {
    const cutoff = now - this.windowMs;
    const hits = (this.buckets.get(key) || []).filter((t) => t > cutoff);
    this.buckets.set(key, hits);
    return hits;
  }

  /** True if another failure is still allowed (under cap). */
  isAllowed(key: string): boolean {
    const now = Date.now();
    const hits = this.prune(key, now);
    return hits.length < this.maxFailures;
  }

  recordFailure(key: string): void {
    const now = Date.now();
    const hits = this.prune(key, now);
    hits.push(now);
    this.buckets.set(key, hits);
  }

  reset(key: string): void {
    this.buckets.delete(key);
  }
}
