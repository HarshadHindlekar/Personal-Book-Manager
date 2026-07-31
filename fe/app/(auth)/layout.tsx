import Link from "next/link";

export default function AuthLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <main className="grid min-h-screen place-items-center bg-gradient-to-br from-[#e9efe7] via-[#f6f7f2] to-[#f6f7f2] p-8">
      <section className="w-full max-w-[440px] rounded-3xl border border-[#e0e7e1] bg-white p-8 shadow-[0_20px_60px_rgba(45,67,52,0.08)] sm:p-10">
        <div className="mb-8">
          <Link className="inline-flex items-center gap-2 text-sm font-bold text-[#708079] transition hover:text-[#285943]" href="/">
            <span aria-hidden="true">←</span> Back to home
          </Link>
        </div>
        {children}
      </section>
    </main>
  );
}
