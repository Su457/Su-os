"use client";

import { KeyboardEvent, useEffect, useState } from "react";
import type { Note, NoteInput } from "@/domain/note";
import type { Project } from "@/domain/project";
import { GlassSelect } from "@/shared/components/ui/glass-select";
import { Icon } from "@/shared/components/ui/icon";
import { formatDateTime } from "@/shared/lib/date-utils";

export function NoteEditor({ note, projects, onUpdate, onDelete, onBack }: { note: Note; projects: Project[]; onUpdate(changes: Partial<NoteInput>): void; onDelete(): void; onBack(): void }) {
  const [title, setTitle] = useState(note.title);
  const [content, setContent] = useState(note.content);
  const [tags, setTags] = useState(note.tags);
  const [projectId, setProjectId] = useState(note.projectId ?? "");
  const [tagInput, setTagInput] = useState("");
  const [dirty, setDirty] = useState(false);

  useEffect(() => {
    if (!dirty) return;
    const timer = window.setTimeout(() => {
      onUpdate({ title: title.trim() || "无标题笔记", content, tags, projectId: projectId || null });
      setDirty(false);
    }, 500);
    return () => window.clearTimeout(timer);
  }, [content, dirty, onUpdate, projectId, tags, title]);

  function addTag() {
    const tag = tagInput.trim().replace(/^#/, "");
    if (!tag || tags.includes(tag)) return setTagInput("");
    setTags((current) => [...current, tag]);
    setTagInput("");
    setDirty(true);
  }

  function onTagKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Enter" || event.key === ",") {
      event.preventDefault();
      addTag();
    }
  }

  return (
    <section className="flex min-h-[620px] flex-col">
      <header className="flex flex-wrap items-center gap-2 border-b border-white/[0.06] p-3 sm:p-4">
        <button onClick={onBack} className="secondary-button grid size-9 place-items-center lg:hidden" aria-label="返回笔记列表"><Icon name="arrow" className="rotate-180" size={15}/></button>
        <span className={`mr-auto text-[10px] ${dirty ? "text-[#fbbf77]" : "text-[#6ee7b7]"}`}>{dirty ? "正在保存…" : "已保存"}</span>
        <button onClick={() => onUpdate({ favorite: !note.favorite })} className={`secondary-button grid size-9 place-items-center ${note.favorite ? "text-[#fbbf77]" : ""}`} aria-label={note.favorite ? "取消收藏" : "收藏"}><Icon name="star" size={15}/></button>
        <button onClick={() => onUpdate({ archived: !note.archived })} className="secondary-button flex items-center gap-1.5 px-3 py-2 text-[10px]"><Icon name="archive" size={13}/>{note.archived ? "取消归档" : "归档"}</button>
        <button onClick={onDelete} className="danger-button grid size-9 place-items-center" aria-label="删除笔记"><Icon name="trash" size={14}/></button>
      </header>
      <div className="flex-1 p-4 sm:p-6">
        <input value={title} onChange={(event) => { setTitle(event.target.value); setDirty(true); }} className="w-full bg-transparent text-xl font-semibold tracking-[-0.02em] text-white outline-none placeholder:text-[#5f6574] sm:text-2xl" placeholder="无标题笔记"/>
        <div className="mt-3 flex flex-wrap items-center gap-2">
          {tags.map((tag) => <button key={tag} onClick={() => { setTags((current) => current.filter((item) => item !== tag)); setDirty(true); }} className="chip px-2.5 py-1 text-[10px] hover:text-[#fda4af]">#{tag} ×</button>)}
          <input value={tagInput} onChange={(event) => setTagInput(event.target.value)} onKeyDown={onTagKeyDown} onBlur={addTag} className="min-w-28 flex-1 bg-transparent px-1 py-1 text-[10px] text-[#b5bbc9] outline-none placeholder:text-[#626877]" placeholder="添加标签后按回车"/>
        </div>
        <div className="mt-4 flex flex-wrap items-end gap-3 border-y border-white/[0.055] py-3"><div className="w-full min-w-44 sm:w-56"><span className="field-label">关联项目</span><GlassSelect ariaLabel="笔记关联项目" value={projectId} onChange={(value) => { setProjectId(value); setDirty(true); }} options={[{ value: "", label: "Inbox", meta: "暂不关联项目" }, ...projects.map((project) => ({ value: project.id, label: project.name, meta: project.goal }))]}/></div><span className="ml-auto pb-2 text-[10px] text-[#5f6573]">最后修改 {formatDateTime(note.updatedAt)}</span></div>
        <textarea value={content} onChange={(event) => { setContent(event.target.value); setDirty(true); }} className="mt-5 min-h-[360px] w-full resize-none bg-transparent text-[13px] leading-7 text-[#c7cbd5] outline-none placeholder:text-[#585e6c]" placeholder="开始记录…\n\n支持轻量 Markdown 文本。"/>
      </div>
    </section>
  );
}
