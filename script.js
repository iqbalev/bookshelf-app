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
  textAuthor.innerText = `Penulis: ${author}`;

  const textYear = document.createElement("p");
  textYear.innerText = `Tahun: ${year}`;

  const actionContainer = document.createElement("div");
  actionContainer.classList.add("action");

  const container = document.createElement("article");
  container.classList.add("book_item");
  container.append(textTitle, textAuthor, textYear, actionContainer);

  // Jika buku selesai dibaca, tambahkan button "Belum Selesai Dibaca" & "Hapus Buku"
  if (isComplete) {
    const unfinishedButton = document.createElement("button");
    unfinishedButton.classList.add("blue");
    unfinishedButton.textContent = "Belum Selesai Dibaca";
    unfinishedButton.addEventListener("click", function () {
      moveToUnfinishedBookshelf(id);
    });

    const removeButton = document.createElement("button");
    removeButton.classList.add("red");
    removeButton.textContent = "Hapus Buku";
    removeButton.addEventListener("click", function () {
      if (confirm("Apakah Anda yakin ingin menghapus buku ini dari rak?")) {
        removeBook(id);
      }
    });

    actionContainer.append(unfinishedButton, removeButton);

    // Jika buku belum selesai dibaca, tambahkan button "Selesai Dibaca" & "Hapus Buku"
  } else {
    const finishedButton = document.createElement("button");
    finishedButton.classList.add("blue");
    finishedButton.textContent = "Selesai Dibaca";
    finishedButton.addEventListener("click", function () {
      moveToFinishedBookshelf(id);
    });

    const removeButton = document.createElement("button");
    removeButton.classList.add("red");
    removeButton.textContent = "Hapus Buku";
    removeButton.addEventListener("click", function () {
      if (confirm("Apakah Anda yakin ingin menghapus buku ini dari rak?")) {
        removeBook(id);
      }
    });

    actionContainer.append(finishedButton, removeButton);
  }
  return container;
}

// Fitur untuk menambahkan buku ke dalam rak
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

// Fitur untuk mencari buku di rak
function searchForBook() {
  const searchBookTitle = document
    .getElementById("searchBookTitle")
    .value.toLowerCase();

  const filteredResult = bookshelf.filter((book) =>
    book.title.toLowerCase().includes(searchBookTitle)
  );

  document.dispatchEvent(
    new CustomEvent(RENDER_EVENT, { detail: filteredResult })
  );
}

// Fitur untuk memindahkan buku ke rak "Selesai Dibaca"
function moveToFinishedBookshelf(bookshelfId) {
  const bookshelfTarget = findBookshelf(bookshelfId);

  if (bookshelfTarget == null) return;

  bookshelfTarget.isComplete = true;
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

// Fitur untuk memindahkan buku ke rak "Belum Selesai Dibaca"
function moveToUnfinishedBookshelf(bookshelfId) {
  const bookshelfTarget = findBookshelf(bookshelfId);

  if (bookshelfTarget == null) return;

  bookshelfTarget.isComplete = false;
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

// Fitur untuk menghapus buku dari rak "Selesai Dibaca" & "Belum Selesai Dibaca"
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

  const searchForm = document.getElementById("searchBook");

  searchForm.addEventListener("submit", function (event) {
    event.preventDefault();
    searchForBook();
  });

  if (isStorageExist()) {
    loadDataFromStorage();
  }
});

document.addEventListener(SAVED_EVENT, () => {
  console.log("Data berhasil disimpan.");
});

document.addEventListener(RENDER_EVENT, function (event) {
  const unfinishedBook = document.getElementById("incompleteBookshelfList");
  const finishedBook = document.getElementById("completeBookshelfList");

  unfinishedBook.innerHTML = "";
  finishedBook.innerHTML = "";

  let booksToRender = bookshelf;
  if (event.detail) {
    booksToRender = event.detail;
  }

  for (const bookshelfItem of booksToRender) {
    const bookshelfElement = createBookshelf(bookshelfItem);
    if (bookshelfItem.isComplete) {
      finishedBook.append(bookshelfElement);
    } else {
      unfinishedBook.append(bookshelfElement);
    }
  }
});
