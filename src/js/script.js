{
  'use strict';

  const select = {
    templateOf: {
      menuBooks: '#template-book',
    },
    containerOf: {
      listOfBooks: '.books-list',
      formOfFilters: '.filters',
    },
    coverImage: '.book__image',
  };

  const classNames = {
    favoriteBook: 'favorite',
    hiddenBook: 'hidden',
  };

  const templates = {
    booksTemplate: Handlebars.compile(document.querySelector(select.templateOf.menuBooks).innerHTML),
  };

  class BooksList{
    constructor(){
      const thisBooksList = this;

      thisBooksList.initData();
      thisBooksList.getElements();
      thisBooksList.renderBooks();
      thisBooksList.initActions();
      thisBooksList.determineRatingBgc();
    }

    initData(){
      const thisBooksList = this;
      thisBooksList.data = dataSource.books;
    }

    getElements() {
      const thisBooksList = this;
      thisBooksList.booksList = document.querySelector(select.containerOf.listOfBooks);
      thisBooksList.filtersForm = document.querySelector(select.containerOf.formOfFilters);
      thisBooksList.favoriteBooks = [];
      thisBooksList.filters = [];
    }

    renderBooks() {
      const thisBooksList = this;
      for(let book of thisBooksList.data){
        const ratingWidth = book.rating;
        book.ratingWidth = ratingWidth * 10;
        book.ratingBgc = thisBooksList.determineRatingBgc(ratingWidth);
        const generatedHTML = templates.booksTemplate(book);
        const element = utils.createDOMFromHTML(generatedHTML);
        thisBooksList.booksList.appendChild(element);
      }
    }

    initActions() {
      const thisBooksList = this;
      thisBooksList.booksList.addEventListener('dblclick', function(event) {
        event.preventDefault();
        const clickedCover = event.target.offsetParent;
        const bookID = clickedCover.getAttribute('data-id');
        if(!thisBooksList.favoriteBooks.includes(bookID)){
          clickedCover.classList.add(classNames.favoriteBook);
          thisBooksList.favoriteBooks.push(bookID);
        } else {
          clickedCover.classList.remove(classNames.favoriteBook);
          const index = thisBooksList.favoriteBooks.indexOf(bookID);
          thisBooksList.favoriteBooks.splice(index,1);
        }
      });

      thisBooksList.filtersForm.addEventListener('click', function(event){
        if(event.target.type === 'checkbox' && event.target.checked){
          thisBooksList.filters.push(event.target.value);
        } else {
          const valueIndex = thisBooksList.filters.indexOf(event.target.value);
          thisBooksList.filters.splice(valueIndex,1);
        }
        thisBooksList.filterBooks();
      });
    }

    filterBooks() {
      const thisBooksList = this;
      const covers = document.querySelectorAll(select.coverImage);
      for (const cover of covers) {
        const bookID = parseInt(cover.getAttribute('data-id'))-1;
        const book = thisBooksList.data[bookID];
        let shouldBeHidden = false;
        for(const filter of thisBooksList.filters){
          if (book.details[filter]){
            shouldBeHidden = true;
            break;
          }
        }

        if (shouldBeHidden){
          cover.classList.add(classNames.hiddenBook);
        } else {
          cover.classList.remove(classNames.hiddenBook);
        }
      }
    }

    determineRatingBgc(rating) {
      let bgc = '';
      if(rating < 6) {
        bgc = 'linear-gradient(to bottom,  #fefcea 0%, #f1da36 100%);';
      } else if(rating > 6 && rating <= 8) {
        bgc = 'linear-gradient(to bottom, #b4df5b 0%,#b4df5b 100%);';
      } else if(rating > 8 && rating <= 9) {
        bgc = 'linear-gradient(to bottom, #299a0b 0%, #299a0b 100%);';
      } else {
        bgc = 'linear-gradient(to bottom, #ff0084 0%,#ff0084 100%);';
      }
      return bgc;
    }
  }

  const app = {
    run: function(){
      new BooksList();
    }
  };

  app.run();
}
