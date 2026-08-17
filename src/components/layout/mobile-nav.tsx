"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Icon } from "@/components/ui/icon";
import { mobilePrimaryNavigation, navigation } from "@/lib/mock-data";

export function MobileNav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const secondary = navigation.slice(4);
  const secondaryActive = secondary.some((item) => pathname.startsWith(item.href));
  return (
    <>
      {open && <div className="fixed inset-0 z-40 bg-[#05060a]/55 backdrop-blur-md md:hidden" onClick={() => setOpen(false)}><div className="glass-dock absolute inset-x-3 bottom-24 p-3" onClick={(event) => event.stopPropagation()}><div className="mb-2 flex items-center justify-between px-2 py-1"><span className="text-sm font-semibold">更多空间</span><button className="rounded-lg px-2 py-1 text-xs text-[#9a9faf]" onClick={() => setOpen(false)}>关闭</button></div><div className="grid grid-cols-4 gap-2">{secondary.map((item) => <Link key={item.href} href={item.href} onClick={() => setOpen(false)} className="glass-control flex min-h-20 flex-col items-center justify-center gap-2 rounded-2xl text-center text-[11px] text-[#bec2ce]"><Icon name={item.icon} size={20}/>{item.label}</Link>)}</div></div></div>}
      <nav className="glass-dock fixed inset-x-3 bottom-[max(0.75rem,env(safe-area-inset-bottom))] z-50 grid h-[70px] grid-cols-5 px-2 md:hidden" aria-label="移动端导航">
        {mobilePrimaryNavigation.map((item) => { const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href); return <Link key={item.href} href={item.href} className={`relative flex flex-col items-center justify-center gap-1 text-[10px] transition ${active ? "text-[#c8beff]" : "text-[#7f8493]"}`}>{active && <span className="absolute top-1.5 h-0.5 w-5 rounded-full bg-[#aa98ff] shadow-[0_0_10px_#9b87f5]"/>}<Icon name={item.icon} size={20}/><span>{item.label}</span></Link>; })}
        <button onClick={() => setOpen(true)} className={`relative flex flex-col items-center justify-center gap-1 text-[10px] ${secondaryActive || open ? "text-[#c8beff]" : "text-[#7f8493]"}`}>{(secondaryActive || open) && <span className="absolute top-1.5 h-0.5 w-5 rounded-full bg-[#aa98ff] shadow-[0_0_10px_#9b87f5]"/>}<Icon name="more" size={21}/><span>更多</span></button>
      </nav>
    </>
  );
}
