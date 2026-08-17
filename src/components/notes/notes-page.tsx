"use client";

import { useMemo, useState } from "react";
import { EmptyState } from "@/components/ui/empty-state";
import { Icon } from "@/components/ui/icon";
import { LoadingState } from "@/components/ui/loading-state";
import { PageHeader } from "@/components/ui/page-header";
import { formatDateTime } from "@/lib/date-utils";
import { useSuOsStore } from "@/lib/store/su-os-store";
import type { NoteInput } from "@/lib/types";
import { NoteEditor } from "./note-editor";

type NoteView = "inbox" | "all" | "favorites" | "archived";

const views: { value: NoteView; label: string; icon: "inbox" | "note" | "star" | "archive" }[] = [
  { value: "inbox", label: "Inbox", icon: "inbox" }, { value: "all", label: "All Notes", icon: "note" }, { value: "favorites", label: "Favorites", icon: "star" }, { value: "archived", label: "Archive", icon: "archive" },
];

export function NotesPage() {
  const { data, hydrated, addNote, updateNote, deleteNote } = useSuOsStore();
  const [view, setView] = useState<NoteView>("all");
  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [mobileEditing, setMobileEditing] = useState(false);

  const notes = useMemo(() => data.notes.filter((note) => {
    const matchesView = view === "inbox" ? !note.archived && !note.projectId : view === "all" ? !note.archived : view === "favorites" ? note.favorite && !note.archived : note.archived;
    const query = search.trim().toLocaleLowerCase();
    return matchesView && (!query || [note.title, note.content, ...note.tags].join(" ").toLocaleLowerCase().includes(query));
  }).sort((a, b) => b.updatedAt.localeCompare(a.updatedAt)), [data.notes, search, view]);

  if (!hydrated) return <LoadingState/>;
  const selected = data.notes.find((note) => note.id === selectedId) ?? notes[0];

  function createNote() {
    const id = addNote({ projectId: view === "inbox" ? null : undefined });
    setSelectedId(id);
    setMobileEditing(true);
  }

  function removeSelected() {
    if (!selected || !window.confirm(`确定删除笔记“${selected.title}”吗？此操作无法撤销。`)) return;
    deleteNote(selected.id);
    setSelectedId(null);
    setMobileEditing(false);
  }

  return (
    <div>
      <PageHeader eyebrow="Second Brain" title="笔记" description="随手收集，自动保存，并让笔记与项目保持关联。" actionLabel="写一篇笔记" onAction={createNote}/>
      <section className="card overflow-hidden lg:grid lg:grid-cols-[340px_minmax(0,1fr)]">
        <aside className={`${mobileEditing ? "hidden" : "block"} border-white/[0.06] lg:block lg:border-r`}>
          <div className="border-b border-white/[0.06] p-3 sm:p-4"><div className="scrollbar-none mb-3 flex gap-1.5 overflow-x-auto">{views.map((item) => <button key={item.value} onClick={() => { setView(item.value); setSelectedId(null); }} className={`flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-2 text-[10px] ${view === item.value ? "bg-[#9b87f5]/16 text-[#bcb1ff]" : "chip"}`}><Icon name={item.icon} size={12}/>{item.label}</button>)}</div><input value={search} onChange={(event) => setSearch(event.target.value)} className="field-input" placeholder="搜索标题、正文或标签…"/></div>
          <div className="max-h-[620px] overflow-y-auto">{notes.length ? notes.map((note) => <button key={note.id} onClick={() => { setSelectedId(note.id); setMobileEditing(true); }} className={`w-full border-b border-white/[0.05] p-4 text-left transition hover:bg-white/[0.03] ${selected?.id === note.id ? "bg-[#9b87f5]/[0.055]" : ""}`}><div className="flex items-center gap-2"><h3 className="min-w-0 flex-1 truncate text-[13px] text-[#d3d7e0]">{note.title}</h3>{note.favorite && <Icon name="star" size={12} className="text-[#fbbf77]"/>}</div><p className="mt-1.5 line-clamp-2 text-[10px] leading-4 text-[#707685]">{note.content || "暂无正文"}</p><div className="mt-2 flex items-center justify-between gap-2"><span className="truncate text-[9px] text-[#5f6573]">{note.tags.map((tag) => `#${tag}`).join(" ") || "无标签"}</span><span className="shrink-0 text-[9px] text-[#5f6573]">{formatDateTime(note.updatedAt)}</span></div></button>) : <EmptyState title="还没有笔记" description="在这里创建第一篇笔记，内容会自动保存。" actionLabel="写一篇笔记" onAction={createNote}/>}</div>
        </aside>
        <div className={`${mobileEditing ? "block" : "hidden"} lg:block`}>{selected ? <NoteEditor key={selected.id} note={selected} projects={data.projects} onUpdate={(changes: Partial<NoteInput>) => updateNote(selected.id, changes)} onDelete={removeSelected} onBack={() => setMobileEditing(false)}/> : <EmptyState icon="note" title="选择一篇笔记" description="从左侧选择笔记，或者创建一篇新的笔记。" actionLabel="新建笔记" onAction={createNote}/>}</div>
      </section>
    </div>
  );
}
