import React from 'react';
import { AlertCircle, CameraOff, RefreshCw, ArrowLeft } from 'lucide-react';
import { Button } from './button';
import Link from 'next/link';

export type ErrorType =
  | 'camera_denied'
  | 'camera_unavailable'
  | 'no_camera'
  | 'browser_unsupported'
  | 'invalid_frame'
  | 'canvas_error'
  | 'export_error';

interface ErrorStateProps {
  type?: ErrorType;
  title?: string;
  message?: string;
  onRetry?: () => void;
  backHref?: string;
}

const ERROR_CONFIGS: Record<
  ErrorType,
  { title: string; message: string; actionText: string }
> = {
  camera_denied: {
    title: 'Akses Kamera Ditolak',
    message:
      'Kami membutuhkan izin kamera untuk mengambil foto photobooth. Silakan aktifkan izin kamera di pengaturan browsermu.',
    actionText: 'Coba Lagi',
  },
  camera_unavailable: {
    title: 'Kamera Tidak Tersedia',
    message:
      'Kamera sedang digunakan oleh aplikasi lain atau tidak dapat diakses. Silakan tutup aplikasi lain dan coba lagi.',
    actionText: 'Muat Ulang',
  },
  no_camera: {
    title: 'Kamera Tidak Ditemukan',
    message:
      'Tidak ada perangkat kamera yang terdeteksi. Pastikan webcam atau kamera perangkatmu terhubung dengan baik.',
    actionText: 'Coba Lagi',
  },
  browser_unsupported: {
    title: 'Browser Tidak Didukung',
    message:
      'Browser kamu tidak mendukung fitur kamera modern. Silakan gunakan Google Chrome, Safari, atau Firefox versi terbaru.',
    actionText: 'Kembali ke Beranda',
  },
  invalid_frame: {
    title: 'Format Frame Tidak Sesuai',
    message:
      'Pastikan file frame berupa gambar PNG dengan transparansi untuk area foto.',
    actionText: 'Pilih File Lain',
  },
  canvas_error: {
    title: 'Gagal Memproses Foto',
    message:
      'Terjadi kendala saat menggabungkan foto ke dalam frame. Silakan coba ulangi pengambilan foto.',
    actionText: 'Ulangi Foto',
  },
  export_error: {
    title: 'Gagal Mengunduh',
    message:
      'Terjadi kendala saat membuat file unduhan. Silakan coba kembali atau gunakan format lain.',
    actionText: 'Coba Lagi',
  },
};

export function ErrorState({
  type = 'camera_denied',
  title,
  message,
  onRetry,
  backHref = '/mode',
}: ErrorStateProps) {
  const config = ERROR_CONFIGS[type];
  const displayTitle = title || config.title;
  const displayMessage = message || config.message;

  return (
    <div className="w-full max-w-md mx-auto my-auto p-6 sm:p-8 bg-white rounded-3xl border-3 border-[#00327d] shadow-hard-blue text-center flex flex-col items-center gap-4">
      <div className="w-16 h-16 rounded-full bg-[#ffdad6] border-2 border-[#ba1a1a] flex items-center justify-center text-[#ba1a1a]">
        {type.startsWith('camera') ? (
          <CameraOff className="w-8 h-8" />
        ) : (
          <AlertCircle className="w-8 h-8" />
        )}
      </div>

      <h3 className="text-xl sm:text-2xl font-extrabold text-[#00327d]">
        {displayTitle}
      </h3>

      <p className="text-sm sm:text-base text-[#434653] leading-relaxed">
        {displayMessage}
      </p>

      <div className="flex flex-col sm:flex-row items-center gap-3 w-full mt-3">
        {onRetry && (
          <Button
            variant="primary"
            onClick={onRetry}
            className="w-full sm:flex-1"
          >
            <RefreshCw className="w-4 h-4" />
            {config.actionText}
          </Button>
        )}
        <Link href={backHref} className="w-full sm:flex-1">
          <Button variant="outline" className="w-full">
            <ArrowLeft className="w-4 h-4" />
            Kembali
          </Button>
        </Link>
      </div>
    </div>
  );
}
