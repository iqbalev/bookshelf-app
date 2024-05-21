/*
    {
        id: string | number / 3657848524,
        title: string / 'Harry Potter and the Philosopher\'s Stone',
        author: string / 'J.K Rowling',
        year: number / 1997,
        isComplete: boolean / false,
    }
*/

// Membuat array kosong untuk menyimpan semua tugas
const bookshelf = [];
const RENDER_EVENT = "render-bookshelf";
const SAVED_EVENT = "saved-bookshelf";
const STORAGE_KEY = "BOOKSHELF_APP";

// Membuat ID secara random
function generateId() {
  return +new Date();
}

// Membuat data buku yang disimpan ke dalam object
function generateBookshelfObject(id, title, author, year, isComplete) {
  return {
    id,
    title,
    author,
    year,
    isComplete,
  };
}

function findBookshelf(bookshelfId) {
  for (const bookshelfItem of bookshelf) {
    if (bookshelfItem.id === bookshelfId) {
      return bookshelfItem;
    }
  }
  return null;
}

function findBookshelfIndex(bookshelfId) {
  for (const index in bookshelf) {
    if (bookshelf[index].id === bookshelfId) {
      return index;
    }
  }
  return -1;
}

function isStorageExist() {
  if (typeof Storage === undefined) {
    alert("Browser kamu tidak mendukung local storage");
    return false;
  }
  return true;
}

function saveData() {
  if (isStorageExist()) {
    const parsed = JSON.stringify(bookshelf);
    localStorage.setItem(STORAGE_KEY, parsed);
    document.dispatchEvent(new Event(SAVED_EVENT));
  }
}

function loadDataFromStorage() {
  const serializedData = localStorage.getItem(STORAGE_KEY);
  let data = JSON.parse(serializedData);

  if (data !== null) {
    for (const shelf of data) {
      bookshelf.push(shelf);
    }
  }
  document.dispatchEvent(new Event(RENDER_EVENT));
}

// Membuat elemen HTML berdasarkan tugas yang diberikan
function createBookshelf(bookshelfObject) {
  const { id, title, author, year, isComplete } = bookshelfObject;

  const textTitle = document.createElement("h3");
  textTitle.innerText = title;

  const textAuthor = document.createElement("p");
  textAuthor.innerText = author;

  const textYear = document.createElement("p");
  textYear.innerText = year;

  const textContainer = document.createElement("div");
  textContainer.classList.add("action");
  textContainer.append(textTitle, textAuthor, textYear);

  const container = document.createElement("article");
  container.classList.add("book_item");
  container.append(textContainer);

  // Jika selesai dibaca, tambahkan button remove
  if (isComplete) {
    const unfinishedButton = document.createElement("button");
    unfinishedButton.classList.add("green");
    unfinishedButton.textContent = "Belum Selesai Dibaca";
    unfinishedButton.addEventListener("click", function () {
      moveToUnfinishedBookshelf(id);
    });

    const removeButton = document.createElement("button");
    removeButton.classList.add("red");
    removeButton.textContent = "Hapus Buku";
    removeButton.addEventListener("click", function () {
      removeBook(id);
    });

    container.append(unfinishedButton, removeButton);

    // Jika belum selesai dibaca, tambahkan button finish
  } else {
    const finishedButton = document.createElement("button");
    finishedButton.classList.add("green");
    finishedButton.textContent = "Selesai Dibaca";
    finishedButton.addEventListener("click", function () {
      moveToFinishedBookshelf(id);
    });

    const removeButton = document.createElement("button");
    removeButton.classList.add("red");
    removeButton.textContent = "Hapus Buku";
    removeButton.addEventListener("click", function () {
      removeBook(id);
    });

    container.append(finishedButton, removeButton);
  }
  return container;
}

//  Membuat function untuk menambah buku ke dalam shelf
function addBook() {
  const bookTitleUserInput = document.getElementById("inputBookTitle").value;
  const bookAuthorUserInput = document.getElementById("inputBookAuthor").value;
  const bookYearUserInput = document.getElementById("inputBookYear").value;
  const isUserFinishedReadingTheBook = document.getElementById(
    "inputBookIsComplete"
  ).checked;

  const generatedId = generateId();
  const bookshelfObject = generateBookshelfObject(
    generatedId,
    bookTitleUserInput,
    bookAuthorUserInput,
    bookYearUserInput,
    isUserFinishedReadingTheBook
  );
  bookshelf.push(bookshelfObject);

  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

// Membuat function untuk menambah buku ke bagian sudah selesai dibaca
function moveToFinishedBookshelf(bookshelfId) {
  const bookshelfTarget = findBookshelf(bookshelfId);

  if (bookshelfTarget == null) return;

  bookshelfTarget.isComplete = true;
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function moveToUnfinishedBookshelf(bookshelfId) {
  const bookshelfTarget = findBookshelf(bookshelfId);

  if (bookshelfTarget == null) return;

  bookshelfTarget.isComplete = false;
  document.dispatchEvent(new Event(RENDER_EVENT));
}

function removeBook(bookshelfId) {
  const bookshelfTarget = findBookshelfIndex(bookshelfId);

  if (bookshelfTarget === -1) return;

  bookshelf.splice(bookshelfTarget, 1);
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

document.addEventListener("DOMContentLoaded", function () {
  const submitForm = document.getElementById("inputBook");

  submitForm.addEventListener("submit", function (event) {
    event.preventDefault();
    addBook();
  });

  if (isStorageExist()) {
    loadDataFromStorage();
  }
});

document.addEventListener(SAVED_EVENT, () => {
  console.log("Data berhasil disimpan.");
});

document.addEventListener(RENDER_EVENT, function () {
  const unfinishedBook = document.getElementById("incompleteBookshelfList");
  const finishedBook = document.getElementById("completeBookshelfList");

  unfinishedBook.innerHTML = "";
  finishedBook.innerHTML = "";

  for (const bookshelfItem of bookshelf) {
    const bookshelfElement = createBookshelf(bookshelfItem);
    if (bookshelfItem.isComplete) {
      finishedBook.append(bookshelfElement);
    } else {
      unfinishedBook.append(bookshelfElement);
    }
  }
});
