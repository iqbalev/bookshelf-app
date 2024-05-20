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
  container.classList.add("book-item");
  container.append(textContainer);

  // Jika selesai dibaca, tambahkan button remove
  if (isComplete) {
    const removeButton = document.createElement("button");
    removeButton.classList.add("red");
    removeButton.textContent = "Hapus Buku";
    removeButton.addEventListener("click", function () {
      removeFromCompleteBookshelf(id);
    });

    container.append(removeButton);

    // Jika belum selesai dibaca, tambahkan button finish
  } else {
    const finishButton = document.createElement("button");
    finishButton.classList.add("green");
    finishButton.textContent = "Selesai Dibaca";
    finishButton.addEventListener("click", function () {
      addToCompleteBookshelf(id);
    });

    container.append(finishButton);
  }
  return container;
}

//  Membuat function untuk menambah buku ke dalam shelf
function addBook() {
  const bookTitleUserInput = document.getElementById("inputBookTitle").value;
  const bookAuthorUserInput = document.getElementById("inputBookAuthor").value;
  const bookYearUserInput = document.getElementById("inputBookYear").value;

  const generatedId = generateId();
  const bookshelfObject = generateBookshelfObject(
    generatedId,
    bookTitleUserInput,
    bookAuthorUserInput,
    bookYearUserInput,
    false
  );
  bookshelf.push(bookshelfObject);
}
