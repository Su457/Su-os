import type { Note } from "@/domain/note";
import type { Milestone, Project, ProjectStatus } from "@/domain/project";
import type { Task } from "@/domain/task";
import { sortNotesByUpdatedAt } from "@/modules/notes/selectors";
import { getTaskCompletionStats, sortTasks } from "@/modules/tasks/selectors";

export type ProjectFilter = "current" | ProjectStatus;

export interface ProjectTaskStats {
  total: number;
  completed: number;
  remaining: number;
  progress: number;
}

export function getProjectsByFilter(projects: readonly Project[], filter: ProjectFilter): Project[] {
  return projects.filter((project) => filter === "current"
    ? project.status !== "archived"
    : project.status === filter);
}

export function getActiveProjects(projects: readonly Project[]): Project[] {
  return projects.filter((project) => project.status === "active");
}

export function getProjectTasks(tasks: readonly Task[], projectId: string): Task[] {
  return sortTasks(tasks.filter((task) => task.projectId === projectId));
}

export function getProjectNotes(notes: readonly Note[], projectId: string): Note[] {
  return sortNotesByUpdatedAt(notes.filter((note) => note.projectId === projectId));
}

export function getProjectMilestones(milestones: readonly Milestone[], projectId: string): Milestone[] {
  return milestones
    .filter((milestone) => milestone.projectId === projectId)
    .sort((a, b) => a.order - b.order);
}

export function getProjectTaskStats(tasks: readonly Task[], projectId: string): ProjectTaskStats {
  const stats = getTaskCompletionStats(tasks.filter((task) => task.projectId === projectId));

  return {
    total: stats.total,
    completed: stats.completed,
    remaining: stats.remaining,
    progress: stats.rate,
  };
}

export function getProjectProgress(tasks: readonly Task[], projectId: string): number {
  return getProjectTaskStats(tasks, projectId).progress;
}

