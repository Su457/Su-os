import { describe, expect, it } from "vitest";
import {
  getActiveProjects,
  getProjectMilestones,
  getProjectNotes,
  getProjectProgress,
  getProjectTasks,
  getProjectTaskStats,
} from "@/modules/projects/selectors";
import { createMilestone, createNote, createProject, createTask } from "@/test/factories";

describe("project selectors", () => {
  it("returns associated tasks in task order", () => {
    const tasks = [
      createTask({ id: "task-2", projectId: "project-1", order: 2 }),
      createTask({ id: "task-other", projectId: "project-2", order: 0 }),
      createTask({ id: "task-1", projectId: "project-1", order: 1 }),
    ];

    expect(getProjectTasks(tasks, "project-1").map((task) => task.id)).toEqual([
      "task-1",
      "task-2",
    ]);
  });

  it("returns associated notes by most recent update", () => {
    const notes = [
      createNote({ id: "note-old", projectId: "project-1", updatedAt: "2026-08-17T10:00:00.000Z" }),
      createNote({ id: "note-other", projectId: "project-2", updatedAt: "2026-08-19T10:00:00.000Z" }),
      createNote({ id: "note-new", projectId: "project-1", updatedAt: "2026-08-18T10:00:00.000Z" }),
    ];

    expect(getProjectNotes(notes, "project-1").map((note) => note.id)).toEqual([
      "note-new",
      "note-old",
    ]);
  });

  it("returns associated milestones in milestone order", () => {
    const milestones = [
      createMilestone({ id: "milestone-2", projectId: "project-1", order: 2 }),
      createMilestone({ id: "milestone-other", projectId: "project-2", order: 0 }),
      createMilestone({ id: "milestone-1", projectId: "project-1", order: 1 }),
    ];

    expect(getProjectMilestones(milestones, "project-1").map((milestone) => milestone.id)).toEqual([
      "milestone-1",
      "milestone-2",
    ]);
  });

  it("calculates project task progress", () => {
    const tasks = [
      createTask({ id: "task-1", projectId: "project-1", completed: true }),
      createTask({ id: "task-2", projectId: "project-1", completed: true }),
      createTask({ id: "task-3", projectId: "project-1", completed: true }),
      createTask({ id: "task-4", projectId: "project-1" }),
      createTask({ id: "task-other", projectId: "project-2", completed: true }),
    ];

    expect(getProjectTaskStats(tasks, "project-1")).toEqual({
      total: 4,
      completed: 3,
      remaining: 1,
      progress: 75,
    });
    expect(getProjectProgress(tasks, "project-1")).toBe(75);
  });

  it("returns finite zero progress for a project without tasks", () => {
    const progress = getProjectProgress([], "project-1");

    expect(progress).toBe(0);
    expect(Number.isFinite(progress)).toBe(true);
  });

  it("returns only active projects", () => {
    const projects = [
      createProject({ id: "active", status: "active" }),
      createProject({ id: "paused", status: "paused" }),
      createProject({ id: "completed", status: "completed" }),
      createProject({ id: "archived", status: "archived" }),
    ];

    expect(getActiveProjects(projects).map((project) => project.id)).toEqual(["active"]);
  });
});
