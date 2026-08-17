import type { FocusDraft, FocusSession } from "./focus";
import type { LearningSession } from "./learning";
import type { Note } from "./note";
import type { Milestone, Project } from "./project";
import type { Task } from "./task";

export interface DurableData {
  tasks: Task[];
  notes: Note[];
  projects: Project[];
  milestones: Milestone[];
  learningSessions: LearningSession[];
  focusSessions: FocusSession[];
}

export interface DeviceState {
  focusDraft: FocusDraft | null;
}

/**
 * The persisted v2 local snapshot. Device state remains embedded solely so
 * existing `su-os:data:v2` snapshots stay byte-shape compatible.
 */
export interface SuOsData extends DurableData, DeviceState {
  schemaVersion: 2;
}
