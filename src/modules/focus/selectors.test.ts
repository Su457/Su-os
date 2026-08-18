import { describe, expect, it } from "vitest";
import {
  getAvailableFocusProjects,
  getAvailableFocusTasks,
  getFocusMinutesForDate,
  getFocusProject,
  getFocusSessionsForDate,
  getFocusTask,
  getFocusTrend,
  getWeekFocusMinutes,
} from "@/modules/focus/selectors";
import {
  createFocusDraft,
  createFocusSession,
  createProject,
  createTask,
  TEST_DATE,
} from "@/test/factories";

function localIso(dateKey: string, hour = 12): string {
  const [year, month, day] = dateKey.split("-").map(Number);
  return new Date(year, month - 1, day, hour, 0, 0).toISOString();
}

describe("focus selectors", () => {
  const now = new Date(2026, 7, 18, 12, 0, 0);

  it("groups ISO timestamps by their local date and sums minutes", () => {
    const sessions = [
      createFocusSession({ id: "today-1", completedAt: localIso(TEST_DATE, 9), durationMinutes: 25 }),
      createFocusSession({ id: "today-2", completedAt: localIso(TEST_DATE, 17), durationMinutes: 15 }),
      createFocusSession({ id: "yesterday", completedAt: localIso("2026-08-17"), durationMinutes: 30 }),
    ];

    expect(getFocusSessionsForDate(sessions, TEST_DATE).map((session) => session.id)).toEqual([
      "today-1",
      "today-2",
    ]);
    expect(getFocusMinutesForDate(sessions, TEST_DATE)).toBe(40);
  });

  it("uses local calendar week boundaries", () => {
    const sessions = [
      createFocusSession({ id: "monday", completedAt: localIso("2026-08-17"), durationMinutes: 10 }),
      createFocusSession({ id: "sunday", completedAt: localIso("2026-08-23"), durationMinutes: 20 }),
      createFocusSession({ id: "previous", completedAt: localIso("2026-08-16"), durationMinutes: 30 }),
      createFocusSession({ id: "next", completedAt: localIso("2026-08-24"), durationMinutes: 40 }),
    ];

    expect(getWeekFocusMinutes(sessions, now)).toBe(30);
  });

  it("builds a deterministic focus trend with aggregated minutes", () => {
    const sessions = [
      createFocusSession({ id: "yesterday-1", completedAt: localIso("2026-08-17", 9), durationMinutes: 10 }),
      createFocusSession({ id: "yesterday-2", completedAt: localIso("2026-08-17", 18), durationMinutes: 15 }),
      createFocusSession({ id: "today", completedAt: localIso(TEST_DATE), durationMinutes: 25 }),
    ];

    expect(getFocusTrend(sessions, TEST_DATE, 3)).toEqual([
      { date: "2026-08-16", minutes: 0 },
      { date: "2026-08-17", minutes: 25 },
      { date: TEST_DATE, minutes: 25 },
    ]);
  });

  it("resolves the draft task and prefers its project association", () => {
    const tasks = [createTask({ id: "task-1", projectId: "project-1" })];
    const projects = [
      createProject({ id: "project-1" }),
      createProject({ id: "project-2" }),
    ];
    const draft = createFocusDraft({ taskId: "task-1", projectId: "project-2" });
    const task = getFocusTask(tasks, draft);

    expect(task?.id).toBe("task-1");
    expect(getFocusProject(projects, draft, task)?.id).toBe("project-1");
    expect(getFocusProject(projects, createFocusDraft({ projectId: "project-2" }))?.id).toBe("project-2");
  });

  it("returns only open tasks and active projects as focus options", () => {
    const tasks = [
      createTask({ id: "open" }),
      createTask({ id: "completed", completed: true }),
    ];
    const projects = [
      createProject({ id: "active", status: "active" }),
      createProject({ id: "paused", status: "paused" }),
    ];

    expect(getAvailableFocusTasks(tasks).map((task) => task.id)).toEqual(["open"]);
    expect(getAvailableFocusProjects(projects).map((project) => project.id)).toEqual(["active"]);
  });
});
