// --- DOM elements ---
console.log("API Key exists:", typeof OPENAI_API_KEY !== "undefined");

const randomBtn = document.getElementById("random-btn");
const recipeDisplay = document.getElementById("recipe-display");

const remixBtn = document.getElementById("remix-btn");
const remixTheme = document.getElementById("remix-theme");
const remixOutput = document.getElementById("remix-output");

let lastRecipe = null;

// --- Ingredient HTML generator ---
function getIngredientsHtml(recipe) {
  let html = "";
  for (let i = 1; i <= 20; i++) {
    const ing = recipe[`strIngredient${i}`];
    const meas = recipe[`strMeasure${i}`];
    if (ing && ing.trim()) html += `<li>${meas ? `${meas} ` : ""}${ing}</li>`;
  }
  return html;
}

// --- Render recipe on screen ---
function renderRecipe(recipe) {
  recipeDisplay.innerHTML = `
    <div class="recipe-title-row">
      <h2>${recipe.strMeal}</h2>
    </div>
    <img src="${recipe.strMealThumb}" alt="${recipe.strMeal}" />
    <h3>Ingredients:</h3>
    <ul>${getIngredientsHtml(recipe)}</ul>
    <h3>Instructions:</h3>
    <p>${recipe.strInstructions.replace(/\r?\n/g, "<br>")}</p>
  `;
}

// --- Get random recipe ---
async function fetchAndDisplayRandomRecipe() {
  recipeDisplay.innerHTML = "<p>Loading...</p>";
  try {
    const res = await fetch("https://www.themealdb.com/api/json/v1/1/random.php");
    const data = await res.json();
    const recipe = data.meals[0];

    renderRecipe(recipe);
    lastRecipe = recipe;
    remixOutput.innerHTML = "";
  } catch (error) {
    recipeDisplay.innerHTML = "<p>Sorry, couldn't load a recipe.</p>";
  }
}

// --- Remix recipe using OpenAI ---
async function remixRecipe(recipe, theme) {
  remixOutput.innerHTML = "Remixing... 🍳";


  const plainIngredients = getIngredientsHtml(recipe).replace(/<[^>]+>/g, '');  const base = `
You are a creative and helpful chef who specializes in transforming recipes to fit unique themes.
Remix the recipe below to match the theme: "${theme}"

Use only realistic, store-bought ingredients.
Avoid invented ingredients or overly complex steps.
 — and follow the theme-specific rules below.
`;

  let themeInstructions = "";

  switch (theme.toLowerCase()) {
    case "turn it into a dessert":
      themeInstructions = `
Completely reimagine this as a dessert. 
- Replace savory ingredients with sweet ones (e.g. mushrooms → chocolate, sugar, fruit).
- Use dessert techniques like baking, chilling, or whipping.
- The result should clearly belong on a dessert menu.
`;
      break;

    case "turn it into a pizza":
      themeInstructions = `
Turn this recipe into a **pizza**.
- Must include a crust (dough, flatbread, or something crisp).
- Add a pizza-style sauce and toppings.
- Can be baked or pan-fried.
- Final result should clearly resemble a pizza.
`;
      break;

    case "remix it for breakfast":
      themeInstructions = `
Remix this into a **breakfast** meal.
- Include classic breakfast elements like eggs, bacon (or alt-proteins), toast, biscuits, or potatoes.
- Should be easy to prepare in the morning and optionally portable.
`;
      break;

    case "make it work in a dorm room with a microwave":
      themeInstructions = `
Remix this for a **dorm room with a microwave**.
- Only allow a microwave and maybe one utensil.
- Avoid recipes that need stovetops, ovens, or extensive prep.
- Ingredients must be easy to buy and store in a dorm.
`;
      break;

    case "make this dish using only ingredients you could find at a gas station":
      themeInstructions = `
Recreate this recipe using **only ingredients you could find at a gas station**.
- Think pre-packaged snacks, soda, hot dogs, microwave burritos, or boiled eggs.
- Be creative but stay within that constraint.
`;
      break;

    case "make it vegan":
      themeInstructions = `
Remix this as a **regular vegan** dish (not raw).
- No animal products: no meat, eggs, dairy, or honey.
- Use beans, grains, tofu, veggies, nuts, etc.
- Cooking is allowed.
`;
      break;

    default:
      themeInstructions = `
Remix the recipe with the theme "${theme}" using creativity and practical cooking techniques.
`;
  }

const prompt = `${base}
Original Recipe: ${recipe.strMeal}

Original Ingredients:
${plainIngredients}

Original Instructions:
${recipe.strInstructions}

Theme-Specific Instructions:
${themeInstructions}

Return a fun, practical recipe in this new style.
`;

  try {
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: "You are a quirky AI chef." },
          { role: "user", content: prompt },
        ],
      }),
    });

    const data = await res.json();
    const remix = data.choices[0].message.content;
    remixOutput.innerHTML = `<h3>🍽️ Remixed Recipe:</h3><p>${remix.replace(/\n/g, "<br>")}</p>`;
  } catch (err) {
    console.error("Remix error:", err);
    remixOutput.innerHTML = "<p>Sorry, remix failed. Try again?</p>";
  }
}

// --- Event listeners ---
randomBtn.addEventListener("click", fetchAndDisplayRandomRecipe);
window.addEventListener("DOMContentLoaded", fetchAndDisplayRandomRecipe);

remixBtn.addEventListener("click", () => {
  if (!lastRecipe) {
    alert("Get a recipe first!");
    return;
  }
  const selectedTheme = remixTheme.value;
  remixRecipe(lastRecipe, selectedTheme);
});
