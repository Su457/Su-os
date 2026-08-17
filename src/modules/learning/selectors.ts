import type { LearningSession } from "@/domain/learning";
import {
  getLastDateKeys,
  getLearningStreak as calculateLearningStreak,
  isDateThisMonth,
  isDateThisWeek,
} from "@/shared/lib/date-utils";

export interface LearningTrendPoint {
  date: string;
  minutes: number;
}

export interface LearningSubjectTotal {
  subject: string;
  minutes: number;
}

export function sortLearningSessions(sessions: readonly LearningSession[]): LearningSession[] {
  return [...sessions].sort((a, b) => b.date.localeCompare(a.date) || b.createdAt.localeCompare(a.createdAt));
}

export function getLearningMinutes(sessions: readonly LearningSession[]): number {
  return sessions.reduce((sum, session) => sum + session.durationMinutes, 0);
}

export function getTodayLearningMinutes(sessions: readonly LearningSession[], dateKey: string): number {
  return getLearningMinutes(sessions.filter((session) => session.date === dateKey));
}

export function getWeekLearningMinutes(sessions: readonly LearningSession[], now: Date): number {
  return getLearningMinutes(sessions.filter((session) => isDateThisWeek(session.date, now)));
}

export function getMonthLearningMinutes(sessions: readonly LearningSession[], now: Date): number {
  return getLearningMinutes(sessions.filter((session) => isDateThisMonth(session.date, now)));
}

export function getLearningStreak(sessions: readonly LearningSession[], dateKey: string): number {
  return calculateLearningStreak(sessions.map((session) => session.date), dateKey);
}

export function getLearningSubjectTotals(sessions: readonly LearningSession[]): LearningSubjectTotal[] {
  const totals = new Map<string, number>();

  sessions.forEach((session) => {
    totals.set(session.subject, (totals.get(session.subject) ?? 0) + session.durationMinutes);
  });

  return [...totals.entries()]
    .map(([subject, minutes]) => ({ subject, minutes }))
    .sort((a, b) => b.minutes - a.minutes);
}

export function getLearningTrend(
  sessions: readonly LearningSession[],
  endDate: string,
  dayCount = 7,
): LearningTrendPoint[] {
  const minutesByDate = new Map<string, number>();

  sessions.forEach((session) => {
    minutesByDate.set(session.date, (minutesByDate.get(session.date) ?? 0) + session.durationMinutes);
  });

  return getLastDateKeys(dayCount, endDate).map((date) => ({
    date,
    minutes: minutesByDate.get(date) ?? 0,
  }));
}

