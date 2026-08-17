"use client";

import { useSuOsStore } from "@/store/su-os-store";

export function useLearning() {
  const store = useSuOsStore();

  return {
    hydrated: store.hydrated,
    learningSessions: store.data.learningSessions,
    addLearningSession: store.addLearningSession,
    updateLearningSession: store.updateLearningSession,
    deleteLearningSession: store.deleteLearningSession,
  };
}

