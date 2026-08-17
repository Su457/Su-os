import type { Task, TaskPriority } from "@/domain/task";

export type TaskView = "inbox" | "today" | "upcoming" | "completed" | "all";
export type TaskStatusFilter = "all" | "open" | "completed";

export interface TaskFilters {
  view?: TaskView;
  dateKey: string;
  search?: string;
  status?: TaskStatusFilter;
  priority?: "all" | TaskPriority;
  projectId?: "all" | string;
}

export interface TaskCompletionStats {
  total: number;
  completed: number;
  remaining: number;
  rate: number;
}

function matchesView(task: Task, view: TaskView, dateKey: string): boolean {
  if (view === "inbox") return !task.completed && !task.dueDate;
  if (view === "today") return task.dueDate === dateKey;
  if (view === "upcoming") return !task.completed && Boolean(task.dueDate && task.dueDate > dateKey);
  if (view === "completed") return task.completed;
  return true;
}

export function sortTasks(tasks: readonly Task[]): Task[] {
  return [...tasks].sort((a, b) => a.order - b.order);
}

export function sortTasksByMitThenOrder(tasks: readonly Task[]): Task[] {
  return [...tasks].sort((a, b) => Number(b.isMIT) - Number(a.isMIT) || a.order - b.order);
}

export function getInboxTasks(tasks: readonly Task[]): Task[] {
  return sortTasks(tasks.filter((task) => !task.completed && !task.dueDate));
}

export function getTodayTasks(tasks: readonly Task[], dateKey: string): Task[] {
  return sortTasks(tasks.filter((task) => task.dueDate === dateKey));
}

export function getUpcomingTasks(tasks: readonly Task[], dateKey: string): Task[] {
  return sortTasks(tasks.filter((task) => !task.completed && Boolean(task.dueDate && task.dueDate > dateKey)));
}

export function getCompletedTasks(tasks: readonly Task[]): Task[] {
  return sortTasks(tasks.filter((task) => task.completed));
}

export function getAllTasks(tasks: readonly Task[]): Task[] {
  return sortTasks(tasks);
}

export function getTasksByView(tasks: readonly Task[], view: TaskView, dateKey: string): Task[] {
  return sortTasks(tasks.filter((task) => matchesView(task, view, dateKey)));
}

export function filterTasks(tasks: readonly Task[], filters: TaskFilters): Task[] {
  const query = filters.search?.trim().toLocaleLowerCase() ?? "";
  const view = filters.view ?? "all";
  const status = filters.status ?? "all";
  const priority = filters.priority ?? "all";
  const projectId = filters.projectId ?? "all";

  return sortTasks(tasks.filter((task) => {
    const matchesSearch = !query
      || [task.title, task.description, ...task.tags].join(" ").toLocaleLowerCase().includes(query);
    const matchesStatus = status === "all" || (status === "completed") === task.completed;
    const matchesPriority = priority === "all" || task.priority === priority;
    const matchesProject = projectId === "all" || task.projectId === projectId;

    return matchesView(task, view, filters.dateKey)
      && matchesSearch
      && matchesStatus
      && matchesPriority
      && matchesProject;
  }));
}

export function getTaskCompletionStats(tasks: readonly Task[]): TaskCompletionStats {
  const completed = tasks.filter((task) => task.completed).length;
  const total = tasks.length;

  return {
    total,
    completed,
    remaining: total - completed,
    rate: total ? Math.round((completed / total) * 100) : 0,
  };
}

export function getTaskCompletionRate(tasks: readonly Task[]): number {
  return getTaskCompletionStats(tasks).rate;
}

export function getMitTasks(tasks: readonly Task[], dateKey: string): Task[] {
  return sortTasks(tasks.filter((task) => task.dueDate === dateKey && task.isMIT));
}

