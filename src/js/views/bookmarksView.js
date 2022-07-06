import View from './View.js';
import previewView from './previewView.js';
import icons from 'url:../../img/icons.svg';

class BookmarksView extends View {
  _parentElement = document.querySelector('.bookmarks__list');
  _errorMessage = 'No bookmarks yet. Find a nice recipe and bookmark it.';
  _message = '';

  addHandlerRender(handler) {
    window.addEventListener('load', handler);
  }
  // _generateMarkup() {
  //   return this._data.map(this._generateMarkupPreview).join('');
  // }

  // _generateMarkupPreview(result) {
  //   const id = window.location.hash.slice(1);
  //   return `<li class="preview">
  //   <a class="preview__link ${
  //     result.id === id ? 'preview__link--active' : ''
  //   }" href="#${result.id}">
  //     <figure class="preview  __fig">
  //       <img src="${result.image}" alt="${result.title}" />
  //     </figure>
  //     <div class="preview__data">
  //       <h4 class="preview__title">${result.title}</h4>
  //       <p class="preview__publisher">${result.publisher}</p>
  //     </div>
  //   </a>
  // </li>`;
  // }

  _generateMarkup() {
    return this._data
      .map(bookmark => previewView.render(bookmark, false))
      .join('');
    //with map with get an array of strings and then we join them with .join(), resulting in a big string with all the markup we wanna render
  }
}

export default new BookmarksView();
