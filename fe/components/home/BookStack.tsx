import { BOOK_STACK_ITEMS } from "../../constants/home";

export default function BookStack() {
  return (
    <section className="flex min-h-[330px] items-center justify-center bg-[#285943] p-16 text-[#f4f6ec] lg:min-h-0" aria-label="A stack of books">
      <div className="grid w-full max-w-[360px] -rotate-6 gap-4">
        {BOOK_STACK_ITEMS.map((book) => (
          <div className={`min-h-[100px] rounded-[8px_18px_18px_8px] p-6 text-[#1f2a26] shadow-[18px_18px_0_rgba(18,48,34,0.2)] ${book.className}`} key={book.title}>
            <strong className="block font-serif text-2xl">{book.title}</strong>
            <span>{book.subtitle}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
