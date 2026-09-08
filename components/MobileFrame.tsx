'use client';

import React from 'react';

interface MobileFrameProps {
  children: React.ReactNode;
}

export function MobileFrame({ children }: MobileFrameProps) {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-stone-950 p-0 sm:p-4 md:p-6 overflow-x-hidden">
      {/* Ambient background glow for desktop users */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden hidden sm:block">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-amber-600/20 via-orange-600/15 to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-[400px] h-[300px] bg-amber-500/10 rounded-full blur-3xl" />
      </div>

      {/* Main Mobile Shell (max-w-[430px] phone width, centered on desktop) */}
      <main className="relative w-full max-w-[430px] min-h-screen sm:min-h-[844px] sm:max-h-[920px] bg-[#FFFDF9] sm:rounded-[40px] shadow-[0_25px_60px_rgba(0,0,0,0.5)] flex flex-col overflow-hidden sm:border-[8px] sm:border-stone-800">
        {/* Simulated mobile speaker/notch pill on desktop */}
        <div className="hidden sm:flex justify-center pt-2 pb-1 bg-transparent">
          <div className="w-24 h-4 bg-stone-900 rounded-full flex items-center justify-end px-3">
            <div className="w-2 h-2 rounded-full bg-stone-800" />
          </div>
        </div>

        {/* Inner App Content */}
        <div className="flex-1 flex flex-col w-full h-full overflow-hidden relative">
          {children}
        </div>
      </main>
    </div>
  );
}
