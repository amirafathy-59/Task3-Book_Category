import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
  name: { type: String, required: [true, "Category name is required"] },
  description: { type: String, required: [true, "Category description is required"] },
  books: [
        {
          bookId: { type: mongoose.Schema.Types.ObjectId, ref: "book" },
          stock: { type: Number, required: true, min: 1 },
        },
      ],
});

export const categoryModel = mongoose.model("category", categorySchema);
