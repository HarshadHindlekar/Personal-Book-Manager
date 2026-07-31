type EmptyStateProps = {
  buttonClass: string;
  onAdd: () => void;
};

export default function EmptyState({ buttonClass, onAdd }: EmptyStateProps) {
  return (
    <div className="rounded-2xl border border-dashed border-[#becbc1] px-4 py-10 text-center text-[#708079]">
      <h2 className="font-serif text-2xl text-[#1f2a26]">A blank page is a beginning.</h2>
      <p className="mt-2">Add your first book and make this shelf yours.</p>
      <button className={`${buttonClass} mt-6`} onClick={onAdd}>Add your first book</button>
    </div>
  );
}
