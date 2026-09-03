"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function Header() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 w-full bg-[#fcf9f8]/95 backdrop-blur-sm border-b-[3.5px] border-[#00327d]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between">
        {/* Brand Logo with Icon */}
        <Link
          href="/"
          className="flex items-center gap-2.5 sm:gap-3 group focus:outline-none focus-visible:ring-2 focus-visible:ring-[#00327d] rounded-lg p-1"
        >
          <div className="relative w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-white border-2 border-[#00327d] p-0.5 shadow-hard-blue-sm flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
            <Image
              src="/Logo-GenBI-Uniku.png"
              alt="Logo GenBI UNIKU"
              width={34}
              height={34}
              className="object-contain"
              priority
            />
          </div>
          <span className="font-extrabold text-2xl sm:text-3xl tracking-tight text-[#00327d] group-hover:scale-105 transition-transform font-['var(--font-bricolage)']">
            GenSNAP
          </span>
        </Link>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-8 text-sm sm:text-base font-semibold text-[#1c1b1b]">
          <Link
            href="/"
            className={
              pathname === "/"
                ? "text-[#00327d] underline underline-offset-8 decoration-2"
                : "text-[#434653] hover:text-[#00327d] transition-colors"
            }
          >
            Home
          </Link>
          <Link
            href="/#frames"
            className="text-[#434653] transition-colors hover:text-[#00327d]"
          >
            Gallery
          </Link>
          <Link
            href="/mode"
            className={
              pathname.startsWith("/mode") || pathname.startsWith("/booth")
                ? "text-[#00327d] underline underline-offset-8 decoration-2"
                : "text-[#434653] hover:text-[#00327d] transition-colors"
            }
          >
            Booth
          </Link>
        </nav>

        {/* GenBI & Champions Explorer Badge */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full bg-[#00327d] text-white font-bold text-xs sm:text-sm border-2 border-[#00327d] shadow-hard-blue-sm select-none">
            {/* <div className="w-5 h-5 rounded-full bg-white p-0.5 flex items-center justify-center shrink-0">
              <Image
                src="/Logo-GenBI-Uniku.png"
                alt="GenBI"
                width={18}
                height={18}
                className="object-contain"
              />
            </div> */}
            <div className="w-5 h-5 rounded-full bg-white p-0.5 flex items-center justify-center shrink-0">
              <Image
                src="/champions-explorer2.png"
                alt="Champions Explorer"
                width={18}
                height={18}
                className="object-contain"
              />
            </div>
            <span className="tracking-wide hidden sm:inline">Champions Explorer</span>
          </div>
        </div>
      </div>
    </header>
  );
}
