import type { FocusDraft, FocusSessionInput } from "@/domain/focus";
import type { LearningSessionInput } from "@/domain/learning";
import type { NoteInput } from "@/domain/note";
import type { MilestoneInput, ProjectInput } from "@/domain/project";
import type { SuOsData } from "@/domain/snapshot";
import type { TaskInput } from "@/domain/task";

export type ImportResult = { ok: true } | { ok: false; error: string };

export interface SuOsStoreValue {
  data: SuOsData;
  hydrated: boolean;
  addTask(input: TaskInput): string;
  updateTask(id: string, changes: Partial<TaskInput>): void;
  toggleTask(id: string): void;
  deleteTask(id: string): void;
  setTaskMit(id: string, value: boolean): boolean;
  reorderTasks(orderedIds: string[]): void;
  addNote(input?: Partial<NoteInput>): string;
  updateNote(id: string, changes: Partial<NoteInput>): void;
  deleteNote(id: string): void;
  addProject(input: ProjectInput): string;
  updateProject(id: string, changes: Partial<ProjectInput>): void;
  deleteProject(id: string): void;
  addMilestone(input: MilestoneInput): string;
  updateMilestone(id: string, changes: Partial<MilestoneInput>): void;
  deleteMilestone(id: string): void;
  reorderMilestones(projectId: string, orderedIds: string[]): void;
  addLearningSession(input: LearningSessionInput): string;
  updateLearningSession(id: string, changes: Partial<LearningSessionInput>): void;
  deleteLearningSession(id: string): void;
  addFocusSession(input: FocusSessionInput): string;
  setFocusDraft(draft: FocusDraft | null): void;
  exportData(): string;
  importData(text: string): ImportResult;
  resetDemoData(): void;
  clearAllData(): void;
}
