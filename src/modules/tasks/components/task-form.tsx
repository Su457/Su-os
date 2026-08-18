"use client";

import { FormEvent, useState } from "react";
import type { Project } from "@/domain/project";
import type { Task, TaskInput, TaskPriority } from "@/domain/task";
import { DateField } from "@/shared/components/ui/date-field";
import { GlassSelect } from "@/shared/components/ui/glass-select";
import { TimeField } from "@/shared/components/ui/time-field";

export function TaskForm({ task, projects, defaultDueDate, onSubmit, onCancel }: { task?: Task; projects: Project[]; defaultDueDate?: string; onSubmit(input: TaskInput): void; onCancel(): void }) {
  const [title, setTitle] = useState(task?.title ?? "");
  const [description, setDescription] = useState(task?.description ?? "");
  const [dueDate, setDueDate] = useState(task?.dueDate ?? defaultDueDate ?? "");
  const [time, setTime] = useState(task?.time ?? "");
  const [priority, setPriority] = useState<TaskPriority>(task?.priority ?? "medium");
  const [projectId, setProjectId] = useState(task?.projectId ?? "");
  const [tags, setTags] = useState(task?.tags.join(", ") ?? "");

  function submit(event: FormEvent) {
    event.preventDefault();
    if (!title.trim()) return;
    onSubmit({
      title: title.trim(),
      description: description.trim(),
      completed: task?.completed ?? false,
      dueDate: dueDate || null,
      time: time || null,
      priority,
      projectId: projectId || null,
      tags: Array.from(new Set(tags.split(/[,，\s#]+/).map((tag) => tag.trim()).filter(Boolean))),
      isMIT: task?.isMIT ?? false,
      order: task?.order ?? Date.now(),
    });
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      <label><span className="field-label">任务名称 *</span><input autoFocus required value={title} onChange={(event) => setTitle(event.target.value)} className="field-input" placeholder="下一步要完成什么？"/></label>
      <label><span className="field-label">备注</span><textarea value={description} onChange={(event) => setDescription(event.target.value)} rows={3} className="field-input resize-none" placeholder="补充任务背景或完成标准…"/></label>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div><span className="field-label">日期</span><DateField ariaLabel="任务日期" value={dueDate} onChange={setDueDate} /></div>
        <div><span className="field-label">时间</span><TimeField ariaLabel="任务时间" value={time} onChange={setTime} /></div>
      </div>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <label><span className="field-label">优先级</span><GlassSelect ariaLabel="任务优先级" value={priority} onChange={(value) => setPriority(value as TaskPriority)} options={[{ value: "high", label: "高优先级" }, { value: "medium", label: "中优先级" }, { value: "low", label: "低优先级" }]}/></label>
        <label><span className="field-label">关联项目</span><GlassSelect ariaLabel="任务关联项目" value={projectId} onChange={setProjectId} options={[{ value: "", label: "不关联项目" }, ...projects.filter((project) => project.status !== "archived").map((project) => ({ value: project.id, label: project.name, meta: project.goal }))]}/></label>
      </div>
      <label><span className="field-label">标签</span><input value={tags} onChange={(event) => setTags(event.target.value)} className="field-input" placeholder="SuOS, 开发（逗号分隔）"/></label>
      <div className="flex justify-end gap-2 pt-2"><button type="button" onClick={onCancel} className="secondary-button px-4 py-2.5 text-xs">取消</button><button type="submit" className="primary-button rounded-xl px-5 py-2.5 text-xs font-semibold">{task ? "保存修改" : "创建任务"}</button></div>
    </form>
  );
}
