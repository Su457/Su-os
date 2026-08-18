"use client";

import { useMemo, useRef, useState } from "react";
import { AnchoredPopover } from "./anchored-popover";
import { Icon } from "./icon";

const WEEKDAYS = ["一", "二", "三", "四", "五", "六", "日"];

function pad(value: number): string {
  return String(value).padStart(2, "0");
}

function toKey(date: Date): string {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

function parseKey(value: string): Date | null {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return null;
  const [year, month, day] = value.split("-").map(Number);
  const date = new Date(year, month - 1, day, 12);
  return date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day
    ? date
    : null;
}

function formatValue(value: string): string {
  const date = parseKey(value);
  return date
    ? new Intl.DateTimeFormat("zh-CN", { year: "numeric", month: "long", day: "numeric", weekday: "short" }).format(date)
    : "选择日期";
}

export function DateField({
  value,
  onChange,
  ariaLabel,
  required = false,
  min,
  max,
}: {
  value: string;
  onChange(value: string): void;
  ariaLabel: string;
  required?: boolean;
  min?: string;
  max?: string;
}) {
  const triggerRef = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState(false);
  const initialMonth = parseKey(value) ?? new Date();
  const [visibleMonth, setVisibleMonth] = useState(() => new Date(initialMonth.getFullYear(), initialMonth.getMonth(), 1, 12));

  const days = useMemo(() => {
    const year = visibleMonth.getFullYear();
    const month = visibleMonth.getMonth();
    const firstWeekday = (new Date(year, month, 1, 12).getDay() + 6) % 7;
    return Array.from({ length: 42 }, (_, index) => new Date(year, month, index - firstWeekday + 1, 12));
  }, [visibleMonth]);

  function openCalendar() {
    const selected = parseKey(value) ?? new Date();
    setVisibleMonth(new Date(selected.getFullYear(), selected.getMonth(), 1, 12));
    setOpen(true);
  }

  function choose(date: Date) {
    const next = toKey(date);
    if ((min && next < min) || (max && next > max)) return;
    onChange(next);
    setOpen(false);
  }

  const selectedKey = parseKey(value) ? value : "";
  const todayKey = toKey(new Date());
  const monthLabel = new Intl.DateTimeFormat("zh-CN", { year: "numeric", month: "long" }).format(visibleMonth);

  return (
    <div className="min-w-0">
      <div className="relative sm:hidden">
        <input
          type="date"
          value={value}
          min={min}
          max={max}
          aria-label={ariaLabel}
          aria-required={required}
          onChange={(event) => onChange(event.target.value)}
          className="field-input pr-10 [color-scheme:dark]"
        />
        {value && (
          <button type="button" aria-label={`清除${ariaLabel}`} onClick={() => onChange("")} className="absolute right-2 top-1/2 grid size-7 -translate-y-1/2 place-items-center rounded-lg text-[#777e8d] focus-visible:outline-2 focus-visible:outline-[#aa98ff]">
            <Icon name="x" size={13} />
          </button>
        )}
      </div>

      <button
        ref={triggerRef}
        type="button"
        aria-label={ariaLabel}
        aria-expanded={open}
        aria-haspopup="dialog"
        onClick={() => open ? setOpen(false) : openCalendar()}
        className={`field-input hidden items-center gap-2 text-left sm:flex ${open ? "border-[#9f8cff]/60 shadow-[0_0_0_3px_rgba(147,124,255,.1)]" : ""}`}
      >
        <Icon name="calendar" size={15} className="shrink-0 text-[#9f92ee]" />
        <span className={`min-w-0 flex-1 truncate ${value ? "text-[#eef0f7]" : "text-[#747b8a]"}`}>{formatValue(value)}</span>
        <Icon name="chevronDown" size={14} className={`shrink-0 text-[#818898] transition ${open ? "rotate-180" : ""}`} />
      </button>

      <AnchoredPopover anchorRef={triggerRef} open={open} onClose={() => setOpen(false)} ariaLabel={ariaLabel}>
        <div className="mb-3 flex items-center justify-between gap-3">
          <button type="button" aria-label="上个月" onClick={() => setVisibleMonth((current) => new Date(current.getFullYear(), current.getMonth() - 1, 1, 12))} className="secondary-button grid size-8 place-items-center focus-visible:outline-2 focus-visible:outline-[#aa98ff]">
            <Icon name="chevronUp" size={14} className="-rotate-90" />
          </button>
          <p className="text-sm font-semibold text-[#e8e9f1]">{monthLabel}</p>
          <button type="button" aria-label="下个月" onClick={() => setVisibleMonth((current) => new Date(current.getFullYear(), current.getMonth() + 1, 1, 12))} className="secondary-button grid size-8 place-items-center focus-visible:outline-2 focus-visible:outline-[#aa98ff]">
            <Icon name="chevronUp" size={14} className="rotate-90" />
          </button>
        </div>

        <div className="mb-1 grid grid-cols-7 gap-1" aria-hidden="true">
          {WEEKDAYS.map((weekday) => <span key={weekday} className="py-1 text-center text-[9px] text-[#6e7482]">{weekday}</span>)}
        </div>
        <div className="grid grid-cols-7 gap-1">
          {days.map((date) => {
            const key = toKey(date);
            const inMonth = date.getMonth() === visibleMonth.getMonth();
            const selected = key === selectedKey;
            const today = key === todayKey;
            const disabled = Boolean((min && key < min) || (max && key > max));
            return (
              <button
                key={key}
                type="button"
                aria-label={new Intl.DateTimeFormat("zh-CN", { year: "numeric", month: "long", day: "numeric" }).format(date)}
                aria-pressed={selected}
                disabled={disabled}
                onClick={() => choose(date)}
                className={`grid aspect-square place-items-center rounded-xl text-[11px] transition focus-visible:outline-2 focus-visible:outline-[#aa98ff] ${selected ? "bg-[#8d78f5] font-semibold text-white shadow-[0_0_16px_rgba(141,120,245,.35)]" : today ? "border border-[#9b87f5]/45 text-[#c7bdff]" : inMonth ? "text-[#c2c7d2] hover:bg-white/[0.07]" : "text-[#555b68] hover:bg-white/[0.035]"} disabled:cursor-not-allowed disabled:opacity-25`}
              >
                {date.getDate()}
              </button>
            );
          })}
        </div>

        <div className="mt-3 flex items-center justify-between gap-2 border-t border-white/[0.07] pt-3">
          <button type="button" onClick={() => { onChange(""); setOpen(false); }} className="rounded-lg px-2 py-1.5 text-[10px] text-[#737a89] transition hover:text-white focus-visible:outline-2 focus-visible:outline-[#aa98ff]">清除</button>
          <button type="button" onClick={() => choose(new Date())} className="secondary-button px-3 py-2 text-[10px] focus-visible:outline-2 focus-visible:outline-[#aa98ff]">今天</button>
        </div>
      </AnchoredPopover>
    </div>
  );
}
