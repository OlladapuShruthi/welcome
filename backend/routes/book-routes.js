const express = require('express');
const multer = require('multer');
const path = require('path');
const {
  getAllBooks,
  getsingleBookId,
  addNewBook,
  updateBook,
  deletebook
} = require('../controllers/book-controllers');

const router = express.Router();

// 📸 Setup multer for image uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../uploads'));
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); // unique filename
  }
});

const upload = multer({ storage: storage });

// ✅ Updated routes
router.get('/get', getAllBooks);
router.get('/get/:id', getsingleBookId);
router.post('/add', upload.single('image'), addNewBook);
router.put('/update/:id', upload.single('image'), updateBook);
router.delete('/delete/:id', deletebook);

module.exports = router;
