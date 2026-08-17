export interface Note {
  id: string;
  title: string;
  content: string;
  tags: string[];
  favorite: boolean;
  archived: boolean;
  projectId: string | null;
  createdAt: string;
  updatedAt: string;
}

export type NoteInput = Omit<Note, "id" | "createdAt" | "updatedAt">;
