export const BOOK_STATUSES = ["want_to_read", "reading", "completed"] as const;
export type BookStatus = (typeof BOOK_STATUSES)[number];
