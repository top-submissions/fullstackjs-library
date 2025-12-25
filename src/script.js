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
    return this.#books.filter((book) => {
      book.author.toLowerCase().includes(author.toLowerCase())
    });
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

