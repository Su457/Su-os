"use client";

import { useEffect } from "react";
import { Icon } from "./icon";

export function Modal({ open, title, description, onClose, children, wide = false }: { open: boolean; title: string; description?: string; onClose(): void; children: React.ReactNode; wide?: boolean }) {
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => event.key === "Escape" && onClose();
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[70] flex items-end justify-center bg-[#03040a]/70 p-0 backdrop-blur-md sm:items-center sm:p-5" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <section role="dialog" aria-modal="true" aria-label={title} className={`card max-h-[92dvh] w-full overflow-y-auto rounded-b-none p-5 sm:rounded-[1.55rem] sm:p-6 ${wide ? "max-w-3xl" : "max-w-xl"}`}>
        <header className="mb-5 flex items-start justify-between gap-4"><div><h2 className="text-lg font-semibold">{title}</h2>{description && <p className="mt-1 text-xs leading-5 text-[#7f8595]">{description}</p>}</div><button type="button" aria-label="关闭" onClick={onClose} className="secondary-button grid size-9 shrink-0 place-items-center"><Icon name="x" size={16}/></button></header>
        {children}
      </section>
    </div>
  );
}
