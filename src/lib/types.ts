export type TaskPriority = "high" | "medium" | "low";
export type ProjectStatus = "active" | "paused" | "completed" | "archived";

export interface Task {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  dueDate: string | null;
  time: string | null;
  priority: TaskPriority;
  projectId: string | null;
  tags: string[];
  isMIT: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
  completedAt: string | null;
}

export interface Note {
  id: string;
  title: string;
  content: string;
  tags: string[];
  favorite: boolean;
  archived: boolean;
  projectId: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  goal: string;
  status: ProjectStatus;
  startDate: string | null;
  dueDate: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Milestone {
  id: string;
  projectId: string;
  title: string;
  completed: boolean;
  dueDate: string | null;
  order: number;
}

export interface LearningSession {
  id: string;
  subject: string;
  content: string;
  durationMinutes: number;
  date: string;
  startTime: string | null;
  endTime: string | null;
  note: string;
  createdAt: string;
  updatedAt: string;
}

export interface FocusSession {
  id: string;
  taskId: string | null;
  projectId: string | null;
  durationMinutes: number;
  startedAt: string;
  completedAt: string;
}

export interface FocusDraft {
  taskId: string | null;
  projectId: string | null;
}

export interface SuOsData {
  schemaVersion: 2;
  tasks: Task[];
  notes: Note[];
  projects: Project[];
  milestones: Milestone[];
  learningSessions: LearningSession[];
  focusSessions: FocusSession[];
  focusDraft: FocusDraft | null;
}

export type TaskInput = Omit<Task, "id" | "createdAt" | "updatedAt" | "completedAt">;
export type NoteInput = Omit<Note, "id" | "createdAt" | "updatedAt">;
export type ProjectInput = Omit<Project, "id" | "createdAt" | "updatedAt">;
export type MilestoneInput = Omit<Milestone, "id">;
export type LearningSessionInput = Omit<LearningSession, "id" | "createdAt" | "updatedAt">;
export type FocusSessionInput = Omit<FocusSession, "id">;
