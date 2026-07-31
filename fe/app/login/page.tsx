"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "../../lib/api";
import type { User } from "../../types";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true); setError("");
    try {
      await api<{ user: User }>("/auth/login", { method: "POST", body: { email, password } });
      router.push("/dashboard");
    } catch (err) { setError(err instanceof Error ? err.message : "Unable to log in"); }
    finally { setLoading(false); }
  }

  return <main className="auth-page"><section className="auth-card">
    <span className="eyebrow">Welcome back</span><h1>Your shelf awaits.</h1><p>Pick up where you left off.</p>
    <form className="form" onSubmit={handleSubmit}>
      {error && <div className="error">{error}</div>}
      <div className="field"><label htmlFor="email">Email</label><input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required /></div>
      <div className="field"><label htmlFor="password">Password</label><input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={8} /></div>
      <button className="button" disabled={loading}>{loading ? "Opening shelf…" : "Log in"}</button>
    </form>
    <div className="auth-footer">New here? <Link href="/signup">Create an account</Link></div>
  </section></main>;
}
