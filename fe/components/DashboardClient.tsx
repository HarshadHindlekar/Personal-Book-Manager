"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "../lib/api";
import type { Book, BookStatus, User } from "../types";

const statusLabels: Record<BookStatus, string> = { want_to_read: "Want to read", reading: "Reading", completed: "Completed" };
const statuses: Array<BookStatus | "all"> = ["all", "want_to_read", "reading", "completed"];

export default function DashboardClient() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null); const [books, setBooks] = useState<Book[]>([]); const [filter, setFilter] = useState<BookStatus | "all">("all");
  const [loading, setLoading] = useState(true); const [error, setError] = useState(""); const [showForm, setShowForm] = useState(false); const [editing, setEditing] = useState<Book | null>(null);

  async function load() {
    try { const [me, data] = await Promise.all([api<{ user: User }>("/auth/me"), api<{ books: Book[] }>(`/books${filter === "all" ? "" : `?status=${filter}`}`)]); setUser(me.user); setBooks(data.books); }
    catch { router.replace("/login"); }
    finally { setLoading(false); }
  }

  useEffect(() => { void load(); }, [filter]);

  const totals = useMemo(() => ({ all: books.length, reading: books.filter((book) => book.status === "reading").length, completed: books.filter((book) => book.status === "completed").length }), [books]);

  async function logout() { await api("/auth/logout", { method: "POST" }); router.replace("/"); }
  async function remove(book: Book) { if (!window.confirm(`Remove “${book.title}” from your shelf?`)) return; await api(`/books/${book._id}`, { method: "DELETE" }); setBooks((current) => current.filter((item) => item._id !== book._id)); }
  async function updateStatus(book: Book, status: BookStatus) { const data = await api<{ book: Book }>(`/books/${book._id}`, { method: "PATCH", body: { status } }); setBooks((current) => current.map((item) => item._id === book._id ? data.book : item)); }

  if (loading) return <main className="auth-page"><p>Opening your shelf…</p></main>;

  return <main className="dashboard">
    <header className="topbar"><a className="brand" href="/">Quietly.</a><div className="user-menu"><span>Hi, {user?.name}</span><button className="button ghost" onClick={logout}>Log out</button></div></header>
    <section className="hero"><div><span className="eyebrow">Your personal collection</span><h1>A shelf for every season.</h1><p>Keep track of what you want to read and what stayed with you.</p></div><button className="button" onClick={() => { setEditing(null); setShowForm(true); }}>+ Add a book</button></section>
    <section className="stats"><div className="stat-card"><span>On your shelf</span><strong>{totals.all}</strong></div><div className="stat-card"><span>Reading now</span><strong>{totals.reading}</strong></div><div className="stat-card"><span>Completed</span><strong>{totals.completed}</strong></div></section>
    <div className="toolbar"><div className="filters">{statuses.map((status) => <button key={status} className={`filter ${filter === status ? "active" : ""}`} onClick={() => setFilter(status)}>{status === "all" ? "All books" : statusLabels[status]}</button>)}</div></div>
    {error && <div className="error">{error}</div>}
    {books.length === 0 ? <div className="empty"><h2>A blank page is a beginning.</h2><p>Add your first book and make this shelf yours.</p><button className="button" onClick={() => setShowForm(true)}>Add your first book</button></div> : <section className="book-grid">{books.map((book) => <article className="book-card" key={book._id}><span className="status">{statusLabels[book.status]}</span><h3>{book.title}</h3><p>by {book.author}</p><div className="tags">{book.tags.map((tag) => <span className="tag" key={tag}>#{tag}</span>)}</div><div className="card-actions"><select aria-label={`Change status for ${book.title}`} value={book.status} onChange={(e) => void updateStatus(book, e.target.value as BookStatus)}><option value="want_to_read">Want to read</option><option value="reading">Reading</option><option value="completed">Completed</option></select><button className="button ghost" onClick={() => { setEditing(book); setShowForm(true); }}>Edit</button><button className="button ghost" onClick={() => void remove(book)}>Delete</button></div></article>)}</section>}
    {showForm && <BookForm book={editing} onClose={() => setShowForm(false)} onSaved={() => { setShowForm(false); void load(); }} />}
  </main>;
}

function BookForm({ book, onClose, onSaved }: { book: Book | null; onClose: () => void; onSaved: () => void }) {
  const [title, setTitle] = useState(book?.title ?? ""); const [author, setAuthor] = useState(book?.author ?? ""); const [tags, setTags] = useState(book?.tags.join(", ") ?? ""); const [status, setStatus] = useState<BookStatus>(book?.status ?? "want_to_read"); const [error, setError] = useState("");
  async function submit(event: FormEvent) { event.preventDefault(); setError(""); try { await api(`/books${book ? `/${book._id}` : ""}`, { method: book ? "PATCH" : "POST", body: { title, author, tags: tags.split(",").map((tag) => tag.trim()).filter(Boolean), status } }); onSaved(); } catch (err) { setError(err instanceof Error ? err.message : "Unable to save book"); } }
  return <div className="modal-backdrop" role="presentation"><section className="modal" role="dialog" aria-modal="true"><div className="modal-header"><h2>{book ? "Edit book" : "Add a book"}</h2><button className="close" onClick={onClose} aria-label="Close">×</button></div><form className="form" onSubmit={submit}>{error && <div className="error">{error}</div>}<div className="field"><label htmlFor="title">Title</label><input id="title" value={title} onChange={(e) => setTitle(e.target.value)} required /></div><div className="field"><label htmlFor="author">Author</label><input id="author" value={author} onChange={(e) => setAuthor(e.target.value)} required /></div><div className="field"><label htmlFor="tags">Tags <span>(comma separated)</span></label><input id="tags" value={tags} onChange={(e) => setTags(e.target.value)} placeholder="fiction, design" /></div><div className="field"><label htmlFor="status">Status</label><select id="status" value={status} onChange={(e) => setStatus(e.target.value as BookStatus)}><option value="want_to_read">Want to read</option><option value="reading">Reading</option><option value="completed">Completed</option></select></div><button className="button">Save book</button></form></section></div>;
}
