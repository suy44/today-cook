'use client';

import React, { useState, useEffect } from 'react';
import { Recipe } from '@/types';
import { RECIPES } from '@/data/recipes';
import { getStoredFavorites, toggleStoredFavorite } from '@/lib/storage';
import { Heart, Clock, ArrowLeft, Trash2, Sparkles, BookOpen } from 'lucide-react';
import { soundManager } from '@/lib/sound';

interface FavoritesViewProps {
  onSelectRecipe: (recipe: Recipe) => void;
  onBackToWheel: () => void;
  onSpinFromFavorites?: (favRecipes: Recipe[]) => void;
}

export function FavoritesView({
  onSelectRecipe,
  onBackToWheel,
  onSpinFromFavorites,
}: FavoritesViewProps) {
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);

  useEffect(() => {
    setFavoriteIds(getStoredFavorites());
  }, []);

  const favRecipes = RECIPES.filter((r) => favoriteIds.includes(r.id));

  const handleRemove = (recipeId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    soundManager.playTap();
    const res = toggleStoredFavorite(recipeId);
    setFavoriteIds(res.all);
  };

  return (
    <div className="flex-1 flex flex-col w-full px-4 py-3 animate-in fade-in duration-200">
      {/* Top Bar */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-xl font-black text-stone-900 flex items-center gap-2">
            <span>الأطباق المفضلة</span>
            <Heart className="w-5 h-5 text-rose-500 fill-rose-500" />
          </h2>
          <p className="text-xs text-stone-500 mt-0.5">
            {favRecipes.length > 0
              ? `عندك ${favRecipes.length} أطباق محفوظة`
              : 'مازال ما حفظتي حتى طبق'}
          </p>
        </div>

        <button
          onClick={onBackToWheel}
          type="button"
          className="flex items-center gap-1 text-xs font-bold text-amber-700 bg-amber-50 border border-amber-200 px-3 py-1.5 rounded-xl hover:bg-amber-100 transition-colors pressable"
        >
          <span>رجوع للعجلة</span>
          <ArrowLeft className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Empty State */}
      {favRecipes.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center my-8 bg-white/80 rounded-3xl border border-stone-200/70 shadow-xs">
          <div className="w-16 h-16 rounded-full bg-rose-50 text-rose-400 flex items-center justify-center text-3xl mb-3 shadow-inner">
            ♡
          </div>
          <h3 className="font-bold text-stone-800 text-base mb-1">
            قائمتك فارغة حالياً
          </h3>
          <p className="text-xs text-stone-500 max-w-xs mb-5 leading-relaxed">
            كي تدوري العجلة ويعجبك كاش طبق، اضغطي على زر القلب باش تلقايه محفوظ هنا وقت ما تحبي!
          </p>
          <button
            onClick={onBackToWheel}
            type="button"
            className="py-3 px-5 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs flex items-center gap-2 shadow-sm shadow-amber-500/20 pressable"
          >
            <span>دوري العجلة واكتشفي 🎡</span>
          </button>
        </div>
      ) : (
        <div className="space-y-3 pb-6">
          {/* Quick Spin from Favorites button */}
          {favRecipes.length >= 2 && onSpinFromFavorites && (
            <button
              type="button"
              onClick={() => onSpinFromFavorites(favRecipes)}
              className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-rose-500 to-amber-500 text-white font-black text-sm flex items-center justify-center gap-2 shadow-md shadow-rose-500/25 mb-2 pressable"
            >
              <Sparkles className="w-4 h-4" />
              <span>دوري العجلة غير بين أطباقك المفضلة! 🎡</span>
            </button>
          )}

          {/* List of Favorite Cards */}
          <div className="grid grid-cols-1 gap-2.5">
            {favRecipes.map((recipe) => (
              <div
                key={recipe.id}
                onClick={() => {
                  soundManager.playTap();
                  onSelectRecipe(recipe);
                }}
                className="bg-white hover:bg-amber-50/40 p-3.5 rounded-2xl border border-stone-200/80 shadow-xs flex items-center justify-between cursor-pointer transition-all pressable"
              >
                <div className="flex items-center gap-3">
                  <span className="text-3xl select-none">{recipe.emoji}</span>
                  <div>
                    <h4 className="font-black text-stone-900 text-sm">
                      {recipe.name}
                    </h4>
                    <div className="flex items-center gap-2 text-[11px] text-stone-500 mt-0.5">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-amber-600" />
                        {recipe.totalTime}
                      </span>
                      <span>•</span>
                      <span className="text-amber-700 font-semibold">
                        {recipe.difficulty}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={(e) => handleRemove(recipe.id, e)}
                    title="حذف من المفضلة"
                    className="w-8 h-8 rounded-full bg-stone-100 hover:bg-rose-100 text-stone-400 hover:text-rose-600 flex items-center justify-center transition-colors pressable"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center">
                    <BookOpen className="w-4 h-4" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
