'use client';

import React from 'react';
import { ViewMode } from '@/types';
import { Compass, Heart, BookOpen } from 'lucide-react';
import { soundManager } from '@/lib/sound';

interface BottomNavProps {
  currentView: ViewMode;
  onViewChange: (view: ViewMode) => void;
  favoritesCount: number;
}

export function BottomNav({
  currentView,
  onViewChange,
  favoritesCount,
}: BottomNavProps) {
  const tabs: { id: ViewMode; label: string; icon: React.ReactNode }[] = [
    {
      id: 'wheel',
      label: 'عجلة الحظ',
      icon: <Compass className="w-5 h-5" />,
    },
    {
      id: 'favorites',
      label: 'المفضلة',
      icon: (
        <div className="relative">
          <Heart className={`w-5 h-5 ${currentView === 'favorites' ? 'fill-rose-500 text-rose-500' : ''}`} />
          {favoritesCount > 0 && (
            <span className="absolute -top-1.5 -left-2 bg-rose-500 text-white text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center border border-white">
              {favoritesCount}
            </span>
          )}
        </div>
      ),
    },
    {
      id: 'all',
      label: 'كل الوصفات',
      icon: <BookOpen className="w-5 h-5" />,
    },
  ];

  return (
    <nav className="w-full bg-white/95 backdrop-blur-md border-t border-stone-200/80 px-4 py-2 safe-bottom shadow-[0_-4px_12px_rgba(0,0,0,0.03)] select-none">
      <div className="grid grid-cols-3 gap-1">
        {tabs.map((tab) => {
          const isActive = currentView === tab.id;
          return (
            <button
              key={tab.id}
              id={`nav-btn-${tab.id}`}
              type="button"
              onClick={() => {
                if (currentView !== tab.id) {
                  soundManager.playTap();
                  onViewChange(tab.id);
                }
              }}
              className={`flex flex-col items-center justify-center py-1.5 px-2 rounded-2xl transition-all duration-150 pressable ${
                isActive
                  ? 'text-amber-600 font-black'
                  : 'text-stone-400 hover:text-stone-600 font-semibold'
              }`}
            >
              <div
                className={`p-1 rounded-xl transition-colors ${
                  isActive ? 'bg-amber-100 text-amber-700' : 'text-stone-500'
                }`}
              >
                {tab.icon}
              </div>
              <span className="text-[11px] mt-0.5">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
