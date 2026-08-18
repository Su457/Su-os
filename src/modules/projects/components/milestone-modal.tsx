"use client";

import { FormEvent, useState } from "react";
import type { Milestone, MilestoneInput } from "@/domain/project";
import { DateField } from "@/shared/components/ui/date-field";
import { Modal } from "@/shared/components/ui/modal";

export function MilestoneModal({ open, projectId, milestone, nextOrder, onClose, onSubmit }: { open: boolean; projectId: string; milestone?: Milestone; nextOrder: number; onClose(): void; onSubmit(input: MilestoneInput): void }) {
  const [title, setTitle] = useState(milestone?.title ?? "");
  const [dueDate, setDueDate] = useState(milestone?.dueDate ?? "");
  function submit(event: FormEvent) { event.preventDefault(); if (title.trim()) onSubmit({ projectId, title: title.trim(), completed: milestone?.completed ?? false, dueDate: dueDate || null, order: milestone?.order ?? nextOrder }); }
  return <Modal open={open} title={milestone ? "编辑里程碑" : "新建里程碑"} onClose={onClose}><form onSubmit={submit} className="space-y-4"><label><span className="field-label">里程碑名称 *</span><input autoFocus required value={title} onChange={(event) => setTitle(event.target.value)} className="field-input"/></label><div><span className="field-label">截止日期</span><DateField ariaLabel="里程碑截止日期" value={dueDate} onChange={setDueDate}/></div><div className="flex justify-end gap-2"><button type="button" onClick={onClose} className="secondary-button px-4 py-2.5 text-xs">取消</button><button className="primary-button rounded-xl px-5 py-2.5 text-xs font-semibold">保存</button></div></form></Modal>;
}
