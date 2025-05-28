// main.js

// CONSTANTS
const RECIPE_URLS = [
    'https://adarsh249.github.io/Lab8-Starter/recipes/1_50-thanksgiving-side-dishes.json',
    'https://adarsh249.github.io/Lab8-Starter/recipes/2_roasting-turkey-breast-with-stuffing.json',
    'https://adarsh249.github.io/Lab8-Starter/recipes/3_moms-cornbread-stuffing.json',
    'https://adarsh249.github.io/Lab8-Starter/recipes/4_50-indulgent-thanksgiving-side-dishes-for-any-holiday-gathering.json',
    'https://adarsh249.github.io/Lab8-Starter/recipes/5_healthy-thanksgiving-recipe-crockpot-turkey-breast.json',
    'https://adarsh249.github.io/Lab8-Starter/recipes/6_one-pot-thanksgiving-dinner.json',
];

// Run the init() function when the page has loaded
window.addEventListener('DOMContentLoaded', init);

// Starts the program, all function calls trace back here
async function init() {
  // initialize ServiceWorker
  initializeServiceWorker();
  // Get the recipes from localStorage
  let recipes;
  try {
    recipes = await getRecipes();
  } catch (err) {
    console.error(err);
  }
  // Add each recipe to the <main> element
  addRecipesToDocument(recipes);
}

/**
 * Detects if there's a service worker, then loads it and begins the process
 * of installing it and getting it running
 */
function initializeServiceWorker() {
  // B1. Check if service workers are supported
  if ('serviceWorker' in navigator) {
    // B2. Add an event listener for the load event on the window object
    window.addEventListener('load', () => {
      // B3. Register the service worker at the root of the site
      navigator.serviceWorker.register('/sw.js')
        .then((reg) => {
          // B4. Log success if registration worked
          console.log('Service Worker registered with scope:', reg.scope);
        })
        .catch((error) => {
          // B5. Log error if registration failed
          console.error('Service Worker registration failed:', error);
        });
    });
  }
}


/**
 * Reads 'recipes' from localStorage and returns an array of
 * all of the recipes found (parsed, not in string form). If
 * nothing is found in localStorage, network requests are made to all
 * of the URLs in RECIPE_URLs, an array is made from those recipes, that
 * array is saved to localStorage, and then the array is returned.
 * @returns {Array<Object>} An array of recipes found in localStorage
 */
async function getRecipes() {
  // A1. Check local storage to see if there are any recipes.
  const localData = localStorage.getItem('recipes');
  if (localData) {
    return JSON.parse(localData);
  }

  // A2. Create an empty array to hold the fetched recipes
  const recipes = [];

  // A3. Return a new Promise
  return new Promise(async (resolve, reject) => {
    // A4. Loop through each URL in RECIPE_URLS
    for (let url of RECIPE_URLS) {
      try {
        // A6. Fetch the recipe
        const response = await fetch(url);
        // A7. Parse the response as JSON
        const json = await response.json();
        // A8. Push it into the recipes array
        recipes.push(json);
      } catch (err) {
        // A10. Log the error
        console.error('Fetch error for:', url, err);
        // A11. Reject the promise
        reject(err);
        return;
      }
    }

    // A9. After all are fetched, save to storage and resolve
    saveRecipesToStorage(recipes);
    resolve(recipes);
  });
}


/**
 * Takes in an array of recipes, converts it to a string, and then
 * saves that string to 'recipes' in localStorage
 * @param {Array<Object>} recipes An array of recipes
 */
function saveRecipesToStorage(recipes) {
  localStorage.setItem('recipes', JSON.stringify(recipes));
}

/**
 * Takes in an array of recipes and for each recipe creates a
 * new <recipe-card> element, adds the recipe data to that card
 * using element.data = {...}, and then appends that new recipe
 * to <main>
 * @param {Array<Object>} recipes An array of recipes
 */
function addRecipesToDocument(recipes) {
  if (!recipes) return;
  let main = document.querySelector('main');
  recipes.forEach((recipe) => {
    let recipeCard = document.createElement('recipe-card');
    recipeCard.data = recipe;
    main.append(recipeCard);
  });
}

initializeServiceWorker();