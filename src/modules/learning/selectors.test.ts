import { describe, expect, it } from "vitest";
import {
  getLearningStreak,
  getLearningSubjectTotals,
  getLearningTrend,
  getMonthLearningMinutes,
  getTodayLearningMinutes,
  getWeekLearningMinutes,
  sortLearningSessions,
} from "@/modules/learning/selectors";
import { createLearningSession, TEST_DATE } from "@/test/factories";

describe("learning selectors", () => {
  const now = new Date(2026, 7, 18, 12, 0, 0);

  it("sorts sessions by date and then creation time descending", () => {
    const sessions = [
      createLearningSession({ id: "older-date", date: "2026-08-17" }),
      createLearningSession({ id: "older-created", createdAt: "2026-08-18T08:00:00.000Z" }),
      createLearningSession({ id: "newer-created", createdAt: "2026-08-18T09:00:00.000Z" }),
    ];

    expect(sortLearningSessions(sessions).map((session) => session.id)).toEqual([
      "newer-created",
      "older-created",
      "older-date",
    ]);
  });

  it("sums only sessions on the requested day", () => {
    const sessions = [
      createLearningSession({ id: "today-1", durationMinutes: 30 }),
      createLearningSession({ id: "today-2", durationMinutes: 45 }),
      createLearningSession({ id: "yesterday", date: "2026-08-17", durationMinutes: 60 }),
    ];

    expect(getTodayLearningMinutes(sessions, TEST_DATE)).toBe(75);
  });

  it("uses Monday-through-Sunday week boundaries", () => {
    const sessions = [
      createLearningSession({ id: "monday", date: "2026-08-17", durationMinutes: 10 }),
      createLearningSession({ id: "tuesday", date: TEST_DATE, durationMinutes: 20 }),
      createLearningSession({ id: "sunday", date: "2026-08-23", durationMinutes: 30 }),
      createLearningSession({ id: "previous-sunday", date: "2026-08-16", durationMinutes: 40 }),
      createLearningSession({ id: "next-monday", date: "2026-08-24", durationMinutes: 50 }),
    ];

    expect(getWeekLearningMinutes(sessions, now)).toBe(60);
  });

  it("uses calendar-month boundaries", () => {
    const sessions = [
      createLearningSession({ id: "first", date: "2026-08-01", durationMinutes: 10 }),
      createLearningSession({ id: "last", date: "2026-08-31", durationMinutes: 20 }),
      createLearningSession({ id: "previous", date: "2026-07-31", durationMinutes: 30 }),
      createLearningSession({ id: "next", date: "2026-09-01", durationMinutes: 40 }),
    ];

    expect(getMonthLearningMinutes(sessions, now)).toBe(30);
  });

  it("aggregates subject totals and sorts by minutes", () => {
    const sessions = [
      createLearningSession({ id: "react-1", subject: "React", durationMinutes: 30 }),
      createLearningSession({ id: "design", subject: "Design", durationMinutes: 45 }),
      createLearningSession({ id: "react-2", subject: "React", durationMinutes: 25 }),
    ];

    expect(getLearningSubjectTotals(sessions)).toEqual([
      { subject: "React", minutes: 55 },
      { subject: "Design", minutes: 45 },
    ]);
  });

  it("calculates a consecutive learning streak from today or yesterday", () => {
    const throughToday = [
      createLearningSession({ id: "today", date: TEST_DATE }),
      createLearningSession({ id: "yesterday", date: "2026-08-17" }),
      createLearningSession({ id: "two-days", date: "2026-08-16" }),
      createLearningSession({ id: "duplicate", date: "2026-08-17" }),
      createLearningSession({ id: "gap", date: "2026-08-14" }),
    ];
    const throughYesterday = throughToday.filter((session) => session.id !== "today");

    expect(getLearningStreak(throughToday, TEST_DATE)).toBe(3);
    expect(getLearningStreak(throughYesterday, TEST_DATE)).toBe(2);
  });

  it("builds a deterministic trend with zero-filled dates", () => {
    const sessions = [
      createLearningSession({ id: "yesterday-1", date: "2026-08-17", durationMinutes: 15 }),
      createLearningSession({ id: "yesterday-2", date: "2026-08-17", durationMinutes: 25 }),
      createLearningSession({ id: "today", date: TEST_DATE, durationMinutes: 30 }),
      createLearningSession({ id: "outside", date: "2026-08-15", durationMinutes: 90 }),
    ];

    expect(getLearningTrend(sessions, TEST_DATE, 3)).toEqual([
      { date: "2026-08-16", minutes: 0 },
      { date: "2026-08-17", minutes: 40 },
      { date: TEST_DATE, minutes: 30 },
    ]);
  });
});
