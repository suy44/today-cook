import { RECIPES } from '@/data/recipes';
import { notFound } from 'next/navigation';
import { RecipePageClient } from './RecipePageClient';

export function generateStaticParams() {
  return RECIPES.map((recipe) => ({
    id: recipe.id,
  }));
}

export default async function RecipePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const recipe = RECIPES.find((r) => r.id === id);

  if (!recipe) {
    notFound();
  }

  return <RecipePageClient recipe={recipe} />;
}
