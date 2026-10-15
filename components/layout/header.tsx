'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, Camera, Sparkles } from 'lucide-react';

export function Header() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => setMobileMenuOpen((prev) => !prev);
  const closeMobileMenu = () => setMobileMenuOpen(false);

  return (
    <header className="sticky top-0 z-40 w-full bg-[#fcf9f8]/95 backdrop-blur-md border-b-3 border-[#1F1A17] transition-colors select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between">
        {/* Brand Logo with Tactical Insignia */}
        <Link
          href="/"
          onClick={closeMobileMenu}
          className="flex items-center gap-3 group focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-[#3E4095] p-1"
        >
          <div className="relative w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-white border-3 border-[#1F1A17] p-1 shadow-brutal-sm flex items-center justify-center shrink-0 group-hover:-translate-y-0.5 transition-transform">
            <Image
              src="/Logo-GenBI-Uniku.png"
              alt="Logo GenBI UNIKU"
              width={36}
              height={36}
              className="w-auto h-auto object-contain"
              style={{ width: 'auto', height: 'auto' }}
              priority
            />
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="font-extrabold text-2xl sm:text-3xl tracking-tight text-[#1F1A17] group-hover:text-[#3E4095] transition-colors font-['var(--font-bricolage)']">
              GenSNAP
            </span>
            <span className="hidden sm:inline font-mono font-bold text-[10px] uppercase text-[#3E4095] bg-[#eef0fa] border border-[#3E4095]/40 px-1.5 py-0.5 rounded">
              2026
            </span>
          </div>
        </Link>

        {/* Primary Desktop Navigation Links: Technical Specimen Tabs */}
        <nav
          aria-label="Navigasi Utama"
          className="hidden md:flex items-center gap-2 text-xs font-mono font-bold"
        >
          <Link
            href="/"
            className={`px-3.5 py-1.5 rounded-lg border-2 transition-all ${
              pathname === '/'
                ? 'bg-[#3E4095] text-white border-[#1F1A17] shadow-brutal-sm'
                : 'text-[#1F1A17] border-transparent hover:border-[#1F1A17] hover:bg-white'
            }`}
          >
            [ 01 // BERANDA ]
          </Link>
          <Link
            href="/#frames"
            className="px-3.5 py-1.5 rounded-lg border-2 border-transparent text-[#1F1A17] hover:border-[#1F1A17] hover:bg-white transition-all"
          >
            [ 02 // GALERI FRAME ]
          </Link>
          <Link
            href="/mode"
            className={`px-3.5 py-1.5 rounded-lg border-2 transition-all ${
              pathname.startsWith('/mode') || pathname.startsWith('/booth') || pathname.startsWith('/frames')
                ? 'bg-[#fcd400] text-[#1F1A17] border-[#1F1A17] shadow-brutal-sm'
                : 'text-[#1F1A17] border-transparent hover:border-[#1F1A17] hover:bg-white'
            }`}
          >
            [ 03 // STUDIO BOOTH ]
          </Link>
        </nav>

        {/* Right Section: Event Pill & Mobile Toggle */}
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="hidden min-[480px]:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#F5F19A] text-[#1F1A17] font-mono font-extrabold text-xs border-2 border-[#1F1A17] shadow-brutal-sm select-none">
            <div className="w-4 h-4 relative shrink-0">
              <Image
                src="/champions-explorer2.png"
                alt="Champions Explorer"
                width={16}
                height={16}
                className="w-auto h-auto object-contain"
                style={{ width: 'auto', height: 'auto' }}
              />
            </div>
            <span className="tracking-tight uppercase">Champions Explorer</span>
          </div>

          <Link href="/mode" className="hidden sm:inline-block">
            <button
              type="button"
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#3E4095] text-white font-mono font-extrabold text-xs uppercase border-2 border-[#1F1A17] shadow-brutal-sm hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all cursor-pointer"
            >
              <Camera className="w-3.5 h-3.5 text-[#fcd400]" />
              <span>Buka Kamera</span>
            </button>
          </Link>

          {/* Mobile Menu Hamburger Button */}
          <button
            type="button"
            onClick={toggleMobileMenu}
            aria-expanded={mobileMenuOpen}
            aria-label="Toggle navigation menu"
            className="md:hidden w-10 h-10 rounded-xl bg-white border-3 border-[#1F1A17] text-[#1F1A17] shadow-brutal-sm flex items-center justify-center active:translate-y-0.5 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-[#3E4095]"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Panel */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t-3 border-[#1F1A17] bg-[#fcf9f8] px-4 pt-4 pb-6 space-y-3">
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-[#F5F19A] border-2 border-[#1F1A17] text-xs font-mono font-bold text-[#1F1A17]">
            <Sparkles className="w-4 h-4 text-[#3E4095]" />
            <span>Special Event: Champions Explorer 2026</span>
          </div>

          <nav className="flex flex-col gap-2 font-mono font-bold text-sm">
            <Link
              href="/"
              onClick={closeMobileMenu}
              className={`p-3 rounded-xl border-2 ${
                pathname === '/'
                  ? 'bg-[#3E4095] text-white border-[#1F1A17] shadow-brutal-sm'
                  : 'bg-white text-[#1F1A17] border-[#1F1A17]'
              }`}
            >
              [ 01 // BERANDA ]
            </Link>
            <Link
              href="/#frames"
              onClick={closeMobileMenu}
              className="p-3 rounded-xl border-2 bg-white text-[#1F1A17] border-[#1F1A17]"
            >
              [ 02 // GALERI FRAME ]
            </Link>
            <Link
              href="/mode"
              onClick={closeMobileMenu}
              className={`p-3 rounded-xl border-2 ${
                pathname.startsWith('/mode') || pathname.startsWith('/booth')
                  ? 'bg-[#fcd400] text-[#1F1A17] border-[#1F1A17] shadow-brutal-sm'
                  : 'bg-white text-[#1F1A17] border-[#1F1A17]'
              }`}
            >
              [ 03 // STUDIO BOOTH ]
            </Link>
          </nav>

          <Link href="/mode" onClick={closeMobileMenu} className="block w-full pt-1">
            <button
              type="button"
              className="w-full py-3.5 rounded-xl bg-[#3E4095] text-white font-mono font-extrabold text-sm uppercase border-3 border-[#1F1A17] shadow-brutal flex items-center justify-center gap-2"
            >
              <Camera className="w-4 h-4 text-[#fcd400]" />
              <span>Mulai Sesi Photobooth</span>
            </button>
          </Link>
        </div>
      )}
    </header>
  );
}
