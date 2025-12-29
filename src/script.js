class Book {
  #id;

  constructor(title, author, pages, genre = '', read = false) {
    this.#id = crypto.randomUUID();
    this.title = title;
    this.author = author;
    this.pages = pages;
    this.genre = genre;
    this.read = read;
  }

  // Getters
  get id() {
    return this.#id;
  }

  get formattedAuthor() {
    return `By ${this.author}`;
  }

  get statusText() {
    return this.read ? 'Read' : 'Unread';
  }

  get statusClass() {
    return this.read ? 'status-read' : 'status-unread';
  }

  // Methods
  toggleReadStatus() {
    this.read = !this.read;
    return this.read;
  }

  static createFromForm(formData) {
    const title = formData.get('title').trim();
    const author = formData.get('author').trim();
    const pages = parseInt(formData.get('pages'));
    const genre = formData.get('genre').trim();
    const read = formData.get('read') === 'on';

    return new Book(title, author, pages, genre, read);
  }
}

class Library {
  #books = [];

  constructor() {
    this.#books = [];
  }

  // Getters
  get bookCount() {
    return this.#books.length;
  }

  get isEmpty() {
    return this.#books.length === 0;
  }

  get books() {
    return [...this.#books];
  }

  // Methods
  addBook(book) {
    this.#books.push(book);
    return book;
  }

  removeBook(bookId) {
    const initialLength = this.#books.length;
    this.#books = this.#books.filter((book) => book.id !== bookId);
    return this.#books.length < initialLength;
  }

  findBookById(bookId) {
    return this.#books.find((book) => book.id === bookId);
  }

  getBooksByAuthor(author) {
    return this.#books.filter((book) =>
      book.author.toLowerCase().includes(author.toLowerCase())
    );
  }

  get readBooks() {
    return this.#books.filter((book) => book.read);
  }

  get unreadBooks() {
    return this.#books.filter((book) => !book.read);
  }

  get totalPages() {
    return this.#books.reduce((total, book) => total + book.pages, 0);
  }

  clear() {
    this.#books = [];
  }
}

/*==========
 ** Application State and Functions
 **/
const myLibrary = new Library();

// Add new book to library
function addBookToLibrary(title, author, pages, genre, read) {
  const newBook = new Book(title, author, pages, genre, read);
  myLibrary.addBook(newBook);
  return newBook;
}

// Display all books
function displayBooks() {
  const booksContainer = document.getElementById('books-container');

  // Clear container
  booksContainer.innerHTML = '';

  // Check if library empty
  if (myLibrary.isEmpty) {
    booksContainer.innerHTML = `
            <div class='empty-library'>
                <i class='fas fa-book-open'></i>
                <h3>Your library is empty</h3>
                <p>Click 'Add New Book' to start adding books to your collection!</p>
            </div>
        `;
    return;
  }

  // Create and append cards to library
  myLibrary.books.forEach((book) => {
    const bookCard = createBookCard(book);
    booksContainer.appendChild(bookCard);
  });
}

// Create book card element
function createBookCard(book) {
  const bookCard = document.createElement('div');
  bookCard.className = 'book-card';
  bookCard.dataset.bookId = book.id;

  bookCard.innerHTML = `
        <div class='book-header'>
            <h3 class='book-title'>${book.title}</h3>
            <span class='book-status ${book.statusClass}'>${
    book.statusText
  }</span>
        </div>
        <p class='book-author'>${book.formattedAuthor}</p>
        <div class='book-details'>
            <div class='book-detail'>
                <span class='book-detail-label'>Pages:</span>
                <span class='book-detail-value'>${book.pages}</span>
            </div>
            ${
              book.genre
                ? `
            <div class='book-detail'>
                <span class='book-detail-label'>Genre:</span>
                <span class='book-detail-value'>${book.genre}</span>
            </div>
            `
                : ''
            }
        </div>
        <div class='book-actions'>
            <button class='btn-success toggle-read-btn' data-book-id='${
              book.id
            }'>
                <i class='fas fa-book-reader'></i> ${
                  book.read ? 'Mark Unread' : 'Mark Read'
                }
            </button>
            <button class='btn-danger remove-btn' data-book-id='${book.id}'>
                <i class='fas fa-trash'></i> Remove
            </button>
        </div>
    `;

  return bookCard;
}

/*==========
 ** Form Validation Functions
 **/

// Get custom error message based on validity state
function getErrorMessage(input) {
  const validity = input.validity;
  const fieldName =
    input.labels[0]?.textContent.replace(' *', '') || input.name;

  if (validity.valueMissing) {
    return `The ${fieldName.toLowerCase()} must be filled!`;
  }

  if (validity.typeMismatch) {
    return `Please enter a valid ${fieldName.toLowerCase()}.`;
  }

  if (validity.tooShort) {
    return `${fieldName} must be at least ${input.minLength} characters long.`;
  }

  if (validity.tooLong) {
    return `${fieldName} must be no more than ${input.maxLength} characters long.`;
  }

  if (validity.rangeUnderflow) {
    return `${fieldName} must be at least ${input.min}.`;
  }

  if (validity.rangeOverflow) {
    return `${fieldName} must be no more than ${input.max}.`;
  }

  if (validity.patternMismatch) {
    return `Please match the requested format for ${fieldName.toLowerCase()}.`;
  }

  return 'Please fill out this field correctly.';
}

// Show error message for a field
function showError(input) {
  const formGroup = input.closest('.form-group');
  let errorSpan = formGroup.querySelector('.error-message');

  // Create error span if it doesn't exist
  if (!errorSpan) {
    errorSpan = document.createElement('span');
    errorSpan.className = 'error-message';
    errorSpan.setAttribute('aria-live', 'polite');
    formGroup.appendChild(errorSpan);
  }

  // Set error message
  errorSpan.textContent = getErrorMessage(input);

  // Add error class to input
  input.classList.add('input-error');
  input.classList.remove('input-valid');
}

// Clear error message for a field
function clearError(input) {
  const formGroup = input.closest('.form-group');
  const errorSpan = formGroup.querySelector('.error-message');

  if (errorSpan) {
    errorSpan.textContent = '';
  }

  // Remove error class and add valid class
  input.classList.remove('input-error');
  input.classList.add('input-valid');
}

// Validate a single input field
function validateField(input) {
  // Check if field is valid using Constraint Validation API
  if (!input.validity.valid) {
    showError(input);
    return false;
  } else {
    clearError(input);
    return true;
  }
}

// Validate entire form
function validateForm() {
  const form = document.getElementById('book-form');
  const inputs = form.querySelectorAll('input[required]');
  let isValid = true;

  inputs.forEach((input) => {
    if (!validateField(input)) {
      isValid = false;
    }
  });

  return isValid;
}

// Handle form submission
function handleFormSubmit(event) {
  event.preventDefault();

  // Validate all fields before submitting
  if (!validateForm()) {
    return; // Stop submission if validation fails
  }

  // Get form values
  const title = document.getElementById('title').value.trim();
  const author = document.getElementById('author').value.trim();
  const pages = parseInt(document.getElementById('pages').value);
  const genre = document.getElementById('genre').value.trim();
  const read = document.getElementById('read').checked;

  // Add book to library
  addBookToLibrary(title, author, pages, genre, read);

  // Reset form and clear all validation states
  const form = document.getElementById('book-form');
  form.reset();

  // Clear all validation classes and error messages
  const inputs = form.querySelectorAll('input');
  inputs.forEach((input) => {
    input.classList.remove('input-error', 'input-valid');
    const formGroup = input.closest('.form-group');
    const errorSpan = formGroup?.querySelector('.error-message');
    if (errorSpan) {
      errorSpan.textContent = '';
    }
  });

  // Close modal
  document.getElementById('book-form-modal').close();

  // Update display
  displayBooks();
}

// Remove book
function handleRemoveBook(event) {
  if (!event.target.closest('.remove-btn')) return;

  const bookId = event.target.closest('.remove-btn').dataset.bookId;

  // Confirm deletion
  if (confirm('Are you sure you want to remove this book from your library?')) {
    // Remove book using Library class method
    const removed = myLibrary.removeBook(bookId);

    if (removed) {
      // Update display
      displayBooks();
    }
  }
}

// Handle toggle read
function handleToggleReadStatus(event) {
  if (!event.target.closest('.toggle-read-btn')) return;

  const bookId = event.target.closest('.toggle-read-btn').dataset.bookId;

  // Find book in library using Library class method
  const book = myLibrary.findBookById(bookId);

  if (book) {
    // Toggle read using Book class method
    book.toggleReadStatus();

    // Update display
    displayBooks();
  }
}

// Add sample books
function initializeSampleBooks() {
  // Add sample books to library
  addBookToLibrary('The Hobbit', 'J.R.R. Tolkien', 310, 'Fantasy', true);
  addBookToLibrary('To Kill a Mockingbird', 'Harper Lee', 281, 'Fiction', true);
  addBookToLibrary('1984', 'George Orwell', 328, 'Dystopian', false);
  addBookToLibrary('Pride and Prejudice', 'Jane Austen', 432, 'Classic', true);

  // Display initial books
  displayBooks();
}

/*=================
 ** Event Listeners
 **/

// DOM Content Loaded
document.addEventListener('DOMContentLoaded', () => {
  // Get DOM elements
  const newBookBtn = document.getElementById('new-book-btn');
  const bookFormModal = document.getElementById('book-form-modal');
  const closeModalBtn = document.getElementById('close-modal');
  const cancelFormBtn = document.getElementById('cancel-form');
  const bookForm = document.getElementById('book-form');
  const booksContainer = document.getElementById('books-container');

  // Disable browser's default validation
  bookForm.noValidate = true;

  /*=================
   ** Modal Event Listeners
   **/

  // Add New Book button clicked
  newBookBtn.addEventListener('click', () => {
    bookFormModal.showModal();
  });

  // Close button clicked
  closeModalBtn.addEventListener('click', () => {
    bookFormModal.close();
  });

  // Cancel button clicked
  cancelFormBtn.addEventListener('click', () => {
    bookFormModal.close();
  });

  // Click outside of modal
  bookFormModal.addEventListener('click', (event) => {
    if (event.target === bookFormModal) {
      bookFormModal.close();
    }
  });

  /*=================
   ** Form Validation Event Listeners
   **/

  // Add validation listeners to all required inputs
  const requiredInputs = bookForm.querySelectorAll('input[required]');

  requiredInputs.forEach((input) => {
    // Validate on blur (when user leaves the field)
    input.addEventListener('blur', () => {
      if (input.value.trim() !== '') {
        validateField(input);
      }
    });

    // Validate on input (as user types) - only if field was previously invalid
    input.addEventListener('input', () => {
      if (input.classList.contains('input-error')) {
        validateField(input);
      }
    });
  });

  // Handle form submission
  bookForm.addEventListener('submit', handleFormSubmit);

  // Handle remove book
  booksContainer.addEventListener('click', handleRemoveBook);

  // Handle toggle read
  booksContainer.addEventListener('click', handleToggleReadStatus);

  // Add sample books
  initializeSampleBooks();
});
