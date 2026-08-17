"use client";

import { usePathname } from "next/navigation";
import { Icon } from "@/components/ui/icon";
import { navigation } from "@/lib/navigation";

export function Topbar() {
  const pathname = usePathname();
  const current = navigation.find((item) => item.href === "/" ? pathname === "/" : pathname.startsWith(item.href));
  return (
    <header className="glass-bar sticky top-3 z-30 mx-3 mt-3 flex h-14 items-center justify-between px-3.5 sm:mx-5 sm:px-4 md:top-4 md:mx-6 md:mt-4 xl:mx-8">
      <div className="flex items-center gap-2 md:hidden"><span className="primary-button grid size-8 place-items-center rounded-xl text-xs font-black">S</span><span className="text-sm font-semibold">{current?.label ?? "Su OS"}</span></div>
      <div className="hidden items-center gap-2 text-xs text-[#72727f] md:flex"><span>Su OS</span><span>/</span><span className="text-[#babac3]">{current?.label ?? "首页"}</span></div>
      <div className="flex items-center gap-2">
        <button aria-label="搜索" className="grid size-9 place-items-center rounded-xl text-[#9da3b2] transition hover:bg-white/[0.07] hover:text-white"><Icon name="search" size={18}/></button>
        <button aria-label="通知" className="relative grid size-9 place-items-center rounded-xl text-[#9da3b2] transition hover:bg-white/[0.07] hover:text-white"><Icon name="bell" size={18}/><span className="absolute right-2 top-2 size-1.5 rounded-full bg-[#aa98ff] shadow-[0_0_8px_#9b87f5]"/></button>
        <div className="glass-control ml-1 grid size-8 place-items-center rounded-full text-[11px] font-bold text-white">SU</div>
      </div>
    </header>
  );
}
