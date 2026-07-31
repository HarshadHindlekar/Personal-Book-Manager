"use client";

import type { FormEventHandler, ReactNode } from "react";

type FormShellProps = {
  children: ReactNode;
  error?: string;
  loading: boolean;
  loadingLabel: string;
  submitLabel: string;
  onSubmit: FormEventHandler<HTMLFormElement>;
};

export default function FormShell({ children, error, loading, loadingLabel, submitLabel, onSubmit }: FormShellProps) {
  return (
    <form className="mt-6 grid gap-4" onSubmit={onSubmit}>
      {error && <div className="rounded-xl bg-[#fff0ed] px-4 py-3 text-sm text-[#a24032]">{error}</div>}
      {children}
      <button className="rounded-full bg-[#285943] px-5 py-3 font-bold text-white transition hover:bg-[#1f4634] disabled:cursor-not-allowed disabled:opacity-60" disabled={loading}>
        {loading ? loadingLabel : submitLabel}
      </button>
    </form>
  );
}
