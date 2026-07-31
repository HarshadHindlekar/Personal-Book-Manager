import { Router } from "express";
import { z } from "zod";
import { Book, bookStatuses } from "../models/Book.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();
const statusSchema = z.enum(bookStatuses);
const bookSchema = z.object({
  title: z.string().trim().min(1).max(160),
  author: z.string().trim().min(1).max(120),
  tags: z.array(z.string().trim().min(1).max(30)).max(12).default([]),
  status: statusSchema.default("want_to_read"),
});

router.use(requireAuth);

router.get("/", async (req, res, next) => {
  try {
    const status = req.query.status ? statusSchema.parse(req.query.status) : undefined;
    const tag = typeof req.query.tag === "string" ? req.query.tag.trim().toLowerCase() : undefined;
    const query: Record<string, unknown> = { userId: req.user!.id };
    if (status) query.status = status;
    if (tag) query.tags = tag;

    const books = await Book.find(query).sort({ updatedAt: -1 }).lean();
    res.json({ books });
  } catch (error) {
    next(error);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const data = bookSchema.parse(req.body);
    const book = await Book.create({ ...data, tags: data.tags.map((tag) => tag.toLowerCase()), userId: req.user!.id });
    res.status(201).json({ book });
  } catch (error) {
    next(error);
  }
});

router.patch("/:id", async (req, res, next) => {
  try {
    const data = bookSchema.partial().parse(req.body);
    if (data.tags) data.tags = data.tags.map((tag) => tag.toLowerCase());
    const book = await Book.findOneAndUpdate({ _id: req.params.id, userId: req.user!.id }, data, { new: true, runValidators: true });
    if (!book) {
      res.status(404).json({ message: "Book not found" });
      return;
    }
    res.json({ book });
  } catch (error) {
    next(error);
  }
});

router.delete("/:id", async (req, res, next) => {
  try {
    const result = await Book.deleteOne({ _id: req.params.id, userId: req.user!.id });
    if (!result.deletedCount) {
      res.status(404).json({ message: "Book not found" });
      return;
    }
    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

export default router;
