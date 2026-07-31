type StatCardProps = {
  label: string;
  value: number;
};

export default function StatCard({ label, value }: StatCardProps) {
  return (
    <div className="rounded-2xl border border-[#e0e7e1] bg-white p-5">
      <span className="text-sm text-[#708079]">{label}</span>
      <strong className="mt-1 block font-serif text-3xl text-[#285943]">{value}</strong>
    </div>
  );
}
