import type { SuOsData } from "@/domain/snapshot";
import { isSuOsData } from "@/data/backup/validation";

export const STORAGE_KEY = "su-os:data:v2";

export type LocalSnapshotLoadResult =
  | { status: "loaded"; data: SuOsData }
  | { status: "empty" | "invalid" | "unavailable"; data: null };

/**
 * Synchronous persistence for one complete browser-local snapshot.
 * This is deliberately not a generic cloud repository contract.
 */
export interface LocalSnapshotRepository {
  load(): LocalSnapshotLoadResult;
  save(data: SuOsData): boolean;
  clear(): boolean;
}

export class LocalStorageSnapshotRepository implements LocalSnapshotRepository {
  load(): LocalSnapshotLoadResult {
    let raw: string | null;
    try {
      raw = window.localStorage.getItem(STORAGE_KEY);
    } catch {
      return { status: "unavailable", data: null };
    }

    if (!raw) return { status: "empty", data: null };

    try {
      const parsed: unknown = JSON.parse(raw);
      return isSuOsData(parsed)
        ? { status: "loaded", data: parsed }
        : { status: "invalid", data: null };
    } catch {
      return { status: "invalid", data: null };
    }
  }

  save(data: SuOsData): boolean {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      return true;
    } catch {
      return false;
    }
  }

  clear(): boolean {
    try {
      window.localStorage.removeItem(STORAGE_KEY);
      return true;
    } catch {
      return false;
    }
  }
}

export const localSnapshotRepository: LocalSnapshotRepository = new LocalStorageSnapshotRepository();
