'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Camera, Image as ImageIcon, Sparkles, Download, Compass } from 'lucide-react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Button } from '@/components/ui/button';
import {
  SquiggleDoodle,
  BlueStarDoodle,
  SparkleDoodle,
} from '@/components/ui/doodles';
import { usePhotoboothSession } from '@/lib/session/session-context';

export default function LandingPage() {
  const { setFrame } = usePhotoboothSession();

  return (
    <div className="min-h-screen flex flex-col bg-[#fcf9f8] bg-dot-pattern relative overflow-x-hidden">
      <Header />

      {/* Decorative Doodles */}
      <div className="absolute top-20 right-6 sm:right-16 pointer-events-none z-10">
        <SquiggleDoodle size={96} color="#fcd400" className="rotate-12 opacity-90" />
      </div>

      <main className="flex-1 max-w-6xl w-full mx-auto px-5 sm:px-8 py-8 sm:py-14 flex flex-col items-center">
        {/* Official Event Pill Badge */}
        <div className="flex items-center gap-2.5 px-4 py-2 rounded-full bg-white border-2 border-[#00327d] shadow-hard-blue-sm mb-6 select-none animate-in fade-in slide-in-from-top-2 duration-300">
          {/* <div className="w-5 h-5 relative shrink-0">
            <Image
              src="/Logo-GenBI-Uniku.png"
              alt="Logo GenBI"
              width={20}
              height={20}
              className="object-contain"
            />
          </div> */}
          {/* <span className="text-xs font-bold text-[#00327d]/40">•</span> */}
          <div className="w-5 h-5 relative shrink-0">
            <Image
              src="/champions-explorer2.png"
              alt="Champions Explorer Logo"
              width={20}
              height={20}
              className="object-contain"
            />
          </div>
          <span className="text-xs sm:text-sm font-extrabold text-[#00327d]">
            Special Event: Champions Explorer
          </span>
        </div>

        {/* Champions Explorer Logo & Typography Hero Header */}
        {/* <div className="relative w-full max-w-sm sm:max-w-md md:max-w-lg h-24 sm:h-32 mb-4 animate-in zoom-in-95 duration-500">
          <Image
            src="/champions-explorer1.png"
            alt="Champions Explorer - Explore the World of Central Banking"
            fill
            className="object-contain drop-shadow-md"
            priority
          />
        </div> */}

        {/* Hero Section */}
        <section className="text-center max-w-3xl mx-auto flex flex-col items-center gap-4 sm:gap-6">
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-[#00327d] leading-[1.15] font-['var(--font-bricolage)']">
            GenSNAP <span className="text-[#00327d]">by</span>{' '}
            <span className="text-[#fcd400] drop-shadow-[0_2px_2px_rgba(0,0,0,0.15)]">
              GenBI UNIKU
            </span>
          </h1>

          {/* Event Theme Box */}
          <div className="px-5 py-3 rounded-2xl bg-[#fcd400] border-2.5 border-[#00327d] shadow-hard-gold-sm max-w-2xl text-center relative group">
            <p className="text-xs sm:text-sm font-extrabold text-[#00327d] leading-relaxed">
              “Explore the World of Central Banking: Buka Wawasan, Jelajahi Tantangan, Temukan Pengetahuan”
            </p>
          </div>

          <p className="text-sm sm:text-lg text-[#434653] max-w-xl font-medium leading-relaxed mt-1">
            Klik Momennya, Abadikan Ceritanya. Abadikan kenangan serumu di kegiatan <span className="font-extrabold text-[#00327d]">Champions Explorer</span>!
          </p>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-5 w-full sm:w-auto mt-2">
            <Link href="/mode" className="w-full sm:w-auto">
              <Button
                variant="primary"
                size="lg"
                className="w-full sm:w-auto text-base sm:text-lg px-8 py-4"
              >
                <Camera className="w-5 h-5 text-[#fcd400]" />
                Mulai Photobooth
              </Button>
            </Link>

            <a href="#frames" className="w-full sm:w-auto">
              <Button
                variant="outline"
                size="lg"
                className="w-full sm:w-auto text-base sm:text-lg px-8 py-4"
              >
                <ImageIcon className="w-5 h-5" />
                Lihat Frame
              </Button>
            </a>
          </div>
        </section>

        {/* 4 Feature Highlights */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 w-full max-w-5xl mt-12 sm:mt-16">
          {/* Feature 1 */}
          <div className="bg-[#f0eded]/90 rounded-3xl p-5 sm:p-6 flex flex-col items-center text-center border-2 border-transparent hover:border-[#00327d] transition-all duration-200">
            <div className="w-12 h-12 rounded-full bg-[#00327d] flex items-center justify-center text-white mb-3 shadow-hard-blue-sm">
              <Camera className="w-6 h-6 text-[#fcd400]" />
            </div>
            <h3 className="font-extrabold text-sm sm:text-base text-[#00327d]">
              Photo Booth
            </h3>
            <p className="text-xs sm:text-sm text-[#434653] mt-1">
              Instant high-quality snaps.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="bg-[#f0eded]/90 rounded-3xl p-5 sm:p-6 flex flex-col items-center text-center border-2 border-transparent hover:border-[#00327d] transition-all duration-200">
            <div className="w-12 h-12 rounded-full bg-[#fcd400] flex items-center justify-center text-[#1c1b1b] mb-3 shadow-hard-gold-sm">
              <Sparkles className="w-6 h-6 text-[#00327d]" />
            </div>
            <h3 className="font-extrabold text-sm sm:text-base text-[#00327d]">
              Live Photo
            </h3>
            <p className="text-xs sm:text-sm text-[#434653] mt-1">
              Capture the action.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="bg-[#f0eded]/90 rounded-3xl p-5 sm:p-6 flex flex-col items-center text-center border-2 border-transparent hover:border-[#00327d] transition-all duration-200">
            <div className="w-12 h-12 rounded-full bg-[#00327d] flex items-center justify-center text-white mb-3 shadow-hard-blue-sm">
              <Compass className="w-6 h-6 text-[#fcd400]" />
            </div>
            <h3 className="font-extrabold text-sm sm:text-base text-[#00327d]">
              Explorer Frame
            </h3>
            <p className="text-xs sm:text-sm text-[#434653] mt-1">
              Special event designs.
            </p>
          </div>

          {/* Feature 4 */}
          <div className="bg-[#f0eded]/90 rounded-3xl p-5 sm:p-6 flex flex-col items-center text-center border-2 border-transparent hover:border-[#00327d] transition-all duration-200">
            <div className="w-12 h-12 rounded-full bg-[#fcd400] flex items-center justify-center text-[#1c1b1b] mb-3 shadow-hard-gold-sm">
              <Download className="w-6 h-6 text-[#00327d]" />
            </div>
            <h3 className="font-extrabold text-sm sm:text-base text-[#00327d]">
              Digital Export
            </h3>
            <p className="text-xs sm:text-sm text-[#434653] mt-1">
              Share instantly.
            </p>
          </div>
        </section>

        {/* Frames Showcase */}
        <section id="frames" className="w-full max-w-5xl mt-16 sm:mt-24 flex flex-col items-center">
          <div className="text-center mb-10">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#00327d] tracking-tight font-['var(--font-bricolage)']">
              Pilih Frame Favoritmu
            </h2>
            <p className="text-sm sm:text-base text-[#434653] mt-2">
              Koleksi template frame eksklusif Champions Explorer & GenBI UNIKU
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-12 w-full max-w-3xl items-start">
            {/* Frame 01 */}
            <div className="flex flex-col items-center">
              <Link
                href="/mode"
                onClick={() => setFrame('frame-01')}
                className="group w-full max-w-[260px] aspect-[560/1600] rounded-3xl overflow-hidden border-4 border-[#00327d] bg-white shadow-hard-blue hover:scale-102 transition-transform relative block"
              >
                <Image
                  src="/frames/frame-01.png"
                  alt="Frame 01 - Vertical 3 Photos"
                  fill
                  className="object-contain p-2"
                  priority
                />
              </Link>
              <div className="mt-4 text-center">
                <h4 className="font-extrabold text-lg text-[#00327d]">Frame 01</h4>
                <p className="text-xs sm:text-sm text-[#434653] font-medium">
                  Vertical 3 Photos
                </p>
              </div>
            </div>

            {/* Frame 02 */}
            <div className="flex flex-col items-center">
              <Link
                href="/mode"
                onClick={() => setFrame('frame-02')}
                className="group w-full max-w-[360px] aspect-[1067/1600] rounded-3xl overflow-hidden border-4 border-[#00327d] bg-white shadow-hard-blue hover:scale-102 transition-transform relative block"
              >
                <Image
                  src="/frames/frame-02.png"
                  alt="Frame 02 - Grid 6 Photos"
                  fill
                  className="object-contain p-2"
                  priority
                />
              </Link>
              <div className="mt-4 text-center">
                <h4 className="font-extrabold text-lg text-[#00327d]">Frame 02</h4>
                <p className="text-xs sm:text-sm text-[#434653] font-medium">
                  Grid 6 Photos
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Decorative Bottom Left Star */}
      <div className="fixed bottom-6 left-6 pointer-events-none hidden sm:block">
        <BlueStarDoodle size={40} />
      </div>

      <Footer />
    </div>
  );
}
