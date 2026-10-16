'use client';

import React, { useEffect, useState } from 'react';
import QRCode from 'qrcode';
import { QrCode, Clock, Copy, Check, Loader2, AlertCircle } from 'lucide-react';

interface QRSharePanelProps {
  /** PNG blob dari finalImageBlob di session */
  photoBlob: Blob;
  /** URL base tanpa trailing slash (e.g. https://gensnap.vercel.app) */
  siteUrl?: string;
}

type UploadStatus = 'idle' | 'uploading' | 'ready' | 'error';

const QR_TTL_MINUTES = 10;

export function QRSharePanel({ photoBlob, siteUrl }: QRSharePanelProps) {
  const [uploadStatus, setUploadStatus] = useState<UploadStatus>('idle');
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(QR_TTL_MINUTES * 60);

  // Upload foto & generate QR saat komponen mount
  useEffect(() => {
    let cancelled = false;

    async function uploadAndGenerateQR() {
      setUploadStatus('uploading');
      try {
        const formData = new FormData();
        formData.append('photo', photoBlob, 'photo.png');

        const res = await fetch('/api/share-photo', {
          method: 'POST',
          body: formData,
        });

        if (!res.ok) throw new Error('upload failed');
        const { token } = await res.json() as { token: string };

        // Selalu pakai NEXT_PUBLIC_SITE_URL (production URL) supaya QR tidak
        // pernah ngarah ke preview deployment Vercel yang butuh login.
        const base =
          siteUrl ??
          process.env.NEXT_PUBLIC_SITE_URL ??
          window.location.origin;
        const url = `${base}/d/${token}`;

        if (cancelled) return;

        const qr = await QRCode.toDataURL(url, {
          width: 240,
          margin: 2,
          color: { dark: '#1F1A17', light: '#ffffff' },
          errorCorrectionLevel: 'M',
        });

        setQrDataUrl(qr);
        setDownloadUrl(url);
        setUploadStatus('ready');
      } catch {
        if (!cancelled) setUploadStatus('error');
      }
    }

    uploadAndGenerateQR();
    return () => { cancelled = true; };
  }, [photoBlob, siteUrl]);

  // Countdown timer (hanya jalan kalau QR sudah ready)
  useEffect(() => {
    if (uploadStatus !== 'ready') return;

    const interval = setInterval(() => {
      setSecondsLeft((s) => {
        if (s <= 1) { clearInterval(interval); return 0; }
        return s - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [uploadStatus]);

  const handleCopyLink = async () => {
    if (!downloadUrl) return;
    await navigator.clipboard.writeText(downloadUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const minutesLeft = Math.ceil(secondsLeft / 60);

  // ── Uploading state ──
  if (uploadStatus === 'uploading' || uploadStatus === 'idle') {
    return (
      <div className="flex flex-col items-center gap-3 py-6">
        <div className="w-12 h-12 rounded-xl bg-[#eef0fa] border-2 border-[#1F1A17] shadow-brutal-sm flex items-center justify-center">
          <Loader2 className="w-6 h-6 text-[#3E4095] animate-spin" />
        </div>
        <p className="font-mono font-extrabold text-xs text-[#434653] uppercase tracking-wide text-center">
          Membuat QR Code...
        </p>
      </div>
    );
  }

  // ── Error state ──
  if (uploadStatus === 'error') {
    return (
      <div className="flex flex-col items-center gap-3 py-4">
        <div className="w-12 h-12 rounded-xl bg-white border-2 border-[#1F1A17] shadow-brutal-sm flex items-center justify-center">
          <AlertCircle className="w-6 h-6 text-[#ED3237]" />
        </div>
        <p className="font-mono font-extrabold text-xs text-[#ED3237] uppercase tracking-wide text-center">
          Gagal membuat QR Code
        </p>
        <p className="text-xs text-[#434653] text-center max-w-[200px] leading-relaxed">
          Cek koneksi internet dan pastikan env Upstash sudah dikonfigurasi.
        </p>
      </div>
    );
  }

  // ── Ready state ──
  return (
    <div className="flex flex-col items-center gap-4 w-full">
      {/* Section label */}
      <div className="flex items-center gap-2 w-full">
        <div className="h-px flex-1 bg-[#1F1A17]/15" />
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#3E4095] border-2 border-[#1F1A17] font-mono font-extrabold text-[10px] text-white shadow-brutal-sm">
          <QrCode className="w-3 h-3" />
          <span>SCAN UNTUK DOWNLOAD</span>
        </div>
        <div className="h-px flex-1 bg-[#1F1A17]/15" />
      </div>

      {/* QR code card */}
      {qrDataUrl && (
        <div className="relative bg-white border-3 border-[#1F1A17] rounded-2xl p-3 shadow-brutal">
          {/* Corner marks */}
          <div className="absolute top-2 left-2 font-mono text-[10px] text-[#1F1A17]/30 select-none">+</div>
          <div className="absolute top-2 right-2 font-mono text-[10px] text-[#1F1A17]/30 select-none">+</div>
          <div className="absolute bottom-2 left-2 font-mono text-[10px] text-[#1F1A17]/30 select-none">+</div>
          <div className="absolute bottom-2 right-2 font-mono text-[10px] text-[#1F1A17]/30 select-none">+</div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={qrDataUrl}
            alt="QR Code untuk download foto"
            width={200}
            height={200}
            className="block rounded-xl"
          />
        </div>
      )}

      {/* Instruction */}
      <p className="text-xs text-[#434653] font-medium text-center leading-relaxed max-w-[220px]">
        Arahkan kamera HP ke QR ini.<br />Foto langsung bisa didownload.
      </p>

      {/* Timer badge */}
      {secondsLeft > 0 ? (
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#fcd400]/30 border-2 border-[#1F1A17]/20 font-mono font-extrabold text-[10px] text-[#1F1A17]">
          <Clock className="w-3 h-3 shrink-0" />
          <span>QR aktif: {minutesLeft} menit lagi</span>
        </div>
      ) : (
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#ED3237]/10 border-2 border-[#ED3237]/30 font-mono font-extrabold text-[10px] text-[#ED3237]">
          <Clock className="w-3 h-3 shrink-0" />
          <span>QR sudah kedaluwarsa</span>
        </div>
      )}

      {/* Copy link button */}
      {downloadUrl && (
        <button
          onClick={handleCopyLink}
          className="flex items-center gap-2 px-3 py-2 rounded-xl border-2 border-[#1F1A17] bg-white text-[#1F1A17] font-mono font-extrabold text-[10px] uppercase tracking-wide shadow-brutal-sm hover:bg-[#F5F19A] transition-colors active-brutal"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-600 stroke-[3]" />
              <span>Link Tersalin!</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              <span>Salin Link Download</span>
            </>
          )}
        </button>
      )}
    </div>
  );
}
