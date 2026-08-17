"use client";

import { useSuOsStore } from "@/store/su-os-store";

export function useNotes() {
  const store = useSuOsStore();

  return {
    hydrated: store.hydrated,
    notes: store.data.notes,
    projects: store.data.projects,
    addNote: store.addNote,
    updateNote: store.updateNote,
    deleteNote: store.deleteNote,
  };
}

