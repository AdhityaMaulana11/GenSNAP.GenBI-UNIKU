'use client';

import React, { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Upload, ArrowLeft, Check, AlertCircle } from 'lucide-react';
import { Header } from '@/components/layout/header';
import { Button } from '@/components/ui/button';
import { usePhotoboothSession } from '@/lib/session/session-context';
import { FrameConfig, FrameSlot } from '@/types/photobooth';

export default function CustomFramePage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { setCustomFrame } = usePhotoboothSession();

  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [frameDimensions, setFrameDimensions] = useState<{ width: number; height: number } | null>(null);
  const [photoCount, setPhotoCount] = useState<number>(3);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setErrorMsg(null);

    // Validate PNG
    if (!file.type.includes('png')) {
      setErrorMsg('Format file harus berupa PNG dengan transparansi untuk area foto.');
      return;
    }

    // Validate size (max 15MB)
    if (file.size > 15 * 1024 * 1024) {
      setErrorMsg('Ukuran file terlalu besar. Maksimal 15MB.');
      return;
    }

    const objectUrl = URL.createObjectURL(file);
    const img = new window.Image();
    img.onload = () => {
      setFrameDimensions({ width: img.naturalWidth, height: img.naturalHeight });
      setPreviewUrl(objectUrl);
      // Guess photo count based on aspect ratio
      const aspect = img.naturalWidth / img.naturalHeight;
      if (aspect < 0.5) {
        setPhotoCount(3);
      } else {
        setPhotoCount(6);
      }
    };
    img.onerror = () => {
      setErrorMsg('Gagal memuat gambar. Pastikan file gambar PNG valid.');
    };
    img.src = objectUrl;
  };

  const handleUseFrame = () => {
    if (!previewUrl || !frameDimensions) return;

    const width = frameDimensions.width;
    const height = frameDimensions.height;
    const slots: FrameSlot[] = [];

    // Generate slots based on user selected count
    if (photoCount === 3) {
      // 3 vertical slots
      const slotHeight = Math.floor((height * 0.78) / 3);
      const slotWidth = Math.floor(width * 0.85);
      const startX = Math.floor((width - slotWidth) / 2);
      const startY = Math.floor(height * 0.05);
      const gap = Math.floor((height * 0.1) / 2);

      for (let i = 0; i < 3; i++) {
        slots.push({
          x: startX,
          y: startY + i * (slotHeight + gap),
          width: slotWidth,
          height: slotHeight,
        });
      }
    } else if (photoCount === 4) {
      // 2x2 grid slots
      const colWidth = Math.floor(width * 0.42);
      const rowHeight = Math.floor(height * 0.35);
      const startX1 = Math.floor(width * 0.06);
      const startX2 = Math.floor(width * 0.52);
      const startY1 = Math.floor(height * 0.08);
      const startY2 = Math.floor(height * 0.48);

      slots.push({ x: startX1, y: startY1, width: colWidth, height: rowHeight });
      slots.push({ x: startX2, y: startY1, width: colWidth, height: rowHeight });
      slots.push({ x: startX1, y: startY2, width: colWidth, height: rowHeight });
      slots.push({ x: startX2, y: startY2, width: colWidth, height: rowHeight });
    } else {
      // 6 photos (2x3 grid)
      const colWidth = Math.floor(width * 0.42);
      const rowHeight = Math.floor(height * 0.25);
      const startX1 = Math.floor(width * 0.06);
      const startX2 = Math.floor(width * 0.52);
      const startY = Math.floor(height * 0.05);
      const gapY = Math.floor(height * 0.03);

      for (let r = 0; r < 3; r++) {
        const y = startY + r * (rowHeight + gapY);
        slots.push({ x: startX1, y, width: colWidth, height: rowHeight });
        slots.push({ x: startX2, y, width: colWidth, height: rowHeight });
      }
    }

    const customConfig: FrameConfig = {
      id: 'custom-frame-' + Date.now(),
      name: 'Custom Frame',
      subtitle: `${photoCount} Photos`,
      photoCount,
      width,
      height,
      imageSrc: previewUrl,
      slots,
      isCustom: true,
    };

    setCustomFrame(customConfig);
    router.push('/frames');
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#fcf9f8] relative">
      <Header />

      <main className="flex-1 max-w-4xl w-full mx-auto px-5 sm:px-8 py-10 sm:py-14 flex flex-col items-center">
        <div className="text-center max-w-xl mx-auto mb-8">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#00327d] tracking-tight font-['var(--font-bricolage)']">
            Upload Custom Frame
          </h1>
          <p className="text-sm sm:text-base text-[#434653] font-medium mt-2">
            Unggah desain frame buatanmu sendiri (format PNG transparan)
          </p>
        </div>

        {errorMsg && (
          <div className="w-full max-w-md p-4 mb-6 rounded-2xl bg-[#ffdad6] border-2 border-[#ba1a1a] text-[#93000a] flex items-center gap-3 text-sm font-semibold">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {!previewUrl ? (
          /* Dropzone / Upload Box */
          <div
            onClick={() => fileInputRef.current?.click()}
            className="w-full max-w-md aspect-[4/3] rounded-3xl border-3 border-dashed border-[#00327d] bg-white hover:bg-[#00327d]/5 transition-all duration-200 flex flex-col items-center justify-center p-8 cursor-pointer shadow-hard-blue text-center group"
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/png"
              onChange={handleFileChange}
              className="hidden"
            />
            <div className="w-16 h-16 rounded-full bg-[#fcd400] text-[#00327d] flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-hard-gold-sm">
              <Upload className="w-8 h-8" />
            </div>
            <h3 className="font-extrabold text-lg sm:text-xl text-[#00327d]">
              Pilih file gambar PNG
            </h3>
            <p className="text-xs sm:text-sm text-[#434653] mt-1 font-medium">
              Pastikan area foto memiliki transparansi
            </p>
            <span className="mt-4 text-xs font-bold text-[#00327d] uppercase tracking-wider bg-[#e8f0fe] px-3 py-1 rounded-full">
              Format PNG (Max 15MB)
            </span>
          </div>
        ) : (
          /* Preview & Slot Configuration */
          <div className="w-full max-w-lg flex flex-col items-center bg-white p-6 sm:p-8 rounded-3xl border-3 border-[#00327d] shadow-hard-blue">
            <div className="w-full max-w-[240px] aspect-[560/1600] max-h-[380px] relative rounded-2xl overflow-hidden border-2 border-[#00327d]/20 bg-[#fcf9f8] p-2 mb-6">
              <Image
                src={previewUrl}
                alt="Custom Frame Preview"
                fill
                className="object-contain"
              />
            </div>

            <div className="w-full space-y-4">
              <div>
                <label className="block text-sm font-bold text-[#00327d] mb-2">
                  Jumlah Slot Foto:
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[3, 4, 6].map((count) => (
                    <button
                      key={count}
                      type="button"
                      onClick={() => setPhotoCount(count)}
                      className={`py-2 px-3 rounded-full font-bold text-sm border-2 transition-all ${
                        photoCount === count
                          ? 'bg-[#00327d] text-white border-[#00327d] shadow-hard-blue-sm'
                          : 'bg-white text-[#434653] border-[#c3c6d5] hover:border-[#00327d]'
                      }`}
                    >
                      {count} Foto
                    </button>
                  ))}
                </div>
              </div>

              <div className="text-xs text-[#737784] font-medium text-center">
                Dimensi: {frameDimensions?.width} x {frameDimensions?.height} px
              </div>
            </div>

            <div className="flex items-center gap-3 w-full mt-6">
              <Button
                variant="outline"
                onClick={() => {
                  setPreviewUrl(null);
                  setFrameDimensions(null);
                }}
                className="flex-1"
              >
                Ganti File
              </Button>
              <Button
                variant="primary"
                onClick={handleUseFrame}
                className="flex-1"
              >
                <Check className="w-4 h-4" />
                Gunakan Frame
              </Button>
            </div>
          </div>
        )}

        <div className="mt-8">
          <Button
            variant="ghost"
            onClick={() => router.push('/frames')}
            className="text-sm"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Kembali ke Pilihan Frame
          </Button>
        </div>
      </main>
    </div>
  );
}
