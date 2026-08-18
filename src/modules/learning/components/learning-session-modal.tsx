"use client";

import { FormEvent, useState } from "react";
import { DateField } from "@/shared/components/ui/date-field";
import { Modal } from "@/shared/components/ui/modal";
import { TimeField } from "@/shared/components/ui/time-field";
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
  const hasCompleteRange = Boolean(startTime && endTime);
  const calculated = hasCompleteRange ? minutesBetween(startTime, endTime) : 0;
  const invalidRange = hasCompleteRange && calculated <= 0;
  const durationMinutes = hasCompleteRange ? calculated : Number(duration);
  const canSubmit = Boolean(subject.trim() && content.trim() && date && durationMinutes > 0 && !invalidRange);

  function submit(event: FormEvent) {
    event.preventDefault();
    if (!canSubmit) return;
    onSubmit({ subject: subject.trim(), content: content.trim(), date, startTime: startTime || null, endTime: endTime || null, durationMinutes, note: note.trim() });
  }

  return (
    <Modal open={open} title={session ? "编辑学习记录" : "添加学习记录"} description="填写起止时间时会自动计算学习时长。" onClose={onClose}>
      <form onSubmit={submit} className="space-y-4">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <label><span className="field-label">科目 *</span><input autoFocus required value={subject} onChange={(event) => setSubject(event.target.value)} className="field-input" placeholder="例如：Python" /></label>
          <div><span className="field-label">日期 *</span><DateField required ariaLabel="学习日期" value={date} onChange={setDate} /></div>
        </div>
        <label><span className="field-label">学习内容 *</span><input required value={content} onChange={(event) => setContent(event.target.value)} className="field-input" placeholder="今天具体学习了什么？" /></label>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <div><span className="field-label">开始时间</span><TimeField ariaLabel="开始时间" value={startTime} onChange={setStartTime} /></div>
          <div><span className="field-label">结束时间</span><TimeField ariaLabel="结束时间" value={endTime} onChange={setEndTime} /></div>
          <label><span className="field-label">时长（分钟）</span><input required={!hasCompleteRange} min="1" type="number" value={hasCompleteRange ? calculated || "" : duration} onChange={(event) => setDuration(event.target.value)} disabled={hasCompleteRange} className="field-input disabled:cursor-not-allowed disabled:opacity-55" /></label>
        </div>
        {invalidRange && <p role="alert" className="rounded-xl border border-[#f08b9b]/18 bg-[#f08b9b]/[0.07] px-3 py-2 text-[10px] text-[#e4a1ad]">结束时间需晚于开始时间；当前版本按同一天计算，不支持跨天记录。</p>}
        {hasCompleteRange && !invalidRange && <p className="rounded-xl border border-[#9b87f5]/15 bg-[#9b87f5]/[0.07] px-3 py-2 text-[10px] text-[#bcb2f5]">{startTime}–{endTime} · 自动计算 {calculated} 分钟</p>}
        <label><span className="field-label">备注</span><textarea value={note} onChange={(event) => setNote(event.target.value)} rows={3} className="field-input resize-none" placeholder="记录理解、问题或下一步…" /></label>
        <div className="flex justify-end gap-2"><button type="button" onClick={onClose} className="secondary-button px-4 py-2.5 text-xs">取消</button><button disabled={!canSubmit} className="primary-button rounded-xl px-5 py-2.5 text-xs font-semibold disabled:cursor-not-allowed disabled:opacity-40">保存记录</button></div>
      </form>
    </Modal>
  );
}
