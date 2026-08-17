"use client";

import { useSuOsStore } from "@/store/su-os-store";

export function useProjects() {
  const store = useSuOsStore();

  return {
    hydrated: store.hydrated,
    projects: store.data.projects,
    tasks: store.data.tasks,
    notes: store.data.notes,
    milestones: store.data.milestones,
    addProject: store.addProject,
    updateProject: store.updateProject,
    deleteProject: store.deleteProject,
    addMilestone: store.addMilestone,
    updateMilestone: store.updateMilestone,
    deleteMilestone: store.deleteMilestone,
    reorderMilestones: store.reorderMilestones,
    toggleTask: store.toggleTask,
  };
}
