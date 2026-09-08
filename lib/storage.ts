const FAVORITES_KEY = 'washtayeb_favorites';
const RECENT_SPINS_KEY = 'washtayeb_recent_spins';
const CUSTOM_RECIPES_KEY = 'washtayeb_custom_recipes';
const EXCLUDED_WHEEL_DISHES_KEY = 'washtayeb_excluded_dishes';

import { Recipe } from '@/types';

export function getCustomRecipes(): Recipe[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(CUSTOM_RECIPES_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveCustomRecipe(recipe: Recipe): Recipe[] {
  if (typeof window === 'undefined') return [];
  try {
    const current = getCustomRecipes();
    const existingIndex = current.findIndex((r) => r.id === recipe.id);
    let updated: Recipe[];
    if (existingIndex >= 0) {
      updated = [...current];
      updated[existingIndex] = recipe;
    } else {
      updated = [recipe, ...current];
    }
    localStorage.setItem(CUSTOM_RECIPES_KEY, JSON.stringify(updated));
    // Ensure newly created dish is explicitly INCLUDED in the wheel (not excluded)
    setDishExclusion(recipe.id, false);
    return updated;
  } catch {
    return [];
  }
}

export function deleteCustomRecipe(recipeId: string): Recipe[] {
  if (typeof window === 'undefined') return [];
  try {
    const current = getCustomRecipes();
    const updated = current.filter((r) => r.id !== recipeId);
    localStorage.setItem(CUSTOM_RECIPES_KEY, JSON.stringify(updated));
    return updated;
  } catch {
    return [];
  }
}

export function isCustomRecipe(recipeId: string): boolean {
  if (typeof window === 'undefined') return false;
  return getCustomRecipes().some((r) => r.id === recipeId);
}

// Wheel Exclusion Management:
// Dishes in this list will be hidden from the active Spin Wheel
export function getExcludedDishIds(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(EXCLUDED_WHEEL_DISHES_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function isDishExcludedFromWheel(dishId: string): boolean {
  if (typeof window === 'undefined') return false;
  return getExcludedDishIds().includes(dishId);
}

export function toggleDishExclusion(dishId: string): { isExcluded: boolean; excluded: string[] } {
  if (typeof window === 'undefined') return { isExcluded: false, excluded: [] };
  try {
    const current = getExcludedDishIds();
    const exists = current.includes(dishId);
    let updated: string[];
    if (exists) {
      updated = current.filter((id) => id !== dishId);
    } else {
      updated = [...current, dishId];
    }
    localStorage.setItem(EXCLUDED_WHEEL_DISHES_KEY, JSON.stringify(updated));
    return { isExcluded: !exists, excluded: updated };
  } catch {
    return { isExcluded: false, excluded: [] };
  }
}

export function setDishExclusion(dishId: string, excluded: boolean): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const current = getExcludedDishIds();
    let updated: string[];
    if (excluded) {
      updated = current.includes(dishId) ? current : [...current, dishId];
    } else {
      updated = current.filter((id) => id !== dishId);
    }
    localStorage.setItem(EXCLUDED_WHEEL_DISHES_KEY, JSON.stringify(updated));
    return updated;
  } catch {
    return [];
  }
}

export function resetExcludedDishes(): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(EXCLUDED_WHEEL_DISHES_KEY);
  } catch {}
}

export function getStoredFavorites(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(FAVORITES_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function toggleStoredFavorite(recipeId: string): { isFavorite: boolean; all: string[] } {
  if (typeof window === 'undefined') return { isFavorite: false, all: [] };
  try {
    const current = getStoredFavorites();
    const exists = current.includes(recipeId);
    let updated: string[];
    if (exists) {
      updated = current.filter(id => id !== recipeId);
    } else {
      updated = [recipeId, ...current];
    }
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(updated));
    return { isFavorite: !exists, all: updated };
  } catch {
    return { isFavorite: false, all: [] };
  }
}

export function isStoredFavorite(recipeId: string): boolean {
  if (typeof window === 'undefined') return false;
  return getStoredFavorites().includes(recipeId);
}

export function getRecentSpins(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(RECENT_SPINS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function recordRecentSpin(recipeId: string): void {
  if (typeof window === 'undefined') return;
  try {
    const current = getRecentSpins().filter(id => id !== recipeId);
    // Keep last 6 spins
    const updated = [recipeId, ...current].slice(0, 6);
    localStorage.setItem(RECENT_SPINS_KEY, JSON.stringify(updated));
  } catch {}
}


