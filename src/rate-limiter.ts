export interface RateLimiter {
  tryAcquire(key: string): boolean;
}

/** Allows `limit` requests per key in each fixed window. */
export function createRateLimiter(limit: number, windowMs: number): RateLimiter {
  const counts = new Map<string, number>();
  setInterval(() => counts.clear(), windowMs);
  return {
    tryAcquire(key) {
      const count = counts.get(key) ?? 0;
      counts.set(key, count + 1);
      return count <= limit;
    },
  };
}
