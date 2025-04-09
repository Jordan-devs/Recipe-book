import { useEffect, useState } from "react";
import { useStore } from "../Store/useStore";

interface Recipe {
  id: number;
  displayId?: string;
  name: string;
  ingredients: string[];
  instructions: string;
}

const RecipeApp = () => {
  const { recipes, addRecipe, removeRecipe } = useStore();

  const [name, setName] = useState<string>("");
  const [ingredients, setIngredients] = useState<string>("");
  const [instructions, setInstructions] = useState<string>("");
  const [editingRecipe, setEditingRecipe] = useState<Recipe | null>(null);
  const [currentTime, setCurrentTime] = useState<string>("");

  // Update the current time every second
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const monthNames = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
      ];
      const formattedTime = `${now.getDate()}, ${
        monthNames[now.getMonth()]
      } ${now.getFullYear()} - ${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`;
      setCurrentTime(formattedTime);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Sync recipes with localStorage
  useEffect(() => {
    const storedRecipes = localStorage.getItem("recipes");
    if (storedRecipes) {
      const parsedRecipes: Recipe[] = JSON.parse(storedRecipes);
      parsedRecipes.forEach((recipe) => {
        addRecipe(recipe);
      });
    }
  }, [addRecipe]);

  useEffect(() => {
    localStorage.setItem("recipes", JSON.stringify(recipes));
  }, [recipes]);

  const handleAddRecipe = (event: React.FormEvent) => {
    event.preventDefault();

    if (name === "" || ingredients === "" || instructions === "") return;

    const newRecipe: Recipe = {
      id: Date.now(),
      displayId: currentTime, // Use the current time for displayId
      name,
      ingredients: ingredients.split(",").map((ing) => ing.trim()),
      instructions,
    };

    addRecipe(newRecipe);
    setName("");
    setIngredients("");
    setInstructions("");
  };

  const handleEditRecipe = (recipe: Recipe) => {
    setEditingRecipe(recipe);
    setName(recipe.name);
    setIngredients(recipe.ingredients.join(", "));
    setInstructions(recipe.instructions);
  };

  const handleUpdateRecipe = () => {
    if (name === "" || ingredients === "" || instructions === "") return;

    if (editingRecipe) {
      const updatedRecipe: Recipe = {
        id: Date.now(),
        displayId: currentTime, // Use the current time for displayId
        name,
        ingredients: ingredients.split(",").map((ing) => ing.trim()),
        instructions,
      };

      removeRecipe(editingRecipe.id);
      addRecipe(updatedRecipe);

      setEditingRecipe(null);
      setName("");
      setIngredients("");
      setInstructions("");
    }
  };

  const handleCancelRecipe = () => {
    setEditingRecipe(null);
    setName("");
    setIngredients("");
    setInstructions("");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-green-100 max-md:p-4">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-2xl sm:m-10">
        <h1 className="text-3xl font-bold text-center mb-6 text-green-800">
          Recipe Book
        </h1>

        <form onSubmit={handleAddRecipe} className="space-y-4 mb-6">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Recipe Name"
            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <input
            type="text"
            value={ingredients}
            onChange={(e) => setIngredients(e.target.value)}
            placeholder="Ingredients (comma separated)"
            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <textarea
            value={instructions}
            onChange={(e) => setInstructions(e.target.value)}
            placeholder="Instructions"
            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
          />

          <div className="flex justify-between">
            {editingRecipe ? (
              <>
                <button
                  type="button"
                  onClick={handleUpdateRecipe}
                  className="cursor-pointer bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                >
                  Update Recipe
                </button>
                <button
                  onClick={handleCancelRecipe}
                  className="cursor-pointer bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500"
                >
                  Cancel
                </button>
              </>
            ) : (
              <>
                <button
                  type="submit"
                  className="cursor-pointer bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  Add Recipe
                </button>
              </>
            )}
          </div>
        </form>

        <ul className="space-y-4">
          {recipes.map((recipe) => (
            <li
              key={recipe.id}
              className="border p-4 rounded-lg shadow-sm bg-green-50"
            >
              <h2 className="text-2xl font-semibold text-green-800 mb-2">
                {recipe.name}
              </h2>

              <p className="text-gray-700 mb-2">
                <strong>Ingredients:</strong> {recipe.ingredients.join(", ")}
              </p>

              <p className="text-gray-700 text-sm italic mb-4 text-right">
                -- Updated {recipe.displayId} --
              </p>
              <div className="flex justify-between">
                <button
                  onClick={() => handleEditRecipe(recipe)}
                  className="cursor-pointer bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                >
                  Edit
                </button>

                <button
                  onClick={() => removeRecipe(recipe.id)}
                  className="cursor-pointer bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default RecipeApp;
