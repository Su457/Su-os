"use client";

import { getDashboardSnapshot } from "@/modules/dashboard/selectors";
import { toDateKey } from "@/shared/lib/date-utils";
import { useSuOsStore } from "@/store/su-os-store";

export function useDashboard() {
  const store = useSuOsStore();
  const now = new Date();

  return {
    hydrated: store.hydrated,
    toggleTask: store.toggleTask,
    ...getDashboardSnapshot(store.data, toDateKey(now), now),
  };
}

