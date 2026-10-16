'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { Download, ImageIcon, Clock, AlertCircle, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PageProps {
  params: Promise<{ token: string }>;
}

type Status = 'loading' | 'ready' | 'downloading' | 'done' | 'expired' | 'error';

export default function DownloadPage({ params }: PageProps) {
  const [token, setToken] = useState<string>('');
  const [status, setStatus] = useState<Status>('loading');
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [pngBlob, setPngBlob] = useState<Blob | null>(null);

  // Resolve params (Next.js 15+ async params)
  useEffect(() => {
    params.then((p) => setToken(p.token));
  }, [params]);

  // Fetch foto preview saat token siap
  useEffect(() => {
    if (!token) return;

    let objectUrl: string | null = null;

    async function fetchPhoto() {
      try {
        // Fetch tanpa ?format → server return PNG, tanpa Content-Disposition
        const res = await fetch(`/api/share-photo?token=${token}&preview=1`);
        if (res.status === 404) {
          setStatus('expired');
          return;
        }
        if (!res.ok) throw new Error('fetch failed');

        const blob = await res.blob();
        objectUrl = URL.createObjectURL(blob);
        setPngBlob(blob);
        setPreviewUrl(objectUrl);
        setStatus('ready');
      } catch {
        setStatus('error');
      }
    }

    fetchPhoto();

    return () => {
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [token]);

  const handleDownloadPNG = useCallback(() => {
    if (!token) return;
    setStatus('downloading');
    // Trigger download via direct link (Content-Disposition: attachment)
    const a = document.createElement('a');
    a.href = `/api/share-photo?token=${token}&format=png`;
    a.download = 'GenSNAP-photo.png';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => setStatus('done'), 1500);
  }, [token]);

  const handleDownloadJPG = useCallback(async () => {
    if (!pngBlob) return;
    setStatus('downloading');

    try {
      // Convert PNG → JPG client-side (zero storage, zero cost)
      const imgBitmap = await createImageBitmap(pngBlob);
      const canvas = document.createElement('canvas');
      canvas.width = imgBitmap.width;
      canvas.height = imgBitmap.height;
      const ctx = canvas.getContext('2d')!;
      // White background untuk JPEG (no transparency)
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(imgBitmap, 0, 0);
      imgBitmap.close();

      canvas.toBlob(
        (jpgBlob) => {
          if (!jpgBlob) { setStatus('error'); return; }
          const url = URL.createObjectURL(jpgBlob);
          const a = document.createElement('a');
          a.href = url;
          a.download = 'GenSNAP-photo.jpg';
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          setTimeout(() => URL.revokeObjectURL(url), 2000);
          setTimeout(() => setStatus('done'), 1500);
        },
        'image/jpeg',
        0.92
      );
    } catch {
      setStatus('error');
    }
  }, [pngBlob]);

  // ── Render states ──────────────────────────────────────────────────────────

  if (status === 'loading') {
    return (
      <Shell>
        <LoadingCard />
      </Shell>
    );
  }

  if (status === 'expired') {
    return (
      <Shell>
        <ExpiredCard />
      </Shell>
    );
  }

  if (status === 'error') {
    return (
      <Shell>
        <ErrorCard />
      </Shell>
    );
  }

  return (
    <Shell>
      <div className="w-full max-w-sm flex flex-col items-center gap-5">
        {/* Status badge */}
        {status === 'done' ? (
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-emerald-100 text-emerald-900 border-2 border-[#1F1A17] font-mono font-extrabold text-xs shadow-brutal-sm">
            <CheckCircle className="w-3.5 h-3.5 stroke-[3] text-emerald-700" />
            <span>[ FOTO BERHASIL DIUNDUH! ]</span>
          </div>
        ) : (
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-[#F5F19A] text-[#1F1A17] border-2 border-[#1F1A17] font-mono font-extrabold text-xs shadow-brutal-sm">
            <ImageIcon className="w-3.5 h-3.5 stroke-[3]" />
            <span>[ FOTOMU SUDAH SIAP! ]</span>
          </div>
        )}

        {/* Title */}
        <div className="text-center">
          <h1 className="text-3xl font-extrabold text-[#1F1A17] tracking-tight font-['var(--font-bricolage)']">
            {status === 'done' ? 'TERSIMPAN!' : 'DOWNLOAD FOTO'}
          </h1>
          <p className="text-sm text-[#434653] font-medium mt-1.5 leading-relaxed">
            {status === 'done'
              ? 'Foto sudah ada di galeri kamu. Selamat!'
              : 'Pilih format foto yang kamu mau. PNG untuk kualitas terbaik, JPG untuk ukuran lebih kecil.'}
          </p>
        </div>

        {/* Photo preview */}
        {previewUrl && (
          <div className="relative rounded-2xl overflow-hidden bg-white p-2.5 border-3 border-[#1F1A17] shadow-brutal w-full max-w-[240px]">
            {/* Corner marks */}
            <div className="absolute top-1.5 left-1.5 font-mono text-[9px] text-[#1F1A17]/30 select-none">+</div>
            <div className="absolute top-1.5 right-1.5 font-mono text-[9px] text-[#1F1A17]/30 select-none">+</div>
            <div className="absolute bottom-1.5 left-1.5 font-mono text-[9px] text-[#1F1A17]/30 select-none">+</div>
            <div className="absolute bottom-1.5 right-1.5 font-mono text-[9px] text-[#1F1A17]/30 select-none">+</div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={previewUrl}
              alt="GenSNAP Photostrip"
              className="w-full h-auto rounded-xl object-contain"
            />
          </div>
        )}

        {/* Timer notice */}
        <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-[#fcd400]/20 border-2 border-[#1F1A17]/20 text-xs font-mono font-bold text-[#1F1A17]/70">
          <Clock className="w-3.5 h-3.5 shrink-0" />
          <span>Link ini aktif selama 10 menit</span>
        </div>

        {/* Action buttons */}
        <div className="flex flex-col gap-3 w-full">
          <Button
            variant="primary"
            size="lg"
            onClick={handleDownloadPNG}
            isLoading={status === 'downloading'}
            disabled={status === 'downloading' || status === 'done'}
            className="w-full shadow-brutal font-mono font-extrabold"
          >
            <Download className="w-5 h-5 text-[#fcd400] mr-1" />
            <span>DOWNLOAD PNG (HD)</span>
          </Button>

          <Button
            variant="secondary"
            size="lg"
            onClick={handleDownloadJPG}
            isLoading={status === 'downloading'}
            disabled={status === 'downloading' || status === 'done'}
            className="w-full shadow-brutal-sm font-mono font-extrabold"
          >
            <Download className="w-5 h-5 text-[#3E4095] mr-1" />
            <span>DOWNLOAD JPG (HEMAT)</span>
          </Button>
        </div>

        {/* Footer branding */}
        <p className="text-[10px] font-mono text-[#737784] text-center mt-1">
          GenSNAP by GenBI UNIKU · #GenSNAP
        </p>
      </div>
    </Shell>
  );
}

// ── Sub-components ─────────────────────────────────────────────────────────

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-[100dvh] flex flex-col items-center justify-center bg-[#fcf9f8] bg-dot-pattern px-4 py-10">
      {children}
    </div>
  );
}

function LoadingCard() {
  return (
    <div className="flex flex-col items-center gap-4 text-center">
      <div className="w-14 h-14 rounded-2xl bg-white border-3 border-[#1F1A17] shadow-brutal flex items-center justify-center">
        <span className="inline-block w-6 h-6 border-3 border-[#3E4095] border-t-transparent rounded-full animate-spin" />
      </div>
      <p className="font-mono font-extrabold text-sm text-[#1F1A17] uppercase tracking-wide">
        Memuat fotomu...
      </p>
    </div>
  );
}

function ExpiredCard() {
  return (
    <div className="flex flex-col items-center gap-4 text-center max-w-xs">
      <div className="w-14 h-14 rounded-2xl bg-[#fcd400] border-3 border-[#1F1A17] shadow-brutal flex items-center justify-center">
        <Clock className="w-7 h-7 text-[#1F1A17]" />
      </div>
      <div>
        <h1 className="text-2xl font-extrabold text-[#1F1A17] font-['var(--font-bricolage)'] tracking-tight">
          LINK SUDAH KEDALUWARSA
        </h1>
        <p className="text-sm text-[#434653] font-medium mt-2 leading-relaxed">
          Link download hanya aktif selama <strong>10 menit</strong>. Minta operator untuk mengambil foto baru dari booth.
        </p>
      </div>
      <div className="px-3 py-2 rounded-xl bg-[#1F1A17] text-[#fcd400] font-mono font-extrabold text-xs">
        #GenSNAP · GenBI UNIKU
      </div>
    </div>
  );
}

function ErrorCard() {
  return (
    <div className="flex flex-col items-center gap-4 text-center max-w-xs">
      <div className="w-14 h-14 rounded-2xl bg-white border-3 border-[#1F1A17] shadow-brutal flex items-center justify-center">
        <AlertCircle className="w-7 h-7 text-[#ED3237]" />
      </div>
      <div>
        <h1 className="text-2xl font-extrabold text-[#1F1A17] font-['var(--font-bricolage)'] tracking-tight">
          GAGAL MEMUAT
        </h1>
        <p className="text-sm text-[#434653] font-medium mt-2 leading-relaxed">
          Terjadi kesalahan saat memuat foto. Coba refresh halaman ini atau minta QR code baru dari booth.
        </p>
      </div>
    </div>
  );
}
