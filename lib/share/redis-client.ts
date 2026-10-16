import { Redis } from '@upstash/redis';

// Lazy singleton — hanya dibuat saat pertama kali dipakai (saat ada request),
// bukan saat module diload. Ini mencegah error/warning saat build.
let _redis: Redis | null = null;

export function getRedis(): Redis {
  if (!_redis) {
    if (!process.env.UPSTASH_REDIS_REST_URL || !process.env.UPSTASH_REDIS_REST_TOKEN) {
      throw new Error(
        '[GenSNAP] Upstash env vars belum diset. ' +
        'Tambahkan UPSTASH_REDIS_REST_URL dan UPSTASH_REDIS_REST_TOKEN ' +
        'ke .env.local dan Vercel Environment Variables.'
      );
    }
    _redis = new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN,
    });
  }
  return _redis;
}
