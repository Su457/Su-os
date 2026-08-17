export interface FocusSession {
  id: string;
  taskId: string | null;
  projectId: string | null;
  durationMinutes: number;
  startedAt: string;
  completedAt: string;
}

/**
 * Device-local timer state. It remains inside the v2 local snapshot for
 * backwards compatibility, but must not be treated as cloud-syncable data.
 */
export interface FocusDraft {
  taskId: string | null;
  projectId: string | null;
}

export type FocusSessionInput = Omit<FocusSession, "id">;
