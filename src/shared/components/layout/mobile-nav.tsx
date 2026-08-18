"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icon } from "@/shared/components/ui/icon";
import { mobilePrimaryNavigation, navigation } from "@/shared/config/navigation";

const MOBILE_MORE_TOGGLE_ID = "mobile-more-toggle";

function closeMoreMenu() {
  const toggle = document.getElementById(MOBILE_MORE_TOGGLE_ID);
  if (toggle instanceof HTMLInputElement) toggle.checked = false;
}

export function MobileNav() {
  const pathname = usePathname();
  const secondary = navigation.slice(4);
  const secondaryActive = secondary.some((item) => pathname.startsWith(item.href));

  return (
    <div className="fixed inset-x-3 bottom-[max(0.75rem,env(safe-area-inset-bottom))] z-50 h-[70px] md:hidden">
      <input
        id={MOBILE_MORE_TOGGLE_ID}
        type="checkbox"
        className="peer sr-only"
        aria-label="打开或关闭更多导航"
        aria-controls="mobile-more-panel"
      />

      <label
        htmlFor={MOBILE_MORE_TOGGLE_ID}
        className={`absolute right-0 top-0 z-20 flex h-full w-1/5 cursor-pointer flex-col items-center justify-center gap-1 rounded-r-[1.65rem] text-[10px] transition peer-checked:text-[#c8beff] peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-[-4px] peer-focus-visible:outline-[#aa98ff] ${secondaryActive ? "text-[#c8beff]" : "text-[#7f8493]"}`}
      >
        {secondaryActive && <span className="absolute top-1.5 h-0.5 w-5 rounded-full bg-[#aa98ff] shadow-[0_0_10px_#9b87f5]" />}
        <Icon name="more" size={21} />
        <span>更多</span>
      </label>

      <div className="pointer-events-none invisible fixed inset-0 -z-10 opacity-0 transition duration-200 peer-checked:pointer-events-auto peer-checked:visible peer-checked:opacity-100">
        <label
          htmlFor={MOBILE_MORE_TOGGLE_ID}
          className="absolute inset-0 cursor-default bg-[#05060a]/55 backdrop-blur-md"
          aria-label="关闭更多导航"
        />
        <section
          id="mobile-more-panel"
          className="glass-dock absolute inset-x-3 bottom-[calc(max(0.75rem,env(safe-area-inset-bottom))+5rem)] p-3"
          aria-label="更多空间"
        >
          <div className="mb-2 flex items-center justify-between px-2 py-1">
            <span className="text-sm font-semibold">更多空间</span>
            <label
              htmlFor={MOBILE_MORE_TOGGLE_ID}
              className="cursor-pointer rounded-lg px-2 py-1 text-xs text-[#9a9faf]"
            >
              关闭
            </label>
          </div>
          <div className="grid grid-cols-4 gap-2">
            {secondary.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={closeMoreMenu}
                className="glass-control flex min-h-20 flex-col items-center justify-center gap-2 rounded-2xl text-center text-[11px] text-[#bec2ce]"
              >
                <Icon name={item.icon} size={20} />
                {item.label}
              </Link>
            ))}
          </div>
        </section>
      </div>

      <nav className="glass-dock relative z-0 grid h-full grid-cols-5 px-2" aria-label="移动端导航">
        {mobilePrimaryNavigation.map((item) => {
          const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`relative flex flex-col items-center justify-center gap-1 text-[10px] transition ${active ? "text-[#c8beff]" : "text-[#7f8493]"}`}
            >
              {active && <span className="absolute top-1.5 h-0.5 w-5 rounded-full bg-[#aa98ff] shadow-[0_0_10px_#9b87f5]" />}
              <Icon name={item.icon} size={20} />
              <span>{item.label}</span>
            </Link>
          );
        })}
        <span aria-hidden="true" />
      </nav>
    </div>
  );
}
