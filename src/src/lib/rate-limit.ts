import { NextRequest, NextResponse } from "next/server";

interface RateLimitRecord {
  count: number;
  resetTime: number;
}

const authRateLimitMap = new Map<string, RateLimitRecord>();
const apiRateLimitMap = new Map<string, RateLimitRecord>();

// Cleanup stale rate limit records periodically
setInterval(() => {
  const now = Date.now();
  for (const [key, record] of authRateLimitMap.entries()) {
    if (now > record.resetTime) authRateLimitMap.delete(key);
  }
  for (const [key, record] of apiRateLimitMap.entries()) {
    if (now > record.resetTime) apiRateLimitMap.delete(key);
  }
}, 60000);

export function getClientIp(req: NextRequest): string {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "127.0.0.1"
  );
}

export function checkRateLimit(
  key: string,
  limitMap: Map<string, RateLimitRecord>,
  maxAttempts: number,
  windowMs: number
): { success: boolean; limit: number; remaining: number; reset: number } {
  const now = Date.now();
  const record = limitMap.get(key);

  if (!record || now > record.resetTime) {
    const resetTime = now + windowMs;
    limitMap.set(key, { count: 1, resetTime });
    return { success: true, limit: maxAttempts, remaining: maxAttempts - 1, reset: resetTime };
  }

  if (record.count >= maxAttempts) {
    return { success: false, limit: maxAttempts, remaining: 0, reset: record.resetTime };
  }

  record.count += 1;
  return {
    success: true,
    limit: maxAttempts,
    remaining: maxAttempts - record.count,
    reset: record.resetTime,
  };
}

/**
 * Auth Rate Limiter: Max 5 attempts per 15 minutes
 */
export function checkAuthRateLimit(req: NextRequest) {
  const ip = getClientIp(req);
  return checkRateLimit(`auth:${ip}`, authRateLimitMap, 5, 15 * 60 * 1000);
}

/**
 * General API Rate Limiter: Max 20 requests per 1 minute
 */
export function checkApiRateLimit(req: NextRequest) {
  const ip = getClientIp(req);
  return checkRateLimit(`api:${ip}`, apiRateLimitMap, 20, 60 * 1000);
}

export function createRateLimitResponse(resetTime: number) {
  const retryAfterSeconds = Math.ceil((resetTime - Date.now()) / 1000);
  return NextResponse.json(
    {
      error: "Too many login attempts. Please try again later.",
      message: `Rate limit exceeded. Retry after ${retryAfterSeconds} seconds.`,
    },
    {
      status: 429,
      headers: {
        "Retry-After": String(retryAfterSeconds),
        "X-RateLimit-Reset": String(resetTime),
      },
    }
  );
}
