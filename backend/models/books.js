const mongoose = require('mongoose');

const bookschema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Book title is required"],
    trim: true,
    maxLength: [100, "Book title cannot exceed 100 characters"]
  },
  author: {
    type: String,
    required: [true, "Author name is required"],
    trim: true
  },
  year: {
    type: Number,
    required: [true, "Publication year is required"],
    min: [1000, "Year must be at least 1000"],
    max: [new Date().getFullYear(), "Year cannot be in the future"]
  },
  image: {
    type: String, // stores image filename or path
    default: "default.jpg"
  },
   price: { 
            type: Number, 
            required: true
          } ,// 💰 added price property
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("BOOK", bookschema);
