import type { FocusDraft, FocusSession } from "@/domain/focus";
import type { Project } from "@/domain/project";
import type { Task } from "@/domain/task";
import { getLastDateKeys, isDateThisWeek, toDateKey } from "@/shared/lib/date-utils";

export interface FocusTrendPoint {
  date: string;
  minutes: number;
}

export function getFocusSessionsForDate(
  sessions: readonly FocusSession[],
  dateKey: string,
): FocusSession[] {
  return sessions.filter((session) => toDateKey(new Date(session.completedAt)) === dateKey);
}

export function getFocusMinutesForDate(sessions: readonly FocusSession[], dateKey: string): number {
  return getFocusSessionsForDate(sessions, dateKey)
    .reduce((sum, session) => sum + session.durationMinutes, 0);
}

export function getWeekFocusMinutes(sessions: readonly FocusSession[], now: Date): number {
  return sessions
    .filter((session) => isDateThisWeek(toDateKey(new Date(session.completedAt)), now))
    .reduce((sum, session) => sum + session.durationMinutes, 0);
}

export function getFocusTrend(
  sessions: readonly FocusSession[],
  endDate: string,
  dayCount = 7,
): FocusTrendPoint[] {
  const dates = getLastDateKeys(dayCount, endDate);
  const totals = new Map(dates.map((date) => [date, 0]));

  sessions.forEach((session) => {
    const date = toDateKey(new Date(session.completedAt));
    if (totals.has(date)) totals.set(date, (totals.get(date) ?? 0) + session.durationMinutes);
  });

  return dates.map((date) => ({ date, minutes: totals.get(date) ?? 0 }));
}

export function getFocusTask(tasks: readonly Task[], draft: FocusDraft | null): Task | undefined {
  return tasks.find((task) => task.id === draft?.taskId);
}

export function getFocusProject(
  projects: readonly Project[],
  draft: FocusDraft | null,
  task?: Task,
): Project | undefined {
  const projectId = task?.projectId ?? draft?.projectId;
  return projects.find((project) => project.id === projectId);
}

export function getAvailableFocusTasks(tasks: readonly Task[]): Task[] {
  return tasks.filter((task) => !task.completed);
}

export function getAvailableFocusProjects(projects: readonly Project[]): Project[] {
  return projects.filter((project) => project.status === "active");
}
