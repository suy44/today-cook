'use client';

import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { soundManager } from '@/lib/sound';

interface SoundToggleProps {
  className?: string;
}

export function SoundToggle({ className = '' }: SoundToggleProps) {
  const [isMuted, setIsMuted] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setIsMuted(soundManager.getIsMuted());
  }, []);

  const handleToggle = () => {
    const muted = soundManager.toggleMute();
    setIsMuted(muted);
    if (!muted) {
      soundManager.playTap();
    }
  };

  if (!mounted) {
    return (
      <div className={`w-10 h-10 rounded-full bg-amber-100/80 animate-pulse ${className}`} />
    );
  }

  return (
    <button
      onClick={handleToggle}
      type="button"
      id="sound-toggle-btn"
      aria-label={isMuted ? 'تشغيل الصوت' : 'كتم الصوت'}
      title={isMuted ? 'تشغيل الصوت' : 'كتم الصوت'}
      className={`relative w-11 h-11 rounded-2xl flex items-center justify-center transition-all duration-200 pressable shadow-sm border ${
        isMuted
          ? 'bg-stone-100 text-stone-400 border-stone-200 hover:bg-stone-200'
          : 'bg-amber-500 text-white border-amber-600 shadow-amber-500/25 hover:bg-amber-600'
      } ${className}`}
    >
      {isMuted ? (
        <VolumeX className="w-5 h-5" />
      ) : (
        <Volume2 className="w-5 h-5 animate-pulse" />
      )}
    </button>
  );
}
