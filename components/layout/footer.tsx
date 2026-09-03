'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Sparkles, MapPin, Mail, ArrowUpRight } from 'lucide-react';

function InstagramIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  );
}

export function Footer() {
  return (
    <footer className="w-full bg-[#fcf9f8] border-t-[3.5px] border-[#00327d] mt-auto select-none">
      {/* Event Banner Bar */}
      <div className="w-full bg-[#00327d] text-white py-2.5 px-4 sm:px-8 border-b border-[#00327d]">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-[#fcd400] text-[#00327d] font-extrabold text-[10px] uppercase font-mono border border-[#00327d]">
              Special Event
            </span>
            <span className="font-bold text-white tracking-wide">
              Champions Explorer 2026
            </span>
          </div>
          <p className="text-[11px] sm:text-xs text-white/90 font-medium italic text-center md:text-right">
            “Explore the World of Central Banking: Buka Wawasan, Jelajahi Tantangan, Temukan Pengetahuan”
          </p>
        </div>
      </div>

      {/* Main Footer Container */}
      <div className="max-w-7xl mx-auto px-5 sm:px-8 py-10 sm:py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 sm:gap-10 items-start">
          
          {/* Column 1: Brand & Logo (lg:col-span-4) */}
          <div className="lg:col-span-4 flex flex-col gap-3">
            <div className="flex items-center gap-2.5">
                {/* <div className="relative w-10 h-10 rounded-xl bg-white border-2 border-[#00327d] p-1 shadow-hard-blue-sm flex items-center justify-center shrink-0">
                  <Image
                    src="/Logo-GenBI-Uniku.png"
                    alt="Logo GenBI UNIKU"
                    width={34}
                    height={34}
                    className="object-contain"
                  />
                </div> */}
              <div className="relative w-10 h-10 rounded-xl bg-white border-2 border-[#00327d] p-1 shadow-hard-blue-sm flex items-center justify-center shrink-0">
                <Image
                  src="/champions-explorer2.png"
                  alt="Champions Explorer Logo"
                  width={34}
                  height={34}
                  className="object-contain"
                />
              </div>
              <div className="flex flex-col ml-1">
                <span className="font-extrabold text-2xl text-[#00327d] tracking-tight font-['var(--font-bricolage)'] leading-none">
                  GenSNAP
                </span>
                <span className="text-[11px] font-bold text-[#434653] mt-0.5">
                  by GenBI UNIKU
                </span>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-[#434653] font-medium leading-relaxed mt-1">
              Klik Momennya, Abadikan Ceritanya. Platform digital photobooth resmi Generasi Baru Indonesia (GenBI) Komisariat Universitas Kuningan.
            </p>
          </div>

          {/* Column 2: Kontak & Sekretariat (lg:col-span-3) */}
          <div className="lg:col-span-3 flex flex-col gap-3">
            <h4 className="font-extrabold text-sm text-[#00327d] uppercase tracking-wider font-mono">
              Sekretariat & Kontak
            </h4>
            <div className="flex flex-col gap-2.5 text-xs text-[#434653] font-medium">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[#00327d] shrink-0 mt-0.5" />
                <span>Ciporang, Universitas Kuningan</span>
              </div>
              <a
                href="mailto:genbi.komisuniku@gmail.com"
                className="flex items-center gap-2 hover:text-[#00327d] transition-colors"
              >
                <Mail className="w-4 h-4 text-[#00327d] shrink-0" />
                <span>genbi.komisuniku@gmail.com</span>
              </a>
              <a
                href="https://instagram.com/genbi_uniku"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 hover:text-[#00327d] transition-colors font-bold text-[#00327d]"
              >
                <InstagramIcon className="w-4 h-4 text-[#00327d] shrink-0" />
                <span>@genbi_uniku</span>
                <ArrowUpRight className="w-3 h-3 text-[#00327d]" />
              </a>
            </div>
          </div>

          {/* Column 3: Navigasi (lg:col-span-2) */}
          <div className="lg:col-span-2 flex flex-col gap-3">
            <h4 className="font-extrabold text-sm text-[#00327d] uppercase tracking-wider font-mono">
              Navigasi
            </h4>
            <nav className="flex flex-col gap-2 text-xs font-semibold text-[#434653]">
              <Link href="/" className="hover:text-[#00327d] transition-colors">
                Beranda
              </Link>
              <Link href="/mode" className="hover:text-[#00327d] transition-colors">
                Mulai Photobooth
              </Link>
              <Link href="/#frames" className="hover:text-[#00327d] transition-colors">
                Koleksi Frame
              </Link>
            </nav>
          </div>

          {/* Column 4: Credit & Copyright (lg:col-span-3) */}
          <div className="lg:col-span-3 flex flex-col gap-3">
            <h4 className="font-extrabold text-sm text-[#00327d] uppercase tracking-wider font-mono">
              Developer
            </h4>
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2 text-xs font-bold text-[#1c1b1b]">
                <span>Brought to you by</span>
                <a
                  href="https://undergrowth.studio"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1 rounded-full bg-[#00327d] text-white hover:bg-[#002660] transition-all shadow-hard-blue-sm flex items-center gap-1.5 group"
                >
                  <Sparkles className="w-3.5 h-3.5 text-[#fcd400] group-hover:rotate-12 transition-transform" />
                  <span className="tracking-wide">Undergrowth.studio</span>
                </a>
              </div>
              <p className="text-[11px] text-[#737784] font-medium mt-1">
                &copy; {new Date().getFullYear()} GenSNAP • GenBI UNIKU. All rights reserved.
              </p>
            </div>
          </div>

        </div>
      </div>
    </footer>
  );
}
