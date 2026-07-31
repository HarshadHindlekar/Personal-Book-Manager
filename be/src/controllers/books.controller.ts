import type { Request, Response } from "express";
import { bookIdSchema, bookQuerySchema, bookSchema, bookUpdateSchema } from "../schemas/books.js";
import { createBook, deleteBook, listBooks, updateBook } from "../services/book.service.js";

export async function list(req: Request, res: Response) {
  const filters = bookQuerySchema.parse(req.query);
  const books = await listBooks(req.user!.id, filters);
  res.json({ books });
}

export async function create(req: Request, res: Response) {
  const book = await createBook(req.user!.id, bookSchema.parse(req.body));
  res.status(201).json({ book });
}

export async function update(req: Request, res: Response) {
  const { id } = bookIdSchema.parse(req.params);
  const book = await updateBook(req.user!.id, id, bookUpdateSchema.parse(req.body));
  res.json({ book });
}

export async function remove(req: Request, res: Response) {
  const { id } = bookIdSchema.parse(req.params);
  await deleteBook(req.user!.id, id);
  res.status(204).send();
}
