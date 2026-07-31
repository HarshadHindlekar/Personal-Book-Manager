type StatCardProps = {
  label: string;
  value: number;
};

export default function StatCard({ label, value }: StatCardProps) {
  return (
    <div className="rounded-xl border border-[#e0e7e1] bg-white p-4">
      <span className="text-sm text-[#708079]">{label}</span>
      <strong className="mt-0.5 block font-serif text-2xl text-[#285943]">{value}</strong>
    </div>
  );
}
