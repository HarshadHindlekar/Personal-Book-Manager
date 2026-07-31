import type { ReactNode } from "react";

type FormFieldProps = {
  id: string;
  label: string;
  error?: string;
  children: ReactNode;
};

export default function FormField({ id, label, error, children }: FormFieldProps) {
  return (
    <div className="grid gap-2">
      <label className="text-sm font-bold text-[#1f2a26]" htmlFor={id}>{label}</label>
      {children}
      {error && <p className="text-sm text-[#a24032]">{error}</p>}
    </div>
  );
}
