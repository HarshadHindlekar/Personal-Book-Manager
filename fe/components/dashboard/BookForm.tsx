"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import FormField from "../forms/FormField";
import FormShell from "../forms/FormShell";
import { api } from "../../lib/api";
import { bookSchema, type BookFormValues } from "../../lib/validation";
import type { Book } from "../../types";

const inputClass = "w-full rounded-xl border border-[#e0e7e1] bg-[#fcfdfb] px-4 py-3 outline-none focus:border-[#285943] focus:ring-4 focus:ring-[#e8f0e8]";

type BookFormProps = {
  book: Book | null;
  onClose: () => void;
  onSaved: () => void;
};

export default function BookForm({ book, onClose, onSaved }: BookFormProps) {
  const { register, handleSubmit, setError, formState: { errors, isSubmitting } } = useForm<BookFormValues>({
    resolver: zodResolver(bookSchema),
    defaultValues: {
      title: book?.title ?? "",
      author: book?.author ?? "",
      tags: book?.tags.join(", ") ?? "",
      status: book?.status ?? "want_to_read",
    },
  });

  async function submit(values: BookFormValues) {
    try {
      await api(`/books${book ? `/${book._id}` : ""}`, {
        method: book ? "PATCH" : "POST",
        body: {
          title: values.title,
          author: values.author,
          tags: values.tags.split(",").map((tag) => tag.trim()).filter(Boolean),
          status: values.status,
        },
      });
      onSaved();
    } catch (err) {
      setError("root.server", { message: err instanceof Error ? err.message : "Unable to save book" });
    }
  }

  return (
    <div className="fixed inset-0 z-10 grid place-items-center bg-[rgba(25,43,32,0.45)] p-4" role="presentation">
      <section className="w-full max-w-[500px] rounded-2xl bg-white p-6" role="dialog" aria-modal="true">
        <div className="flex items-center justify-between">
          <h2 className="font-serif text-2xl text-[#1f2a26]">{book ? "Edit book" : "Add a book"}</h2>
          <button className="text-2xl text-[#708079]" type="button" onClick={onClose} aria-label="Close">×</button>
        </div>

        <FormShell error={errors.root?.server?.message} loading={isSubmitting} loadingLabel="Saving…" submitLabel="Save book" onSubmit={handleSubmit(submit)}>
          
          <FormField id="title" label="Title" error={errors.title?.message}>
            <input className={inputClass} id="title" {...register("title")} />
          </FormField>

          <FormField id="author" label="Author" error={errors.author?.message}>
            <input className={inputClass} id="author" {...register("author")} />
          </FormField>

          <FormField id="tags" label="Tags (comma separated)" error={errors.tags?.message}>
            <input className={inputClass} id="tags" placeholder="fiction, design" {...register("tags")} />
          </FormField>

          <FormField id="status" label="Status" error={errors.status?.message}>
            <select className={inputClass} id="status" {...register("status")}>
              <option value="want_to_read">Want to read</option>
              <option value="reading">Reading</option>
              <option value="completed">Completed</option>
            </select>
          </FormField>

        </FormShell>
      </section>
    </div>
  );
}
