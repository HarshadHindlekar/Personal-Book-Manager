"use client";

import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import FormField from "../forms/FormField";
import FormShell from "../forms/FormShell";
import { api } from "../../lib/api";
import { loginSchema, type LoginFormValues } from "../../lib/validation";
import type { User } from "../../types";

const inputClass = "w-full rounded-xl border border-[#e0e7e1] bg-[#fcfdfb] px-4 py-3 outline-none focus:border-[#285943] focus:ring-4 focus:ring-[#e8f0e8]";

export default function LoginForm() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({ resolver: zodResolver(loginSchema) });

  async function submit(values: LoginFormValues) {
    try {
      await api<{ user: User }>("/auth/login", { method: "POST", body: values });
      router.push("/dashboard");
    } catch (err) {
      setError("root.server", { message: err instanceof Error ? err.message : "Unable to log in" });
    }
  }

  return (
    <>
      <span className="text-xs font-bold uppercase tracking-[0.12em] text-[#285943]">Welcome back</span>
      <h1 className="my-2 font-serif text-[2.7rem] font-bold text-[#1f2a26]">Your shelf awaits.</h1>
      <p className="leading-[1.6] text-[#708079]">Pick up where you left off.</p>

      <FormShell
        error={errors.root?.server?.message ?? ""}
        loading={isSubmitting}
        loadingLabel="Opening shelf…"
        submitLabel="Log in"
        onSubmit={handleSubmit(submit)}
      >
        
        <FormField id="email" label="Email" error={errors.email?.message}>
          <input className={inputClass} id="email" type="email" {...register("email")} />
        </FormField>

        <FormField id="password" label="Password" error={errors.password?.message}>
          <input className={inputClass} id="password" type="password" {...register("password")} />
        </FormField>

      </FormShell>

      <div className="mt-6 text-sm text-[#708079]">
        New here? <Link className="font-bold text-[#285943]" href="/signup">Create an account</Link>
      </div>
    </>
  );
}
