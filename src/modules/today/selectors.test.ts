import { describe, expect, it } from "vitest";
import { getTodaySummary } from "@/modules/today/selectors";
import { createFocusSession, createTask, TEST_DATE } from "@/test/factories";

function localIso(dateKey: string): string {
  const [year, month, day] = dateKey.split("-").map(Number);
  return new Date(year, month - 1, day, 12, 0, 0).toISOString();
}

describe("today selectors", () => {
  it("combines today's tasks, MITs, completion stats, and focus minutes", () => {
    const tasks = [
      createTask({ id: "today-open", dueDate: TEST_DATE, order: 2 }),
      createTask({ id: "today-done-mit", dueDate: TEST_DATE, completed: true, isMIT: true, order: 1 }),
      createTask({ id: "future", dueDate: "2026-08-19", isMIT: true, order: 0 }),
      createTask({ id: "inbox", dueDate: null, order: 0 }),
    ];
    const focusSessions = [
      createFocusSession({ id: "today-1", completedAt: localIso(TEST_DATE), durationMinutes: 25 }),
      createFocusSession({ id: "today-2", completedAt: localIso(TEST_DATE), durationMinutes: 15 }),
      createFocusSession({ id: "yesterday", completedAt: localIso("2026-08-17"), durationMinutes: 30 }),
    ];

    const summary = getTodaySummary(tasks, focusSessions, TEST_DATE);

    expect(summary.tasks.map((task) => task.id)).toEqual(["today-done-mit", "today-open"]);
    expect(summary.mitTasks.map((task) => task.id)).toEqual(["today-done-mit"]);
    expect(summary).toMatchObject({
      total: 2,
      completed: 1,
      remaining: 1,
      completionRate: 50,
      focusMinutes: 40,
    });
  });
});
