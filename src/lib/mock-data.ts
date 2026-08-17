export type IconName =
  | "home" | "calendar" | "check" | "note" | "folder" | "chart" | "bot" | "settings"
  | "search" | "bell" | "plus" | "more" | "clock" | "arrow" | "flame" | "sparkles"
  | "book" | "moon" | "shield" | "database" | "palette" | "send";

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

export const todayTasks = [
  { id: 1, title: "完成 Su OS 首页原型", time: "09:30", tag: "Su OS", priority: "高优先级", done: true },
  { id: 2, title: "学习 Next.js 布局与路由", time: "14:00", tag: "学习", priority: "中优先级", done: false },
  { id: 3, title: "整理本周个人计划", time: "18:30", tag: "生活", priority: "低优先级", done: false },
  { id: 4, title: "阅读 30 分钟", time: "21:00", tag: "习惯", priority: "低优先级", done: false },
];

export const focusData = [
  { day: "一", minutes: 88 }, { day: "二", minutes: 126 }, { day: "三", minutes: 96 },
  { day: "四", minutes: 148 }, { day: "五", minutes: 112 }, { day: "六", minutes: 68 }, { day: "日", minutes: 122 },
];

export const projects = [
  { title: "Su OS", category: "个人项目", progress: 67, color: "#9b87f5" },
  { title: "前端学习", category: "学习计划", progress: 42, color: "#6ee7b7" },
  { title: "内容系统", category: "知识管理", progress: 18, color: "#fbbf77" },
];
