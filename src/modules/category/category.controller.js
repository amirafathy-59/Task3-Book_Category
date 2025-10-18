import { catchAsyncError } from "../../middleware/catchAsyncError.js";
import { AppError } from "../../utils/AppError.js";
import { ApiFeatures } from "../../utils/ApiFeatures.js";
import { deleteOne } from "../handlers/factor.handler.js";
import { categoryModel } from "../../../DB/models/category.model.js";
import { bookModel } from "../../../DB/models/book.model.js";

// GET /api/categories
export const getAllCategories = async (req, res) => {
  const categories = await categoryModel.find().populate("books");
  res.json(categories);
};

// GET /api/categories/:id
export const getCategoryById = async (req, res) => {
  const Category = await categoryModel.findById(req.params.id).populate("books");
  if (!Category) return res.status(404).json({ message: "Category not found" });
  res.json(Category);
};

// POST /api/categories

export const createCategory = async (req, res) => {
  const { name,description, books } = req.body;

  if (!Array.isArray(books) || books.length === 0) {
    return res
      .status(400)
      .json({ message: "books must be a non-empty array." });
  }

  let totalAmount = 0;
  const updatedbooks = [];

  for (const item of books) {
    // Check if quantity is positive
    if (item.stock <= 0) {
      return res
        .status(400)
        .json({
          message: `stock must be greater than 0 for book ${item.bookId}`,
        });
    }
    const book = await bookModel.findById(item.bookId);
    if (!book) {
      return res
        .status(400)
        .json({ message: `Book not found: ${item.bookId}` });
    }
    //  Validate non-negative stock
    if (item.stock > book.stock) {
      return res.status(400).json({
        message: `Not enough stock for "${book.name}". Requested: ${item.stock}, Available: ${book.stock}`,
      });
    }
    totalAmount += book.price * item.stock;
    updatedbooks.push({
      bookId: book._id,
      stock: item.quantity,
      newStock: book.stock - item.stock,
    });
  }
  const Category = await categoryModel.create({ name,description, books });
  for (const item of updatedbooks) {
    await bookModel.findByIdAndUpdate(item.productId, {
      stock: item.newStock,
    });
  }
  res.status(201).json(Category);
};

// PUT /api/categories/:id
export const updateCategory = async (req, res) => {
  const { name,description, books } = req.body;
  let updatedbooks = [];

  if (!books || !Array.isArray(books) || books.length === 0) {
    return res
      .status(400)
      .json({
        message: "books are required and must be a non-empty array.",
      });
  }

  let totalAmount = 0;

  // Recalculate totalAmount from new product list
  for (const item of books) {
    // Check if quantity is positive
    if (item.stock <= 0) {
      return res
        .status(400)
        .json({
          message: `Quantity must be greater than 0 for product ${item.bookId}`,
        });
    }
    const book = await bookModel.findById(item.bookId);
    if (!book)
      return res
        .status(400)
        .json({ message: `Invalid book ID: ${item.bookId}` });

    //  Validate non-negative stock
    if (item.quantity > product.stock) {
      return res.status(400).json({
        message: `Not enough stock for "${product.name}". Requested: ${item.quantity}, Available: ${product.stock}`,
      });
    }

    totalAmount += product.price * item.quantity;
    
    updatedbooks.push({
      productId: product._id,
      quantity: item.quantity,
      newStock: product.stock - item.quantity,
    });
  }
  const updatedCategory = await categoryModel.findByIdAndUpdate(
    req.params.id,
    { customerId, books, totalAmount },
    { new: true }
  );

  if (!updatedCategory) {
    return res.status(404).json({ message: "Category not found" });
  }

  for (const item of updatedbooks) {
    await productModel.findByIdAndUpdate(item.productId, {
      stock: item.newStock,
    });
  }

  res.status(200).json(updatedCategory);
};

// DELETE /api/categories/:id
export const deleteCategory = deleteOne(categoryModel);
