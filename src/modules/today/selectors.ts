import type { FocusSession } from "@/domain/focus";
import type { Task } from "@/domain/task";
import { getFocusMinutesForDate } from "@/modules/focus/selectors";
import {
  getMitTasks,
  getTaskCompletionStats,
  getTodayTasks as getTasksForDate,
} from "@/modules/tasks/selectors";

export interface TodaySummary {
  tasks: Task[];
  mitTasks: Task[];
  total: number;
  completed: number;
  remaining: number;
  completionRate: number;
  focusMinutes: number;
}

export function getTodayTasks(tasks: readonly Task[], dateKey: string): Task[] {
  return getTasksForDate(tasks, dateKey);
}

export function getTodayMitTasks(tasks: readonly Task[], dateKey: string): Task[] {
  return getMitTasks(tasks, dateKey);
}

export function getTodaySummary(
  tasks: readonly Task[],
  focusSessions: readonly FocusSession[],
  dateKey: string,
): TodaySummary {
  const todayTasks = getTodayTasks(tasks, dateKey);
  const stats = getTaskCompletionStats(todayTasks);

  return {
    tasks: todayTasks,
    mitTasks: getTodayMitTasks(todayTasks, dateKey),
    total: stats.total,
    completed: stats.completed,
    remaining: stats.remaining,
    completionRate: stats.rate,
    focusMinutes: getFocusMinutesForDate(focusSessions, dateKey),
  };
}

