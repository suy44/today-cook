'use client';

import React, { useState, useEffect } from 'react';
import { Recipe } from '@/types';
import { Clock, Users, Flame, Heart, Share2, ArrowRight, CheckCircle2, Circle, Lightbulb, Sparkles } from 'lucide-react';
import { isStoredFavorite, toggleStoredFavorite } from '@/lib/storage';
import { soundManager } from '@/lib/sound';

interface RecipeModalProps {
  recipe: Recipe | null;
  isOpen: boolean;
  onClose: () => void;
  onSpinAgain?: () => void;
}

export function RecipeModal({
  recipe,
  isOpen,
  onClose,
  onSpinAgain,
}: RecipeModalProps) {
  const [isFav, setIsFav] = useState(false);
  const [checkedIngredients, setCheckedIngredients] = useState<Record<number, boolean>>({});
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (recipe) {
      setIsFav(isStoredFavorite(recipe.id));
      setCheckedIngredients({});
      setCopied(false);
    }
  }, [recipe]);

  if (!isOpen || !recipe) return null;

  const toggleIngredient = (idx: number) => {
    soundManager.playTap();
    setCheckedIngredients((prev) => ({
      ...prev,
      [idx]: !prev[idx],
    }));
  };

  const handleFavoriteToggle = () => {
    soundManager.playTap();
    const res = toggleStoredFavorite(recipe.id);
    setIsFav(res.isFavorite);
  };

  const handleShare = async () => {
    soundManager.playTap();
    const shareText = `واش رايك نوجدو اليوم: ${recipe.name} 😋\nالوقت: ${recipe.totalTime} | الأشخاص: ${recipe.servings}\nالمقادير:\n${recipe.ingredients.slice(0, 5).join('\n')}\nتطبيق: واش نطيب اليوم؟`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: recipe.name,
          text: shareText,
          url: window.location.href,
        });
        return;
      } catch {}
    }

    // Fallback: Copy to clipboard
    try {
      await navigator.clipboard.writeText(shareText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {}
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-md max-h-[90vh] bg-stone-50 rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom duration-300 border-t sm:border border-stone-200">
        {/* Header bar */}
        <div className="sticky top-0 z-10 bg-white/95 backdrop-blur-md px-5 py-3.5 border-b border-stone-200/80 flex items-center justify-between">
          <button
            onClick={onClose}
            type="button"
            className="flex items-center gap-1.5 text-stone-600 hover:text-stone-900 font-bold text-sm py-1 px-2.5 rounded-xl hover:bg-stone-100 transition-colors pressable"
          >
            <ArrowRight className="w-4 h-4" />
            <span>رجوع</span>
          </button>

          <div className="flex items-center gap-2">
            {/* Share button */}
            <button
              onClick={handleShare}
              type="button"
              title="مشاركة الوصفة"
              className="w-9 h-9 rounded-full bg-stone-100 text-stone-600 hover:bg-stone-200 flex items-center justify-center transition-colors pressable"
            >
              <Share2 className="w-4 h-4" />
            </button>

            {/* Favorite toggle button */}
            <button
              onClick={handleFavoriteToggle}
              type="button"
              title="حفظ في المفضلة"
              className={`w-9 h-9 rounded-full flex items-center justify-center transition-colors pressable ${
                isFav ? 'bg-rose-50 text-rose-500' : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              <Heart className={`w-4 h-4 ${isFav ? 'fill-rose-500' : ''}`} />
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-5 no-scrollbar pb-10">
          {/* Share Copied toast */}
          {copied && (
            <div className="bg-emerald-600 text-white text-xs font-bold py-2 px-3 rounded-xl text-center shadow-md animate-in fade-in">
              تم نسخ تفاصيل الوصفة إلى الحافظة بنجاح! 📋
            </div>
          )}

          {/* Hero Dish Title Card */}
          <div className="bg-gradient-to-br from-amber-500 to-orange-600 text-white rounded-2xl p-5 shadow-md shadow-orange-500/20 relative overflow-hidden">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-xs bg-white/20 backdrop-blur-xs px-2.5 py-0.5 rounded-full font-bold">
                  {recipe.mealType === 'breakfast'
                    ? '🌅 فطور الصباح'
                    : recipe.mealType === 'lunch'
                    ? '🍛 غداء جزائري'
                    : recipe.mealType === 'dinner'
                    ? '🌙 عشاء خفيف'
                    : '☕ حاجة خفيفة'}
                </span>
                <h1 className="text-2xl font-black mt-2 leading-snug">{recipe.name}</h1>
                <p className="text-xs text-amber-100 mt-1">{recipe.description}</p>
              </div>
              <span className="text-5xl select-none mr-2">{recipe.emoji}</span>
            </div>

            {/* Badges Grid */}
            <div className="grid grid-cols-3 gap-2 mt-4 pt-4 border-t border-white/20 text-center">
              <div className="bg-black/10 backdrop-blur-xs py-1.5 px-2 rounded-xl">
                <div className="flex items-center justify-center gap-1 text-[11px] text-amber-100 font-semibold mb-0.5">
                  <Clock className="w-3 h-3" />
                  <span>الوقت</span>
                </div>
                <div className="font-bold text-xs">{recipe.totalTime}</div>
              </div>

              <div className="bg-black/10 backdrop-blur-xs py-1.5 px-2 rounded-xl">
                <div className="flex items-center justify-center gap-1 text-[11px] text-amber-100 font-semibold mb-0.5">
                  <Users className="w-3 h-3" />
                  <span>الأشخاص</span>
                </div>
                <div className="font-bold text-xs">{recipe.servings}</div>
              </div>

              <div className="bg-black/10 backdrop-blur-xs py-1.5 px-2 rounded-xl">
                <div className="flex items-center justify-center gap-1 text-[11px] text-amber-100 font-semibold mb-0.5">
                  <Flame className="w-3 h-3" />
                  <span>الصعوبة</span>
                </div>
                <div className="font-bold text-xs">{recipe.difficulty}</div>
              </div>
            </div>
          </div>

          {/* Ingredients Section with interactive Checklist */}
          <div className="bg-white rounded-2xl p-4 border border-stone-200/90 shadow-xs">
            <div className="flex items-center justify-between mb-3 pb-2 border-b border-stone-100">
              <h3 className="font-black text-stone-900 text-base flex items-center gap-2">
                <span>🛒 المقادير المطلوبة</span>
              </h3>
              <span className="text-[11px] text-stone-400 font-medium">
                شطبي واش عندك في الكوزينة 👇
              </span>
            </div>

            <ul className="space-y-2">
              {recipe.ingredients.map((ing, idx) => {
                const isChecked = !!checkedIngredients[idx];
                return (
                  <li
                    key={idx}
                    onClick={() => toggleIngredient(idx)}
                    className={`flex items-start gap-2.5 p-2 rounded-xl cursor-pointer transition-colors ${
                      isChecked
                        ? 'bg-emerald-50 text-stone-400 line-through'
                        : 'hover:bg-amber-50/50 text-stone-800'
                    }`}
                  >
                    {isChecked ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                    ) : (
                      <Circle className="w-4 h-4 text-stone-300 mt-0.5 shrink-0" />
                    )}
                    <span className="text-sm font-semibold">{ing}</span>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Steps Section */}
          <div className="bg-white rounded-2xl p-4 border border-stone-200/90 shadow-xs">
            <h3 className="font-black text-stone-900 text-base mb-3 pb-2 border-b border-stone-100 flex items-center gap-2">
              <span>👩‍🍳 طريقة التحضير خطوة بخطوة</span>
            </h3>

            <ol className="space-y-3">
              {recipe.steps.map((step, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-amber-500 text-white font-black text-xs flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
                    {idx + 1}
                  </span>
                  <p className="text-sm text-stone-800 font-medium leading-relaxed">
                    {step}
                  </p>
                </li>
              ))}
            </ol>
          </div>

          {/* Tip Card (نصيحة الحراير) */}
          <div className="bg-amber-50 border-2 border-amber-300/80 rounded-2xl p-4 flex items-start gap-3 shadow-xs">
            <div className="w-9 h-9 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-sm">
              <Lightbulb className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-black text-amber-900 text-sm flex items-center gap-1.5">
                <span>نصيحة الحراير</span>
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              </h4>
              <p className="text-xs text-amber-950/85 font-medium mt-1 leading-relaxed">
                {recipe.tip}
              </p>
            </div>
          </div>

          {/* Spin again CTA if opened from wheel */}
          {onSpinAgain && (
            <div className="pt-2">
              <button
                type="button"
                onClick={() => {
                  soundManager.playTap();
                  onClose();
                  onSpinAgain();
                }}
                className="w-full py-3.5 px-4 rounded-2xl bg-stone-900 text-white font-bold text-sm flex items-center justify-center gap-2 hover:bg-stone-800 transition-all pressable"
              >
                <span>ما عجبتكش؟ دوري واختاري طبق واحد آخر 🎡</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
