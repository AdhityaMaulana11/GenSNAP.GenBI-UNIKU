'use client';

import React, { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Upload, ArrowLeft, Check, AlertCircle } from 'lucide-react';
import { Header } from '@/components/layout/header';
import { Button } from '@/components/ui/button';
import { usePhotoboothSession } from '@/lib/session/session-context';
import { FrameConfig, FrameSlot } from '@/types/photobooth';
import { Footer } from '@/components/layout/footer';

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
    <div className="min-h-[100dvh] flex flex-col bg-[#fcf9f8] relative">
      <Header />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-8 py-10 sm:py-14 flex flex-col items-center">
        <div className="text-center max-w-xl mx-auto mb-8">
          <div className="inline-block px-3 py-1 rounded-xl bg-[#F5F19A] border-2 border-[#1F1A17] text-xs font-mono font-bold text-[#1F1A17] mb-3 shadow-brutal-sm">
            [ PORTAL UNGGAH FRAME // FORMAT PNG ]
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-[#1F1A17] tracking-tight font-['var(--font-bricolage)']">
            UPLOAD CUSTOM FRAME
          </h1>
          <p className="text-sm sm:text-base text-[#434653] font-medium mt-2">
            Unggah desain frame buatanmu sendiri format PNG dengan area transparan.
          </p>
        </div>

        {errorMsg && (
          <div className="w-full max-w-md p-4 mb-6 rounded-2xl bg-[#ffdad6] border-2 border-[#ED3237] text-[#93000a] flex items-center gap-3 text-sm font-semibold shadow-brutal-sm">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {!previewUrl ? (
          /* Dropzone / Upload Box */
          <div
            onClick={() => fileInputRef.current?.click()}
            className="w-full max-w-md aspect-[4/3] rounded-3xl border-3 border-dashed border-[#1F1A17] bg-white hover:bg-[#F5F19A]/20 transition-all duration-200 flex flex-col items-center justify-center p-8 cursor-pointer shadow-brutal text-center group"
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/png"
              onChange={handleFileChange}
              className="hidden"
            />
            <div className="w-16 h-16 rounded-2xl bg-[#fcd400] text-[#1F1A17] border-2 border-[#1F1A17] flex items-center justify-center mb-4 group-hover:scale-105 transition-transform shadow-brutal-sm">
              <Upload className="w-8 h-8" />
            </div>
            <h3 className="font-extrabold text-xl text-[#1F1A17] font-['var(--font-bricolage)']">
              Pilih File Gambar PNG
            </h3>
            <p className="text-xs sm:text-sm text-[#434653] mt-1 font-medium">
              Pastikan area penempatan foto transparan
            </p>
            <span className="mt-4 text-xs font-mono font-bold text-[#3E4095] uppercase tracking-wider bg-[#eef0fa] border border-[#3E4095]/30 px-3 py-1 rounded-xl">
              PNG TRANSPARAN (MAKS 15MB)
            </span>
          </div>
        ) : (
          /* Preview & Slot Configuration */
          <div className="w-full max-w-lg flex flex-col items-center bg-white p-6 sm:p-8 rounded-3xl border-3 border-[#1F1A17] shadow-brutal">
            <div className="w-full max-w-[240px] aspect-[560/1600] max-h-[380px] relative rounded-2xl overflow-hidden border-2 border-[#1F1A17] bg-[#fcf9f8] p-3 mb-6 shadow-brutal-sm">
              <Image
                src={previewUrl}
                alt="Custom Frame Preview"
                fill
                sizes="(max-width: 640px) 240px, 300px"
                className="object-contain"
              />
            </div>

            <div className="w-full space-y-4">
              <div>
                <label className="block text-xs font-mono font-extrabold text-[#1F1A17] uppercase mb-2">
                  [ JUMLAH SLOT FOTO ]:
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[3, 4, 6].map((count) => (
                    <button
                      key={count}
                      type="button"
                      onClick={() => setPhotoCount(count)}
                      className={`py-2 px-3 rounded-xl font-mono font-bold text-xs uppercase border-2 transition-all ${
                        photoCount === count
                          ? 'bg-[#3E4095] text-white border-[#1F1A17] shadow-brutal-sm'
                          : 'bg-white text-[#1F1A17] border-[#1F1A17] hover:bg-[#F5F19A]'
                      }`}
                    >
                      {count} FOTO
                    </button>
                  ))}
                </div>
              </div>

              <div className="text-xs font-mono font-bold text-[#737784] text-center">
                DIMENSI: {frameDimensions?.width} x {frameDimensions?.height} PX
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
                className="flex-1 shadow-brutal"
              >
                <Check className="w-4 h-4" />
                <span>Gunakan Frame</span>
              </Button>
            </div>
          </div>
        )}

        <div className="mt-8 mb-6">
          <Button
            variant="ghost"
            onClick={() => router.push('/frames')}
            className="text-xs font-mono font-bold"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            <span>Kembali Ke Pilihan Frame</span>
          </Button>
        </div>
      </main>

      <Footer />
    </div>
  );
}
