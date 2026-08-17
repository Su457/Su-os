import type { Note } from "@/domain/note";

export type NoteView = "inbox" | "all" | "favorites" | "archived";

export interface NoteFilters {
  view?: NoteView;
  search?: string;
}

export function sortNotesByUpdatedAt(notes: readonly Note[]): Note[] {
  return [...notes].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}

export function getInboxNotes(notes: readonly Note[]): Note[] {
  return sortNotesByUpdatedAt(notes.filter((note) => !note.archived && !note.projectId));
}

export function getAllNotes(notes: readonly Note[]): Note[] {
  return sortNotesByUpdatedAt(notes.filter((note) => !note.archived));
}

export function getFavoriteNotes(notes: readonly Note[]): Note[] {
  return sortNotesByUpdatedAt(notes.filter((note) => note.favorite && !note.archived));
}

export function getArchivedNotes(notes: readonly Note[]): Note[] {
  return sortNotesByUpdatedAt(notes.filter((note) => note.archived));
}

export function filterNotes(notes: readonly Note[], filters: NoteFilters = {}): Note[] {
  const view = filters.view ?? "all";
  const query = filters.search?.trim().toLocaleLowerCase() ?? "";

  return sortNotesByUpdatedAt(notes.filter((note) => {
    const matchesView = view === "inbox"
      ? !note.archived && !note.projectId
      : view === "all"
        ? !note.archived
        : view === "favorites"
          ? note.favorite && !note.archived
          : note.archived;
    const matchesSearch = !query
      || [note.title, note.content, ...note.tags].join(" ").toLocaleLowerCase().includes(query);

    return matchesView && matchesSearch;
  }));
}

export function getRecentNote(notes: readonly Note[]): Note | undefined {
  return getAllNotes(notes)[0];
}

