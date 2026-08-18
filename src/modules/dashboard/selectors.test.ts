import { describe, expect, it } from "vitest";
import { getDashboardSnapshot } from "@/modules/dashboard/selectors";
import {
  createFocusSession,
  createLearningSession,
  createNote,
  createProject,
  createSuOsData,
  createTask,
  TEST_DATE,
} from "@/test/factories";

function localIso(dateKey: string): string {
  const [year, month, day] = dateKey.split("-").map(Number);
  return new Date(year, month - 1, day, 12, 0, 0).toISOString();
}

describe("dashboard selector composition", () => {
  it("composes a stable dashboard snapshot from module selectors", () => {
    const data = createSuOsData({
      projects: [
        createProject({ id: "project-1", name: "Active project", status: "active" }),
        createProject({ id: "project-2", name: "Paused project", status: "paused" }),
      ],
      tasks: [
        createTask({ id: "today-regular", dueDate: TEST_DATE, projectId: "project-1", order: 0 }),
        createTask({ id: "today-completed", dueDate: TEST_DATE, projectId: "project-1", completed: true, order: 1 }),
        createTask({ id: "today-mit", dueDate: TEST_DATE, projectId: "project-1", isMIT: true, order: 2 }),
        createTask({ id: "future-completed", dueDate: "2026-08-19", projectId: "project-1", completed: true, order: 3 }),
        createTask({ id: "paused-project-task", projectId: "project-2", completed: true, order: 4 }),
      ],
      learningSessions: [
        createLearningSession({ id: "learning-today", date: TEST_DATE, durationMinutes: 30 }),
        createLearningSession({ id: "learning-yesterday", date: "2026-08-17", durationMinutes: 20 }),
      ],
      focusSessions: [
        createFocusSession({ id: "focus-today", completedAt: localIso(TEST_DATE), durationMinutes: 25 }),
        createFocusSession({ id: "focus-yesterday", completedAt: localIso("2026-08-17"), durationMinutes: 10 }),
      ],
      notes: [
        createNote({ id: "recent", updatedAt: "2026-08-18T10:00:00.000Z" }),
        createNote({ id: "older", updatedAt: "2026-08-17T10:00:00.000Z" }),
        createNote({ id: "archived-newer", archived: true, updatedAt: "2026-08-19T10:00:00.000Z" }),
      ],
    });
    const now = new Date(2026, 7, 18, 12, 0, 0);

    const snapshot = getDashboardSnapshot(data, TEST_DATE, now);

    expect(snapshot.today).toBe(TEST_DATE);
    expect(snapshot.todayTasks.map((task) => task.id)).toEqual([
      "today-mit",
      "today-regular",
      "today-completed",
    ]);
    expect(snapshot.todayMits.map((task) => task.id)).toEqual(["today-mit"]);
    expect(snapshot.completedTodayTasks).toBe(1);
    expect(snapshot.todayTaskProgress).toBe(33);
    expect(snapshot.todayFocusMinutes).toBe(25);
    expect(snapshot.todayLearningMinutes).toBe(30);
    expect(snapshot.weekLearningMinutes).toBe(50);
    expect(snapshot.learningStreak).toBe(2);
    expect(snapshot.projectNames).toEqual({
      "project-1": "Active project",
      "project-2": "Paused project",
    });
    expect(snapshot.activeProjects).toHaveLength(1);
    expect(snapshot.activeProjects[0]).toMatchObject({
      totalTasks: 4,
      completedTasks: 2,
      progress: 50,
    });
    expect(snapshot.activeProjects[0].project.id).toBe("project-1");
    expect(snapshot.recentNote?.id).toBe("recent");
    expect(snapshot.trend.at(-2)).toEqual({ date: "2026-08-17", minutes: 30 });
    expect(snapshot.trend.at(-1)).toEqual({ date: TEST_DATE, minutes: 55 });
    expect(snapshot.maxTrendMinutes).toBe(55);
  });
});
