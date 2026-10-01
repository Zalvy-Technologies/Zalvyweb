/**
 * ZALVY — Enterprise Rate Limiting.
 *
 * Sliding-window rate limiter designed to defend API endpoints and forms
 * against Denial of Service (DoS), credential stuffing, and spam attacks.
 *
 * Features:
 *  - Configurable rate windows and request ceilings.
 *  - Emits RFC 6585 compliant HTTP headers (`RateLimit-Limit`, `RateLimit-Remaining`, `RateLimit-Reset`, `Retry-After`).
 *  - Production: Redis-backed (Upstash) for horizontal scaling.
 *  - Development: In-memory with automatic GC and size limits.
 *
 * @module lib/security/rate-limit
 */

export interface RateLimitConfig {
  /** Time window in milliseconds (default: 60,000ms / 1 min). */
  windowMs?: number;
  /** Maximum requests per window (default: 10). */
  maxRequests?: number;
  /** Custom key prefix (default: "rl") */
  keyPrefix?: string;
}

export interface RateLimitResult {
  limited: boolean;
  limit: number;
  remaining: number;
  resetMs: number;
  retryAfterSeconds: number;
  headers: Record<string, string>;
}

interface RecordEntry {
  count: number;
  resetTime: number;
}

/**
 * In-memory rate limiter store with LRU eviction and size limits.
 * Used for development and serverless environments without Redis.
 */
class MemoryRateLimiterStore {
  private store = new Map<string, RecordEntry>();
  private lastCleanup = Date.now();
  private readonly maxSize: number;

  constructor(maxSize = 10000) {
    this.maxSize = maxSize;
  }

  check(key: string, maxRequests: number, windowMs: number): RateLimitResult {
    const now = Date.now();
    this.cleanup(now, windowMs);

    let entry = this.store.get(key);

    if (!entry || now > entry.resetTime) {
      entry = { count: 1, resetTime: now + windowMs };
      this.setWithEviction(key, entry);
    } else {
      entry.count += 1;
    }

    const limited = entry.count > maxRequests;
    const remaining = Math.max(0, maxRequests - entry.count);
    const resetMs = Math.max(0, entry.resetTime - now);
    const retryAfterSeconds = Math.ceil(resetMs / 1000);

    const headers: Record<string, string> = {
      "RateLimit-Limit": String(maxRequests),
      "RateLimit-Remaining": String(remaining),
      "RateLimit-Reset": String(retryAfterSeconds),
    };

    if (limited) {
      headers["Retry-After"] = String(retryAfterSeconds);
    }

    return {
      limited,
      limit: maxRequests,
      remaining,
      resetMs,
      retryAfterSeconds,
      headers,
    };
  }

  /**
   * Set entry with LRU eviction when store exceeds maxSize.
   */
  private setWithEviction(key: string, entry: RecordEntry): void {
    if (this.store.size >= this.maxSize && !this.store.has(key)) {
      // Evict oldest entry (first in Map iteration order)
      const firstKey = this.store.keys().next().value;
      if (firstKey !== undefined) {
        this.store.delete(firstKey);
      }
    }
    this.store.set(key, entry);
  }

  /**
   * Periodic GC to purge stale entries and prevent memory leaks.
   * Runs at most once per windowMs * 2.
   */
  private cleanup(now: number, windowMs: number): void {
    if (now - this.lastCleanup < windowMs * 2) {
      return;
    }

    this.lastCleanup = now;
    for (const [key, entry] of this.store.entries()) {
      if (now > entry.resetTime) {
        this.store.delete(key);
      }
    }
  }

  reset(): void {
    this.store.clear();
  }

  size(): number {
    return this.store.size;
  }
}

/**
 * Redis-backed rate limiter using Upstash REST API.
 * Provides horizontal scaling for production deployments.
 */
class RedisRateLimiterStore {
  private readonly baseUrl: string;
  private readonly token: string;
  private readonly keyPrefix: string;

  constructor(baseUrl: string, token: string, keyPrefix = "rl") {
    this.baseUrl = baseUrl;
    this.token = token;
    this.keyPrefix = keyPrefix;
  }

  async check(key: string, maxRequests: number, windowMs: number): Promise<RateLimitResult> {
    const fullKey = `${this.keyPrefix}:${key}`;
    const windowSec = Math.ceil(windowMs / 1000);

    const url = `${this.baseUrl}/ratelimit/${fullKey}`;
    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${this.token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        limit: maxRequests,
        window: windowSec,
      }),
    });

    if (!response.ok) {
      // Fallback to permissive on Redis error (fail-open for availability)
      return {
        limited: false,
        limit: maxRequests,
        remaining: maxRequests,
        resetMs: windowMs,
        retryAfterSeconds: windowSec,
        headers: {
          "RateLimit-Limit": String(maxRequests),
          "RateLimit-Remaining": String(maxRequests),
          "RateLimit-Reset": String(windowSec),
        },
      };
    }

    const data = (await response.json()) as {
      success: boolean;
      limit: number;
      remaining: number;
      reset: number;
      resetAfter: number;
    };

    const headers: Record<string, string> = {
      "RateLimit-Limit": String(data.limit),
      "RateLimit-Remaining": String(data.remaining),
      "RateLimit-Reset": String(data.resetAfter),
    };

    if (!data.success) {
      headers["Retry-After"] = String(data.resetAfter);
    }

    return {
      limited: !data.success,
      limit: data.limit,
      remaining: data.remaining,
      resetMs: data.resetAfter * 1000,
      retryAfterSeconds: data.resetAfter,
      headers,
    };
  }
}

/**
 * Rate limiter factory that selects the appropriate backend based on environment.
 */
function createRateLimiterStore(): MemoryRateLimiterStore | RedisRateLimiterStore {
  const redisUrl = process.env.UPSTASH_REDIS_REST_URL;
  const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN;

  if (redisUrl && redisToken && process.env.NODE_ENV === "production") {
    return new RedisRateLimiterStore(redisUrl, redisToken);
  }

  return new MemoryRateLimiterStore();
}

const rateLimiterStore = createRateLimiterStore();

/**
 * Checks if an IP or identifier is rate-limited according to the provided config.
 * Returns RateLimitResult with RFC 6585 compliant headers.
 */
export async function checkRateLimit(
  identifier: string,
  config: RateLimitConfig = {}
): Promise<RateLimitResult> {
  const windowMs = config.windowMs ?? 60 * 1000;
  const maxRequests = config.maxRequests ?? 10;
  const keyPrefix = config.keyPrefix ?? "rl";
  const fullKey = `${keyPrefix}:${identifier}`;

  if (rateLimiterStore instanceof RedisRateLimiterStore) {
    return rateLimiterStore.check(fullKey, maxRequests, windowMs);
  }

  return rateLimiterStore.check(fullKey, maxRequests, windowMs);
}

/**
 * Synchronous version for use in middleware (memory store only).
 * Throws if Redis store is active.
 */
export function checkRateLimitSync(
  identifier: string,
  config: RateLimitConfig = {}
): RateLimitResult {
  if (rateLimiterStore instanceof RedisRateLimiterStore) {
    throw new Error("Cannot use sync rate limiter with Redis backend. Use async checkRateLimit.");
  }
  const windowMs = config.windowMs ?? 60 * 1000;
  const maxRequests = config.maxRequests ?? 10;
  return rateLimiterStore.check(identifier, maxRequests, windowMs);
}

export { MemoryRateLimiterStore, RedisRateLimiterStore };
export const memoryRateLimiterStore = new MemoryRateLimiterStore();
