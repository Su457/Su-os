export function StatCard({ label, value, hint }: { label: string; value: string; hint?: string }) {
  return <div className="card p-4 sm:p-5"><p className="text-[10px] text-[#777d8c] sm:text-xs">{label}</p><p className="mt-2 text-xl font-semibold sm:text-2xl">{value}</p>{hint && <p className="mt-1 text-[10px] text-[#646a79]">{hint}</p>}</div>;
}
