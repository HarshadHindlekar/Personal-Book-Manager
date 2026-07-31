"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "../../lib/api";
import type { User } from "../../types";

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState(""); const [email, setEmail] = useState(""); const [password, setPassword] = useState("");
  const [error, setError] = useState(""); const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setLoading(true); setError("");
    try {
      await api<{ user: User }>("/auth/signup", { method: "POST", body: { name, email, password } });
      router.push("/dashboard");
    } catch (err) { setError(err instanceof Error ? err.message : "Unable to create account"); }
    finally { setLoading(false); }
  }

  return <main className="auth-page"><section className="auth-card">
    <span className="eyebrow">Start a collection</span><h1>Make space for good books.</h1><p>One place for your next read, current read, and forever favourites.</p>
    <form className="form" onSubmit={handleSubmit}>
      {error && <div className="error">{error}</div>}
      <div className="field"><label htmlFor="name">Name</label><input id="name" value={name} onChange={(e) => setName(e.target.value)} required minLength={2} /></div>
      <div className="field"><label htmlFor="email">Email</label><input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required /></div>
      <div className="field"><label htmlFor="password">Password</label><input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={8} /></div>
      <button className="button" disabled={loading}>{loading ? "Making your shelf…" : "Create account"}</button>
    </form>
    <div className="auth-footer">Already have an account? <Link href="/login">Log in</Link></div>
  </section></main>;
}
