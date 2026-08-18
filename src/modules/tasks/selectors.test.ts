import { describe, expect, it } from "vitest";
import {
  filterTasks,
  getCompletedTasks,
  getInboxTasks,
  getMitTasks,
  getTaskCompletionStats,
  getTodayTasks,
  getUpcomingTasks,
  sortTasks,
  sortTasksByMitThenOrder,
} from "@/modules/tasks/selectors";
import { createTask, TEST_DATE } from "@/test/factories";

describe("task selectors", () => {
  it("returns only open undated tasks in the inbox", () => {
    const tasks = [
      createTask({ id: "task-inbox", dueDate: null }),
      createTask({ id: "task-dated", dueDate: TEST_DATE }),
      createTask({ id: "task-completed", completed: true, dueDate: null }),
    ];

    expect(getInboxTasks(tasks).map((task) => task.id)).toEqual(["task-inbox"]);
  });

  it("returns tasks whose due date exactly matches today", () => {
    const tasks = [
      createTask({ id: "task-open", dueDate: TEST_DATE, order: 1 }),
      createTask({ id: "task-completed", dueDate: TEST_DATE, completed: true, order: 0 }),
      createTask({ id: "task-other-day", dueDate: "2026-08-19" }),
      createTask({ id: "task-undated", dueDate: null }),
    ];

    expect(getTodayTasks(tasks, TEST_DATE).map((task) => task.id)).toEqual([
      "task-completed",
      "task-open",
    ]);
  });

  it("returns only open future tasks as upcoming", () => {
    const tasks = [
      createTask({ id: "task-future", dueDate: "2026-08-19", order: 1 }),
      createTask({ id: "task-later", dueDate: "2026-08-25", order: 0 }),
      createTask({ id: "task-completed", dueDate: "2026-08-20", completed: true }),
      createTask({ id: "task-today", dueDate: TEST_DATE }),
      createTask({ id: "task-past", dueDate: "2026-08-17" }),
      createTask({ id: "task-undated", dueDate: null }),
    ];

    expect(getUpcomingTasks(tasks, TEST_DATE).map((task) => task.id)).toEqual([
      "task-later",
      "task-future",
    ]);
  });

  it("returns only completed tasks", () => {
    const tasks = [
      createTask({ id: "task-open" }),
      createTask({ id: "task-done-2", completed: true, order: 2 }),
      createTask({ id: "task-done-1", completed: true, order: 1 }),
    ];

    expect(getCompletedTasks(tasks).map((task) => task.id)).toEqual([
      "task-done-1",
      "task-done-2",
    ]);
  });

  it("sorts by order without mutating the input", () => {
    const tasks = [
      createTask({ id: "task-2", order: 2 }),
      createTask({ id: "task-1", order: 1 }),
    ];

    expect(sortTasks(tasks).map((task) => task.id)).toEqual(["task-1", "task-2"]);
    expect(tasks.map((task) => task.id)).toEqual(["task-2", "task-1"]);
  });

  it("places MIT tasks first and then sorts each group by order", () => {
    const tasks = [
      createTask({ id: "regular-1", order: 1 }),
      createTask({ id: "mit-2", isMIT: true, order: 2 }),
      createTask({ id: "mit-0", isMIT: true, order: 0 }),
      createTask({ id: "regular-0", order: 0 }),
    ];

    expect(sortTasksByMitThenOrder(tasks).map((task) => task.id)).toEqual([
      "mit-0",
      "mit-2",
      "regular-0",
      "regular-1",
    ]);
  });

  it.each([
    ["release", "task-title"],
    ["hydration", "task-description"],
    ["regression", "task-tag"],
    ["RELEASE", "task-title"],
  ])("searches title, description, and tags case-insensitively for %s", (search, id) => {
    const tasks = [
      createTask({ id: "task-title", title: "Release baseline" }),
      createTask({ id: "task-description", description: "Fix hydration boundary" }),
      createTask({ id: "task-tag", tags: ["Regression"] }),
    ];

    expect(filterTasks(tasks, { dateKey: TEST_DATE, search }).map((task) => task.id)).toEqual([id]);
  });

  it("combines view, status, priority, project, and search filters", () => {
    const tasks = [
      createTask({
        id: "task-match",
        title: "Ship test baseline",
        dueDate: TEST_DATE,
        priority: "high",
        projectId: "project-1",
      }),
      createTask({ id: "task-wrong-status", title: "Ship test baseline", dueDate: TEST_DATE, completed: true, priority: "high", projectId: "project-1" }),
      createTask({ id: "task-wrong-priority", title: "Ship test baseline", dueDate: TEST_DATE, priority: "low", projectId: "project-1" }),
      createTask({ id: "task-wrong-project", title: "Ship test baseline", dueDate: TEST_DATE, priority: "high", projectId: "project-2" }),
      createTask({ id: "task-wrong-view", title: "Ship test baseline", dueDate: "2026-08-19", priority: "high", projectId: "project-1" }),
    ];

    expect(filterTasks(tasks, {
      dateKey: TEST_DATE,
      view: "today",
      status: "open",
      priority: "high",
      projectId: "project-1",
      search: "baseline",
    }).map((task) => task.id)).toEqual(["task-match"]);
  });

  it("calculates completion totals and rate", () => {
    const tasks = [
      createTask({ id: "task-1", completed: true }),
      createTask({ id: "task-2", completed: true }),
      createTask({ id: "task-3" }),
      createTask({ id: "task-4" }),
    ];

    expect(getTaskCompletionStats(tasks)).toEqual({
      total: 4,
      completed: 2,
      remaining: 2,
      rate: 50,
    });
  });

  it("returns a zero rate for an empty task list", () => {
    expect(getTaskCompletionStats([])).toEqual({
      total: 0,
      completed: 0,
      remaining: 0,
      rate: 0,
    });
  });

  it("returns MIT tasks for the requested date using task order", () => {
    const tasks = [
      createTask({ id: "mit-2", dueDate: TEST_DATE, isMIT: true, order: 2 }),
      createTask({ id: "mit-1", dueDate: TEST_DATE, isMIT: true, completed: true, order: 1 }),
      createTask({ id: "regular", dueDate: TEST_DATE, isMIT: false }),
      createTask({ id: "other-day", dueDate: "2026-08-19", isMIT: true }),
    ];

    expect(getMitTasks(tasks, TEST_DATE).map((task) => task.id)).toEqual(["mit-1", "mit-2"]);
  });
});
