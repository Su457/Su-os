import { Icon } from "./icon";
import type { IconName } from "@/lib/navigation";

export function EmptyState({ icon = "inbox", title, description, actionLabel, onAction }: { icon?: IconName; title: string; description: string; actionLabel?: string; onAction?(): void }) {
  return <div className="grid min-h-52 place-items-center p-8 text-center"><div><span className="glass-control mx-auto grid size-11 place-items-center rounded-2xl text-[#9587e6]"><Icon name={icon} size={20}/></span><h3 className="mt-4 text-sm font-medium">{title}</h3><p className="mx-auto mt-2 max-w-sm text-xs leading-5 text-[#747a89]">{description}</p>{actionLabel && onAction && <button onClick={onAction} className="primary-button mt-4 rounded-xl px-4 py-2.5 text-xs font-semibold">{actionLabel}</button>}</div></div>;
}
