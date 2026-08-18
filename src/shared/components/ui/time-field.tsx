"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AnchoredPopover } from "./anchored-popover";
import { Icon } from "./icon";

const HOURS = Array.from({ length: 24 }, (_, index) => index);
const BASE_MINUTES = Array.from({ length: 12 }, (_, index) => index * 5);

function pad(value: number): string {
  return String(value).padStart(2, "0");
}

function parseTime(value: string): { hour: number; minute: number } | null {
  const match = /^(\d{2}):(\d{2})$/.exec(value);
  if (!match) return null;
  const hour = Number(match[1]);
  const minute = Number(match[2]);
  return hour < 24 && minute < 60 ? { hour, minute } : null;
}

function currentTime(): { hour: number; minute: number } {
  const now = new Date();
  return { hour: now.getHours(), minute: now.getMinutes() };
}

export function TimeField({
  value,
  onChange,
  ariaLabel,
}: {
  value: string;
  onChange(value: string): void;
  ariaLabel: string;
}) {
  const triggerRef = useRef<HTMLButtonElement>(null);
  const hourListRef = useRef<HTMLDivElement>(null);
  const minuteListRef = useRef<HTMLDivElement>(null);
  const selectedHourRef = useRef<HTMLButtonElement>(null);
  const selectedMinuteRef = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState(() => parseTime(value) ?? currentTime());
  const minuteOptions = useMemo(() => Array.from(new Set([...BASE_MINUTES, draft.minute])).sort((a, b) => a - b), [draft.minute]);

  useEffect(() => {
    if (!open) return;

    const frame = requestAnimationFrame(() => {
      const centerSelected = (
        list: HTMLDivElement | null,
        item: HTMLButtonElement | null,
      ) => {
        if (!list || !item) return;
        const listRect = list.getBoundingClientRect();
        const itemRect = item.getBoundingClientRect();
        list.scrollTop +=
          itemRect.top - listRect.top - list.clientHeight / 2 + itemRect.height / 2;
      };

      centerSelected(hourListRef.current, selectedHourRef.current);
      centerSelected(minuteListRef.current, selectedMinuteRef.current);
    });

    return () => cancelAnimationFrame(frame);
  }, [draft.hour, draft.minute, open]);

  function openPicker() {
    setDraft(parseTime(value) ?? currentTime());
    setOpen(true);
  }

  function shiftMinutes(amount: number) {
    setDraft((current) => {
      const total = (current.hour * 60 + current.minute + amount + 1440) % 1440;
      return { hour: Math.floor(total / 60), minute: total % 60 };
    });
  }

  function commit() {
    onChange(`${pad(draft.hour)}:${pad(draft.minute)}`);
    setOpen(false);
  }

  return (
    <div className="min-w-0">
      <div className="relative sm:hidden">
        <input
          type="time"
          step="300"
          value={value}
          aria-label={ariaLabel}
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
        onClick={() => open ? setOpen(false) : openPicker()}
        className={`field-input hidden items-center gap-2 text-left sm:flex ${open ? "border-[#9f8cff]/60 shadow-[0_0_0_3px_rgba(147,124,255,.1)]" : ""}`}
      >
        <Icon name="clock" size={15} className="shrink-0 text-[#9f92ee]" />
        <span className={`min-w-0 flex-1 ${value ? "text-[#eef0f7]" : "text-[#747b8a]"}`}>{value || "选择时间"}</span>
        <Icon name="chevronDown" size={14} className={`shrink-0 text-[#818898] transition ${open ? "rotate-180" : ""}`} />
      </button>

      <AnchoredPopover anchorRef={triggerRef} open={open} onClose={() => setOpen(false)} ariaLabel={ariaLabel}>
        <div className="mb-3 flex items-center justify-between">
          <div>
            <p className="text-[10px] uppercase tracking-[0.18em] text-[#777d8c]">选择时间</p>
            <p className="mt-1 text-2xl font-semibold tracking-[0.12em] text-[#eeecff]">{pad(draft.hour)} : {pad(draft.minute)}</p>
          </div>
          <Icon name="clock" size={20} className="text-[#9d8cf2]" />
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div ref={hourListRef} className="scrollbar-none max-h-40 overflow-y-auto rounded-xl border border-white/[0.07] bg-black/15 p-1" aria-label="小时">
            {HOURS.map((hour) => (
              <button ref={draft.hour === hour ? selectedHourRef : undefined} key={hour} type="button" aria-pressed={draft.hour === hour} onClick={() => setDraft((current) => ({ ...current, hour }))} className={`mb-1 grid h-9 w-full place-items-center rounded-lg text-xs last:mb-0 focus-visible:outline-2 focus-visible:outline-[#aa98ff] ${draft.hour === hour ? "bg-[#8c77f5] font-semibold text-white" : "text-[#aeb4c1] hover:bg-white/[0.06]"}`}>{pad(hour)}</button>
            ))}
          </div>
          <div ref={minuteListRef} className="scrollbar-none max-h-40 overflow-y-auto rounded-xl border border-white/[0.07] bg-black/15 p-1" aria-label="分钟">
            {minuteOptions.map((minute) => (
              <button ref={draft.minute === minute ? selectedMinuteRef : undefined} key={minute} type="button" aria-pressed={draft.minute === minute} onClick={() => setDraft((current) => ({ ...current, minute }))} className={`mb-1 grid h-9 w-full place-items-center rounded-lg text-xs last:mb-0 focus-visible:outline-2 focus-visible:outline-[#aa98ff] ${draft.minute === minute ? "bg-[#8c77f5] font-semibold text-white" : "text-[#aeb4c1] hover:bg-white/[0.06]"}`}>{pad(minute)}</button>
            ))}
          </div>
        </div>

        <div className="mt-3 grid grid-cols-3 gap-2">
          <button type="button" onClick={() => setDraft(currentTime())} className="glass-control rounded-xl px-2 py-2 text-[10px] text-[#b7bdca] focus-visible:outline-2 focus-visible:outline-[#aa98ff]">现在</button>
          <button type="button" onClick={() => setDraft((current) => ({ ...current, minute: 0 }))} className="glass-control rounded-xl px-2 py-2 text-[10px] text-[#b7bdca] focus-visible:outline-2 focus-visible:outline-[#aa98ff]">整点</button>
          <button type="button" onClick={() => shiftMinutes(30)} className="glass-control rounded-xl px-2 py-2 text-[10px] text-[#b7bdca] focus-visible:outline-2 focus-visible:outline-[#aa98ff]">+30分钟</button>
        </div>

        <div className="mt-3 flex items-center gap-2 border-t border-white/[0.07] pt-3">
          <button type="button" onClick={() => { onChange(""); setOpen(false); }} className="mr-auto rounded-lg px-2 py-2 text-[10px] text-[#737a89] transition hover:text-white focus-visible:outline-2 focus-visible:outline-[#aa98ff]">清除</button>
          <button type="button" onClick={() => setOpen(false)} className="secondary-button px-3 py-2 text-[10px] focus-visible:outline-2 focus-visible:outline-[#aa98ff]">取消</button>
          <button type="button" onClick={commit} className="primary-button rounded-xl px-4 py-2 text-[10px] font-semibold focus-visible:outline-2 focus-visible:outline-[#d8d1ff]">完成</button>
        </div>
      </AnchoredPopover>
    </div>
  );
}
