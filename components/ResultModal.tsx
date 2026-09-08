'use client';

import React, { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import { Recipe } from '@/types';
import { Heart, RotateCw, BookOpen, Clock, Users, X } from 'lucide-react';
import { isStoredFavorite, toggleStoredFavorite } from '@/lib/storage';
import { soundManager } from '@/lib/sound';

interface ResultModalProps {
  recipe: Recipe | null;
  isOpen: boolean;
  onClose: () => void;
  onViewRecipe: (recipe: Recipe) => void;
  onSpinAgain: () => void;
}

export function ResultModal({
  recipe,
  isOpen,
  onClose,
  onViewRecipe,
  onSpinAgain,
}: ResultModalProps) {
  const [isFav, setIsFav] = useState(false);

  useEffect(() => {
    if (isOpen && recipe) {
      setIsFav(isStoredFavorite(recipe.id));
      // Fire confetti burst!
      try {
        confetti({
          particleCount: 75,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#ea580c', '#f59e0b', '#16a34a', '#dc2626', '#3b82f6'],
        });
      } catch {}
    }
  }, [isOpen, recipe]);

  if (!isOpen || !recipe) return null;

  const handleFavoriteToggle = () => {
    soundManager.playTap();
    const result = toggleStoredFavorite(recipe.id);
    setIsFav(result.isFavorite);
  };

  const handleViewRecipe = () => {
    soundManager.playTap();
    onViewRecipe(recipe);
  };

  const handleSpinAgain = () => {
    soundManager.playTap();
    onSpinAgain();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-sm bg-gradient-to-b from-amber-50 to-white rounded-3xl p-6 shadow-2xl border-2 border-amber-200 text-center overflow-hidden animate-in zoom-in-95 duration-300">
        {/* Subtle decorative background circles */}
        <div className="absolute -top-12 -right-12 w-32 h-32 bg-amber-200/40 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-12 -left-12 w-32 h-32 bg-orange-200/40 rounded-full blur-2xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          type="button"
          aria-label="إغلاق"
          className="absolute top-4 left-4 w-9 h-9 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-600 flex items-center justify-center transition-colors pressable"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Top Celebration Subtitle */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-bold mb-3">
          <span>🎉</span>
          <span>الحظ اختارلك اليوم</span>
          <span>🎉</span>
        </div>

        {/* Dish Big Emoji with bounce */}
        <div className="text-6xl my-2 select-none animate-bounce-subtle">
          {recipe.emoji}
        </div>

        {/* Big Dish Name */}
        <h2 className="text-2xl font-black text-stone-900 tracking-tight mb-1">
          {recipe.name}
        </h2>

        {/* Friendly Algerian message */}
        <p className="text-sm font-semibold text-amber-800 mb-4 px-2">
          اختيار موفق! ساهلة وما تديش اليد، تحمري وجهك قدام العايلة 😋
        </p>

        {/* Quick Info Badges */}
        <div className="flex items-center justify-center gap-2 mb-5 text-xs font-bold text-stone-700">
          <div className="flex items-center gap-1 bg-white px-2.5 py-1.5 rounded-xl border border-stone-200 shadow-xs">
            <Clock className="w-3.5 h-3.5 text-amber-600" />
            <span>{recipe.totalTime}</span>
          </div>
          <div className="flex items-center gap-1 bg-white px-2.5 py-1.5 rounded-xl border border-stone-200 shadow-xs">
            <Users className="w-3.5 h-3.5 text-amber-600" />
            <span>{recipe.servings}</span>
          </div>
          <div className="bg-amber-500/10 text-amber-900 px-2.5 py-1.5 rounded-xl border border-amber-200 font-bold">
            {recipe.difficulty}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2.5">
          {/* View Recipe Button (Primary) */}
          <button
            id="view-recipe-btn"
            type="button"
            onClick={handleViewRecipe}
            className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-black text-base flex items-center justify-center gap-2 shadow-md shadow-orange-500/30 transition-all pressable"
          >
            <BookOpen className="w-5 h-5" />
            <span>👩‍🍳 نشوف الوصفة والمقادير</span>
          </button>

          {/* Secondary Buttons Row */}
          <div className="grid grid-cols-2 gap-2">
            {/* Spin Again */}
            <button
              id="spin-again-btn"
              type="button"
              onClick={handleSpinAgain}
              className="py-3 px-3 rounded-2xl bg-white hover:bg-stone-50 text-stone-800 font-bold text-sm flex items-center justify-center gap-1.5 border border-stone-200 shadow-xs transition-all pressable"
            >
              <RotateCw className="w-4 h-4 text-orange-500" />
              <span>عاودي دوري</span>
            </button>

            {/* Favorite toggle */}
            <button
              id="favorite-toggle-btn"
              type="button"
              onClick={handleFavoriteToggle}
              className={`py-3 px-3 rounded-2xl font-bold text-sm flex items-center justify-center gap-1.5 border shadow-xs transition-all pressable ${
                isFav
                  ? 'bg-rose-50 text-rose-600 border-rose-200'
                  : 'bg-white hover:bg-stone-50 text-stone-700 border-stone-200'
              }`}
            >
              <Heart
                className={`w-4 h-4 transition-transform ${
                  isFav ? 'fill-rose-500 text-rose-500 scale-110' : 'text-stone-400'
                }`}
              />
              <span>{isFav ? 'محفوظة ❤️' : 'حفظ ♡'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
