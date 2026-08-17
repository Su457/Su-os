import { addDays, toDateKey } from "@/shared/lib/date-utils";
import type { SuOsData } from "@/domain/snapshot";

export function createEmptyData(): SuOsData {
  return {
    schemaVersion: 2,
    tasks: [],
    notes: [],
    projects: [],
    milestones: [],
    learningSessions: [],
    focusSessions: [],
    focusDraft: null,
  };
}

export function createDefaultData(now = new Date()): SuOsData {
  const today = toDateKey(now);
  const iso = now.toISOString();
  const yesterday = addDays(today, -1);
  const twoDaysAgo = addDays(today, -2);
  const tomorrow = addDays(today, 1);
  const nextWeek = addDays(today, 6);

  return {
    schemaVersion: 2,
    projects: [
      { id: "project-su-os", name: "Su OS", description: "打造真正可日常使用的个人数字工作台。", goal: "完成本地优先的 v0.2 核心工作流", status: "active", startDate: addDays(today, -14), dueDate: addDays(today, 21), createdAt: iso, updatedAt: iso },
      { id: "project-frontend", name: "前端学习", description: "系统学习现代 React 与 Next.js。", goal: "完成 2026 前端学习路径", status: "active", startDate: addDays(today, -30), dueDate: addDays(today, 60), createdAt: iso, updatedAt: iso },
      { id: "project-content", name: "内容系统", description: "整理个人知识与内容输出流程。", goal: "建立每周稳定输出节奏", status: "paused", startDate: addDays(today, -20), dueDate: null, createdAt: iso, updatedAt: iso },
    ],
    tasks: [
      { id: "task-dashboard", title: "完成 Su OS v0.2 数据层", description: "统一 Tasks、Today、Projects 与 Dashboard 的数据来源。", completed: true, dueDate: today, time: "09:30", priority: "high", projectId: "project-su-os", tags: ["SuOS", "开发"], isMIT: true, order: 0, createdAt: iso, updatedAt: iso, completedAt: iso },
      { id: "task-notes", title: "完善 Notes 编辑体验", description: "加入自动保存、标签和项目关联。", completed: false, dueDate: today, time: "14:00", priority: "high", projectId: "project-su-os", tags: ["SuOS"], isMIT: true, order: 1, createdAt: iso, updatedAt: iso, completedAt: null },
      { id: "task-reading", title: "阅读 30 分钟", description: "继续阅读手边的技术书。", completed: false, dueDate: today, time: "21:00", priority: "low", projectId: "project-frontend", tags: ["习惯"], isMIT: false, order: 2, createdAt: iso, updatedAt: iso, completedAt: null },
      { id: "task-rsc", title: "学习 React Server Components", description: "整理一页学习笔记。", completed: false, dueDate: tomorrow, time: "19:30", priority: "medium", projectId: "project-frontend", tags: ["React"], isMIT: false, order: 3, createdAt: iso, updatedAt: iso, completedAt: null },
      { id: "task-review", title: "整理本周个人计划", description: "从收件箱整理下一步行动。", completed: false, dueDate: null, time: null, priority: "medium", projectId: null, tags: ["生活"], isMIT: false, order: 4, createdAt: iso, updatedAt: iso, completedAt: null },
      { id: "task-content", title: "确定下一篇文章主题", description: "从近期笔记中选择一个主题。", completed: false, dueDate: nextWeek, time: null, priority: "low", projectId: "project-content", tags: ["写作"], isMIT: false, order: 5, createdAt: iso, updatedAt: iso, completedAt: null },
    ],
    notes: [
      { id: "note-workbench", title: "个人工作台：从工具集合到生活系统", content: "真正有用的个人工作台，不只是把链接放在一起。\n\n它应该帮助我看清今天、推进项目，并留下持续成长的记录。", tags: ["SuOS", "产品思考"], favorite: true, archived: false, projectId: "project-su-os", createdAt: iso, updatedAt: iso },
      { id: "note-next", title: "Next.js App Router 学习摘录", content: "布局负责稳定的页面骨架，业务状态则通过客户端 Provider 注入。", tags: ["Next.js", "前端"], favorite: false, archived: false, projectId: "project-frontend", createdAt: iso, updatedAt: iso },
      { id: "note-review", title: "本周复盘", content: "做得好的事：保持了稳定学习。\n需要改进：减少同时进行的任务。", tags: ["复盘"], favorite: false, archived: false, projectId: null, createdAt: iso, updatedAt: iso },
    ],
    milestones: [
      { id: "milestone-data", projectId: "project-su-os", title: "统一数据层", completed: true, dueDate: today, order: 0 },
      { id: "milestone-modules", projectId: "project-su-os", title: "核心模块可日常使用", completed: false, dueDate: addDays(today, 7), order: 1 },
      { id: "milestone-polish", projectId: "project-su-os", title: "完成移动端体验检查", completed: false, dueDate: addDays(today, 10), order: 2 },
    ],
    learningSessions: [
      { id: "learning-today", subject: "Next.js", content: "App Router 与客户端状态边界", durationMinutes: 75, date: today, startTime: "10:00", endTime: "11:15", note: "理解了 hydration 处理。", createdAt: iso, updatedAt: iso },
      { id: "learning-yesterday", subject: "UI 设计", content: "液态玻璃视觉层次", durationMinutes: 50, date: yesterday, startTime: null, endTime: null, note: "减少不必要的高亮。", createdAt: iso, updatedAt: iso },
      { id: "learning-two-days", subject: "英语阅读", content: "技术文章精读", durationMinutes: 40, date: twoDaysAgo, startTime: null, endTime: null, note: "", createdAt: iso, updatedAt: iso },
    ],
    focusSessions: [
      { id: "focus-today", taskId: "task-dashboard", projectId: "project-su-os", durationMinutes: 25, startedAt: new Date(today + "T09:00:00").toISOString(), completedAt: new Date(today + "T09:25:00").toISOString() },
    ],
    focusDraft: null,
  };
}
