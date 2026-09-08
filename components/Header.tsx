'use client';

import React from 'react';
import { SoundToggle } from './SoundToggle';
import { Utensils } from 'lucide-react';

interface HeaderProps {
  className?: string;
}

export function Header({ className = '' }: HeaderProps) {
  return (
    <header
      className={`w-full px-4 pt-3 pb-2 flex items-center justify-between border-b border-stone-200/60 bg-white/70 backdrop-blur-xs select-none ${className}`}
    >
      {/* Title & Cultural Brand */}
      <div className="flex items-center gap-2.5">
        <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-500 flex items-center justify-center text-white shadow-sm shadow-orange-500/25">
          <Utensils className="w-5 h-5" />
        </div>

        <div>
          <div className="flex items-center gap-1.5">
            <h1 className="text-lg font-black text-stone-900 tracking-tight leading-none">
              واش نطيب اليوم؟
            </h1>
            <span className="text-sm" title="الجزائر">
              🇩🇿
            </span>
          </div>
          <p className="text-[11px] font-semibold text-amber-800/90 mt-0.5">
            ما تزيديش تحتاري، خلي الحظ يختار 😋
          </p>
        </div>
      </div>

      {/* Sound Toggle */}
      <SoundToggle />
    </header>
  );
}
