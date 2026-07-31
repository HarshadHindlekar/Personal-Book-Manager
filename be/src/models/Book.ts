import { InferSchemaType, model, models, Schema } from "mongoose";
import { BOOK_STATUSES } from "../constants/books.js";

export const bookStatuses = BOOK_STATUSES;
export type BookStatus = (typeof BOOK_STATUSES)[number];

const bookSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    title: { type: String, required: true, trim: true, maxlength: 160 },
    author: { type: String, required: true, trim: true, maxlength: 120 },
    tags: { type: [String], default: [] },
    status: { type: String, enum: BOOK_STATUSES, default: "want_to_read" },
  },
  { timestamps: true },
);

bookSchema.index({ userId: 1, status: 1 });
bookSchema.index({ userId: 1, tags: 1 });

export type BookDocument = InferSchemaType<typeof bookSchema>;
export const Book = models.Book || model("Book", bookSchema);
