import type { Note } from "@/domain/note";
import type { Project } from "@/domain/project";
import type { SuOsData } from "@/domain/snapshot";
import type { Task } from "@/domain/task";
import { getFocusTrend } from "@/modules/focus/selectors";
import {
  getLearningStreak,
  getLearningTrend,
  getTodayLearningMinutes,
  getWeekLearningMinutes,
} from "@/modules/learning/selectors";
import { getRecentNote } from "@/modules/notes/selectors";
import { getActiveProjects, getProjectTaskStats } from "@/modules/projects/selectors";
import { sortTasksByMitThenOrder } from "@/modules/tasks/selectors";
import { getTodaySummary } from "@/modules/today/selectors";

export interface DashboardTrendPoint {
  date: string;
  minutes: number;
}

export interface DashboardProjectSummary {
  project: Project;
  totalTasks: number;
  completedTasks: number;
  progress: number;
}

export interface DashboardSnapshot {
  today: string;
  todayTasks: Task[];
  todayMits: Task[];
  completedTodayTasks: number;
  todayTaskProgress: number;
  todayFocusMinutes: number;
  todayLearningMinutes: number;
  weekLearningMinutes: number;
  learningStreak: number;
  trend: DashboardTrendPoint[];
  maxTrendMinutes: number;
  projectNames: Record<string, string>;
  activeProjects: DashboardProjectSummary[];
  recentNote: Note | undefined;
}

export function getDashboardSnapshot(data: SuOsData, today: string, now: Date): DashboardSnapshot {
  const todaySummary = getTodaySummary(data.tasks, data.focusSessions, today);
  const todayTasks = sortTasksByMitThenOrder(todaySummary.tasks);
  const learningTrend = getLearningTrend(data.learningSessions, today);
  const focusTrend = getFocusTrend(data.focusSessions, today);
  const focusByDate = new Map(focusTrend.map((item) => [item.date, item.minutes]));
  const trend = learningTrend.map((item) => ({
    date: item.date,
    minutes: item.minutes + (focusByDate.get(item.date) ?? 0),
  }));
  const activeProjects = getActiveProjects(data.projects).map((project) => {
    const stats = getProjectTaskStats(data.tasks, project.id);
    return {
      project,
      totalTasks: stats.total,
      completedTasks: stats.completed,
      progress: stats.progress,
    };
  });

  return {
    today,
    todayTasks,
    todayMits: todayTasks.filter((task) => task.isMIT),
    completedTodayTasks: todaySummary.completed,
    todayTaskProgress: todaySummary.completionRate,
    todayFocusMinutes: todaySummary.focusMinutes,
    todayLearningMinutes: getTodayLearningMinutes(data.learningSessions, today),
    weekLearningMinutes: getWeekLearningMinutes(data.learningSessions, now),
    learningStreak: getLearningStreak(data.learningSessions, today),
    trend,
    maxTrendMinutes: Math.max(...trend.map((item) => item.minutes), 1),
    projectNames: Object.fromEntries(data.projects.map((project) => [project.id, project.name])),
    activeProjects,
    recentNote: getRecentNote(data.notes),
  };
}
