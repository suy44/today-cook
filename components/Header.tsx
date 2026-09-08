'use client';

import React from 'react';
import { SoundToggle } from './SoundToggle';
import { Utensils, Plus, ChefHat } from 'lucide-react';
import { soundManager } from '@/lib/sound';

interface HeaderProps {
  className?: string;
  onOpenAddDish?: () => void;
}

export function Header({ className = '', onOpenAddDish }: HeaderProps) {
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

      {/* Right Controls: Add Dish + Sound Toggle */}
      <div className="flex items-center gap-1.5">
        {onOpenAddDish && (
          <button
            onClick={() => {
              soundManager.playTap();
              onOpenAddDish();
            }}
            type="button"
            title="أضيفي طبقك الخاص للعجلة"
            className="h-11 px-2.5 rounded-2xl bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 font-bold text-xs flex items-center gap-1.5 transition-colors pressable shadow-xs"
          >
            <Plus className="w-4 h-4 text-amber-600" />
            <span className="hidden xs:inline">طبقك</span>
            <ChefHat className="w-4 h-4 text-amber-600" />
          </button>
        )}
        <SoundToggle />
      </div>
    </header>
  );
}

