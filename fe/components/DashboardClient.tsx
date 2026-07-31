"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "../lib/api";
import type { Book, BookStatus, User } from "../types";

const statusLabels: Record<BookStatus, string> = { want_to_read: "Want to read", reading: "Reading", completed: "Completed" };
const statuses: Array<BookStatus | "all"> = ["all", "want_to_read", "reading", "completed"];

const buttonClass = "rounded-full bg-[#285943] px-5 py-3 font-bold text-white transition hover:bg-[#1f4634] disabled:cursor-not-allowed disabled:opacity-60";
const ghostButtonClass = "rounded-full px-2 py-2 font-bold text-[#285943] transition hover:bg-[#e8f0e8]";
const inputClass = "w-full rounded-xl border border-[#e0e7e1] bg-[#fcfdfb] px-4 py-3 outline-none focus:border-[#285943] focus:ring-4 focus:ring-[#e8f0e8]";

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
      const [me, data] = await Promise.all([api<{ user: User }>("/auth/me"), api<{ books: Book[] }>(`/books${filter === "all" ? "" : `?status=${filter}`}`)]);
      setUser(me.user);
      setBooks(data.books);
    } catch {
      router.replace("/login");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { void load(); }, [filter]);

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
    const data = await api<{ book: Book }>(`/books/${book._id}`, { method: "PATCH", body: { status } });
    setBooks((current) => current.map((item) => item._id === book._id ? data.book : item));
  }

  if (loading) return <main className="grid min-h-screen place-items-center bg-[#f6f7f2] text-[#708079]"><p>Opening your shelf…</p></main>;

  return (
    <main className="mx-auto min-h-screen w-full max-w-[1180px] bg-[#f6f7f2] px-4 py-8 pb-16 sm:px-8">
      <header className="mb-8 flex items-center justify-between gap-4 sm:mb-12">
        <a className="font-serif text-2xl font-bold text-[#285943]" href="/">Quietly.</a>
        <div className="flex items-center gap-3 text-sm text-[#708079] sm:gap-4"><span>Hi, {user?.name}</span><button className={ghostButtonClass} onClick={logout}>Log out</button></div>
      </header>
      <section className="mb-8 flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
        <div><span className="text-xs font-bold uppercase tracking-[0.12em] text-[#285943]">Your personal collection</span><h1 className="my-1 font-serif text-[clamp(2.5rem,5vw,4.8rem)] font-bold leading-[0.95] text-[#1f2a26]">A shelf for every season.</h1><p className="text-[#708079]">Keep track of what you want to read and what stayed with you.</p></div>
        <button className={buttonClass} onClick={() => { setEditing(null); setShowForm(true); }}>+ Add a book</button>
      </section>
      <section className="mb-8 grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-[#e0e7e1] bg-white p-5"><span className="text-sm text-[#708079]">On your shelf</span><strong className="mt-1 block font-serif text-3xl text-[#285943]">{totals.all}</strong></div>
        <div className="rounded-2xl border border-[#e0e7e1] bg-white p-5"><span className="text-sm text-[#708079]">Reading now</span><strong className="mt-1 block font-serif text-3xl text-[#285943]">{totals.reading}</strong></div>
        <div className="rounded-2xl border border-[#e0e7e1] bg-white p-5"><span className="text-sm text-[#708079]">Completed</span><strong className="mt-1 block font-serif text-3xl text-[#285943]">{totals.completed}</strong></div>
      </section>
      <div className="mb-4 flex flex-wrap gap-2">
        {statuses.map((status) => <button key={status} className={`rounded-full border px-4 py-2 text-sm transition ${filter === status ? "border-[#285943] bg-[#285943] text-white" : "border-[#e0e7e1] bg-white text-[#708079] hover:border-[#285943]"}`} onClick={() => setFilter(status)}>{status === "all" ? "All books" : statusLabels[status]}</button>)}
      </div>
      {error && <div className="mb-4 rounded-xl bg-[#fff0ed] px-4 py-3 text-sm text-[#a24032]">{error}</div>}
      {books.length === 0 ? <div className="rounded-2xl border border-dashed border-[#becbc1] px-4 py-16 text-center text-[#708079]"><h2 className="font-serif text-2xl text-[#1f2a26]">A blank page is a beginning.</h2><p className="mt-2">Add your first book and make this shelf yours.</p><button className={`${buttonClass} mt-6`} onClick={() => setShowForm(true)}>Add your first book</button></div> : <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{books.map((book) => <article className="min-h-[210px] rounded-2xl border border-[#e0e7e1] bg-white p-5" key={book._id}><span className="mb-6 inline-flex rounded-full bg-[#e8f0e8] px-3 py-2 text-xs font-bold text-[#285943]">{statusLabels[book.status]}</span><h3 className="font-serif text-2xl text-[#1f2a26]">{book.title}</h3><p className="text-[#708079]">by {book.author}</p><div className="mt-5 flex flex-wrap gap-2">{book.tags.map((tag) => <span className="rounded-full bg-[#f1f3ee] px-2 py-1 text-xs text-[#708079]" key={tag}>#{tag}</span>)}</div><div className="mt-5 flex flex-wrap items-center gap-2"><select className="rounded-lg border border-[#e0e7e1] bg-white px-2 py-2 text-sm text-[#1f2a26]" aria-label={`Change status for ${book.title}`} value={book.status} onChange={(e) => void updateStatus(book, e.target.value as BookStatus)}><option value="want_to_read">Want to read</option><option value="reading">Reading</option><option value="completed">Completed</option></select><button className={ghostButtonClass} onClick={() => { setEditing(book); setShowForm(true); }}>Edit</button><button className={ghostButtonClass} onClick={() => void remove(book)}>Delete</button></div></article>)}</section>}
      {showForm && <BookForm book={editing} onClose={() => setShowForm(false)} onSaved={() => { setShowForm(false); void load(); }} />}
    </main>
  );
}

function BookForm({ book, onClose, onSaved }: { book: Book | null; onClose: () => void; onSaved: () => void }) {
  const [title, setTitle] = useState(book?.title ?? "");
  const [author, setAuthor] = useState(book?.author ?? "");
  const [tags, setTags] = useState(book?.tags.join(", ") ?? "");
  const [status, setStatus] = useState<BookStatus>(book?.status ?? "want_to_read");
  const [error, setError] = useState("");

  async function submit(event: FormEvent) {
    event.preventDefault();
    setError("");
    try {
      await api(`/books${book ? `/${book._id}` : ""}`, { method: book ? "PATCH" : "POST", body: { title, author, tags: tags.split(",").map((tag) => tag.trim()).filter(Boolean), status } });
      onSaved();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to save book");
    }
  }

  return <div className="fixed inset-0 z-10 grid place-items-center bg-[rgba(25,43,32,0.45)] p-4" role="presentation"><section className="w-full max-w-[500px] rounded-2xl bg-white p-6" role="dialog" aria-modal="true"><div className="flex items-center justify-between"><h2 className="font-serif text-2xl text-[#1f2a26]">{book ? "Edit book" : "Add a book"}</h2><button className="text-2xl text-[#708079]" type="button" onClick={onClose} aria-label="Close">×</button></div><form className="mt-6 grid gap-4" onSubmit={submit}>{error && <div className="rounded-xl bg-[#fff0ed] px-4 py-3 text-sm text-[#a24032]">{error}</div>}<div className="grid gap-2"><label className="text-sm font-bold text-[#1f2a26]" htmlFor="title">Title</label><input className={inputClass} id="title" value={title} onChange={(e) => setTitle(e.target.value)} required /></div><div className="grid gap-2"><label className="text-sm font-bold text-[#1f2a26]" htmlFor="author">Author</label><input className={inputClass} id="author" value={author} onChange={(e) => setAuthor(e.target.value)} required /></div><div className="grid gap-2"><label className="text-sm font-bold text-[#1f2a26]" htmlFor="tags">Tags <span className="font-normal text-[#708079]">(comma separated)</span></label><input className={inputClass} id="tags" value={tags} onChange={(e) => setTags(e.target.value)} placeholder="fiction, design" /></div><div className="grid gap-2"><label className="text-sm font-bold text-[#1f2a26]" htmlFor="status">Status</label><select className={inputClass} id="status" value={status} onChange={(e) => setStatus(e.target.value as BookStatus)}><option value="want_to_read">Want to read</option><option value="reading">Reading</option><option value="completed">Completed</option></select></div><button className={buttonClass}>Save book</button></form></section></div>;
}
