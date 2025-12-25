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
