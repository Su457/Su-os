import type { SuOsData } from "@/domain/snapshot";
import { isSuOsData } from "@/data/backup/validation";

export const STORAGE_KEY = "su-os:data:v2";

/**
 * Synchronous persistence for one complete browser-local snapshot.
 * This is deliberately not a generic cloud repository contract.
 */
export interface LocalSnapshotRepository {
  load(): SuOsData | null;
  save(data: SuOsData): void;
  clear(): void;
}

export class LocalStorageSnapshotRepository implements LocalSnapshotRepository {
  load(): SuOsData | null {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    try {
      const parsed: unknown = JSON.parse(raw);
      return isSuOsData(parsed) ? parsed : null;
    } catch {
      return null;
    }
  }

  save(data: SuOsData): void {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }

  clear(): void {
    window.localStorage.removeItem(STORAGE_KEY);
  }
}

export const localSnapshotRepository: LocalSnapshotRepository = new LocalStorageSnapshotRepository();
