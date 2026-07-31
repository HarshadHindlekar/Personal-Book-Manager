import { BOOK_STATUS_LABELS } from "../../constants/dashboard";
import type { Book, BookStatus } from "../../types";

type BookCardProps = {
  book: Book;
  ghostButtonClass: string;
  onEdit: () => void;
  onRemove: () => void;
  onStatusChange: (status: BookStatus) => void;
};

export default function BookCard({ book, ghostButtonClass, onEdit, onRemove, onStatusChange }: BookCardProps) {
  return (
    <article className="min-h-[210px] rounded-2xl border border-[#e0e7e1] bg-white p-5">
      <span className="mb-6 inline-flex rounded-full bg-[#e8f0e8] px-3 py-2 text-xs font-bold text-[#285943]">{BOOK_STATUS_LABELS[book.status]}</span>
      <h3 className="font-serif text-2xl text-[#1f2a26]">{book.title}</h3>
      <p className="text-[#708079]">by {book.author}</p>
      <div className="mt-5 flex flex-wrap gap-2">
        {book.tags.map((tag) => (
          <span className="rounded-full bg-[#f1f3ee] px-2 py-1 text-xs text-[#708079]" key={tag}>#{tag}</span>
        ))}
      </div>
      <div className="mt-5 flex flex-wrap items-center gap-2">
        <select
          className="rounded-lg border border-[#e0e7e1] bg-white px-2 py-2 text-sm text-[#1f2a26]"
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
