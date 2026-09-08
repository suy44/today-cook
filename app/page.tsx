'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { MealType, Recipe, ViewMode } from '@/types';
import { RECIPES } from '@/data/recipes';
import { pickRandomRecipe } from '@/lib/spin';
import { getStoredFavorites, recordRecentSpin, getCustomRecipes, deleteCustomRecipe } from '@/lib/storage';
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
import { AddDishModal } from '@/components/AddDishModal';

export default function Home() {
  const [selectedMeal, setSelectedMeal] = useState<MealType>('lunch');
  const [viewMode, setViewMode] = useState<ViewMode>('wheel');

  const [isSpinning, setIsSpinning] = useState<boolean>(false);
  const [targetRecipe, setTargetRecipe] = useState<Recipe | null>(null);

  const [resultRecipe, setResultRecipe] = useState<Recipe | null>(null);
  const [isResultModalOpen, setIsResultModalOpen] = useState<boolean>(false);

  const [activeRecipeForModal, setActiveRecipeForModal] = useState<Recipe | null>(null);
  const [isRecipeModalOpen, setIsRecipeModalOpen] = useState<boolean>(false);

  const [isAddDishModalOpen, setIsAddDishModalOpen] = useState<boolean>(false);
  const [customRecipes, setCustomRecipes] = useState<Recipe[]>([]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const [favoritesCount, setFavoritesCount] = useState<number>(0);
  const [customPool, setCustomPool] = useState<Recipe[] | null>(null);

  // Sync favorites and custom recipes on mount
  const refreshStorage = useCallback(() => {
    setFavoritesCount(getStoredFavorites().length);
    setCustomRecipes(getCustomRecipes());
  }, []);

  useEffect(() => {
    refreshStorage();
  }, [refreshStorage]);

  // Combined recipes: User's custom recipes + default Algerian recipes
  const allRecipes = useMemo(() => {
    return [...customRecipes, ...RECIPES];
  }, [customRecipes]);

  // Available recipes on the wheel
  const currentWheelRecipes = useMemo(() => {
    if (customPool && customPool.length >= 2) {
      return customPool;
    }
    return allRecipes.filter((r) => r.mealType === selectedMeal);
  }, [selectedMeal, customPool, allRecipes]);

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

  // Custom recipe added
  const handleDishAdded = (newRecipe: Recipe) => {
    setCustomRecipes((prev) => [newRecipe, ...prev.filter((r) => r.id !== newRecipe.id)]);
    setSelectedMeal(newRecipe.mealType);
    setViewMode('wheel');
    setCustomPool(null);
    setToastMessage(`تمت إضافة "${newRecipe.name}" للعجلة بنجاح! 🎡✨`);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Delete custom recipe
  const handleDeleteCustomRecipe = (recipeId: string) => {
    const updated = deleteCustomRecipe(recipeId);
    setCustomRecipes(updated);
    setToastMessage('تم حذف الطبق الخاص بنجاح.');
    setTimeout(() => setToastMessage(null), 2500);
  };

  return (
    <MobileFrame>
      {/* Top Header */}
      <Header onOpenAddDish={() => setIsAddDishModalOpen(true)} />

      {/* Floating Notification Toast */}
      {toastMessage && (
        <div className="mx-4 mt-2 p-2.5 rounded-2xl bg-emerald-600 text-white text-xs font-bold text-center shadow-lg animate-in fade-in slide-in-from-top-2 duration-200 z-30">
          {toastMessage}
        </div>
      )}

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
            recipes={allRecipes}
            onSelectRecipe={handleOpenRecipeDetail}
            onBackToWheel={() => setViewMode('wheel')}
            onOpenAddDish={() => setIsAddDishModalOpen(true)}
            onDeleteCustomRecipe={handleDeleteCustomRecipe}
          />
        )}
      </div>

      {/* Bottom Navigation */}
      <BottomNav
        currentView={viewMode}
        onViewChange={(mode) => {
          if (!isSpinning) {
            setViewMode(mode);
            refreshStorage();
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
          refreshStorage();
        }}
        onSpinAgain={handleSpinAgain}
      />

      {/* Add Custom Dish Modal */}
      <AddDishModal
        isOpen={isAddDishModalOpen}
        onClose={() => setIsAddDishModalOpen(false)}
        onDishAdded={handleDishAdded}
        initialMealType={selectedMeal}
      />
    </MobileFrame>
  );
}

