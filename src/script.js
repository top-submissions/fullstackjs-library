class Book {
  #id;

  constructor(title, author, pages, genre = "", read = false) {
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
    return this.read ? "Read" : "Unread";
  }

  get statusClass() {
    return this.read ? "status-read" : "status-unread";
  }

  // Methods
  toggleReadStatus() {
    this.read = !this.read;
    return this.read;
  }

  static createFromForm(formData) {
    const title = formData.get("title").trim();
    const author = formData.get("author").trim();
    const pages = parseInt(formData.get("pages"));
    const genre = formData.get("genre").trim();
    const read = formData.get("read") === "on";

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
  const booksContainer = document.getElementById("books-container");

  // Clear container
  booksContainer.innerHTML = "";

  // Check if library empty
  if (myLibrary.isEmpty) {
    booksContainer.innerHTML = `
            <div class="empty-library">
                <i class="fas fa-book-open"></i>
                <h3>Your library is empty</h3>
                <p>Click "Add New Book" to start adding books to your collection!</p>
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
  const bookCard = document.createElement("div");
  bookCard.className = "book-card";
  bookCard.dataset.bookId = book.id;

  bookCard.innerHTML = `
        <div class="book-header">
            <h3 class="book-title">${book.title}</h3>
            <span class="book-status ${book.statusClass}">${
    book.statusText
  }</span>
        </div>
        <p class="book-author">${book.formattedAuthor}</p>
        <div class="book-details">
            <div class="book-detail">
                <span class="book-detail-label">Pages:</span>
                <span class="book-detail-value">${book.pages}</span>
            </div>
            ${
              book.genre
                ? `
            <div class="book-detail">
                <span class="book-detail-label">Genre:</span>
                <span class="book-detail-value">${book.genre}</span>
            </div>
            `
                : ""
            }
        </div>
        <div class="book-actions">
            <button class="btn-success toggle-read-btn" data-book-id="${
              book.id
            }">
                <i class="fas fa-book-reader"></i> ${
                  book.read ? "Mark Unread" : "Mark Read"
                }
            </button>
            <button class="btn-danger remove-btn" data-book-id="${book.id}">
                <i class="fas fa-trash"></i> Remove
            </button>
        </div>
    `;

  return bookCard;
}

// Handle form submission
function handleFormSubmit(event) {
  event.preventDefault();

  // Get form values
  const title = document.getElementById("title").value.trim();
  const author = document.getElementById("author").value.trim();
  const pages = parseInt(document.getElementById("pages").value);
  const genre = document.getElementById("genre").value.trim();
  const read = document.getElementById("read").checked;

  // Validate fields
  if (!title || !author || !pages) {
    alert("Please fill in all required fields (Title, Author, and Pages)");
    return;
  }

  // Add book to library
  addBookToLibrary(title, author, pages, genre, read);

  // Reset form
  document.getElementById("book-form").reset();

  // Close modal
  document.getElementById("book-form-modal").close();

  // Update display
  displayBooks();
}

// Remove book
function handleRemoveBook(event) {
  if (!event.target.closest(".remove-btn")) return;

  const bookId = event.target.closest(".remove-btn").dataset.bookId;

  // Confirm deletion
  if (confirm("Are you sure you want to remove this book from your library?")) {
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
  if (!event.target.closest(".toggle-read-btn")) return;

  const bookId = event.target.closest(".toggle-read-btn").dataset.bookId;

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
  addBookToLibrary("The Hobbit", "J.R.R. Tolkien", 310, "Fantasy", true);
  addBookToLibrary("To Kill a Mockingbird", "Harper Lee", 281, "Fiction", true);
  addBookToLibrary("1984", "George Orwell", 328, "Dystopian", false);
  addBookToLibrary("Pride and Prejudice", "Jane Austen", 432, "Classic", true);

  // Display initial books
  displayBooks();
}
