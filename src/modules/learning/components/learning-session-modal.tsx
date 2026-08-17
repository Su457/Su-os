"use client";

import { FormEvent, useState } from "react";
import { Modal } from "@/shared/components/ui/modal";
import { minutesBetween, toDateKey } from "@/shared/lib/date-utils";
import type { LearningSession, LearningSessionInput } from "@/domain/learning";

export function LearningSessionModal({ open, session, onClose, onSubmit }: { open: boolean; session?: LearningSession; onClose(): void; onSubmit(input: LearningSessionInput): void }) {
  const [subject, setSubject] = useState(session?.subject ?? "");
  const [content, setContent] = useState(session?.content ?? "");
  const [date, setDate] = useState(session?.date ?? toDateKey());
  const [startTime, setStartTime] = useState(session?.startTime ?? "");
  const [endTime, setEndTime] = useState(session?.endTime ?? "");
  const [duration, setDuration] = useState(String(session?.durationMinutes ?? ""));
  const [note, setNote] = useState(session?.note ?? "");
  const calculated = startTime && endTime ? minutesBetween(startTime, endTime) : 0;

  function submit(event: FormEvent) {
    event.preventDefault();
    const durationMinutes = calculated || Number(duration);
    if (!subject.trim() || !content.trim() || durationMinutes <= 0) return;
    onSubmit({ subject: subject.trim(), content: content.trim(), date, startTime: startTime || null, endTime: endTime || null, durationMinutes, note: note.trim() });
  }

  return <Modal open={open} title={session ? "编辑学习记录" : "添加学习记录"} description="填写起止时间时会自动计算学习时长。" onClose={onClose}><form onSubmit={submit} className="space-y-4"><div className="grid grid-cols-1 gap-3 sm:grid-cols-2"><label><span className="field-label">科目 *</span><input autoFocus required value={subject} onChange={(event) => setSubject(event.target.value)} className="field-input" placeholder="例如：Python"/></label><label><span className="field-label">日期 *</span><input required type="date" value={date} onChange={(event) => setDate(event.target.value)} className="field-input"/></label></div><label><span className="field-label">学习内容 *</span><input required value={content} onChange={(event) => setContent(event.target.value)} className="field-input" placeholder="今天具体学习了什么？"/></label><div className="grid grid-cols-3 gap-3"><label><span className="field-label">开始时间</span><input type="time" value={startTime} onChange={(event) => setStartTime(event.target.value)} className="field-input"/></label><label><span className="field-label">结束时间</span><input type="time" value={endTime} onChange={(event) => setEndTime(event.target.value)} className="field-input"/></label><label><span className="field-label">时长（分钟）</span><input required={!calculated} min="1" type="number" value={calculated || duration} onChange={(event) => setDuration(event.target.value)} disabled={Boolean(calculated)} className="field-input disabled:opacity-60"/></label></div><label><span className="field-label">备注</span><textarea value={note} onChange={(event) => setNote(event.target.value)} rows={3} className="field-input resize-none" placeholder="记录理解、问题或下一步…"/></label><div className="flex justify-end gap-2"><button type="button" onClick={onClose} className="secondary-button px-4 py-2.5 text-xs">取消</button><button className="primary-button rounded-xl px-5 py-2.5 text-xs font-semibold">保存记录</button></div></form></Modal>;
}
