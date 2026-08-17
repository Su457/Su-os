export type TaskPriority = "high" | "medium" | "low";

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

export type TaskInput = Omit<Task, "id" | "createdAt" | "updatedAt" | "completedAt">;
