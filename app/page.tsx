'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Camera, Image as ImageIcon, Sparkles, Video, Download, ArrowRight, CheckCircle2 } from 'lucide-react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Button } from '@/components/ui/button';
import { usePhotoboothSession } from '@/lib/session/session-context';

export default function LandingPage() {
  const { setFrame } = usePhotoboothSession();

  return (
    <div className="min-h-[100dvh] flex flex-col bg-[#fcf9f8] bg-dot-pattern relative overflow-x-hidden">
      <Header />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-14 flex flex-col items-center">
        {/* HERO SECTION: Asymmetric 7/5 Desktop Split */}
        <section aria-label="Hero Studio" className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center mb-16 sm:mb-20">
          {/* Left Column (7 cols): Editorial Typography & Command Launchpad */}
          <div className="lg:col-span-7 flex flex-col items-start text-left">
            {/* Technical Event Stamp */}
            <div className="flex items-center gap-2.5 px-3.5 py-1.5 rounded-xl bg-[#F5F19A] border-2 border-[#1F1A17] shadow-brutal-sm mb-5 select-none animate-in fade-in slide-in-from-top-2 duration-300">
              <div className="w-4 h-4 relative shrink-0">
                <Image
                  src="/champions-explorer2.png"
                  alt="Champions Explorer Logo"
                  width={16}
                  height={16}
                  className="w-auto h-auto object-contain"
                  style={{ width: 'auto', height: 'auto' }}
                />
              </div>
              <span className="font-mono font-extrabold text-[11px] sm:text-xs text-[#1F1A17] uppercase tracking-wider">
                [ SPECIAL EVENT // CHAMPIONS EXPLORER 2026 ]
              </span>
            </div>

            {/* Macro-Typography Headline */}
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tighter text-[#1F1A17] leading-[0.96] font-['var(--font-bricolage)'] mb-5">
              KLIK MOMENNYA,{' '}
              <span className="text-[#3E4095] block sm:inline">
                ABADIKAN
              </span>{' '}
              <span className="relative inline-block text-[#1F1A17]">
                CERITANYA.
                <span className="absolute left-0 bottom-1 w-full h-3 bg-[#fcd400] -z-10 -rotate-1 rounded" />
              </span>
            </h1>

            {/* Concise Subtext (Strictly under 20 words) */}
            <p className="text-base sm:text-lg text-[#434653] font-medium leading-relaxed max-w-xl mb-6">
              Abadikan momen terbaikmu di Champions Explorer 2026 dengan photobooth digital interaktif resmi GenBI UNIKU.
            </p>

            {/* Command Launchpad CTAs */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 w-full sm:w-auto mb-8">
              <Link href="/mode" className="w-full sm:w-auto">
                <Button
                  variant="primary"
                  size="lg"
                  className="w-full sm:w-auto text-base sm:text-lg px-8 py-4 shadow-brutal"
                >
                  <Camera className="w-5 h-5 text-[#fcd400]" aria-hidden="true" />
                  <span>Mulai Photobooth</span>
                </Button>
              </Link>

              <a href="#frames" className="w-full sm:w-auto">
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full sm:w-auto text-base sm:text-lg px-8 py-4"
                >
                  <ImageIcon className="w-5 h-5 text-[#3E4095]" aria-hidden="true" />
                  <span>Lihat Frame</span>
                </Button>
              </a>
            </div>

            {/* Telemetry Quick Status Bar */}
            <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs font-mono font-bold text-[#1F1A17]">
              <span className="px-2.5 py-1 rounded-lg bg-white border-2 border-[#1F1A17] shadow-brutal-sm flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                3 MODES READY
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-white border-2 border-[#1F1A17] shadow-brutal-sm flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#3E4095]" />
                2 OFFICIAL FRAMES
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-[#F5F19A] border-2 border-[#1F1A17] shadow-brutal-sm flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#ED3237]" />
                INSTANT EXPORT
              </span>
            </div>
          </div>

          {/* Right Column (5 cols): Layered Photostrip Specimen Showcase */}
          <div className="lg:col-span-5 flex justify-center lg:justify-end relative">
            <div className="relative w-full max-w-[340px] sm:max-w-[380px] bg-white rounded-3xl p-5 border-4 border-[#1F1A17] shadow-brutal-lg rotate-1 hover:rotate-0 transition-transform duration-300">
              {/* Corner Registration Crosses */}
              <div className="absolute top-2 left-2 font-mono text-xs font-bold text-[#1F1A17]/40 select-none">+</div>
              <div className="absolute top-2 right-2 font-mono text-xs font-bold text-[#1F1A17]/40 select-none">+</div>
              <div className="absolute bottom-2 left-2 font-mono text-xs font-bold text-[#1F1A17]/40 select-none">+</div>
              <div className="absolute bottom-2 right-2 font-mono text-xs font-bold text-[#1F1A17]/40 select-none">+</div>

              {/* Card Header Spec */}
              <div className="flex items-center justify-between pb-3 mb-3 border-b-2 border-[#1F1A17]/20 font-mono text-xs font-bold text-[#1F1A17]">
                <span>SPECIMEN // 01</span>
                <span className="text-[#3E4095] bg-[#eef0fa] px-2 py-0.5 rounded">CE-2026 EDITION</span>
              </div>

              {/* Physical Photostrip Display */}
              <div className="w-full aspect-[4/5] relative rounded-2xl overflow-hidden border-2 border-[#1F1A17] bg-[#fcf9f8] mb-4 flex items-center justify-center p-2">
                <Image
                  src="/champions-explorer1.png"
                  alt="Champions Explorer Visual"
                  fill
                  sizes="(max-width: 640px) 300px, 380px"
                  className="object-contain p-2"
                  priority
                />
              </div>

              {/* Card Action Strip */}
              <div className="flex items-center justify-between pt-1 font-mono text-xs">
                <span className="font-extrabold text-[#1F1A17]">LAYOUT: 3-SLOT STRIP</span>
                <Link
                  href="/mode"
                  onClick={() => setFrame('frame-01')}
                  className="px-3 py-1.5 rounded-lg bg-[#3E4095] text-white font-bold border-2 border-[#1F1A17] shadow-brutal-sm hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 transition-all"
                >
                  PILIH FRAME →
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* EVENT THEME PLACARD: Architectural Event Manifest */}
        <section aria-label="Tema Event" className="w-full max-w-6xl mb-16 sm:mb-20">
          <div className="w-full p-6 sm:p-8 rounded-3xl bg-[#F5F19A] border-3 border-[#1F1A17] shadow-brutal flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
            <div className="flex flex-col gap-2 max-w-3xl">
              <div className="flex items-center gap-2 font-mono text-xs font-extrabold text-[#3E4095] uppercase">
                <span className="px-2 py-0.5 rounded bg-[#3E4095] text-white">TEMA UTAMA</span>
                <span>BANK INDONESIA & GENBI UNIKU</span>
              </div>
              <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-[#1F1A17] tracking-tight font-['var(--font-bricolage)'] leading-snug">
                “Explore the World of Central Banking: Buka Wawasan, Jelajahi Tantangan, Temukan Pengetahuan”
              </h2>
            </div>

            <div className="shrink-0 flex flex-col items-start md:items-end gap-1 font-mono text-xs font-bold text-[#1F1A17] bg-white/70 p-3.5 rounded-2xl border-2 border-[#1F1A17]">
              <span>LOKASI: KAMPUS 1 UNIKU</span>
              <span>KUNINGAN, JAWA BARAT</span>
              <span className="text-[#3E4095] mt-1">TAHUN: 2026</span>
            </div>
          </div>
        </section>

        {/* BENTO FEATURE SHOWCASE: 4-Card Asymmetric Industrial Grid */}
        <section aria-label="Fitur Utama" className="w-full max-w-6xl mb-16 sm:mb-24">
          <div className="flex items-center justify-between mb-8 pb-3 border-b-3 border-[#1F1A17]">
            <div>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-[#1F1A17] tracking-tight font-['var(--font-bricolage)']">
                FITUR STUDIO UNGGULAN
              </h2>
              <p className="text-xs sm:text-sm font-mono font-medium text-[#434653] mt-1">
                [ TEKNOLOGI PHOTOBOOTH BROWSER-BASED RESMI CHAMPIONS EXPLORER ]
              </p>
            </div>
            <span className="hidden sm:inline font-mono font-bold text-xs bg-white border-2 border-[#1F1A17] px-3 py-1 rounded-lg shadow-brutal-sm">
              4 MODUL AKTIF
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            {/* Bento 1: Wide Master Card (Photo Strip) - Col 7 */}
            <div className="md:col-span-7 bg-[#3E4095] text-white rounded-3xl p-6 sm:p-8 border-3 border-[#1F1A17] shadow-brutal flex flex-col justify-between relative group">
              <div>
                <div className="flex items-center justify-between mb-5">
                  <div className="w-12 h-12 rounded-2xl bg-[#fcd400] text-[#1F1A17] border-2 border-[#1F1A17] flex items-center justify-center shadow-brutal-sm">
                    <Camera className="w-6 h-6 text-[#1F1A17]" aria-hidden="true" />
                  </div>
                  <span className="px-3 py-1 rounded-xl bg-white text-[#1F1A17] font-mono text-xs font-extrabold uppercase border-2 border-[#1F1A17] shadow-brutal-sm">
                    MODE UTAMA
                  </span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-extrabold font-['var(--font-bricolage)'] leading-tight text-white mb-2">
                  Multi-Shot Photo Strip
                </h3>
                <p className="text-sm sm:text-base text-white/90 font-medium leading-relaxed max-w-lg">
                  Ambil 3 atau 6 foto beruntun otomatis dengan panduan audio visual, shutter flash realistis, dan studio ring light terintegrasi.
                </p>
              </div>

              <div className="mt-8 pt-4 border-t-2 border-white/20 flex flex-wrap items-center gap-3 text-xs font-mono font-bold">
                <span className="flex items-center gap-1.5 bg-white/10 px-2.5 py-1 rounded-lg border border-white/20">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#fcd400]" aria-hidden="true" />
                  COUNTDOWN 3S / 5S / 10S
                </span>
                <span className="flex items-center gap-1.5 bg-white/10 px-2.5 py-1 rounded-lg border border-white/20">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#fcd400]" aria-hidden="true" />
                  SINGLE-SLOT RETAKE
                </span>
              </div>
            </div>

            {/* Bento 2: Gold Accent Card (Live Photo) - Col 5 */}
            <div className="md:col-span-5 bg-[#fcd400] text-[#1F1A17] rounded-3xl p-6 sm:p-8 border-3 border-[#1F1A17] shadow-brutal flex flex-col justify-between relative group">
              <div>
                <div className="flex items-center justify-between mb-5">
                  <div className="w-12 h-12 rounded-2xl bg-[#3E4095] text-white border-2 border-[#1F1A17] flex items-center justify-center shadow-brutal-sm">
                    <Sparkles className="w-6 h-6 text-[#fcd400]" aria-hidden="true" />
                  </div>
                  <span className="px-3 py-1 rounded-xl bg-[#ED3237] text-white font-mono text-xs font-extrabold uppercase border-2 border-[#1F1A17] shadow-brutal-sm">
                    INTERAKTIF
                  </span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-extrabold font-['var(--font-bricolage)'] leading-tight text-[#1F1A17] mb-2">
                  Live Photo Motion
                </h3>
                <p className="text-sm sm:text-base text-[#1F1A17]/85 font-medium leading-relaxed">
                  Merekam cuplikan gerak hidup yang dapat diputar secara interaktif saat frame ditekan atau disentuh.
                </p>
              </div>

              <div className="mt-8 pt-4 border-t-2 border-[#1F1A17]/20 flex items-center justify-between text-xs font-mono font-extrabold uppercase tracking-wider text-[#1F1A17]">
                <span>MOTION CLIP ENGINE</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
              </div>
            </div>

            {/* Bento 3: Video Mode - Col 6 */}
            <div className="md:col-span-6 bg-white text-[#1F1A17] rounded-3xl p-6 sm:p-8 border-3 border-[#1F1A17] shadow-brutal flex flex-col justify-between group">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-[#3E4095] text-white border-2 border-[#1F1A17] flex items-center justify-center shadow-brutal-sm">
                    <Video className="w-6 h-6 text-[#fcd400]" aria-hidden="true" />
                  </div>
                  <span className="px-3 py-1 rounded-xl bg-[#E67817] text-white font-mono text-xs font-extrabold uppercase border-2 border-[#1F1A17] shadow-brutal-sm">
                    UNIKU ORANGE
                  </span>
                </div>
                <h3 className="text-xl sm:text-2xl font-extrabold font-['var(--font-bricolage)'] text-[#1F1A17] mb-2">
                  Video Booth 15 Detik
                </h3>
                <p className="text-sm text-[#434653] font-medium leading-relaxed">
                  Rekam ekspresi kebersamaan kilat dengan timer presisi dan orientasi kamera depan maupun belakang.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t-2 border-[#1F1A17]/10 text-xs font-mono font-extrabold text-[#3E4095] uppercase tracking-wider">
                DURASI MAKSIMAL: 15 DETIK
              </div>
            </div>

            {/* Bento 4: Digital Export - Col 6 */}
            <div className="md:col-span-6 bg-white text-[#1F1A17] rounded-3xl p-6 sm:p-8 border-3 border-[#1F1A17] shadow-brutal flex flex-col justify-between group">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-[#fcd400] text-[#1F1A17] border-2 border-[#1F1A17] flex items-center justify-center shadow-brutal-sm">
                    <Download className="w-6 h-6 text-[#1F1A17]" aria-hidden="true" />
                  </div>
                  <span className="px-3 py-1 rounded-xl bg-[#427799] text-white font-mono text-xs font-extrabold uppercase border-2 border-[#1F1A17] shadow-brutal-sm">
                    UNIKU BLUE
                  </span>
                </div>
                <h3 className="text-xl sm:text-2xl font-extrabold font-['var(--font-bricolage)'] text-[#1F1A17] mb-2">
                  Ekspor Digital Resolusi Tinggi
                </h3>
                <p className="text-sm text-[#434653] font-medium leading-relaxed">
                  Simpan langsung hasil photobooth format PNG dan JPG jernih atau bagikan via Web Share API tanpa kompresi buram.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t-2 border-[#1F1A17]/10 text-xs font-mono font-extrabold text-[#3E4095] uppercase tracking-wider">
                CANVAS RENDER ENGINE: 300 DPI
              </div>
            </div>
          </div>
        </section>

        {/* FRAME SPECIMEN SHOWCASE: Physical Elevated Gallery */}
        <section id="frames" className="w-full max-w-6xl mb-16 sm:mb-24 flex flex-col items-center">
          <div className="w-full flex flex-col md:flex-row items-start md:items-end justify-between mb-10 pb-3 border-b-3 border-[#1F1A17] gap-3">
            <div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-[#1F1A17] tracking-tight font-['var(--font-bricolage)']">
                KOLEKSI TEMPLATE FRAME
              </h2>
              <p className="text-xs sm:text-sm font-mono text-[#434653] mt-1 font-bold">
                [ PILIH TEMPLATE RESMI CHAMPIONS EXPLORER ATAU UNGGAH KREASIMU ]
              </p>
            </div>
            <Link href="/frames/custom">
              <Button variant="secondary" size="sm">
                Unggah Custom Frame
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-12 w-full max-w-4xl items-start">
            {/* Frame Specimen 01 */}
            <div className="flex flex-col bg-white rounded-3xl p-6 border-3 border-[#1F1A17] shadow-brutal group">
              <div className="flex items-center justify-between pb-3 mb-4 border-b-2 border-[#1F1A17]/20 font-mono text-xs font-extrabold">
                <span className="text-[#3E4095]">SPECIMEN // 01</span>
                <span>3 PHOTOS VERTICAL</span>
              </div>

              <Link
                href="/mode"
                onClick={() => setFrame('frame-01')}
                className="w-full aspect-[560/1600] max-h-[460px] rounded-2xl overflow-hidden border-3 border-[#1F1A17] bg-[#fcf9f8] relative block group-hover:-translate-y-1 transition-transform p-3 shadow-brutal-sm"
                title="Pilih Frame 01 (Vertical 3 Photos)"
              >
                <Image
                  src="/frames/frame-01.png"
                  alt="Frame 01 Vertical 3 Photos"
                  fill
                  sizes="(max-width: 640px) 260px, 320px"
                  className="object-contain p-2"
                  priority
                />
              </Link>

              <div className="mt-5 flex items-center justify-between">
                <div>
                  <h3 className="font-extrabold text-xl text-[#1F1A17] font-['var(--font-bricolage)']">Frame 01</h3>
                  <p className="text-xs font-mono text-[#434653] font-bold">Format Strip Klasik</p>
                </div>
                <Link href="/mode" onClick={() => setFrame('frame-01')}>
                  <Button variant="primary" size="sm">
                    Gunakan Frame
                  </Button>
                </Link>
              </div>
            </div>

            {/* Frame Specimen 02 */}
            <div className="flex flex-col bg-white rounded-3xl p-6 border-3 border-[#1F1A17] shadow-brutal group">
              <div className="flex items-center justify-between pb-3 mb-4 border-b-2 border-[#1F1A17]/20 font-mono text-xs font-extrabold">
                <span className="text-[#3E4095]">SPECIMEN // 02</span>
                <span>6 PHOTOS GRID</span>
              </div>

              <Link
                href="/mode"
                onClick={() => setFrame('frame-02')}
                className="w-full aspect-[1067/1600] max-h-[460px] rounded-2xl overflow-hidden border-3 border-[#1F1A17] bg-[#fcf9f8] relative block group-hover:-translate-y-1 transition-transform p-3 shadow-brutal-sm"
                title="Pilih Frame 02 (Grid 6 Photos)"
              >
                <Image
                  src="/frames/frame-02.png"
                  alt="Frame 02 Grid 6 Photos"
                  fill
                  sizes="(max-width: 640px) 340px, 400px"
                  className="object-contain p-2"
                  priority
                />
              </Link>

              <div className="mt-5 flex items-center justify-between">
                <div>
                  <h3 className="font-extrabold text-xl text-[#1F1A17] font-['var(--font-bricolage)']">Frame 02</h3>
                  <p className="text-xs font-mono text-[#434653] font-bold">Format Grid 6 Kotak</p>
                </div>
                <Link href="/mode" onClick={() => setFrame('frame-02')}>
                  <Button variant="primary" size="sm">
                    Gunakan Frame
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
