import type { BookStatus } from "../types";

export const BOOK_STATUS_LABELS: Record<BookStatus, string> = {
  want_to_read: "Want to read",
  reading: "Reading",
  completed: "Completed",
};

export const BOOK_STATUSES: Array<BookStatus | "all"> = ["all", "want_to_read", "reading", "completed"];
