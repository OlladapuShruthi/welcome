const Book = require('../models/books');

// 📚 Get all books
exports.getAllBooks = async (req, res) => {
  try {
    const books = await Book.find();
    res.json({ success: true, data: books });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// 📘 Get single book by ID
exports.getsingleBookId = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ success: false, message: 'Book not found' });
    res.json({ success: true, data: book });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ➕ Add new book
exports.addNewBook = async (req, res) => {
  try {
    const { title, author, year, price } = req.body;
    const image = req.file ? req.file.filename : '';

    const newBook = new Book({
      title,
      author,
      year,
      price,
      image
    });

    await newBook.save();
    res.status(201).json({ success: true, message: 'Book added successfully', data: newBook });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ✏️ Update book
exports.updateBook = async (req, res) => {
  try {
    const { title, author, year, price } = req.body;
    const updateData = { title, author, year, price };

    if (req.file) {
      updateData.image = req.file.filename;
    }

    const updatedBook = await Book.findByIdAndUpdate(req.params.id, updateData, { new: true });
    if (!updatedBook) return res.status(404).json({ success: false, message: 'Book not found' });

    res.json({ success: true, message: 'Book updated successfully', data: updatedBook });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// 🗑️ Delete book
exports.deletebook = async (req, res) => {
  try {
    const deletedBook = await Book.findByIdAndDelete(req.params.id);
    if (!deletedBook) return res.status(404).json({ success: false, message: 'Book not found' });
    res.json({ success: true, message: 'Book deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
