export type MealType = 'breakfast' | 'lunch' | 'dinner' | 'snack';

export interface Recipe {
  id: string;
  name: string;
  shortName: string;
  mealType: MealType;
  emoji: string;
  description: string;
  prepTime: string;
  cookTime: string;
  totalTime: string;
  servings: string;
  difficulty: 'ساهلة' | 'متوسطة' | 'تاع حراير';
  ingredients: string[];
  steps: string[];
  tip: string;
  color: string;
  textColor?: string;
}

export interface MealCategory {
  id: MealType;
  label: string;
  shortLabel: string;
  emoji: string;
  description: string;
}

export type ViewMode = 'wheel' | 'favorites' | 'all';
