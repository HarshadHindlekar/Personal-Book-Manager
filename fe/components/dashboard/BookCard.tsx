import type { Book, BookStatus } from "../../types";
import { BOOK_STATUS_STYLES } from "../../constants/dashboard";

type BookCardProps = {
  book: Book;
  ghostButtonClass: string;
  onEdit: () => void;
  onRemove: () => void;
  onStatusChange: (status: BookStatus) => void;
};

export default function BookCard({ book, ghostButtonClass, onEdit, onRemove, onStatusChange }: BookCardProps) {
  return (
    <article className="rounded-2xl border border-[#e0e7e1] bg-white p-4">
      <h3 className="font-serif text-xl text-[#1f2a26]">{book.title}</h3>
      <p className="text-[#708079]">by {book.author}</p>
      <div className="mt-3 flex flex-wrap gap-2">
        {book.tags.map((tag) => (
          <span className="rounded-full bg-[#f1f3ee] px-2 py-1 text-xs text-[#708079]" key={tag}>#{tag}</span>
        ))}
      </div>
      <div className="mt-4 flex flex-wrap items-center gap-2">
        <select
          className={`rounded-lg border px-2 py-2 text-sm font-medium ${BOOK_STATUS_STYLES[book.status]}`}
          aria-label={`Change status for ${book.title}`}
          value={book.status}
          onChange={(e) => onStatusChange(e.target.value as BookStatus)}
        >
          <option value="want_to_read">Want to read</option>
          <option value="reading">Reading</option>
          <option value="completed">Completed</option>
        </select>
        <button className={ghostButtonClass} onClick={onEdit}>Edit</button>
        <button className={ghostButtonClass} onClick={onRemove}>Delete</button>
      </div>
    </article>
  );
}
