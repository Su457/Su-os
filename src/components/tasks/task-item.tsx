"use client";

import { Icon } from "@/components/ui/icon";
import { formatDate } from "@/lib/date-utils";
import type { Project, Task } from "@/lib/types";

const priorityMap = {
  high: { label: "高", className: "bg-[#fb7185]" },
  medium: { label: "中", className: "bg-[#fbbf77]" },
  low: { label: "低", className: "bg-[#6ee7b7]" },
};

export function TaskItem({ task, project, onToggle, onEdit, onDelete, onMit, onFocus, onMoveUp, onMoveDown }: { task: Task; project?: Project; onToggle(): void; onEdit(): void; onDelete(): void; onMit?(): void; onFocus?(): void; onMoveUp?(): void; onMoveDown?(): void }) {
  const priority = priorityMap[task.priority];
  return (
    <article className={`border-b border-white/[0.055] p-4 transition last:border-b-0 hover:bg-white/[0.025] sm:p-5 ${task.isMIT ? "bg-[#9b87f5]/[0.035]" : ""}`}>
      <div className="flex items-start gap-3">
        <button aria-label={task.completed ? "取消完成" : "完成任务"} onClick={onToggle} className={`mt-0.5 grid size-5 shrink-0 place-items-center rounded-md border transition ${task.completed ? "border-[#9b87f5] bg-[#9b87f5] text-white" : "border-white/20 text-transparent hover:border-[#9b87f5]"}`}><Icon name="check" size={12} strokeWidth={2.5}/></button>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2"><h3 className={`text-[13px] font-medium ${task.completed ? "text-[#696f7e] line-through" : "text-[#d9dce5]"}`}>{task.title}</h3>{task.isMIT && <span className="rounded-full bg-[#9b87f5]/15 px-2 py-0.5 text-[9px] font-semibold text-[#b6a9ff]">MIT</span>}<span className={`size-1.5 rounded-full ${priority.className}`} title={`${priority.label}优先级`}/></div>
          {task.description && <p className="mt-1 line-clamp-2 text-[11px] leading-5 text-[#747a89]">{task.description}</p>}
          <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-[10px] text-[#666c7a]"><span>{formatDate(task.dueDate)}{task.time ? ` · ${task.time}` : ""}</span>{project && <span className="text-[#9d90ea]">{project.name}</span>}{task.tags.map((tag) => <span key={tag}>#{tag}</span>)}</div>
        </div>
      </div>
      <div className="mt-3 flex flex-wrap items-center justify-end gap-1.5 pl-8">
        {onMoveUp && <button aria-label="上移" onClick={onMoveUp} className="secondary-button grid size-8 place-items-center"><Icon name="chevronUp" size={14}/></button>}
        {onMoveDown && <button aria-label="下移" onClick={onMoveDown} className="secondary-button grid size-8 place-items-center"><Icon name="chevronDown" size={14}/></button>}
        {onMit && <button onClick={onMit} className={`rounded-lg px-2.5 py-2 text-[10px] ${task.isMIT ? "bg-[#9b87f5]/15 text-[#b6a9ff]" : "secondary-button"}`}>{task.isMIT ? "取消 MIT" : "设为 MIT"}</button>}
        {onFocus && !task.completed && <button onClick={onFocus} className="secondary-button flex items-center gap-1.5 px-2.5 py-2 text-[10px]"><Icon name="play" size={12}/>专注</button>}
        <button aria-label="编辑" onClick={onEdit} className="secondary-button grid size-8 place-items-center"><Icon name="edit" size={14}/></button>
        <button aria-label="删除" onClick={onDelete} className="danger-button grid size-8 place-items-center"><Icon name="trash" size={14}/></button>
      </div>
    </article>
  );
}
