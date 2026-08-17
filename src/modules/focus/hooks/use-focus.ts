"use client";

import { useSuOsStore } from "@/store/su-os-store";

export function useFocus() {
  const store = useSuOsStore();

  return {
    hydrated: store.hydrated,
    focusSessions: store.data.focusSessions,
    focusDraft: store.data.focusDraft,
    tasks: store.data.tasks,
    projects: store.data.projects,
    addFocusSession: store.addFocusSession,
    setFocusDraft: store.setFocusDraft,
  };
}

