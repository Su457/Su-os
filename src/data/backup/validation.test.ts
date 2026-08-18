import { describe, expect, it } from "vitest";
import { isSuOsData, parseImportedData } from "@/data/backup/validation";
import {
  createFocusDraft,
  createFocusSession,
  createLearningSession,
  createMilestone,
  createNote,
  createProject,
  createSuOsData,
  createTask,
} from "@/test/factories";

function createValidSnapshot() {
  return createSuOsData({
    tasks: [createTask()],
    notes: [createNote()],
    projects: [createProject()],
    milestones: [createMilestone()],
    learningSessions: [createLearningSession()],
    focusSessions: [createFocusSession()],
    focusDraft: createFocusDraft(),
  });
}

function cloneAsRecord(): Record<string, unknown> {
  return JSON.parse(JSON.stringify(createValidSnapshot())) as Record<string, unknown>;
}

describe("backup validation", () => {
  it("accepts and parses a valid schemaVersion 2 snapshot", () => {
    const snapshot = createValidSnapshot();

    expect(isSuOsData(snapshot)).toBe(true);
    expect(parseImportedData(JSON.stringify(snapshot))).toEqual(snapshot);
  });

  it("rejects invalid JSON", () => {
    expect(() => parseImportedData("{ broken")).toThrow();
  });

  it("rejects the wrong schema version", () => {
    const snapshot = cloneAsRecord();
    snapshot.schemaVersion = 999;

    expect(isSuOsData(snapshot)).toBe(false);
    expect(() => parseImportedData(JSON.stringify(snapshot))).toThrow("文件不是有效的 Su OS v0.2 数据。");
  });

  it.each(["tasks", "projects", "notes"])("rejects a snapshot missing %s", (field) => {
    const snapshot = cloneAsRecord();
    delete snapshot[field];

    expect(isSuOsData(snapshot)).toBe(false);
  });

  it("rejects an invalid entity field type", () => {
    const snapshot = cloneAsRecord();
    const tasks = snapshot.tasks as Array<Record<string, unknown>>;
    tasks[0].completed = "yes";

    expect(isSuOsData(snapshot)).toBe(false);
  });

  it("rejects an unsupported task priority", () => {
    const snapshot = cloneAsRecord();
    const tasks = snapshot.tasks as Array<Record<string, unknown>>;
    tasks[0].priority = "super-high";

    expect(isSuOsData(snapshot)).toBe(false);
  });

  it("rejects an unsupported project status", () => {
    const snapshot = cloneAsRecord();
    const projects = snapshot.projects as Array<Record<string, unknown>>;
    projects[0].status = "blocked";

    expect(isSuOsData(snapshot)).toBe(false);
  });
});
