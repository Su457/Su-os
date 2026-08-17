type Stat = { label: string; value: string };
type Item = { title: string; meta: string; status: string };

export function SectionPage({ eyebrow, title, description, action, stats, items }: { eyebrow: string; title: string; description: string; action: string; stats: Stat[]; items: Item[] }) {
  return (
    <div>
      <div className="mb-8 flex flex-col justify-between gap-5 sm:flex-row sm:items-end"><div><p className="eyebrow mb-2">{eyebrow}</p><h1 className="text-2xl font-semibold tracking-[-0.03em] sm:text-3xl">{title}</h1><p className="mt-2 text-sm text-[#858591]">{description}</p></div><button className="primary-button flex w-fit items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-semibold">＋ {action}</button></div>
      <div className="mb-4 grid grid-cols-3 gap-3 sm:gap-4">{stats.map((stat) => <div key={stat.label} className="card p-4 sm:p-5"><p className="text-[10px] text-[#73737e] sm:text-xs">{stat.label}</p><p className="mt-2 text-xl font-semibold sm:text-2xl">{stat.value}</p></div>)}</div>
      <div className="card overflow-hidden"><div className="flex items-center justify-between border-b border-white/[0.06] p-5"><div><p className="text-sm font-semibold">最近内容</p><p className="mt-1 text-[11px] text-[#6d6d78]">本地演示数据</p></div><button className="rounded-lg border border-white/[0.08] px-3 py-2 text-[11px] text-[#8d8d98]">筛选</button></div><div>{items.map((item, index) => <div key={item.title} className={`flex items-center gap-3 p-4 transition hover:bg-white/[0.025] sm:p-5 ${index !== items.length - 1 ? "border-b border-white/[0.055]" : ""}`}><span className="grid size-9 shrink-0 place-items-center rounded-xl bg-[#9b87f5]/10 text-xs text-[#ad9dfa]">{index + 1}</span><div className="min-w-0 flex-1"><p className="truncate text-[13px] text-[#d4d4da]">{item.title}</p><p className="mt-1 text-[10px] text-[#686873]">{item.meta}</p></div><span className="rounded-full bg-white/[0.04] px-2.5 py-1 text-[10px] text-[#8e8e99]">{item.status}</span></div>)}</div></div>
    </div>
  );
}
