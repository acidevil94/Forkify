import * as model from "./model.js";
import recipeView from "./views/recipeView.js";

import "core-js/stable";
import "regenerator-runtime/runtime";

const timeout = function (s) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(new Error(`Request took too long! Timeout after ${s} second`));
    }, s * 1000);
  });
};

// https://forkify-api.herokuapp.com/v2

///////////////////////////////////////

// key: bfa67edcad5e43d49b6c6e728fbd8574

const controlRecipes = async function () {
  try {
    const id = window.location.hash.slice(1);

    if (!id) {
      console.log("No ID found in location");
      return;
    }
    console.log(`Fetching recipe with id ${id}`);
    recipeView.renderSpinner();
    await model.loadRecipe(id);
    // Render recipe
    recipeView.render(model.state.recipe);
  } catch (err) {
    alert(err);
  }
};

controlRecipes();

["hashchange", "load"].forEach((ev) =>
  window.addEventListener(ev, controlRecipes)
);
