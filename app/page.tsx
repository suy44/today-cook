'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { MealType, Recipe, ViewMode } from '@/types';
import { RECIPES } from '@/data/recipes';
import { pickRandomRecipe } from '@/lib/spin';
import { getStoredFavorites, recordRecentSpin } from '@/lib/storage';
import { MobileFrame } from '@/components/MobileFrame';
import { Header } from '@/components/Header';
import { MealSelector } from '@/components/MealSelector';
import { SpinWheel } from '@/components/SpinWheel';
import { SpinButton } from '@/components/SpinButton';
import { ResultModal } from '@/components/ResultModal';
import { RecipeModal } from '@/components/RecipeModal';
import { FavoritesView } from '@/components/FavoritesView';
import { AllDishesView } from '@/components/AllDishesView';
import { BottomNav } from '@/components/BottomNav';

export default function Home() {
  const [selectedMeal, setSelectedMeal] = useState<MealType>('lunch');
  const [viewMode, setViewMode] = useState<ViewMode>('wheel');

  const [isSpinning, setIsSpinning] = useState<boolean>(false);
  const [targetRecipe, setTargetRecipe] = useState<Recipe | null>(null);

  const [resultRecipe, setResultRecipe] = useState<Recipe | null>(null);
  const [isResultModalOpen, setIsResultModalOpen] = useState<boolean>(false);

  const [activeRecipeForModal, setActiveRecipeForModal] = useState<Recipe | null>(null);
  const [isRecipeModalOpen, setIsRecipeModalOpen] = useState<boolean>(false);

  const [favoritesCount, setFavoritesCount] = useState<number>(0);
  const [customPool, setCustomPool] = useState<Recipe[] | null>(null);

  // Sync favorites count
  const refreshFavorites = useCallback(() => {
    setFavoritesCount(getStoredFavorites().length);
  }, []);

  useEffect(() => {
    refreshFavorites();
  }, [refreshFavorites]);

  // Available recipes on the wheel
  const currentWheelRecipes = useMemo(() => {
    if (customPool && customPool.length >= 2) {
      return customPool;
    }
    return RECIPES.filter((r) => r.mealType === selectedMeal);
  }, [selectedMeal, customPool]);

  // Start spinning
  const handleStartSpin = useCallback(() => {
    if (isSpinning || currentWheelRecipes.length === 0) return;

    try {
      const { recipe } = pickRandomRecipe(currentWheelRecipes);
      setTargetRecipe(recipe);
      setIsSpinning(true);
      setIsResultModalOpen(false);
    } catch {
      // Fallback
      if (currentWheelRecipes[0]) {
        setTargetRecipe(currentWheelRecipes[0]);
        setIsSpinning(true);
      }
    }
  }, [isSpinning, currentWheelRecipes]);

  // Spin completed
  const handleSpinEnd = useCallback(
    (recipe: Recipe) => {
      setIsSpinning(false);
      setResultRecipe(recipe);
      recordRecentSpin(recipe.id);
      setIsResultModalOpen(true);
    },
    []
  );

  // View recipe detail
  const handleOpenRecipeDetail = (recipe: Recipe) => {
    setIsResultModalOpen(false);
    setActiveRecipeForModal(recipe);
    setIsRecipeModalOpen(true);
  };

  // Re-spin action from result modal or recipe modal
  const handleSpinAgain = () => {
    setIsResultModalOpen(false);
    setIsRecipeModalOpen(false);
    // Smooth delay before launching next spin
    setTimeout(() => {
      handleStartSpin();
    }, 200);
  };

  // Reset custom pool if meal changes
  const handleMealChange = (meal: MealType) => {
    setCustomPool(null);
    setSelectedMeal(meal);
  };

  // Spin exclusively among favorites
  const handleSpinFavorites = (favs: Recipe[]) => {
    setCustomPool(favs);
    setViewMode('wheel');
    setTimeout(() => {
      handleStartSpin();
    }, 250);
  };

  return (
    <MobileFrame>
      {/* Top Header */}
      <Header />

      {/* Main Screen Views */}
      <div className="flex-1 flex flex-col overflow-y-auto no-scrollbar relative">
        {viewMode === 'wheel' && (
          <div className="flex-1 flex flex-col justify-between py-1">
            {/* Meal Category Selector */}
            <MealSelector
              selectedMeal={selectedMeal}
              onSelectMeal={handleMealChange}
              disabled={isSpinning}
            />

            {/* Custom favorites filter indicator */}
            {customPool && (
              <div className="mx-4 mb-1 p-2 rounded-xl bg-rose-50 border border-rose-200 flex items-center justify-between text-xs font-bold text-rose-700">
                <span>🎡 العجلة تدور بين أطباقك المفضلة فقط ({customPool.length})</span>
                <button
                  onClick={() => setCustomPool(null)}
                  className="underline text-stone-600 hover:text-stone-900"
                >
                  إلغاء
                </button>
              </div>
            )}

            {/* Centerpiece Spin Wheel */}
            <div className="flex-1 flex items-center justify-center my-auto">
              <SpinWheel
                recipes={currentWheelRecipes}
                isSpinning={isSpinning}
                targetRecipe={targetRecipe}
                onSpinStart={handleStartSpin}
                onSpinEnd={handleSpinEnd}
              />
            </div>

            {/* Big Tactile Spin CTA Button */}
            <div className="pb-2">
              <SpinButton
                isSpinning={isSpinning}
                onSpin={handleStartSpin}
                disabled={currentWheelRecipes.length === 0}
              />
            </div>
          </div>
        )}

        {viewMode === 'favorites' && (
          <FavoritesView
            onSelectRecipe={handleOpenRecipeDetail}
            onBackToWheel={() => setViewMode('wheel')}
            onSpinFromFavorites={handleSpinFavorites}
          />
        )}

        {viewMode === 'all' && (
          <AllDishesView
            onSelectRecipe={handleOpenRecipeDetail}
            onBackToWheel={() => setViewMode('wheel')}
          />
        )}
      </div>

      {/* Bottom Navigation */}
      <BottomNav
        currentView={viewMode}
        onViewChange={(mode) => {
          if (!isSpinning) {
            setViewMode(mode);
            refreshFavorites();
          }
        }}
        favoritesCount={favoritesCount}
      />

      {/* Result Modal with Confetti */}
      <ResultModal
        recipe={resultRecipe}
        isOpen={isResultModalOpen}
        onClose={() => setIsResultModalOpen(false)}
        onViewRecipe={handleOpenRecipeDetail}
        onSpinAgain={handleSpinAgain}
      />

      {/* Recipe Details Modal */}
      <RecipeModal
        recipe={activeRecipeForModal}
        isOpen={isRecipeModalOpen}
        onClose={() => {
          setIsRecipeModalOpen(false);
          refreshFavorites();
        }}
        onSpinAgain={handleSpinAgain}
      />
    </MobileFrame>
  );
}
