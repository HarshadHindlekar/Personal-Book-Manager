import { InferSchemaType, model, models, Schema } from "mongoose";

export const bookStatuses = ["want_to_read", "reading", "completed"] as const;
export type BookStatus = (typeof bookStatuses)[number];

const bookSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    title: { type: String, required: true, trim: true, maxlength: 160 },
    author: { type: String, required: true, trim: true, maxlength: 120 },
    tags: { type: [String], default: [] },
    status: { type: String, enum: bookStatuses, default: "want_to_read" },
  },
  { timestamps: true },
);

bookSchema.index({ userId: 1, status: 1 });
bookSchema.index({ userId: 1, tags: 1 });

export type BookDocument = InferSchemaType<typeof bookSchema>;
export const Book = models.Book || model("Book", bookSchema);
