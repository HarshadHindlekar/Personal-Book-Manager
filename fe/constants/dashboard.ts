import type { BookStatus } from "../types";

export const BOOK_STATUS_LABELS: Record<BookStatus, string> = {
  want_to_read: "Want to read",
  reading: "Reading",
  completed: "Completed",
};

export const BOOK_STATUSES: Array<BookStatus | "all"> = ["all", "want_to_read", "reading", "completed"];

export const BOOK_STATUS_STYLES: Record<BookStatus, string> = {
  want_to_read: "border-[#e5c978] bg-[#fff8e5] text-[#806215]",
  reading: "border-[#9fc5a7] bg-[#e8f0e8] text-[#285943]",
  completed: "border-[#cbd5d0] bg-[#f1f3f2] text-[#5d6c65]",
};
