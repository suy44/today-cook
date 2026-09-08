'use client';

import React, { useState, useMemo } from 'react';
import { Recipe, MealType } from '@/types';
import { RECIPES } from '@/data/recipes';
import { Search, Clock, ArrowLeft, BookOpen, X } from 'lucide-react';
import { soundManager } from '@/lib/sound';

interface AllDishesViewProps {
  onSelectRecipe: (recipe: Recipe) => void;
  onBackToWheel: () => void;
}

export function AllDishesView({
  onSelectRecipe,
  onBackToWheel,
}: AllDishesViewProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | MealType>('all');

  const filteredRecipes = useMemo(() => {
    return RECIPES.filter((r) => {
      const matchesCategory = activeFilter === 'all' || r.mealType === activeFilter;
      const q = searchQuery.trim().toLowerCase();
      const matchesSearch =
        !q ||
        r.name.toLowerCase().includes(q) ||
        r.shortName.toLowerCase().includes(q) ||
        r.ingredients.some((ing) => ing.toLowerCase().includes(q));
      return matchesCategory && matchesSearch;
    });
  }, [searchQuery, activeFilter]);

  return (
    <div className="flex-1 flex flex-col w-full px-4 py-3 animate-in fade-in duration-200">
      {/* Top Header */}
      <div className="flex items-center justify-between mb-3">
        <div>
          <h2 className="text-xl font-black text-stone-900 flex items-center gap-2">
            <span>كل الأكلات الجزائرية</span>
            <span className="text-sm font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
              {RECIPES.length} طبق
            </span>
          </h2>
          <p className="text-xs text-stone-500 mt-0.5">
            تصفحي واكتشفي وصفات بلادنا البنينة
          </p>
        </div>

        <button
          onClick={onBackToWheel}
          type="button"
          className="flex items-center gap-1 text-xs font-bold text-amber-700 bg-amber-50 border border-amber-200 px-3 py-1.5 rounded-xl hover:bg-amber-100 transition-colors pressable"
        >
          <span>العجلة 🎡</span>
          <ArrowLeft className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative mb-3">
        <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-stone-400">
          <Search className="w-4 h-4" />
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="ابحثي عن طبق، مكون (مثلا: شخشوخة، دجاج...)"
          className="w-full pr-9 pl-9 py-2.5 bg-white border border-stone-200 rounded-2xl text-xs font-semibold placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-500/50 shadow-xs"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            type="button"
            className="absolute inset-y-0 left-3 flex items-center text-stone-400 hover:text-stone-600"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Category Pills */}
      <div className="flex gap-1.5 overflow-x-auto pb-2 mb-2 no-scrollbar text-xs font-bold">
        {[
          { id: 'all', label: 'الكل' },
          { id: 'lunch', label: '🍛 غداء' },
          { id: 'dinner', label: '🌙 عشاء' },
          { id: 'breakfast', label: '🌅 فطور' },
          { id: 'snack', label: '☕ خفيفة' },
        ].map((tab) => {
          const isActive = activeFilter === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => {
                soundManager.playTap();
                setActiveFilter(tab.id as 'all' | MealType);
              }}
              type="button"
              className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition-all select-none pressable ${
                isActive
                  ? 'bg-amber-500 text-white shadow-xs'
                  : 'bg-white text-stone-600 hover:bg-stone-100 border border-stone-200/80'
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Recipe Cards List */}
      <div className="space-y-2 pb-8 overflow-y-auto">
        {filteredRecipes.length === 0 ? (
          <div className="text-center py-10 text-stone-500 text-xs">
            ما لقينا حتى طبق يطابق البحث تاعك! جربي كلمة أخرى.
          </div>
        ) : (
          filteredRecipes.map((recipe) => (
            <div
              key={recipe.id}
              onClick={() => {
                soundManager.playTap();
                onSelectRecipe(recipe);
              }}
              className="bg-white hover:bg-amber-50/40 p-3 rounded-2xl border border-stone-200/80 shadow-xs flex items-center justify-between cursor-pointer transition-all pressable"
            >
              <div className="flex items-center gap-3">
                <span className="text-3xl select-none">{recipe.emoji}</span>
                <div>
                  <h4 className="font-black text-stone-900 text-xs">
                    {recipe.name}
                  </h4>
                  <div className="flex items-center gap-2 text-[10px] text-stone-500 mt-0.5">
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

              <div className="w-7 h-7 rounded-full bg-amber-50 text-amber-800 flex items-center justify-center shrink-0">
                <BookOpen className="w-3.5 h-3.5" />
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
