import { expect, test } from "vitest";
import { createRateLimiter } from "./rate-limiter";

test("rejects the request after the limit, not one later", () => {
  let time = 0;
  const limiter = createRateLimiter(2, 1000, () => time);
  expect(limiter.tryAcquire("a")).toBe(true);
  expect(limiter.tryAcquire("a")).toBe(true);
  expect(limiter.tryAcquire("a")).toBe(false);
  time = 1001;
  expect(limiter.tryAcquire("a")).toBe(true);
});
