export function LoadingState({ label = "正在读取本地数据…" }: { label?: string }) {
  return <div className="card grid min-h-56 place-items-center p-8 text-center"><div><span className="mx-auto mb-4 block size-8 animate-pulse rounded-full bg-[#9b87f5]/30 shadow-[0_0_28px_rgba(155,135,245,.28)]"/><p className="text-xs text-[#858b9a]">{label}</p></div></div>;
}
