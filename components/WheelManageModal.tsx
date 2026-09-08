'use client';

import React from 'react';
import { Recipe, MealType } from '@/types';
import { X, Check, Plus, Trash2, SlidersHorizontal, Sparkles, AlertCircle } from 'lucide-react';
import { soundManager } from '@/lib/sound';
import { isCustomRecipe } from '@/lib/storage';

interface WheelManageModalProps {
  isOpen: boolean;
  onClose: () => void;
  categoryRecipes: Recipe[];
  excludedDishIds: string[];
  onToggleDish: (dishId: string) => void;
  onSelectAll: () => void;
  onOpenAddDish: () => void;
  onDeleteCustomDish?: (dishId: string) => void;
  selectedMeal: MealType;
}

export function WheelManageModal({
  isOpen,
  onClose,
  categoryRecipes,
  excludedDishIds,
  onToggleDish,
  onSelectAll,
  onOpenAddDish,
  onDeleteCustomDish,
  selectedMeal,
}: WheelManageModalProps) {
  if (!isOpen) return null;

  const activeCount = categoryRecipes.filter((r) => !excludedDishIds.includes(r.id)).length;
  const totalCount = categoryRecipes.length;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-md max-h-[92vh] bg-stone-50 rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom duration-300 border-t sm:border border-stone-200">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-white/95 backdrop-blur-md px-5 py-3.5 border-b border-stone-200/80 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-500 text-white flex items-center justify-center shadow-xs">
              <SlidersHorizontal className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-black text-stone-900 leading-none">
                تخصيص أطباق العجلة 🎡
              </h2>
              <p className="text-[11px] text-stone-500 mt-0.5">
                فعّلي أو استبعدي الأكلات لي تحبيها
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            type="button"
            className="w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-600 flex items-center justify-center transition-colors pressable"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Sub-header Bar: Stats and Quick actions */}
        <div className="bg-amber-50/80 px-5 py-2.5 border-b border-amber-200/70 flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs font-bold text-amber-900">
            <span>الأطباق في العجلة:</span>
            <span className="bg-amber-500 text-white px-2 py-0.5 rounded-full text-[11px] shadow-xs">
              {activeCount} من {totalCount}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {activeCount < totalCount && (
              <button
                type="button"
                onClick={() => {
                  soundManager.playTap();
                  onSelectAll();
                }}
                className="text-[11px] font-bold text-amber-700 hover:text-amber-900 underline"
              >
                تفعيل الكل
              </button>
            )}

            <button
              type="button"
              onClick={() => {
                soundManager.playTap();
                onClose();
                onOpenAddDish();
              }}
              className="px-2.5 py-1 rounded-xl bg-amber-500 text-white text-[11px] font-bold flex items-center gap-1 shadow-xs hover:bg-amber-600 transition-colors pressable"
            >
              <Plus className="w-3 h-3" />
              <span>أضيفي أكلة</span>
            </button>
          </div>
        </div>

        {/* Warning if fewer than 2 active */}
        {activeCount < 2 && (
          <div className="mx-4 mt-3 p-2.5 rounded-xl bg-rose-50 border border-rose-200 flex items-center gap-2 text-rose-700 text-xs font-bold">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>لازم تختاري على الأقل طبقين (2) باش تدور العجلة!</span>
          </div>
        )}

        {/* List of Dishes with Toggle */}
        <div className="flex-1 overflow-y-auto px-5 py-3 space-y-2 no-scrollbar">
          {categoryRecipes.map((recipe) => {
            const isExcluded = excludedDishIds.includes(recipe.id);
            const isCustom = isCustomRecipe(recipe.id);

            return (
              <div
                key={recipe.id}
                onClick={() => {
                  soundManager.playTap();
                  onToggleDish(recipe.id);
                }}
                className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between select-none pressable ${
                  !isExcluded
                    ? 'bg-white border-amber-300 shadow-xs'
                    : 'bg-stone-100/70 border-stone-200 opacity-65'
                }`}
              >
                {/* Right side: Emoji + Title + Tag */}
                <div className="flex items-center gap-3">
                  <span className="text-2xl select-none">{recipe.emoji}</span>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h4
                        className={`font-black text-xs ${
                          !isExcluded ? 'text-stone-900' : 'text-stone-500 line-through'
                        }`}
                      >
                        {recipe.name}
                      </h4>
                      {isCustom && (
                        <span className="text-[9px] bg-amber-200 text-amber-900 px-1.5 py-0.2 rounded-full font-bold flex items-center gap-0.5">
                          <Sparkles className="w-2.5 h-2.5" />
                          <span>وصفتي</span>
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] text-stone-400 font-semibold">
                      {recipe.totalTime} • {recipe.difficulty}
                    </span>
                  </div>
                </div>

                {/* Left side: Status Toggle & Delete */}
                <div className="flex items-center gap-2">
                  {isCustom && onDeleteCustomDish && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        soundManager.playTap();
                        onDeleteCustomDish(recipe.id);
                      }}
                      title="حذف هذا الطبق من القائمة نهائياً"
                      className="w-7 h-7 rounded-full bg-rose-50 hover:bg-rose-100 text-rose-500 flex items-center justify-center transition-colors pressable"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}

                  <div
                    className={`px-3 py-1 rounded-xl text-xs font-black flex items-center gap-1 transition-all ${
                      !isExcluded
                        ? 'bg-emerald-500 text-white shadow-xs'
                        : 'bg-stone-200 text-stone-500'
                    }`}
                  >
                    {!isExcluded ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>في العجلة</span>
                      </>
                    ) : (
                      <span>مستبعدة 🚫</span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer Button */}
        <div className="p-4 bg-white border-t border-stone-200">
          <button
            type="button"
            onClick={() => {
              soundManager.playTap();
              onClose();
            }}
            disabled={activeCount < 2}
            className={`w-full py-3.5 px-4 rounded-2xl font-black text-sm flex items-center justify-center gap-2 shadow-md transition-all pressable ${
              activeCount >= 2
                ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-orange-500/25'
                : 'bg-stone-200 text-stone-400 cursor-not-allowed shadow-none'
            }`}
          >
            <span>تطبيق على العجلة ({activeCount} أطباق) 🎡</span>
          </button>
        </div>
      </div>
    </div>
  );
}
