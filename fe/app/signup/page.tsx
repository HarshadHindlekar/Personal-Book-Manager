"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "../../lib/api";
import type { User } from "../../types";

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");
    try {
      await api<{ user: User }>("/auth/signup", { method: "POST", body: { name, email, password } });
      router.push("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to create account");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="grid min-h-screen place-items-center bg-[radial-gradient(circle_at_top_right,#e9efe7,transparent_45%),#f6f7f2] p-8">
      <section className="w-full max-w-[440px] rounded-3xl border border-[#e0e7e1] bg-white p-8 shadow-[0_20px_60px_rgba(45,67,52,0.08)] sm:p-10">
        <span className="text-xs font-bold uppercase tracking-[0.12em] text-[#285943]">Start a collection</span>
        <h1 className="my-2 font-serif text-[2.7rem] font-bold text-[#1f2a26]">Make space for good books.</h1>
        <p className="leading-[1.6] text-[#708079]">One place for your next read, current read, and forever favourites.</p>
        <form className="mt-6 grid gap-4" onSubmit={handleSubmit}>
          {error && <div className="rounded-xl bg-[#fff0ed] px-4 py-3 text-sm text-[#a24032]">{error}</div>}
          <div className="grid gap-2"><label className="text-sm font-bold text-[#1f2a26]" htmlFor="name">Name</label><input className="w-full rounded-xl border border-[#e0e7e1] bg-[#fcfdfb] px-4 py-3 outline-none focus:border-[#285943] focus:ring-4 focus:ring-[#e8f0e8]" id="name" value={name} onChange={(e) => setName(e.target.value)} required minLength={2} /></div>
          <div className="grid gap-2"><label className="text-sm font-bold text-[#1f2a26]" htmlFor="email">Email</label><input className="w-full rounded-xl border border-[#e0e7e1] bg-[#fcfdfb] px-4 py-3 outline-none focus:border-[#285943] focus:ring-4 focus:ring-[#e8f0e8]" id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required /></div>
          <div className="grid gap-2"><label className="text-sm font-bold text-[#1f2a26]" htmlFor="password">Password</label><input className="w-full rounded-xl border border-[#e0e7e1] bg-[#fcfdfb] px-4 py-3 outline-none focus:border-[#285943] focus:ring-4 focus:ring-[#e8f0e8]" id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={8} /></div>
          <button className="rounded-full bg-[#285943] px-5 py-3 font-bold text-white transition hover:bg-[#1f4634] disabled:cursor-not-allowed disabled:opacity-60" disabled={loading}>{loading ? "Making your shelf…" : "Create account"}</button>
        </form>
        <div className="mt-6 text-sm text-[#708079]">Already have an account? <Link className="font-bold text-[#285943]" href="/login">Log in</Link></div>
      </section>
    </main>
  );
}
