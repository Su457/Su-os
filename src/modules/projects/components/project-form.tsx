"use client";

import { FormEvent, useState } from "react";
import type { Project, ProjectInput, ProjectStatus } from "@/domain/project";
import { DateField } from "@/shared/components/ui/date-field";
import { GlassSelect } from "@/shared/components/ui/glass-select";

export function ProjectForm({ project, onSubmit, onCancel }: { project?: Project; onSubmit(input: ProjectInput): void; onCancel(): void }) {
  const [name, setName] = useState(project?.name ?? "");
  const [description, setDescription] = useState(project?.description ?? "");
  const [goal, setGoal] = useState(project?.goal ?? "");
  const [status, setStatus] = useState<ProjectStatus>(project?.status ?? "active");
  const [startDate, setStartDate] = useState(project?.startDate ?? "");
  const [dueDate, setDueDate] = useState(project?.dueDate ?? "");
  const invalidRange = Boolean(startDate && dueDate && dueDate < startDate);

  function submit(event: FormEvent) {
    event.preventDefault();
    if (!name.trim() || invalidRange) return;
    onSubmit({ name: name.trim(), description: description.trim(), goal: goal.trim(), status, startDate: startDate || null, dueDate: dueDate || null });
  }

  return <form onSubmit={submit} className="space-y-4"><label><span className="field-label">项目名称 *</span><input autoFocus required value={name} onChange={(event) => setName(event.target.value)} className="field-input" placeholder="例如：Su OS"/></label><label><span className="field-label">项目说明</span><textarea value={description} onChange={(event) => setDescription(event.target.value)} rows={3} className="field-input resize-none" placeholder="这个项目为什么值得做？"/></label><label><span className="field-label">项目目标</span><input value={goal} onChange={(event) => setGoal(event.target.value)} className="field-input" placeholder="清晰、可判断的完成目标"/></label><div className="grid grid-cols-1 gap-3 sm:grid-cols-3"><label><span className="field-label">状态</span><GlassSelect ariaLabel="项目状态" value={status} onChange={(value) => setStatus(value as ProjectStatus)} options={[{ value: "active", label: "进行中" }, { value: "paused", label: "已暂停" }, { value: "completed", label: "已完成" }, { value: "archived", label: "已归档" }]}/></label><div><span className="field-label">开始日期</span><DateField ariaLabel="项目开始日期" value={startDate} max={dueDate || undefined} onChange={setStartDate}/></div><div><span className="field-label">截止日期</span><DateField ariaLabel="项目截止日期" value={dueDate} min={startDate || undefined} onChange={setDueDate}/></div></div>{invalidRange && <p role="alert" className="text-[10px] text-[#e4a1ad]">截止日期不能早于开始日期。</p>}<div className="flex justify-end gap-2 pt-2"><button type="button" onClick={onCancel} className="secondary-button px-4 py-2.5 text-xs">取消</button><button disabled={invalidRange} className="primary-button rounded-xl px-5 py-2.5 text-xs font-semibold disabled:cursor-not-allowed disabled:opacity-40">{project ? "保存项目" : "创建项目"}</button></div></form>;
}
