import { create } from "zustand";

interface Recipe {
  id: number;
  displayId?: string;
  name: string;
  ingredients: string[];
  instructions: string;
}

interface RecipeStore {
  recipes: Recipe[];
  addRecipe: (recipe: Recipe) => void;
  removeRecipe: (id: number) => void;
  //   other actions can be added here
}

export const useStore = create<RecipeStore>((set) => ({
  recipes: [],
  addRecipe: (recipe: Recipe) =>
    set((state) => ({ recipes: [...state.recipes, recipe] })),
  removeRecipe: (id: number) =>
    set((state) => ({
      recipes: state.recipes.filter((recipe) => recipe.id !== id),
    })),
}));
