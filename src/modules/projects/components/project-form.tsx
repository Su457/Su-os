"use client";

import { FormEvent, useState } from "react";
import type { Project, ProjectInput, ProjectStatus } from "@/domain/project";
import { GlassSelect } from "@/shared/components/ui/glass-select";

export function ProjectForm({ project, onSubmit, onCancel }: { project?: Project; onSubmit(input: ProjectInput): void; onCancel(): void }) {
  const [name, setName] = useState(project?.name ?? "");
  const [description, setDescription] = useState(project?.description ?? "");
  const [goal, setGoal] = useState(project?.goal ?? "");
  const [status, setStatus] = useState<ProjectStatus>(project?.status ?? "active");
  const [startDate, setStartDate] = useState(project?.startDate ?? "");
  const [dueDate, setDueDate] = useState(project?.dueDate ?? "");

  function submit(event: FormEvent) {
    event.preventDefault();
    if (!name.trim()) return;
    onSubmit({ name: name.trim(), description: description.trim(), goal: goal.trim(), status, startDate: startDate || null, dueDate: dueDate || null });
  }

  return <form onSubmit={submit} className="space-y-4"><label><span className="field-label">项目名称 *</span><input autoFocus required value={name} onChange={(event) => setName(event.target.value)} className="field-input" placeholder="例如：Su OS"/></label><label><span className="field-label">项目说明</span><textarea value={description} onChange={(event) => setDescription(event.target.value)} rows={3} className="field-input resize-none" placeholder="这个项目为什么值得做？"/></label><label><span className="field-label">项目目标</span><input value={goal} onChange={(event) => setGoal(event.target.value)} className="field-input" placeholder="清晰、可判断的完成目标"/></label><div className="grid grid-cols-1 gap-3 sm:grid-cols-3"><label><span className="field-label">状态</span><GlassSelect ariaLabel="项目状态" value={status} onChange={(value) => setStatus(value as ProjectStatus)} options={[{ value: "active", label: "进行中" }, { value: "paused", label: "已暂停" }, { value: "completed", label: "已完成" }, { value: "archived", label: "已归档" }]}/></label><label><span className="field-label">开始日期</span><input type="date" value={startDate} onChange={(event) => setStartDate(event.target.value)} className="field-input"/></label><label><span className="field-label">截止日期</span><input type="date" value={dueDate} onChange={(event) => setDueDate(event.target.value)} className="field-input"/></label></div><div className="flex justify-end gap-2 pt-2"><button type="button" onClick={onCancel} className="secondary-button px-4 py-2.5 text-xs">取消</button><button className="primary-button rounded-xl px-5 py-2.5 text-xs font-semibold">{project ? "保存项目" : "创建项目"}</button></div></form>;
}
