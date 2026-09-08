'use client';

import React from 'react';
import { Loader2 } from 'lucide-react';
import { soundManager } from '@/lib/sound';

interface SpinButtonProps {
  isSpinning: boolean;
  onSpin: () => void;
  disabled?: boolean;
}

export function SpinButton({ isSpinning, onSpin, disabled = false }: SpinButtonProps) {
  const handleClick = () => {
    if (isSpinning || disabled) return;
    soundManager.playTap();
    onSpin();
  };

  return (
    <div className="w-full px-4 py-2">
      <button
        id="main-spin-button"
        type="button"
        disabled={isSpinning || disabled}
        onClick={handleClick}
        className={`w-full py-4 px-6 rounded-2xl font-black text-xl flex items-center justify-center gap-3 transition-all duration-200 select-none shadow-lg ${
          isSpinning
            ? 'bg-stone-300 text-stone-500 cursor-not-allowed shadow-none scale-[0.98]'
            : 'bg-gradient-to-r from-amber-500 via-orange-500 to-red-600 text-white shadow-orange-500/35 hover:brightness-105 active:scale-[0.96] pressable'
        }`}
      >
        {isSpinning ? (
          <>
            <Loader2 className="w-6 h-6 animate-spin text-stone-500" />
            <span>راهي تدور... اختاري الحظ 😋</span>
          </>
        ) : (
          <>
            <span className="text-2xl animate-bounce-subtle">🎡</span>
            <span>دوريها وشوفي واش تطيبي!</span>
            <span className="text-2xl animate-bounce-subtle">✨</span>
          </>
        )}
      </button>
    </div>
  );
}
