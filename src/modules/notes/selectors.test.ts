import { describe, expect, it } from "vitest";
import {
  filterNotes,
  getAllNotes,
  getArchivedNotes,
  getFavoriteNotes,
  getInboxNotes,
  getRecentNote,
  sortNotesByUpdatedAt,
} from "@/modules/notes/selectors";
import { createNote } from "@/test/factories";

describe("note selectors", () => {
  const notes = [
    createNote({ id: "inbox", updatedAt: "2026-08-16T10:00:00.000Z" }),
    createNote({ id: "project", projectId: "project-1", updatedAt: "2026-08-18T10:00:00.000Z" }),
    createNote({ id: "favorite", favorite: true, updatedAt: "2026-08-17T10:00:00.000Z" }),
    createNote({ id: "archived", archived: true, favorite: true, updatedAt: "2026-08-19T10:00:00.000Z" }),
  ];

  it("separates inbox, all, favorite, and archived views", () => {
    expect(getInboxNotes(notes).map((note) => note.id)).toEqual(["favorite", "inbox"]);
    expect(getAllNotes(notes).map((note) => note.id)).toEqual(["project", "favorite", "inbox"]);
    expect(getFavoriteNotes(notes).map((note) => note.id)).toEqual(["favorite"]);
    expect(getArchivedNotes(notes).map((note) => note.id)).toEqual(["archived"]);
  });

  it.each([
    ["roadmap", "note-title"],
    ["hydration", "note-content"],
    ["regression", "note-tag"],
  ])("searches note title, content, and tags for %s", (search, id) => {
    const searchable = [
      createNote({ id: "note-title", title: "Product roadmap" }),
      createNote({ id: "note-content", content: "Hydration investigation" }),
      createNote({ id: "note-tag", tags: ["Regression"] }),
    ];

    expect(filterNotes(searchable, { search }).map((note) => note.id)).toEqual([id]);
  });

  it("does not return archived notes from ordinary search", () => {
    const archived = createNote({ id: "archived", title: "Hidden regression", archived: true });

    expect(filterNotes([archived], { view: "all", search: "regression" })).toEqual([]);
    expect(filterNotes([archived], { view: "archived", search: "regression" })).toEqual([archived]);
  });

  it("sorts by updated time without mutating the input", () => {
    const input = [
      createNote({ id: "old", updatedAt: "2026-08-17T10:00:00.000Z" }),
      createNote({ id: "new", updatedAt: "2026-08-18T10:00:00.000Z" }),
    ];

    expect(sortNotesByUpdatedAt(input).map((note) => note.id)).toEqual(["new", "old"]);
    expect(input.map((note) => note.id)).toEqual(["old", "new"]);
  });

  it("returns the most recently updated non-archived note", () => {
    expect(getRecentNote(notes)?.id).toBe("project");
    expect(getRecentNote([createNote({ archived: true })])).toBeUndefined();
  });
});
