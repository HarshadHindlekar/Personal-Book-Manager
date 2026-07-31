import Link from "next/link";

export default function HomePage() {
  return (
    <main className="landing shell">
      <section className="landing-copy">
        <span className="eyebrow">A quieter reading life</span>
        <h1>Keep the books that keep you company.</h1>
        <p>Personal Book Manager gives your reading list a little room to breathe. Save what is next, notice what is happening now, and keep the good ones close.</p>
        <div className="actions">
          <Link className="button" href="/signup">Create your shelf</Link>
          <Link className="button secondary" href="/login">Log in</Link>
        </div>
      </section>
      <section className="landing-art" aria-label="A stack of books">
        <div className="book-stack">
          <div className="book"><strong>Small rituals</strong><span>for a larger life</span></div>
          <div className="book"><strong>The long way</strong><span>through a good story</span></div>
          <div className="book"><strong>Notes to self</strong><span>and other favourites</span></div>
        </div>
      </section>
    </main>
  );
}
