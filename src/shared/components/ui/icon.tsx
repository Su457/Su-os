export type IconName =
  | "home" | "calendar" | "check" | "note" | "folder" | "chart" | "bot" | "settings"
  | "search" | "bell" | "plus" | "more" | "clock" | "arrow" | "flame" | "sparkles"
  | "book" | "moon" | "shield" | "database" | "palette" | "send" | "trash" | "edit"
  | "star" | "archive" | "inbox" | "filter" | "play" | "pause" | "download" | "upload"
  | "refresh" | "chevronUp" | "chevronDown" | "x";

type IconProps = { name: IconName; size?: number; className?: string; strokeWidth?: number };

const paths: Record<IconName, React.ReactNode> = {
  home: <><path d="m3 10 9-7 9 7"/><path d="M5 9.5V21h14V9.5"/><path d="M9 21v-7h6v7"/></>,
  calendar: <><rect width="18" height="18" x="3" y="4" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></>,
  check: <><path d="M9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></>,
  note: <><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z"/><path d="M14 2v6h6M8 13h8M8 17h6"/></>,
  folder: <path d="M3 6a2 2 0 0 1 2-2h5l2 3h7a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z"/>,
  chart: <><path d="M3 3v18h18"/><path d="m7 16 4-5 4 3 5-7"/></>,
  bot: <><rect x="4" y="7" width="16" height="13" rx="3"/><path d="M12 3v4M8 12h.01M16 12h.01M9 16h6"/></>,
  settings: <><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .34 1.88l.06.06-2.83 2.83-.06-.06a1.7 1.7 0 0 0-1.88-.34A1.7 1.7 0 0 0 14 20.93V21h-4v-.08A1.7 1.7 0 0 0 9 19.37a1.7 1.7 0 0 0-1.88.34l-.06.06-2.83-2.83.06-.06A1.7 1.7 0 0 0 4.63 15 1.7 1.7 0 0 0 3.08 14H3v-4h.08A1.7 1.7 0 0 0 4.63 9a1.7 1.7 0 0 0-.34-1.88l-.06-.06 2.83-2.83.06.06A1.7 1.7 0 0 0 9 4.63 1.7 1.7 0 0 0 10 3.08V3h4v.08A1.7 1.7 0 0 0 15 4.63a1.7 1.7 0 0 0 1.88-.34l.06-.06 2.83 2.83-.06.06A1.7 1.7 0 0 0 19.37 9 1.7 1.7 0 0 0 20.92 10H21v4h-.08A1.7 1.7 0 0 0 19.4 15Z"/></>,
  search: <><circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/></>,
  bell: <><path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9"/><path d="M10 21h4"/></>,
  plus: <path d="M12 5v14M5 12h14"/>,
  more: <><circle cx="5" cy="12" r="1" fill="currentColor"/><circle cx="12" cy="12" r="1" fill="currentColor"/><circle cx="19" cy="12" r="1" fill="currentColor"/></>,
  clock: <><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></>,
  arrow: <><path d="M5 12h14M13 6l6 6-6 6"/></>,
  flame: <path d="M12 22c4.4 0 8-3.4 8-7.7 0-3.1-1.8-5.7-4.4-7.5.1 2-1 3.7-2.5 4.5.2-3.8-2-7.3-5.5-9.3.3 3.8-3.6 6.4-3.6 11.4C4 18.2 7.6 22 12 22Z"/>,
  sparkles: <><path d="m12 3-1.2 3.5L7 8l3.8 1.5L12 13l1.2-3.5L17 8l-3.8-1.5Z"/><path d="m19 14-.8 2.2L16 17l2.2.8L19 20l.8-2.2L22 17l-2.2-.8ZM5 14l-.8 2.2L2 17l2.2.8L5 20l.8-2.2L8 17l-2.2-.8Z"/></>,
  book: <><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2Z"/></>,
  moon: <path d="M21 12.8A8.5 8.5 0 1 1 11.2 3 6.5 6.5 0 0 0 21 12.8Z"/>,
  shield: <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z"/>,
  database: <><ellipse cx="12" cy="5" rx="8" ry="3"/><path d="M4 5v7c0 1.7 3.6 3 8 3s8-1.3 8-3V5M4 12v7c0 1.7 3.6 3 8 3s8-1.3 8-3v-7"/></>,
  palette: <><circle cx="12" cy="12" r="9"/><circle cx="8" cy="9" r="1" fill="currentColor"/><circle cx="12" cy="7" r="1" fill="currentColor"/><circle cx="16" cy="9" r="1" fill="currentColor"/><path d="M15 17c0-1.1.9-2 2-2h1.5"/></>,
  send: <><path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/></>,
  trash: <><path d="M3 6h18M8 6V4h8v2M19 6l-1 15H6L5 6M10 11v6M14 11v6"/></>,
  edit: <><path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L8 18l-4 1 1-4Z"/></>,
  star: <path d="m12 2 3 6 6.5.9-4.7 4.6 1.1 6.5-5.9-3.1L6 21l1.1-6.5-4.7-4.6L9 8Z"/>,
  archive: <><rect x="3" y="4" width="18" height="5" rx="1"/><path d="M5 9v11h14V9M10 13h4"/></>,
  inbox: <><path d="M4 4h16v16H4Z"/><path d="M4 14h4l2 3h4l2-3h4"/></>,
  filter: <path d="M4 5h16l-6 7v5l-4 2v-7Z"/>,
  play: <path d="m8 5 11 7-11 7Z"/>,
  pause: <><path d="M9 5v14M15 5v14"/></>,
  download: <><path d="M12 3v12M7 10l5 5 5-5"/><path d="M5 21h14"/></>,
  upload: <><path d="M12 15V3M7 8l5-5 5 5"/><path d="M5 21h14"/></>,
  refresh: <><path d="M20 7h-5V2"/><path d="M20 7a8 8 0 1 0 1 6"/></>,
  chevronUp: <path d="m6 15 6-6 6 6"/>,
  chevronDown: <path d="m6 9 6 6 6-6"/>,
  x: <path d="M6 6l12 12M18 6 6 18"/>,
};

export function Icon({ name, size = 20, className, strokeWidth = 1.8 }: IconProps) {
  return <svg aria-hidden="true" className={className} fill="none" height={size} viewBox="0 0 24 24" width={size} stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={strokeWidth}>{paths[name]}</svg>;
}
