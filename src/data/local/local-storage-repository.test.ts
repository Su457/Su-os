import { afterEach, describe, expect, it, vi } from "vitest";
import {
  LocalStorageSnapshotRepository,
  STORAGE_KEY,
} from "@/data/local/local-storage-repository";
import { createSuOsData } from "@/test/factories";

function stubLocalStorage() {
  const getItem = vi.fn<(key: string) => string | null>(() => null);
  const setItem = vi.fn<(key: string, value: string) => void>(() => undefined);
  const removeItem = vi.fn<(key: string) => void>(() => undefined);
  vi.stubGlobal("window", { localStorage: { getItem, setItem, removeItem } });
  return { getItem, setItem, removeItem };
}

describe("LocalStorageSnapshotRepository", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("returns empty when the storage key does not exist", () => {
    const storage = stubLocalStorage();
    const repository = new LocalStorageSnapshotRepository();

    expect(repository.load()).toEqual({ status: "empty", data: null });
    expect(storage.getItem).toHaveBeenCalledWith(STORAGE_KEY);
  });

  it("loads a valid snapshot", () => {
    const storage = stubLocalStorage();
    const data = createSuOsData();
    storage.getItem.mockReturnValue(JSON.stringify(data));
    const repository = new LocalStorageSnapshotRepository();

    expect(repository.load()).toEqual({ status: "loaded", data });
  });

  it("returns invalid for malformed JSON", () => {
    const storage = stubLocalStorage();
    storage.getItem.mockReturnValue("{ broken");
    const repository = new LocalStorageSnapshotRepository();

    expect(repository.load()).toEqual({ status: "invalid", data: null });
  });

  it("returns invalid for JSON that is not a Su OS snapshot", () => {
    const storage = stubLocalStorage();
    storage.getItem.mockReturnValue(JSON.stringify({ schemaVersion: 2 }));
    const repository = new LocalStorageSnapshotRepository();

    expect(repository.load()).toEqual({ status: "invalid", data: null });
  });

  it("returns unavailable when reading localStorage throws", () => {
    const storage = stubLocalStorage();
    storage.getItem.mockImplementation(() => {
      throw new Error("storage unavailable");
    });
    const repository = new LocalStorageSnapshotRepository();

    expect(repository.load()).toEqual({ status: "unavailable", data: null });
  });

  it("serializes and saves a snapshot", () => {
    const storage = stubLocalStorage();
    const data = createSuOsData();
    const repository = new LocalStorageSnapshotRepository();

    expect(repository.save(data)).toBe(true);
    expect(storage.setItem).toHaveBeenCalledWith(STORAGE_KEY, JSON.stringify(data));
  });

  it("returns false when saving throws", () => {
    const storage = stubLocalStorage();
    storage.setItem.mockImplementation(() => {
      throw new Error("quota exceeded");
    });
    const repository = new LocalStorageSnapshotRepository();

    expect(repository.save(createSuOsData())).toBe(false);
  });

  it("clears the snapshot key", () => {
    const storage = stubLocalStorage();
    const repository = new LocalStorageSnapshotRepository();

    expect(repository.clear()).toBe(true);
    expect(storage.removeItem).toHaveBeenCalledWith(STORAGE_KEY);
  });

  it("returns false when clearing throws", () => {
    const storage = stubLocalStorage();
    storage.removeItem.mockImplementation(() => {
      throw new Error("storage unavailable");
    });
    const repository = new LocalStorageSnapshotRepository();

    expect(repository.clear()).toBe(false);
  });
});
