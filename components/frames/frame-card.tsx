'use client';

import React from 'react';
import Image from 'next/image';
import { Check } from 'lucide-react';
import { FrameConfig } from '@/types/photobooth';
import { Button } from '@/components/ui/button';

interface FrameCardProps {
  frame: FrameConfig;
  isSelected: boolean;
  onSelect: (frameId: string) => void;
}

export function FrameCard({ frame, isSelected, onSelect }: FrameCardProps) {
  const isVertical = frame.id === 'frame-01';

  return (
    <div
      onClick={() => onSelect(frame.id)}
      className={`group cursor-pointer rounded-3xl p-5 sm:p-6 bg-white transition-all duration-200 flex flex-col items-center relative border-3 ${
        isSelected
          ? 'border-[#1F1A17] shadow-brutal-lg -translate-y-1 ring-4 ring-[#F5F19A]'
          : 'border-[#1F1A17] shadow-brutal hover:-translate-y-0.5'
      }`}
    >
      {/* Checkmark Stamp on Selected */}
      {isSelected && (
        <div className="absolute -top-3.5 -right-3.5 w-9 h-9 rounded-xl bg-[#fcd400] border-2 border-[#1F1A17] flex items-center justify-center text-[#1F1A17] shadow-brutal-sm z-20">
          <Check className="w-5 h-5 stroke-[3]" />
        </div>
      )}

      {/* Frame Spec Header */}
      <div className="w-full flex items-center justify-between pb-3 mb-4 border-b-2 border-[#1F1A17]/20 font-mono text-xs font-bold text-[#1F1A17]">
        <span className="text-[#3E4095] uppercase">{frame.id.toUpperCase()}</span>
        <span className="bg-[#fcf9f8] px-2 py-0.5 rounded border border-[#1F1A17]/20">
          {frame.photoCount} FOTO
        </span>
      </div>

      {/* Frame Artwork Preview Container */}
      <div
        className={`w-full relative rounded-2xl overflow-hidden bg-[#fcf9f8] border-2 border-[#1F1A17] mb-5 flex items-center justify-center p-3 shadow-brutal-sm ${
          isVertical ? 'max-w-[240px] aspect-[560/1600]' : 'max-w-[340px] aspect-[1067/1600]'
        }`}
      >
        <div className="w-full h-full relative">
          <Image
            src={frame.imageSrc}
            alt={frame.name}
            fill
            sizes="(max-width: 768px) 100vw, 400px"
            className="object-contain"
            priority
          />
        </div>
      </div>

      {/* Frame Info */}
      <div className="w-full flex items-center justify-between mb-4">
        <div>
          <h3 className="font-extrabold text-lg sm:text-xl text-[#1F1A17] font-['var(--font-bricolage)']">
            {frame.name}
          </h3>
          <span className="inline-block mt-0.5 font-mono text-xs text-[#434653] font-bold">
            {isVertical ? 'Strip Vertikal 3 Slot' : 'Grid Sejajar 6 Slot'}
          </span>
        </div>
      </div>

      {/* Action Button */}
      <div className="w-full mt-auto">
        {isSelected ? (
          <Button
            variant="primary"
            size="md"
            className="w-full py-2.5 shadow-brutal-sm"
            onClick={(e) => {
              e.stopPropagation();
              onSelect(frame.id);
            }}
          >
            <Check className="w-4 h-4" />
            <span>Frame Terpilih</span>
          </Button>
        ) : (
          <Button
            variant="outline"
            size="md"
            className="w-full py-2.5"
            onClick={(e) => {
              e.stopPropagation();
              onSelect(frame.id);
            }}
          >
            <span>Pilih Frame Ini</span>
          </Button>
        )}
      </div>
    </div>
  );
}
