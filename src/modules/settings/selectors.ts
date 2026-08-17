import type { SuOsData } from "@/domain/snapshot";

export interface DataCounts {
  tasks: number;
  notes: number;
  projects: number;
  learningSessions: number;
  focusSessions: number;
}

export function getDataCounts(data: SuOsData): DataCounts {
  return {
    tasks: data.tasks.length,
    notes: data.notes.length,
    projects: data.projects.length,
    learningSessions: data.learningSessions.length,
    focusSessions: data.focusSessions.length,
  };
}

