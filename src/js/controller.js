import * as model from "./model.js";
import recipeView from "./views/recipeView.js";
import searchView from "./views/searchView.js";
import resultsView from "./views/resultsView.js";
import bookmarksView from "./views/bookmarksView.js";
import paginationView from "./views/paginationView.js";
import addRecipeView from "./views/addRecipeView.js";

import { CLOSE_MODAL_TIMEOUT_SEC } from "./config.js";

import "core-js/stable";
import "regenerator-runtime/runtime";

// if (module.hot) {
//   module.hot.accept();
// }

// https://forkify-api.herokuapp.com/v2

///////////////////////////////////////

const controlRecipes = async function () {
  try {
    const id = window.location.hash.slice(1);

    if (!id) {
      return;
    }
    console.log(`controlRecipes(): Fetching recipe with id ${id}`);
    recipeView.renderSpinner();

    resultsView.update(model.getSearchResultsPage());

    await model.loadRecipe(id);
    // Render recipe
    recipeView.render(model.state.recipe);

    bookmarksView.update(model.state.bookmarks);
  } catch (err) {
    console.error(err);
    recipeView.renderError();
  }
};

const controlSearchResults = async function () {
  try {
    const query = searchView.getQueryAndCleanInput();
    if (!query) {
      return;
    }
    console.log(`controlSearchResults(): Fetching recipe with query ${query}`);
    resultsView.renderSpinner();
    await model.loadSearchResults(query);

    resultsView.render(model.getSearchResultsPage());

    paginationView.render(model.state.search);
  } catch (err) {
    console.error(err);
    resultsView.renderError();
  }
};

const controlPagination = function (gotoPage) {
  resultsView.render(model.getSearchResultsPage(gotoPage));

  paginationView.render(model.state.search);
};

const controlServings = function (newServings) {
  // update the recipe (in state)
  model.updateServings(newServings);

  // update the view
  recipeView.update(model.state.recipe);
};

const controlAddBookmark = function () {
  // toggle bookmarks
  if (model.state.recipe.bookmarked) {
    model.deleteBookmark(model.state.recipe.id);
  } else {
    model.addBookmark(model.state.recipe);
  }

  // update recipe view
  recipeView.update(model.state.recipe);

  // render bookmark
  bookmarksView.render(model.state.bookmarks);
};

const controlBookmarks = function () {
  bookmarksView.render(model.state.bookmarks);
};

const controlAddRecipe = async function (newRecipe) {
  try {
    addRecipeView.renderSpinner();

    await model.uploadRecipe(newRecipe);

    console.log(model.state.recipe);

    recipeView.render(model.state.recipe);

    addRecipeView.renderMessage();

    bookmarksView.render(model.state.bookmarks);

    window.history.pushState(null, "", `#${model.state.recipe.id}`);

    setTimeout(() => {
      addRecipeView.toggleWindow();
    }, CLOSE_MODAL_TIMEOUT_SEC * 1000);
  } catch (err) {
    addRecipeView.renderError(err.message);
    console.error(err);
  } finally {
    console.log("controlAddRecipe(): Finish.");
  }
};

const init = function () {
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerBookmark(controlAddBookmark);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
  bookmarksView.addHandlerRender(controlBookmarks);
  addRecipeView.addHandlerUpload(controlAddRecipe);
};

init();
