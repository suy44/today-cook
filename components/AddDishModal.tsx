'use client';

import React, { useState } from 'react';
import { MealType, Recipe } from '@/types';
import { MEAL_CATEGORIES } from '@/data/recipes';
import { X, Sparkles, Plus, Clock, ChefHat, Check } from 'lucide-react';
import { saveCustomRecipe } from '@/lib/storage';
import { soundManager } from '@/lib/sound';

interface AddDishModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDishAdded: (recipe: Recipe) => void;
  initialMealType?: MealType;
}

const EMOJI_OPTIONS = [
  '🍲', '🥘', '🍝', '🍕', '🥞', '🍳', 
  '🫒', '🥔', '🥩', '🐟', '🥟', '🌯', 
  '🍰', '🥧', '🍪', '🥗', '🥣', '🥖'
];

const TIME_PRESETS = ['15 دقيقة', '30 دقيقة', '45 دقيقة', '60 دقيقة', '90 دقيقة'];

export function AddDishModal({
  isOpen,
  onClose,
  onDishAdded,
  initialMealType = 'lunch',
}: AddDishModalProps) {
  const [name, setName] = useState('');
  const [mealType, setMealType] = useState<MealType>(initialMealType);
  const [selectedEmoji, setSelectedEmoji] = useState('🍲');
  const [totalTime, setTotalTime] = useState('40 دقيقة');
  const [difficulty, setDifficulty] = useState<'ساهلة' | 'متوسطة' | 'تاع حراير'>('ساهلة');
  const [ingredientsText, setIngredientsText] = useState('');
  const [stepsText, setStepsText] = useState('');
  const [tip, setTip] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('من فضلك اكتبي اسم الطبق!');
      return;
    }

    // Process ingredients and steps into arrays
    const ingredients = ingredientsText
      .split('\n')
      .map((i) => i.trim().replace(/^[-*•]\s*/, ''))
      .filter((i) => i.length > 0);

    const steps = stepsText
      .split('\n')
      .map((s) => s.trim().replace(/^\d+[\.\-\)]\s*/, ''))
      .filter((s) => s.length > 0);

    const newRecipe: Recipe = {
      id: `custom_${Date.now()}`,
      name: name.trim(),
      shortName: name.trim().length > 12 ? name.trim().slice(0, 11) + '..' : name.trim(),
      mealType: mealType,
      emoji: selectedEmoji,
      description: `وصفتك الخاصة والمميزة لـ ${name.trim()}`,
      prepTime: '15 دقيقة',
      cookTime: totalTime,
      totalTime: totalTime,
      servings: '4 أشخاص',
      difficulty: difficulty,
      color: '#EA580C',
      ingredients: ingredients.length > 0 ? ingredients : ['المقادير حسب الرغبة وذوقك الخاص'],
      steps: steps.length > 0 ? steps : ['حضري المكونات وطيبيهم بحب ولمستك السحرية!'],
      tip: tip.trim() || 'طيبيها على نار هادية وبحب، تخرج بنينة وتحمر الوجه!',
    };

    saveCustomRecipe(newRecipe);
    soundManager.playCelebration();
    onDishAdded(newRecipe);
    onClose();

    // Reset form
    setName('');
    setIngredientsText('');
    setStepsText('');
    setTip('');
    setError('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-md max-h-[92vh] bg-stone-50 rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom duration-300 border-t sm:border border-stone-200">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-white/95 backdrop-blur-md px-5 py-3.5 border-b border-stone-200/80 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-500 text-white flex items-center justify-center shadow-xs">
              <ChefHat className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-black text-stone-900 leading-none">
                زيدي طبقك الخاص 👩‍🍳
              </h2>
              <p className="text-[11px] text-stone-500 mt-0.5">
                خلّي العجلة تقترح أكلاتك الخاصة
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

        {/* Scrollable Form Content */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto px-5 py-4 space-y-4 no-scrollbar pb-8">
          {error && (
            <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold text-center">
              {error}
            </div>
          )}

          {/* Dish Name */}
          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">
              اسم الطبق *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (error) setError('');
              }}
              placeholder="مثلا: شخشوخة ماما المخصوصة، غراتان بطاطا بالفرماج..."
              className="w-full px-3.5 py-2.5 bg-white border border-stone-200 rounded-xl text-sm font-semibold text-stone-800 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-500 shadow-xs"
            />
          </div>

          {/* Meal Type Selection */}
          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">
              نوع الوجبة
            </label>
            <div className="grid grid-cols-4 gap-1.5 bg-stone-200/60 p-1 rounded-xl">
              {MEAL_CATEGORIES.map((cat) => {
                const isSelected = mealType === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setMealType(cat.id)}
                    className={`py-2 px-1 rounded-lg text-xs font-bold transition-all flex flex-col items-center gap-0.5 ${
                      isSelected
                        ? 'bg-amber-500 text-white shadow-xs'
                        : 'text-stone-700 hover:bg-white/60'
                    }`}
                  >
                    <span className="text-base">{cat.emoji}</span>
                    <span className="text-[10px]">{cat.shortLabel.replace(/^[^\s]+\s*/, '')}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Emoji Picker */}
          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">
              اختاري رمز الطبق (الإيموجي)
            </label>
            <div className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar">
              {EMOJI_OPTIONS.map((emoji) => (
                <button
                  key={emoji}
                  type="button"
                  onClick={() => setSelectedEmoji(emoji)}
                  className={`w-9 h-9 rounded-xl flex items-center justify-center text-xl shrink-0 transition-transform ${
                    selectedEmoji === emoji
                      ? 'bg-amber-100 border-2 border-amber-500 scale-110 shadow-xs'
                      : 'bg-white border border-stone-200 hover:bg-stone-50'
                  }`}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>

          {/* Time & Difficulty */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                الوقت التقريبي
              </label>
              <select
                value={totalTime}
                onChange={(e) => setTotalTime(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-stone-200 rounded-xl text-xs font-semibold text-stone-800 focus:outline-none focus:ring-2 focus:ring-amber-500 shadow-xs"
              >
                {TIME_PRESETS.map((t) => (
                  <option key={t} value={t}>
                    ⏱ {t}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                مستوى الصعوبة
              </label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value as any)}
                className="w-full px-3 py-2 bg-white border border-stone-200 rounded-xl text-xs font-semibold text-stone-800 focus:outline-none focus:ring-2 focus:ring-amber-500 shadow-xs"
              >
                <option value="ساهلة">🌟 ساهلة</option>
                <option value="متوسطة">⚡ متوسطة</option>
                <option value="تاع حراير">👑 تاع حراير</option>
              </select>
            </div>
          </div>

          {/* Ingredients list */}
          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">
              المقادير (سطر لكل مكون)
            </label>
            <textarea
              rows={3}
              value={ingredientsText}
              onChange={(e) => setIngredientsText(e.target.value)}
              placeholder="مثلا:&#10;دجاج أو لحم&#10;بصل وثوم وطماطم&#10;توابل رأس الحانوت"
              className="w-full px-3 py-2 bg-white border border-stone-200 rounded-xl text-xs font-medium text-stone-800 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-500 shadow-xs leading-relaxed"
            />
          </div>

          {/* Steps */}
          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">
              طريقة التحضير (سطر لكل خطوة)
            </label>
            <textarea
              rows={3}
              value={stepsText}
              onChange={(e) => setStepsText(e.target.value)}
              placeholder="مثلا:&#10;1. قلي البصل مع الدجاج والتوابل&#10;2. مرقي بالماء الساخن وغطي الطنجرة&#10;3. قدميها سخونة مع رشة معدنوس"
              className="w-full px-3 py-2 bg-white border border-stone-200 rounded-xl text-xs font-medium text-stone-800 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-500 shadow-xs leading-relaxed"
            />
          </div>

          {/* Tip */}
          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">
              سر الطبخة / نصيحة خاصة بك (اختياري)
            </label>
            <input
              type="text"
              value={tip}
              onChange={(e) => setTip(e.target.value)}
              placeholder="مثلا: زيدي رشة سمن في الأخير تعطي بنة زمان!"
              className="w-full px-3.5 py-2 bg-white border border-stone-200 rounded-xl text-xs font-semibold text-stone-800 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-500 shadow-xs"
            />
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-600 text-white font-black text-base flex items-center justify-center gap-2 shadow-md shadow-orange-500/30 hover:brightness-105 active:scale-95 transition-all pressable"
            >
              <Sparkles className="w-5 h-5" />
              <span>حفظ في العجلة وقائمة الأطباق 🎡</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
