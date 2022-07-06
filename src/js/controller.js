import * as model from './model.js';
import { MODAL_CLOSE_SEC, TIMEOUT_SEC } from './config.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js';
import bookmarksView from './views/bookmarksView.js';
import addRecipeView from './views/addRecipeView.js';
import 'regenerator-runtime/runtime'; //polyfilling async await on old browsers
import 'core-js/stable'; //polyfilling everything else
import { async } from 'regenerator-runtime';

if (module.hot) {
  module.hot.accept();
}

const controlRecipes = async function () {
  try {
    const id = window.location.hash.slice(1);
    if (!id) return;
    recipeView.renderSpinner();
    //0)update results view to mark selected result
    resultsView.update(model.getSearchResultsPage());

    //1) Updating bookmarks view
    bookmarksView.update(model.state.bookmarks);

    //2) Loading recipe
    await model.loadRecipe(id);

    //3) Rendering recipe
    recipeView.render(model.state.recipe);
    //or const recipeView = new recipeView(model.state.recipe)
  } catch (err) {
    recipeView.renderError(`${err}`);
  }
};

const controlSearchResults = async function () {
  try {
    resultsView.renderSpinner();

    //1) Get search query
    const query = searchView.getQuery();
    if (!query) return;

    //2) Load search results

    await model.loadSearchResults(query);

    //3) Render NEW results

    resultsView.render(model.getSearchResultsPage());

    //4) Render NEW initial pagination buttons
    paginationView.render(model.state.search);
  } catch (err) {
    console.log(err);
  }
};

const controlPagination = function (goToPage) {
  //1) Render NEW results

  resultsView.render(model.getSearchResultsPage(goToPage));

  //2) Render NEW initial pagination buttons
  paginationView.render(model.state.search);
};

const controlServings = function (newServings) {
  //update recipe servings (in a state)
  model.updateServings(newServings);

  //update recipe view
  //recipeView.render(model.state.recipe);
  //the diff is that update will only updt txt and attributes in the DOM without having to re-render the entire view
  recipeView.update(model.state.recipe);
};

const controlAddBookmark = function () {
  //1) add/remove bookmarks
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else model.deleteBookmark(model.state.recipe.id);

  //2) update recipe view
  recipeView.update(model.state.recipe);

  //3) render bookmark
  bookmarksView.render(model.state.bookmarks);
};

const controlBookmarks = function () {
  bookmarksView.render(model.state.bookmarks);
};

const controlAddRecipe = async function (newRecipe) {
  try {
    addRecipeView.renderSpinner();

    //upload new recipe data
    await model.uploadRecipe(newRecipe);
    //render recipe
    recipeView.render(model.state.recipe);

    //success message
    addRecipeView.renderMessage();

    //render bookmark view
    bookmarksView.render(model.state.bookmarks); //new recipes are automatically bookmarked

    //change id in url
    window.history.pushState(null, '', `#${model.state.recipe.id}`); //this will allows us change the URL without reloading the page
    //close form
    setTimeout(function () {
      addRecipeView.toggleWindow();
    }, MODAL_CLOSE_SEC * 1000);
  } catch (err) {
    console.log(err);
    addRecipeView.renderError(err.message);
  }
};

//upload new recipe data

const init = function () {
  bookmarksView.addHandlerRender(controlBookmarks);
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerAddBookmark(controlAddBookmark);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
  addRecipeView.addHandlerUpload(controlAddRecipe);
};

init();
