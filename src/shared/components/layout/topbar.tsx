"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { navigation } from "@/shared/config/navigation";

export function Topbar() {
  const pathname = usePathname();
  const current = navigation.find((item) => item.href === "/" ? pathname === "/" : pathname.startsWith(item.href));
  return (
    <header className="glass-bar sticky top-[max(0.75rem,env(safe-area-inset-top))] z-30 mx-3 mt-[max(0.75rem,env(safe-area-inset-top))] flex h-13 items-center justify-between px-3.5 sm:mx-5 sm:px-4 md:hidden">
      <div className="flex min-w-0 items-center gap-2.5">
        <span className="primary-button grid size-8 shrink-0 place-items-center rounded-xl text-xs font-black">S</span>
        <span className="truncate text-sm font-semibold">{current?.label ?? "Su OS"}</span>
      </div>
      <Link href="/settings" aria-label="打开设置" className="glass-control grid size-9 shrink-0 place-items-center rounded-full text-[11px] font-bold text-white transition hover:border-[#9b87f5]/40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#aa98ff]">SU</Link>
    </header>
  );
}
