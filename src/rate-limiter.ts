export interface RateLimiter {
  tryAcquire(key: string): boolean;
}

/**
 * Allows `limit` requests per key in any sliding window of `windowMs`.
 * Timestamps older than the window are dropped on each call, so idle keys
 * cost nothing and there is no interval timer to leak.
 */
export function createRateLimiter(limit: number, windowMs: number, now: () => number = Date.now): RateLimiter {
  const hits = new Map<string, number[]>();
  return {
    tryAcquire(key) {
      const cutoff = now() - windowMs;
      const recent = (hits.get(key) ?? []).filter((t) => t > cutoff);
      if (recent.length >= limit) {
        hits.set(key, recent);
        return false;
      }
      recent.push(now());
      hits.set(key, recent);
      return true;
    },
  };
}
