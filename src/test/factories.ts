import type { FocusDraft, FocusSession } from "@/domain/focus";
import type { LearningSession } from "@/domain/learning";
import type { Note } from "@/domain/note";
import type { Milestone, Project } from "@/domain/project";
import type { SuOsData } from "@/domain/snapshot";
import type { Task } from "@/domain/task";

export const TEST_DATE = "2026-08-18";
export const TEST_TIMESTAMP = "2026-08-18T04:00:00.000Z";

export function createTask(overrides: Partial<Task> = {}): Task {
  return {
    id: "task-1",
    title: "Test task",
    description: "",
    completed: false,
    dueDate: null,
    time: null,
    priority: "medium",
    projectId: null,
    tags: [],
    isMIT: false,
    order: 0,
    createdAt: TEST_TIMESTAMP,
    updatedAt: TEST_TIMESTAMP,
    completedAt: null,
    ...overrides,
  };
}

export function createProject(overrides: Partial<Project> = {}): Project {
  return {
    id: "project-1",
    name: "Test project",
    description: "",
    goal: "",
    status: "active",
    startDate: null,
    dueDate: null,
    createdAt: TEST_TIMESTAMP,
    updatedAt: TEST_TIMESTAMP,
    ...overrides,
  };
}

export function createMilestone(overrides: Partial<Milestone> = {}): Milestone {
  return {
    id: "milestone-1",
    projectId: "project-1",
    title: "Test milestone",
    completed: false,
    dueDate: null,
    order: 0,
    ...overrides,
  };
}

export function createNote(overrides: Partial<Note> = {}): Note {
  return {
    id: "note-1",
    title: "Test note",
    content: "",
    tags: [],
    favorite: false,
    archived: false,
    projectId: null,
    createdAt: TEST_TIMESTAMP,
    updatedAt: TEST_TIMESTAMP,
    ...overrides,
  };
}

export function createLearningSession(overrides: Partial<LearningSession> = {}): LearningSession {
  return {
    id: "learning-1",
    subject: "Test subject",
    content: "Test content",
    durationMinutes: 30,
    date: TEST_DATE,
    startTime: null,
    endTime: null,
    note: "",
    createdAt: TEST_TIMESTAMP,
    updatedAt: TEST_TIMESTAMP,
    ...overrides,
  };
}

export function createFocusSession(overrides: Partial<FocusSession> = {}): FocusSession {
  return {
    id: "focus-1",
    taskId: null,
    projectId: null,
    durationMinutes: 25,
    startedAt: "2026-08-18T03:35:00.000Z",
    completedAt: TEST_TIMESTAMP,
    ...overrides,
  };
}

export function createFocusDraft(overrides: Partial<FocusDraft> = {}): FocusDraft {
  return {
    taskId: null,
    projectId: null,
    ...overrides,
  };
}

export function createSuOsData(overrides: Partial<SuOsData> = {}): SuOsData {
  return {
    schemaVersion: 2,
    tasks: [],
    notes: [],
    projects: [],
    milestones: [],
    learningSessions: [],
    focusSessions: [],
    focusDraft: null,
    ...overrides,
  };
}
