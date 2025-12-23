const myLibrary = [];

function Book(title, author, pages, genre = "", read = false) {
  this.id = crypto.randomUUID();
  this.title = title;
  this.author = author;
  this.pages = pages;
  this.genre = genre;
  this.read = read;
}

/*==========
 ** Functions
 **/

// Toggle read status
Book.prototype.toggleReadStatus = function () {
  this.read = !this.read;
  return this.read;
};

// Add new book to library
function addBookToLibrary(title, author, pages, genre, read) {
  const newBook = new Book(title, author, pages, genre, read);
  myLibrary.push(newBook);
  return newBook;
}

// Remove book from library
function removeBookFromLibrary(bookId) {
  const bookIndex = myLibrary.findIndex((book) => book.id === bookId);
  if (bookIndex !== -1) {
    myLibrary.splice(bookIndex, 1);
    return true;
  }
  return false;
}

// Display all books
function displayBooks() {
  const booksContainer = document.getElementById("books-container");

  // Clear container
  booksContainer.innerHTML = "";

  // Check if library empty
  if (myLibrary.length === 0) {
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
  myLibrary.forEach((book) => {
    const bookCard = createBookCard(book);
    booksContainer.appendChild(bookCard);
  });
}

// Create book card element
function createBookCard(book) {
  const bookCard = document.createElement("div");
  bookCard.className = "book-card";
  bookCard.dataset.bookId = book.id;

  // Add status text and class
  const statusText = book.read ? "Read" : "Unread";
  const statusClass = book.read ? "status-read" : "status-unread";

  bookCard.innerHTML = `
        <div class="book-header">
            <h3 class="book-title">${book.title}</h3>
            <span class="book-status ${statusClass}">${statusText}</span>
        </div>
        <p class="book-author">By ${book.author}</p>
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
    // Remove book
    const removed = removeBookFromLibrary(bookId);

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

  // Find book in library
  const book = myLibrary.find((book) => book.id === bookId);

  if (book) {
    // Toggle read
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
