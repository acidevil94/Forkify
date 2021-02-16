import * as model from "./model.js";
import recipeView from "./views/recipeView.js";
import searchView from "./views/searchView.js";
import resultsView from "./views/resultsView.js";

import "core-js/stable";
import "regenerator-runtime/runtime";

if (module.hot) {
  module.hot.accept();
}

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
    console.log(`controlRecipes(): Fetching recipe with id ${id}`);
    recipeView.renderSpinner();
    await model.loadRecipe(id);
    // Render recipe
    recipeView.render(model.state.recipe);
  } catch (err) {
    console.log(err);
    recipeView.renderError();
  }
};

const controlSearchResults = async function () {
  try {
    const query = searchView.getQueryAndCleanInput();
    if (!query) {
      console.log("controlSearchResults(): No query specified");
      return;
    }
    resultsView.renderSpinner();
    await model.loadSearchResults(query);

    resultsView.render(model.state.search.results);
  } catch (err) {
    console.error(err);
  }
};

const init = function () {
  recipeView.addHandlerRender(controlRecipes);
  searchView.addHandlerSearch(controlSearchResults);
};

init();
