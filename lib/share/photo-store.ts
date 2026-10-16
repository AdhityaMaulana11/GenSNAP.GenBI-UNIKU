import { getRedis } from '@/lib/share/redis-client';
import { nanoid } from 'nanoid';

// TTL 10 menit = 600 detik
const PHOTO_TTL_SECONDS = 600;
const KEY_PREFIX = 'gensnap:photo:';

export interface StoredPhoto {
  imageBase64: string;
  mimeType: 'image/png' | 'image/jpeg';
  createdAt: number;
}

/**
 * Simpan foto ke Upstash Redis dengan TTL 10 menit.
 * Returns token unik 10 karakter.
 */
export async function storePhoto(blob: Blob): Promise<string> {
  const arrayBuffer = await blob.arrayBuffer();
  const base64 = Buffer.from(arrayBuffer).toString('base64');

  const token = nanoid(10);
  const payload: StoredPhoto = {
    imageBase64: base64,
    mimeType: blob.type === 'image/jpeg' ? 'image/jpeg' : 'image/png',
    createdAt: Date.now(),
  };

  await getRedis().set(`${KEY_PREFIX}${token}`, payload, { ex: PHOTO_TTL_SECONDS });

  return token;
}

/**
 * Ambil foto dari Redis by token.
 * Returns null kalau tidak ditemukan atau sudah expired.
 */
export async function getPhoto(token: string): Promise<StoredPhoto | null> {
  const data = await getRedis().get<StoredPhoto>(`${KEY_PREFIX}${token}`);
  return data ?? null;
}
