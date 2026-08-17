"use client";

import { useSuOsStore } from "@/store/su-os-store";

export function useTasks() {
  const store = useSuOsStore();

  return {
    hydrated: store.hydrated,
    tasks: store.data.tasks,
    projects: store.data.projects,
    addTask: store.addTask,
    updateTask: store.updateTask,
    toggleTask: store.toggleTask,
    deleteTask: store.deleteTask,
    setTaskMit: store.setTaskMit,
    reorderTasks: store.reorderTasks,
  };
}

