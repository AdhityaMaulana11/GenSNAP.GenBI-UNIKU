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
          ? 'border-[#00327d] shadow-hard-gold scale-102 ring-4 ring-[#fcd400]/40'
          : 'border-[#00327d]/40 hover:border-[#00327d] hover:shadow-hard-blue-sm'
      }`}
    >
      {/* Checkmark Badge on Selected */}
      {isSelected && (
        <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-[#fcd400] border-2 border-[#00327d] flex items-center justify-center text-[#00327d] shadow-hard-blue-sm z-20">
          <Check className="w-5 h-5 stroke-[3]" />
        </div>
      )}

      {/* Frame Artwork Preview Container */}
      <div
        className={`w-full relative rounded-2xl overflow-hidden bg-[#fcf9f8] border-2 border-[#00327d]/20 mb-5 flex items-center justify-center p-2 ${
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
          <h3 className="font-extrabold text-lg sm:text-xl text-[#00327d]">
            {frame.name}
          </h3>
          <span className="inline-block mt-1 px-2.5 py-0.5 rounded-full bg-[#00327d] text-white font-bold text-xs">
            {frame.photoCount} Photos
          </span>
        </div>
      </div>

      {/* Action Button */}
      <div className="w-full mt-auto">
        {isSelected ? (
          <Button
            variant="primary"
            size="md"
            className="w-full py-2.5"
            onClick={(e) => {
              e.stopPropagation();
              onSelect(frame.id);
            }}
          >
            <Check className="w-4 h-4" />
            Selected
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
            Select
          </Button>
        )}
      </div>
    </div>
  );
}
