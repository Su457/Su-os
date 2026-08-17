import { Icon } from "./icon";

export function PageHeader({ eyebrow, title, description, actionLabel, onAction }: { eyebrow: string; title: string; description: string; actionLabel?: string; onAction?(): void }) {
  return <header className="mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div><p className="eyebrow mb-2">{eyebrow}</p><h1 className="text-2xl font-semibold tracking-[-0.03em] sm:text-3xl">{title}</h1><p className="mt-2 text-sm text-[#858b9a]">{description}</p></div>{actionLabel && onAction && <button onClick={onAction} className="primary-button flex w-fit items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-semibold"><Icon name="plus" size={16}/>{actionLabel}</button>}</header>;
}
