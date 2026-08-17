"use client";

import { useEffect, useId, useRef, useState } from "react";
import { Icon } from "./icon";

export interface GlassSelectOption {
  value: string;
  label: string;
  meta?: string;
}

export function GlassSelect({ value, options, onChange, placeholder = "请选择", disabled = false, ariaLabel }: { value: string; options: GlassSelectOption[]; onChange(value: string): void; placeholder?: string; disabled?: boolean; ariaLabel: string }) {
  const [open, setOpen] = useState(false);
  const listboxId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const selected = options.find((option) => option.value === value);

  useEffect(() => {
    const closeOnOutside = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("pointerdown", closeOnOutside);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("pointerdown", closeOnOutside);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, []);

  function choose(nextValue: string) {
    onChange(nextValue);
    setOpen(false);
  }

  return (
    <div ref={rootRef} className="relative min-w-0">
      <button
        type="button"
        role="combobox"
        aria-label={ariaLabel}
        aria-controls={listboxId}
        aria-expanded={open}
        aria-haspopup="listbox"
        disabled={disabled}
        onClick={() => setOpen((current) => !current)}
        className={`glass-select-trigger flex w-full min-w-0 items-center gap-2 rounded-[0.9rem] px-3 py-2.5 text-left text-xs ${open ? "border-[#9f8cff]/60 shadow-[0_0_0_3px_rgba(147,124,255,.1)]" : ""} disabled:cursor-not-allowed disabled:opacity-50`}
      >
        <span className={`min-w-0 flex-1 truncate ${selected ? "text-[#eef0f7]" : "text-[#747b8a]"}`}>{selected?.label ?? placeholder}</span>
        <Icon name="chevronDown" size={14} className={`shrink-0 text-[#9ca2b1] transition ${open ? "rotate-180 text-[#b6a8ff]" : ""}`}/>
      </button>

      {open && !disabled && (
        <div id={listboxId} role="listbox" aria-label={ariaLabel} className="glass-popover absolute inset-x-0 top-[calc(100%+0.45rem)] z-50 max-h-56 overflow-y-auto rounded-2xl p-1.5">
          {options.map((option) => {
            const active = option.value === value;
            return (
              <button
                key={option.value || "empty"}
                type="button"
                role="option"
                aria-selected={active}
                onClick={() => choose(option.value)}
                className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition ${active ? "bg-[#9b87f5]/18 text-[#d6ceff] shadow-[inset_0_1px_0_rgba(255,255,255,.08)]" : "text-[#b7bdca] hover:bg-white/[0.07] hover:text-white"}`}
              >
                <span className={`size-1.5 shrink-0 rounded-full ${active ? "bg-[#aa98ff] shadow-[0_0_9px_#9b87f5]" : "bg-white/15"}`}/>
                <span className="min-w-0 flex-1"><span className="block truncate text-[11px]">{option.label}</span>{option.meta && <span className="mt-0.5 block truncate text-[9px] text-[#6f7686]">{option.meta}</span>}</span>
                {active && <Icon name="check" size={13} className="shrink-0 text-[#b7aaff]"/>}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
