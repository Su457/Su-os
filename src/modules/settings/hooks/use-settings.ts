"use client";

import { getDataCounts } from "@/modules/settings/selectors";
import { useSuOsStore } from "@/store/su-os-store";

export function useSettings() {
  const store = useSuOsStore();

  return {
    hydrated: store.hydrated,
    counts: getDataCounts(store.data),
    exportData: store.exportData,
    importData: store.importData,
    resetDemoData: store.resetDemoData,
    clearAllData: store.clearAllData,
  };
}
