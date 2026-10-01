/**
 * ZALVY — Enterprise Caching Layer.
 *
 * Provides a unified caching abstraction (ICacheProvider) ready for Redis,
 * Memcached, or Edge KV stores. Includes an in-memory implementation with TTL support.
 *
 * Production: Uses Upstash Redis REST API for serverless-compatible caching.
 * Development: Uses in-memory Map with LRU eviction and size limits.
 *
 * @module server/cache/cache-provider
 */

export interface ICacheProvider {
  get<T>(key: string): Promise<T | null>;
  set(key: string, value: unknown, ttlSeconds?: number): Promise<void>;
  delete(key: string): Promise<boolean>;
  clear(): Promise<void>;
}

interface CacheItem<T> {
  value: T;
  expiresAt: number | null;
}

/**
 * In-memory cache provider with LRU eviction and size limits.
 * Used for development and serverless environments without Redis.
 */
export class MemoryCacheProvider implements ICacheProvider {
  private cache = new Map<string, CacheItem<unknown>>();
  private readonly maxSize: number;
  private accessOrder = new Set<string>();

  constructor(maxSize = 10000) {
    this.maxSize = maxSize;
  }

  get<T>(key: string): Promise<T | null> {
    const item = this.cache.get(key);
    if (!item) return Promise.resolve(null);

    if (item.expiresAt !== null && Date.now() > item.expiresAt) {
      this.cache.delete(key);
      this.accessOrder.delete(key);
      return Promise.resolve(null);
    }

    // Update access order for LRU
    this.accessOrder.delete(key);
    this.accessOrder.add(key);

    return Promise.resolve(item.value as T);
  }

  set(key: string, value: unknown, ttlSeconds?: number): Promise<void> {
    // Evict LRU entry if at capacity and key is new
    if (this.cache.size >= this.maxSize && !this.cache.has(key)) {
      const lruKey = this.accessOrder.values().next().value;
      if (lruKey) {
        this.cache.delete(lruKey);
        this.accessOrder.delete(lruKey);
      }
    }

    const expiresAt = ttlSeconds ? Date.now() + ttlSeconds * 1000 : null;
    this.cache.set(key, { value, expiresAt });
    this.accessOrder.delete(key);
    this.accessOrder.add(key);
    return Promise.resolve();
  }

  delete(key: string): Promise<boolean> {
    this.accessOrder.delete(key);
    return Promise.resolve(this.cache.delete(key));
  }

  clear(): Promise<void> {
    this.cache.clear();
    this.accessOrder.clear();
    return Promise.resolve();
  }

  size(): number {
    return this.cache.size;
  }
}

/**
 * Redis cache provider using Upstash REST API.
 * Provides persistent, distributed caching for production.
 */
export class RedisCacheProvider implements ICacheProvider {
  private readonly baseUrl: string;
  private readonly token: string;
  private readonly keyPrefix: string;

  constructor(baseUrl: string, token: string, keyPrefix = "zalvy:cache:") {
    this.baseUrl = baseUrl.replace(/\/$/, "");
    this.token = token;
    this.keyPrefix = keyPrefix;
  }

  private buildKey(key: string): string {
    return `${this.keyPrefix}${key}`;
  }

  async get<T>(key: string): Promise<T | null> {
    const fullKey = this.buildKey(key);
    const url = `${this.baseUrl}/get/${encodeURIComponent(fullKey)}`;

    try {
      const response = await fetch(url, {
        headers: { Authorization: `Bearer ${this.token}` },
      });

      if (!response.ok) {
        if (response.status === 404) return null;
        throw new Error(`Redis GET failed: ${String(response.status)}`);
      }

      const data = (await response.json()) as { result: string | null };
      return data.result ? (JSON.parse(data.result) as T) : null;
    } catch (error) {
      console.error("[RedisCacheProvider] GET error:", error);
      return null; // Fail-open for availability
    }
  }

  async set(key: string, value: unknown, ttlSeconds?: number): Promise<void> {
    const fullKey = this.buildKey(key);
    const url = `${this.baseUrl}/set/${encodeURIComponent(fullKey)}`;

    const body = JSON.stringify(value);
    const params = new URLSearchParams();
    if (ttlSeconds) params.set("ex", String(ttlSeconds));

    try {
      const response = await fetch(`${url}?${params.toString()}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.token}`,
          "Content-Type": "application/json",
        },
        body,
      });

      if (!response.ok) {
        throw new Error(`Redis SET failed: ${String(response.status)}`);
      }
    } catch (error) {
      console.error("[RedisCacheProvider] SET error:", error);
      // Fail silently for availability
    }
  }

  async delete(key: string): Promise<boolean> {
    const fullKey = this.buildKey(key);
    const url = `${this.baseUrl}/del/${encodeURIComponent(fullKey)}`;

    try {
      const response = await fetch(url, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${this.token}` },
      });
      return response.ok;
    } catch (error) {
      console.error("[RedisCacheProvider] DEL error:", error);
      return false;
    }
  }

  clear(): Promise<void> {
    // Upstash doesn't support FLUSHDB via REST, would need pipeline
    // For now, this is a no-op in production
    console.warn("[RedisCacheProvider] CLEAR not implemented for Upstash REST");
    return Promise.resolve();
  }
}

/**
 * Factory function to create the appropriate cache provider based on environment.
 */
function createCacheProvider(): ICacheProvider {
  const redisUrl = process.env.UPSTASH_REDIS_REST_URL;
  const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN;

  if (redisUrl && redisToken && process.env.NODE_ENV === "production") {
    return new RedisCacheProvider(redisUrl, redisToken);
  }

  return new MemoryCacheProvider();
}

export const defaultCacheProvider: ICacheProvider = createCacheProvider();
