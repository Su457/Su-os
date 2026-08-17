export type IconName =
  | "home" | "calendar" | "check" | "note" | "folder" | "chart" | "bot" | "settings"
  | "search" | "bell" | "plus" | "more" | "clock" | "arrow" | "flame" | "sparkles"
  | "book" | "moon" | "shield" | "database" | "palette" | "send" | "trash" | "edit"
  | "star" | "archive" | "inbox" | "filter" | "play" | "pause" | "download" | "upload"
  | "refresh" | "chevronUp" | "chevronDown" | "x";

export const navigation = [
  { label: "首页", href: "/", icon: "home" as IconName },
  { label: "今日", href: "/today", icon: "calendar" as IconName },
  { label: "任务", href: "/tasks", icon: "check" as IconName },
  { label: "笔记", href: "/notes", icon: "note" as IconName },
  { label: "项目", href: "/projects", icon: "folder" as IconName },
  { label: "学习统计", href: "/learning", icon: "chart" as IconName },
  { label: "AI 助手", href: "/ai", icon: "bot" as IconName },
  { label: "设置", href: "/settings", icon: "settings" as IconName },
];

export const mobilePrimaryNavigation = navigation.slice(0, 4);
