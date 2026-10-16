import { NextRequest, NextResponse } from 'next/server';
import { storePhoto, getPhoto } from '@/lib/share/photo-store';

/**
 * POST /api/share-photo
 * Body: FormData with "photo" file (PNG blob)
 * Returns: { token: string }
 */
export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('photo') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No photo provided' }, { status: 400 });
    }

    const blob = new Blob([await file.arrayBuffer()], { type: file.type });
    const token = await storePhoto(blob);

    return NextResponse.json({ token });
  } catch (err) {
    console.error('[share-photo POST]', err);
    return NextResponse.json({ error: 'Failed to store photo' }, { status: 500 });
  }
}

/**
 * GET /api/share-photo?token=xxx
 * Query param "format": "png" (default) | "jpg"
 * Returns: PNG/JPG blob with Content-Disposition: attachment
 */
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const token = searchParams.get('token');
  const format = searchParams.get('format') ?? 'png';

  if (!token) {
    return new NextResponse('Missing token', { status: 400 });
  }

  // preview=1 → inline (untuk preview di halaman download HP)
  // download  → attachment (trigger download)
  const isPreview = searchParams.get('preview') === '1';

  try {
    const data = await getPhoto(token);

    if (!data) {
      return new NextResponse('Photo not found or expired', { status: 404 });
    }

    const buffer = Buffer.from(data.imageBase64, 'base64');

    // Foto selalu disimpan PNG; JPG diconvert client-side di HP
    const contentType = 'image/png';
    const filename = `GenSNAP-photo.${format === 'jpg' ? 'jpg' : 'png'}`;

    const headers: Record<string, string> = {
      'Content-Type': contentType,
      'Cache-Control': 'private, no-cache',
    };

    if (!isPreview) {
      headers['Content-Disposition'] = `attachment; filename="${filename}"`;
    }

    return new NextResponse(buffer, { headers });
  } catch (err) {
    console.error('[share-photo GET]', err);
    return new NextResponse('Server error', { status: 500 });
  }
}
