export type ProjectStatus = "active" | "paused" | "completed" | "archived";

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

export type ProjectInput = Omit<Project, "id" | "createdAt" | "updatedAt">;
export type MilestoneInput = Omit<Milestone, "id">;
