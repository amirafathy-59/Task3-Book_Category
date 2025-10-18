


import mongoose from "mongoose";

const bookSchema = new mongoose.Schema({
  name: { type: String, required: [true, "Book name is required"] },
  description: { type: String, required: [true, "Book description is required"] },
  price: {
    type: Number,
    required: true,
    min: [0, "Price must be non-negative"]
  },
  stock: {
    type: Number,
    required: true,
    min: [0, "Stock must be non-negative"]
  },
  author: { type: String, required: true },
  categoryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "category",
    required: true
  }
});

export const bookModel = mongoose.model("book", bookSchema);
