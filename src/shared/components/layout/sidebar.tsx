"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icon } from "@/shared/components/ui/icon";
import { navigation } from "@/shared/config/navigation";
import { formatMinutes, isDateThisWeek, toDateKey } from "@/shared/lib/date-utils";
import { useSuOsStore } from "@/store/su-os-store";

export function Sidebar() {
  const pathname = usePathname();
  const { data, hydrated } = useSuOsStore();
  const weekFocus = hydrated ? data.focusSessions.filter((session) => isDateThisWeek(toDateKey(new Date(session.completedAt)))).reduce((sum, session) => sum + session.durationMinutes, 0) : 0;
  const targetProgress = Math.min(100, Math.round(weekFocus / 300 * 100));
  return (
    <aside className="glass-nav sticky top-4 m-4 mr-0 hidden h-[calc(100dvh-2rem)] flex-col px-4 py-5 md:flex">
      <Link href="/" className="mb-9 flex items-center gap-3 px-2">
        <span className="primary-button grid size-9 place-items-center rounded-xl text-sm font-black text-white">S</span>
        <span><span className="block text-[15px] font-semibold tracking-wide">Su OS</span><span className="block text-[10px] uppercase tracking-[0.18em] text-[#696976]">Personal Space</span></span>
      </Link>
      <nav className="space-y-1" aria-label="主导航">
        {navigation.map((item) => {
          const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
          return <Link key={item.href} href={item.href} className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] transition ${active ? "nav-active text-[#d2caff]" : "border border-transparent text-[#9096a7] hover:bg-white/[0.055] hover:text-white"}`}><Icon name={item.icon} size={18}/><span>{item.label}</span>{active && <span className="ml-auto size-1.5 rounded-full bg-[#aa98ff] shadow-[0_0_10px_#9b87f5]"/>}</Link>;
        })}
      </nav>
      <div className="glass-control mt-auto rounded-2xl p-3.5">
        <div className="mb-3 flex items-center gap-2 text-xs text-[#aaaab5]"><span className="grid size-7 place-items-center rounded-lg bg-[#6ee7b7]/10 text-[#6ee7b7]"><Icon name="flame" size={15}/></span>本周专注 {formatMinutes(weekFocus)}</div>
        <div className="h-1.5 overflow-hidden rounded-full bg-white/[0.06]"><div className="h-full rounded-full bg-gradient-to-r from-[#9b87f5] to-[#6ee7b7]" style={{ width: `${targetProgress}%` }}/></div>
        <p className="mt-2 text-[10px] text-[#686875]">每周目标 5 小时</p>
      </div>
    </aside>
  );
}
