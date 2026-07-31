export type BookStatus = "want_to_read" | "reading" | "completed";

export type User = { id: string; name: string; email: string };

export type Book = {
  _id: string;
  title: string;
  author: string;
  tags: string[];
  status: BookStatus;
  createdAt: string;
  updatedAt: string;
};
