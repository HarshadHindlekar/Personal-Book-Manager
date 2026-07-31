import { Types } from "mongoose";
import { Book } from "../models/Book.js";
import type { BookStatus } from "../constants/books.js";
import { AppError } from "../errors/AppError.js";

type BookData = {
  title: string;
  author: string;
  tags: string[];
  status: BookStatus;
};

export async function listBooks(userId: Types.ObjectId, filters: { status?: BookStatus; tag?: string }) {
  const query: Record<string, unknown> = { userId };
  if (filters.status) query.status = filters.status;
  if (filters.tag) query.tags = filters.tag;
  return Book.find(query).sort({ updatedAt: -1 }).lean();
}

export async function createBook(userId: Types.ObjectId, data: BookData) {
  return Book.create({ ...data, tags: data.tags.map((tag) => tag.toLowerCase()), userId });
}

export async function updateBook(userId: Types.ObjectId, bookId: string, data: Partial<BookData>) {
  const normalizedData = data.tags ? { ...data, tags: data.tags.map((tag) => tag.toLowerCase()) } : data;
  const book = await Book.findOneAndUpdate({ _id: bookId, userId }, normalizedData, { new: true, runValidators: true });
  if (!book) {
    throw new AppError("Book not found", 404);
  }
  return book;
}

export async function deleteBook(userId: Types.ObjectId, bookId: string) {
  const result = await Book.deleteOne({ _id: bookId, userId });
  if (!result.deletedCount) {
    throw new AppError("Book not found", 404);
  }
}
