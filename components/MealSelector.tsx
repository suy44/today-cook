'use client';

import React from 'react';
import { MealType } from '@/types';
import { MEAL_CATEGORIES } from '@/data/recipes';
import { soundManager } from '@/lib/sound';

interface MealSelectorProps {
  selectedMeal: MealType;
  onSelectMeal: (meal: MealType) => void;
  disabled?: boolean;
}

export function MealSelector({
  selectedMeal,
  onSelectMeal,
  disabled = false,
}: MealSelectorProps) {
  const handleSelect = (mealId: MealType) => {
    if (disabled || mealId === selectedMeal) return;
    soundManager.playTap();
    onSelectMeal(mealId);
  };

  return (
    <div className="w-full px-4 py-2">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">
          واش حابة تطيبي؟
        </span>
        <span className="text-[11px] text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full font-medium border border-amber-200">
          بدّلي الوجبة تتغير العجلة 🎡
        </span>
      </div>

      {/* Touch-optimized horizontal pill selector */}
      <div className="grid grid-cols-4 gap-2 bg-stone-100/90 p-1.5 rounded-2xl border border-stone-200/80 shadow-inner">
        {MEAL_CATEGORIES.map((category) => {
          const isSelected = selectedMeal === category.id;
          return (
            <button
              key={category.id}
              id={`meal-btn-${category.id}`}
              type="button"
              disabled={disabled}
              onClick={() => handleSelect(category.id)}
              className={`relative flex flex-col items-center justify-center py-2 px-1 rounded-xl transition-all duration-200 select-none min-h-[52px] ${
                disabled ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer active:scale-95'
              } ${
                isSelected
                  ? 'bg-gradient-to-b from-amber-500 to-orange-600 text-white font-bold shadow-md shadow-orange-500/30 scale-[1.02]'
                  : 'bg-white/80 text-stone-700 hover:bg-white hover:text-stone-900 border border-stone-200/50 shadow-xs'
              }`}
            >
              <span className="text-lg leading-none mb-1">{category.emoji}</span>
              <span className="text-[11px] font-bold truncate max-w-full">
                {category.shortLabel.replace(/^[^\s]+\s*/, '')}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
