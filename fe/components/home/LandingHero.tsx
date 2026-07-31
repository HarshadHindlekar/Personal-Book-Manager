import Link from "next/link";

export default function LandingHero() {
  return (
    <section className="flex flex-col justify-center bg-[#e9efe7] px-8 py-20 sm:px-16 lg:px-[9vw] lg:py-[10vh]">
      <span className="text-xs font-bold uppercase tracking-[0.12em] text-[#285943]">A quieter reading life</span>
      <h1 className="my-4 max-w-[590px] font-serif text-[clamp(3.4rem,7vw,6.5rem)] font-bold leading-[0.95] tracking-[-0.055em] text-[#1f2a26]">
        Keep the books that keep you company.
      </h1>
      <p className="max-w-[470px] text-[1.1rem] leading-[1.7] text-[#708079]">
        Personal Book Manager gives your reading list a little room to breathe. Save what is next, notice what is happening now, and keep the good ones close.
      </p>
      <div className="mt-6 flex flex-wrap gap-3">
        <Link className="rounded-full bg-[#285943] px-5 py-3 font-bold text-white transition hover:bg-[#1f4634]" href="/signup">Create your shelf</Link>
        <Link className="rounded-full border border-[#e0e7e1] bg-transparent px-5 py-3 font-bold text-[#1f2a26] transition hover:bg-white" href="/login">Log in</Link>
      </div>
    </section>
  );
}
