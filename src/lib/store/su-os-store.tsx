"use client";

import { createContext, useContext, useEffect, useState, useSyncExternalStore } from "react";
import { createDefaultData, createEmptyData } from "@/lib/default-data";
import { localDataRepository, parseImportedData } from "@/lib/storage/local-storage";
import type {
  FocusDraft,
  FocusSession,
  FocusSessionInput,
  LearningSession,
  LearningSessionInput,
  Milestone,
  MilestoneInput,
  Note,
  NoteInput,
  Project,
  ProjectInput,
  SuOsData,
  Task,
  TaskInput,
} from "@/lib/types";

type ImportResult = { ok: true } | { ok: false; error: string };

interface SuOsStoreValue {
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

const SuOsStoreContext = createContext<SuOsStoreValue | null>(null);
const subscribeToHydration = () => () => undefined;

function makeId(prefix: string): string {
  const random = typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(16).slice(2)}`;
  return `${prefix}-${random}`;
}

export function SuOsStoreProvider({ children }: { children: React.ReactNode }) {
  const hydrated = useSyncExternalStore(subscribeToHydration, () => true, () => false);
  const [data, setData] = useState<SuOsData>(() => typeof window === "undefined" ? createEmptyData() : localDataRepository.load() ?? createDefaultData());

  useEffect(() => {
    if (hydrated) localDataRepository.save(data);
  }, [data, hydrated]);

  function addTask(input: TaskInput): string {
    const id = makeId("task");
    const timestamp = new Date().toISOString();
    const task: Task = { ...input, id, createdAt: timestamp, updatedAt: timestamp, completedAt: input.completed ? timestamp : null };
    setData((current) => ({ ...current, tasks: [...current.tasks, task] }));
    return id;
  }

  function updateTask(id: string, changes: Partial<TaskInput>): void {
    const timestamp = new Date().toISOString();
    setData((current) => ({
      ...current,
      tasks: current.tasks.map((task) => {
        if (task.id !== id) return task;
        const completed = changes.completed ?? task.completed;
        const dueDate = changes.dueDate === undefined ? task.dueDate : changes.dueDate;
        const requestedMit = changes.isMIT ?? task.isMIT;
        const otherMitCount = current.tasks.filter((item) => item.id !== id && item.dueDate === dueDate && item.isMIT).length;
        const isMIT = requestedMit && Boolean(dueDate) && otherMitCount < 3;
        return { ...task, ...changes, dueDate, isMIT, completed, updatedAt: timestamp, completedAt: completed ? task.completedAt ?? timestamp : null };
      }),
    }));
  }

  function toggleTask(id: string): void {
    const task = data.tasks.find((item) => item.id === id);
    if (task) updateTask(id, { completed: !task.completed });
  }

  function deleteTask(id: string): void {
    setData((current) => ({
      ...current,
      tasks: current.tasks.filter((task) => task.id !== id),
      focusSessions: current.focusSessions.map((session) => session.taskId === id ? { ...session, taskId: null } : session),
      focusDraft: current.focusDraft?.taskId === id ? null : current.focusDraft,
    }));
  }

  function setTaskMit(id: string, value: boolean): boolean {
    const task = data.tasks.find((item) => item.id === id);
    if (!task) return false;
    if (value) {
      const mitCount = data.tasks.filter((item) => item.dueDate === task.dueDate && item.isMIT && item.id !== id).length;
      if (mitCount >= 3) return false;
    }
    updateTask(id, { isMIT: value });
    return true;
  }

  function reorderTasks(orderedIds: string[]): void {
    const order = new Map(orderedIds.map((id, index) => [id, index]));
    setData((current) => ({ ...current, tasks: current.tasks.map((task) => order.has(task.id) ? { ...task, order: order.get(task.id) ?? task.order, updatedAt: new Date().toISOString() } : task) }));
  }

  function addNote(input: Partial<NoteInput> = {}): string {
    const id = makeId("note");
    const timestamp = new Date().toISOString();
    const note: Note = { id, title: input.title ?? "无标题笔记", content: input.content ?? "", tags: input.tags ?? [], favorite: input.favorite ?? false, archived: input.archived ?? false, projectId: input.projectId ?? null, createdAt: timestamp, updatedAt: timestamp };
    setData((current) => ({ ...current, notes: [note, ...current.notes] }));
    return id;
  }

  function updateNote(id: string, changes: Partial<NoteInput>): void {
    const timestamp = new Date().toISOString();
    setData((current) => ({ ...current, notes: current.notes.map((note) => note.id === id ? { ...note, ...changes, updatedAt: timestamp } : note) }));
  }

  function deleteNote(id: string): void {
    setData((current) => ({ ...current, notes: current.notes.filter((note) => note.id !== id) }));
  }

  function addProject(input: ProjectInput): string {
    const id = makeId("project");
    const timestamp = new Date().toISOString();
    const project: Project = { ...input, id, createdAt: timestamp, updatedAt: timestamp };
    setData((current) => ({ ...current, projects: [...current.projects, project] }));
    return id;
  }

  function updateProject(id: string, changes: Partial<ProjectInput>): void {
    const timestamp = new Date().toISOString();
    setData((current) => ({ ...current, projects: current.projects.map((project) => project.id === id ? { ...project, ...changes, updatedAt: timestamp } : project) }));
  }

  function deleteProject(id: string): void {
    setData((current) => ({
      ...current,
      projects: current.projects.filter((project) => project.id !== id),
      tasks: current.tasks.map((task) => task.projectId === id ? { ...task, projectId: null, updatedAt: new Date().toISOString() } : task),
      notes: current.notes.map((note) => note.projectId === id ? { ...note, projectId: null, updatedAt: new Date().toISOString() } : note),
      milestones: current.milestones.filter((milestone) => milestone.projectId !== id),
      focusSessions: current.focusSessions.map((session) => session.projectId === id ? { ...session, projectId: null } : session),
      focusDraft: current.focusDraft?.projectId === id ? null : current.focusDraft,
    }));
  }

  function addMilestone(input: MilestoneInput): string {
    const id = makeId("milestone");
    const milestone: Milestone = { ...input, id };
    setData((current) => ({ ...current, milestones: [...current.milestones, milestone] }));
    return id;
  }

  function updateMilestone(id: string, changes: Partial<MilestoneInput>): void {
    setData((current) => ({ ...current, milestones: current.milestones.map((milestone) => milestone.id === id ? { ...milestone, ...changes } : milestone) }));
  }

  function deleteMilestone(id: string): void {
    setData((current) => ({ ...current, milestones: current.milestones.filter((milestone) => milestone.id !== id) }));
  }

  function reorderMilestones(projectId: string, orderedIds: string[]): void {
    const order = new Map(orderedIds.map((id, index) => [id, index]));
    setData((current) => ({ ...current, milestones: current.milestones.map((milestone) => milestone.projectId === projectId && order.has(milestone.id) ? { ...milestone, order: order.get(milestone.id) ?? milestone.order } : milestone) }));
  }

  function addLearningSession(input: LearningSessionInput): string {
    const id = makeId("learning");
    const timestamp = new Date().toISOString();
    const session: LearningSession = { ...input, id, createdAt: timestamp, updatedAt: timestamp };
    setData((current) => ({ ...current, learningSessions: [session, ...current.learningSessions] }));
    return id;
  }

  function updateLearningSession(id: string, changes: Partial<LearningSessionInput>): void {
    const timestamp = new Date().toISOString();
    setData((current) => ({ ...current, learningSessions: current.learningSessions.map((session) => session.id === id ? { ...session, ...changes, updatedAt: timestamp } : session) }));
  }

  function deleteLearningSession(id: string): void {
    setData((current) => ({ ...current, learningSessions: current.learningSessions.filter((session) => session.id !== id) }));
  }

  function addFocusSession(input: FocusSessionInput): string {
    const id = makeId("focus");
    const session: FocusSession = { ...input, id };
    setData((current) => ({ ...current, focusSessions: [...current.focusSessions, session], focusDraft: null }));
    return id;
  }

  function setFocusDraft(focusDraft: FocusDraft | null): void {
    setData((current) => ({ ...current, focusDraft }));
  }

  function exportData(): string {
    return JSON.stringify(data, null, 2);
  }

  function importData(text: string): ImportResult {
    try {
      setData(parseImportedData(text));
      return { ok: true };
    } catch (error) {
      return { ok: false, error: error instanceof Error ? error.message : "无法导入数据。" };
    }
  }

  function resetDemoData(): void {
    setData(createDefaultData());
  }

  function clearAllData(): void {
    setData(createEmptyData());
  }

  const value: SuOsStoreValue = {
    data, hydrated, addTask, updateTask, toggleTask, deleteTask, setTaskMit, reorderTasks,
    addNote, updateNote, deleteNote, addProject, updateProject, deleteProject,
    addMilestone, updateMilestone, deleteMilestone, reorderMilestones,
    addLearningSession, updateLearningSession, deleteLearningSession,
    addFocusSession, setFocusDraft, exportData, importData, resetDemoData, clearAllData,
  };

  return <SuOsStoreContext.Provider value={value}>{children}</SuOsStoreContext.Provider>;
}

export function useSuOsStore(): SuOsStoreValue {
  const store = useContext(SuOsStoreContext);
  if (!store) throw new Error("useSuOsStore must be used inside SuOsStoreProvider");
  return store;
}
