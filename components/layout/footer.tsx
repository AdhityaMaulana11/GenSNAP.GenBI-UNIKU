'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { MapPin, Mail, ArrowUpRight, Camera } from 'lucide-react';

function InstagramIcon({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  );
}

export function Footer() {
  return (
    <footer className="w-full bg-[#fcf9f8] border-t-3 border-[#1F1A17] mt-auto select-none">
      {/* Event Header Banner Bar */}
      <div className="w-full bg-[#1F1A17] text-white py-2.5 px-4 sm:px-8 border-b-2 border-[#1F1A17]">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-2 text-xs font-mono">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#fcd400] animate-ping" />
            <span className="px-2 py-0.5 rounded bg-[#3E4095] text-white font-extrabold text-[10px] uppercase border border-white/30">
              OFFICIAL DISPATCH
            </span>
            <span className="font-bold text-white tracking-wider uppercase">
              Champions Explorer 2026
            </span>
          </div>
          <p className="text-[11px] sm:text-xs text-[#F5F19A] font-medium text-center md:text-right">
            [ BI & GENBI UNIKU COMMISSION // KAMPUS 1 UNIVERSITAS KUNINGAN ]
          </p>
        </div>
      </div>

      {/* Main Footer Container */}
      <div className="max-w-7xl mx-auto px-5 sm:px-8 py-10 sm:py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 sm:gap-10 items-start">
          {/* Column 1: Brand & Logo */}
          <div className="lg:col-span-5 flex flex-col gap-3.5">
            <div className="flex items-center gap-3">
              <div className="relative w-12 h-12 rounded-xl bg-white border-3 border-[#1F1A17] p-1 shadow-brutal-sm flex items-center justify-center shrink-0">
                <Image
                  src="/Logo-GenBI-Uniku.png"
                  alt="Logo GenBI UNIKU"
                  width={38}
                  height={38}
                  className="w-auto h-auto object-contain"
                  style={{ width: 'auto', height: 'auto' }}
                />
              </div>
              <div className="flex flex-col">
                <span className="font-extrabold text-2xl sm:text-3xl text-[#1F1A17] tracking-tight font-['var(--font-bricolage)'] leading-none">
                  GenSNAP
                </span>
                <span className="text-xs font-mono font-bold text-[#3E4095] mt-1">
                  GENBI KOMISARIAT UNIKU
                </span>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-[#434653] font-medium leading-relaxed mt-1 max-w-md">
              Klik Momennya, Abadikan Ceritanya. Platform digital photobooth resmi Generasi Baru Indonesia (GenBI) Komisariat Universitas Kuningan untuk kegiatan Champions Explorer 2026.
            </p>

            <div className="flex items-center gap-2 mt-2">
              <span className="px-2.5 py-1 rounded-lg bg-[#eef0fa] border border-[#3E4095]/30 text-[#3E4095] font-mono text-[11px] font-bold">
                CANVAS ENGINE v2.0
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-[#F5F19A] border border-[#1F1A17]/30 text-[#1F1A17] font-mono text-[11px] font-bold">
                300 DPI RENDER
              </span>
            </div>
          </div>

          {/* Column 2: Sekretariat & Kontak */}
          <div className="lg:col-span-4 flex flex-col gap-3">
            <h4 className="font-mono font-extrabold text-xs text-[#1F1A17] uppercase tracking-wider bg-white border-2 border-[#1F1A17] shadow-brutal-sm px-2.5 py-1 inline-block w-fit">
              [ SEKRETARIAT & KONTAK ]
            </h4>
            <div className="flex flex-col gap-2.5 text-xs text-[#434653] font-medium mt-1">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[#3E4095] shrink-0 mt-0.5" aria-hidden="true" />
                <span>Jl. Cut Nyak Dhien No.36A, Cijoho, Kuningan, Jawa Barat</span>
              </div>
              <a
                href="mailto:genbi.komisuniku@gmail.com"
                className="flex items-center gap-2 hover:text-[#3E4095] transition-colors focus-visible:outline-none focus-visible:underline"
              >
                <Mail className="w-4 h-4 text-[#3E4095] shrink-0" aria-hidden="true" />
                <span className="font-mono">genbi.komisuniku@gmail.com</span>
              </a>
              <a
                href="https://instagram.com/genbi_uniku"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 hover:text-[#3E4095] transition-colors font-bold text-[#1F1A17] focus-visible:outline-none focus-visible:underline group"
              >
                <InstagramIcon className="w-4 h-4 text-[#3E4095] group-hover:scale-110 transition-transform" />
                <span className="font-mono">@genbi_uniku</span>
                <ArrowUpRight className="w-3.5 h-3.5 text-[#3E4095]" />
              </a>
            </div>
          </div>

          {/* Column 3: Tautan Cepat & Telemetri */}
          <div className="lg:col-span-3 flex flex-col gap-3">
            <h4 className="font-mono font-extrabold text-xs text-[#1F1A17] uppercase tracking-wider bg-white border-2 border-[#1F1A17] shadow-brutal-sm px-2.5 py-1 inline-block w-fit">
              [ AKSES CEPAT ]
            </h4>
            <ul className="flex flex-col gap-2 text-xs font-mono font-bold text-[#1F1A17] mt-1">
              <li>
                <Link href="/" className="hover:text-[#3E4095] transition-colors flex items-center gap-1.5">
                  <span>→</span> Beranda Studio
                </Link>
              </li>
              <li>
                <Link href="/mode" className="hover:text-[#3E4095] transition-colors flex items-center gap-1.5">
                  <span>→</span> Pilih Mode Photobooth
                </Link>
              </li>
              <li>
                <Link href="/frames" className="hover:text-[#3E4095] transition-colors flex items-center gap-1.5">
                  <span>→</span> Koleksi Template Frame
                </Link>
              </li>
              <li>
                <Link href="/frames/custom" className="hover:text-[#3E4095] transition-colors flex items-center gap-1.5">
                  <span>→</span> Upload Frame Custom
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Colophon Bar */}
        <div className="mt-10 pt-6 border-t-2 border-[#1F1A17]/20 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-mono text-[#737784]">
          <p>© 2026 GenBI UNIKU. Hak Cipta Dilindungi.</p>
          <div className="flex items-center gap-3 text-[11px]">
            <span>BANK INDONESIA</span>
            <span>+</span>
            <span>UNIVERSITAS KUNINGAN</span>
            <span>+</span>
            <span>CHAMPIONS EXPLORER</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
