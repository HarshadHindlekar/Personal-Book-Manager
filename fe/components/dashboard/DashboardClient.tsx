"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import BookForm from "./BookForm";
import BookCard from "./BookCard";
import EmptyState from "./EmptyState";
import StatCard from "./StatCard";
import { BOOK_STATUS_LABELS, BOOK_STATUSES } from "../../constants/dashboard";
import { api } from "../../lib/api";
import type { Book, BookStatus, User } from "../../types";

const buttonClass = "rounded-full bg-[#285943] px-4 py-2.5 font-bold text-white transition hover:bg-[#1f4634] disabled:cursor-not-allowed disabled:opacity-60";
const ghostButtonClass = "rounded-full px-2 py-2 font-bold text-[#285943] transition hover:bg-[#e8f0e8]";

export default function DashboardClient() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [books, setBooks] = useState<Book[]>([]);
  const [filter, setFilter] = useState<BookStatus | "all">("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Book | null>(null);

  async function load() {
    try {
      const [me, data] = await Promise.all([
        api<{ user: User }>("/auth/me"),
        api<{ books: Book[] }>(`/books${filter === "all" ? "" : `?status=${filter}`}`),
      ]);
      setUser(me.user);
      setBooks(data.books);
    } catch {
      router.replace("/login");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void load();
  }, [filter]);

  const totals = useMemo(() => ({
    all: books.length,
    reading: books.filter((book) => book.status === "reading").length,
    completed: books.filter((book) => book.status === "completed").length,
  }), [books]);

  async function logout() {
    await api("/auth/logout", { method: "POST" });
    router.replace("/");
  }

  async function remove(book: Book) {
    if (!window.confirm(`Remove “${book.title}” from your shelf?`)) return;
    await api(`/books/${book._id}`, { method: "DELETE" });
    setBooks((current) => current.filter((item) => item._id !== book._id));
  }

  async function updateStatus(book: Book, status: BookStatus) {
    const data = await api<{ book: Book }>(`/books/${book._id}`, {
      method: "PATCH",
      body: { status },
    });
    setBooks((current) => current.map((item) => item._id === book._id ? data.book : item));
  }

  if (loading) {
    return (
      <main className="grid min-h-screen place-items-center bg-[#f6f7f2] text-[#708079]">
        <p>Opening your shelf…</p>
      </main>
    );
  }

  return (
    <main className="mx-auto min-h-screen w-full max-w-[1180px] bg-[#f6f7f2] px-4 py-5 pb-10 sm:px-8">
      <header className="mb-6 flex items-center justify-between gap-4 sm:mb-8">
        <a className="font-serif text-2xl font-bold text-[#285943]" href="/">Quietly.</a>
        <div className="flex items-center gap-3 text-sm text-[#708079] sm:gap-4">
          <span>Hi, {user?.name}</span>
          <button className={ghostButtonClass} onClick={logout}>Log out</button>
        </div>
      </header>

      <section className="mb-6 flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
        <div>
          <span className="text-xs font-bold uppercase tracking-[0.12em] text-[#285943]">Your personal collection</span>
          <h1 className="my-1 font-serif text-[clamp(2.25rem,4vw,4rem)] font-bold leading-[0.95] text-[#1f2a26]">A shelf for every season.</h1>
          <p className="text-[#708079]">Keep track of what you want to read and what stayed with you.</p>
        </div>
        <button className={buttonClass} onClick={() => { setEditing(null); setShowForm(true); }}>+ Add a book</button>
      </section>

      <section className="mb-5 grid gap-3 md:grid-cols-3">
        <StatCard label="On your shelf" value={totals.all} />
        <StatCard label="Reading now" value={totals.reading} />
        <StatCard label="Completed" value={totals.completed} />
      </section>

      <div className="mb-3 flex flex-wrap gap-2">
        {BOOK_STATUSES.map((status) => (
          <button
            key={status}
            className={`rounded-full border px-3 py-1.5 text-sm transition ${filter === status ? "border-[#285943] bg-[#285943] text-white" : "border-[#e0e7e1] bg-white text-[#708079] hover:border-[#285943]"}`}
            onClick={() => setFilter(status)}
          >
            {status === "all" ? "All books" : BOOK_STATUS_LABELS[status]}
          </button>
        ))}
      </div>

      {error && <div className="mb-4 rounded-xl bg-[#fff0ed] px-4 py-3 text-sm text-[#a24032]">{error}</div>}
      {books.length === 0 ? (
        <EmptyState buttonClass={buttonClass} onAdd={() => setShowForm(true)} />
      ) : (
        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {books.map((book) => (
            <BookCard
              key={book._id}
              book={book}
              ghostButtonClass={ghostButtonClass}
              onEdit={() => { setEditing(book); setShowForm(true); }}
              onRemove={() => void remove(book)}
              onStatusChange={(status) => void updateStatus(book, status)}
            />
          ))}
        </section>
      )}

      {showForm && <BookForm book={editing} onClose={() => setShowForm(false)} onSaved={() => { setShowForm(false); void load(); }} />}
    </main>
  );
}
