let cart = [];

//view all books
async function fetchBooks() {
  const res = await fetch("http://localhost:3010/api/books/get");
  const data = await res.json();

  const container = document.getElementById("books-container");
  container.innerHTML = "";

  if (!data.success || data.data.length === 0) {
    container.innerHTML = "<p>No books found.</p>";
    return;
  }

  data.data.forEach((book) => {
    const col = document.createElement("div");
    col.className = "col-md-4 col-sm-6";

    const div = document.createElement("div");
    div.classList.add("book-card");

    div.innerHTML = `
      <img src="http://localhost:3010/uploads/${book.image}" alt="${book.title}" class="book-img">
      <h3>${book.title}</h3>
      <p><strong>Author:</strong> ${book.author}</p>
      <p><strong>Year:</strong> ${book.year}</p>
      <p><strong>Price:</strong> ₹${book.price}</p>

      <button onclick="deleteBook('${book._id}')" class="btn btn-danger btn-sm">🗑 Delete</button>
      <button onclick="window.location.href='updateBook.html?id=${book._id}'" class="btn btn-warning btn-sm">✏️ Update</button>
      <button onclick="addToCart('${book._id}', '${book.title}', ${book.price}, '${book.image}')" class="btn btn-success btn-sm">🛒 Add to Cart</button>
    `;

    col.appendChild(div);
    container.appendChild(col);
  });
}

// Add to cart
function addToCart(id, title, price, image) {
  price = Number(price);
  const existing = cart.find(item => item.id === id);

  if (existing) existing.quantity++;
  else cart.push({ id, title, price, image, quantity: 1 });

  renderCart();
}

// Render Cart
function renderCart() {
  const cartContainer = document.getElementById("cart-container");
  cartContainer.innerHTML = "";

  if (cart.length === 0) {
    cartContainer.innerHTML = "<p>Your cart is empty 🛒</p>";
    return;
  }

  let total = 0;

  cart.forEach((item, index) => {
    const itemTotal = item.price * item.quantity;
    total += itemTotal;

    const div = document.createElement("div");
    div.classList.add("cart-item");

    div.innerHTML = `
      <img src="http://localhost:3010/uploads/${item.image}" class="cart-img">
      <div class="cart-details">
        <h4>${item.title}</h4>
        <p>₹${item.price}</p>
      </div>
      <div class="cart-quantity">
        <button onclick="updateQuantity(${index}, -1)">➖</button>
        <span>${item.quantity}</span>
        <button onclick="updateQuantity(${index}, 1)">➕</button>
      </div>
      <p class="cart-total">₹${itemTotal}</p>
    `;
    cartContainer.appendChild(div);
  });

  const totalDiv = document.createElement("div");
  totalDiv.classList.add("cart-summary");
  totalDiv.innerHTML = `<h3>Total: ₹${total}</h3>`;
  cartContainer.appendChild(totalDiv);
}

// Update quantity
function updateQuantity(index, change) {
  cart[index].quantity += change;
  if (cart[index].quantity <= 0) cart.splice(index, 1);
  renderCart();
}

// Delete book
async function deleteBook(id) {
  if (confirm("Are you sure you want to delete this book?")) {
    const res = await fetch(`http://localhost:3010/api/books/delete/${id}`, {
      method: "DELETE",
    });
    const data = await res.json();
    alert(data.message || "Deleted");
    fetchBooks();
  }
}

fetchBooks();

// ADD BOOK
const addForm = document.getElementById("addBookForm");

if (addForm) {
  addForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("title", title.value);
    formData.append("author", author.value);
    formData.append("year", year.value);
    formData.append("price", price.value);
    formData.append("image", image.files[0]);

    const response = await fetch("http://localhost:3010/api/books/add", {
      method: "POST",
      body: formData,
    });

    const data = await response.json();
    alert(data.message);
    if (data.success)
       window.location.href = "http://127.0.0.1:5500/frontend/index.html";

  });
}

// UPDATE BOOK
const updateForm = document.getElementById("updateBookForm");

if (updateForm) {
  const urlParams = new URLSearchParams(window.location.search);
  const bookId = urlParams.get("id");

  async function loadBook() {
    const res = await fetch(`http://localhost:3010/api/books/get/${bookId}`);
    const result = await res.json();

    if (result.success && result.data) {
      const book = result.data;

      title.value = book.title;
      author.value = book.author;
      year.value = book.year;
      price.value = book.price;

      previewImage.src = `http://localhost:3010/uploads/${book.image}`;
    } else {
      alert("Book not found");
    }
  }

  loadBook();

  updateForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("title", title.value);
    formData.append("author", author.value);
    formData.append("year", year.value);
    formData.append("price", price.value);

    const imgFile = image.files[0];
    if (imgFile) formData.append("image", imgFile);

    const res = await fetch(`http://localhost:3010/api/books/update/${bookId}`, {
      method: "PUT",
      body: formData,
    });

    const result = await res.json();

    if (result.success) {
      alert("Book updated Successfully");
     // window.location.href = "http://127.0.0.1:5500/index.html";

    } else {
      alert("Failed to update");
    }
  });
}
