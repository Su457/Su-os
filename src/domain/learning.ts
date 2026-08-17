export interface LearningSession {
  id: string;
  subject: string;
  content: string;
  durationMinutes: number;
  date: string;
  startTime: string | null;
  endTime: string | null;
  note: string;
  createdAt: string;
  updatedAt: string;
}

export type LearningSessionInput = Omit<LearningSession, "id" | "createdAt" | "updatedAt">;
