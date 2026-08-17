"use client";

import { useMemo, useState } from "react";
import { EmptyState } from "@/components/ui/empty-state";
import { Icon } from "@/components/ui/icon";
import { LoadingState } from "@/components/ui/loading-state";
import { PageHeader } from "@/components/ui/page-header";
import { StatCard } from "@/components/ui/stat-card";
import { formatDate, formatMinutes, getLastDateKeys, getLearningStreak, isDateThisMonth, isDateThisWeek, toDateKey } from "@/lib/date-utils";
import { useSuOsStore } from "@/lib/store/su-os-store";
import type { LearningSession, LearningSessionInput } from "@/lib/types";
import { LearningSessionModal } from "./learning-session-modal";

export function LearningPage() {
  const store = useSuOsStore();
  const { data, hydrated } = store;
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<LearningSession>();
  const sessions = useMemo(() => [...data.learningSessions].sort((a, b) => b.date.localeCompare(a.date) || b.createdAt.localeCompare(a.createdAt)), [data.learningSessions]);
  if (!hydrated) return <LoadingState/>;
  const today = toDateKey();
  const todayMinutes = sessions.filter((session) => session.date === today).reduce((sum, session) => sum + session.durationMinutes, 0);
  const weekMinutes = sessions.filter((session) => isDateThisWeek(session.date)).reduce((sum, session) => sum + session.durationMinutes, 0);
  const monthMinutes = sessions.filter((session) => isDateThisMonth(session.date)).reduce((sum, session) => sum + session.durationMinutes, 0);
  const streak = getLearningStreak(sessions.map((session) => session.date));
  const subjects = Object.entries(sessions.reduce<Record<string, number>>((accumulator, session) => ({ ...accumulator, [session.subject]: (accumulator[session.subject] ?? 0) + session.durationMinutes }), {})).sort((a, b) => b[1] - a[1]);
  const maxSubject = subjects[0]?.[1] ?? 1;
  const trend = getLastDateKeys(7).map((date) => ({ date, minutes: sessions.filter((session) => session.date === date).reduce((sum, session) => sum + session.durationMinutes, 0) }));
  const maxDay = Math.max(...trend.map((item) => item.minutes), 1);

  function save(input: LearningSessionInput) {
    if (editing) store.updateLearningSession(editing.id, input); else store.addLearningSession(input);
    setModalOpen(false); setEditing(undefined);
  }

  return (
    <div>
      <PageHeader eyebrow="Learning Analytics" title="学习统计" description="每一条统计都来自真实学习记录，而不是固定演示数字。" actionLabel="记录学习" onAction={() => { setEditing(undefined); setModalOpen(true); }}/>
      <div className="mb-4 grid grid-cols-2 gap-3 sm:grid-cols-4"><StatCard label="今日学习" value={formatMinutes(todayMinutes)}/><StatCard label="本周学习" value={formatMinutes(weekMinutes)}/><StatCard label="本月学习" value={formatMinutes(monthMinutes)}/><StatCard label="连续学习" value={`${streak} 天`}/></div>
      <div className="grid gap-4 xl:grid-cols-2">
        <section className="card p-5 sm:p-6"><div className="mb-5"><p className="eyebrow">Last 7 Days</p><h2 className="mt-2 text-base font-semibold">学习趋势</h2></div><div className="flex h-52 items-end gap-2 border-b border-white/[0.06] pb-1 sm:gap-4">{trend.map((item) => <div key={item.date} className="flex h-full flex-1 flex-col items-center justify-end gap-2"><span className="text-[9px] text-[#777d8c]">{item.minutes || ""}</span><div className="flex h-full w-full items-end justify-center"><div className={`w-full max-w-9 rounded-t-lg ${item.date === today ? "bg-gradient-to-t from-[#7562db] to-[#b5a8ff]" : "bg-white/[0.08]"}`} style={{ height: `${Math.max(item.minutes ? 8 : 2, item.minutes / maxDay * 100)}%` }}/></div><span className="text-[9px] text-[#666c7a]">{new Intl.DateTimeFormat("zh-CN", { weekday: "short" }).format(new Date(`${item.date}T12:00:00`))}</span></div>)}</div></section>
        <section className="card p-5 sm:p-6"><div className="mb-5"><p className="eyebrow">Subjects</p><h2 className="mt-2 text-base font-semibold">科目统计</h2></div>{subjects.length ? <div className="space-y-5">{subjects.slice(0, 6).map(([subject, minutes]) => <div key={subject}><div className="mb-2 flex justify-between gap-3"><span className="text-xs text-[#cbd0da]">{subject}</span><span className="text-[10px] text-[#8b819f]">{formatMinutes(minutes)}</span></div><div className="h-1.5 rounded-full bg-white/[0.06]"><div className="h-full rounded-full bg-gradient-to-r from-[#8c78ff] to-[#6fdcbc]" style={{ width: `${minutes / maxSubject * 100}%` }}/></div></div>)}</div> : <EmptyState icon="book" title="还没有科目数据" description="添加学习记录后会自动按科目汇总。"/>}</section>
        <section className="card overflow-hidden xl:col-span-2"><div className="flex items-center justify-between border-b border-white/[0.06] p-5"><div><h2 className="text-sm font-semibold">最近学习记录</h2><p className="mt-1 text-[10px] text-[#6d7382]">共 {sessions.length} 条记录</p></div></div>{sessions.length ? sessions.map((session) => <article key={session.id} className="flex items-start gap-3 border-b border-white/[0.055] p-4 last:border-0 sm:p-5"><span className="grid size-9 shrink-0 place-items-center rounded-xl bg-[#6ee7b7]/10 text-[#6ee7b7]"><Icon name="book" size={16}/></span><div className="min-w-0 flex-1"><div className="flex flex-wrap items-center gap-2"><h3 className="text-[13px] text-[#d4d8e1]">{session.subject}</h3><span className="chip px-2 py-0.5 text-[9px]">{formatMinutes(session.durationMinutes)}</span></div><p className="mt-1 text-[11px] text-[#8a909e]">{session.content}</p><p className="mt-2 text-[9px] text-[#606675]">{formatDate(session.date, { year: "numeric", month: "short", day: "numeric" })}{session.startTime ? ` · ${session.startTime}${session.endTime ? `–${session.endTime}` : ""}` : ""}{session.note ? ` · ${session.note}` : ""}</p></div><div className="flex gap-1.5"><button onClick={() => { setEditing(session); setModalOpen(true); }} className="secondary-button grid size-8 place-items-center"><Icon name="edit" size={13}/></button><button onClick={() => window.confirm(`删除这条 ${session.subject} 学习记录？`) && store.deleteLearningSession(session.id)} className="danger-button grid size-8 place-items-center"><Icon name="trash" size={13}/></button></div></article>) : <EmptyState icon="book" title="还没有学习记录" description="记录一次真实学习后，趋势与统计会自动更新。" actionLabel="记录学习" onAction={() => setModalOpen(true)}/>}</section>
      </div>
      <LearningSessionModal key={editing?.id ?? "new"} open={modalOpen} session={editing} onClose={() => { setModalOpen(false); setEditing(undefined); }} onSubmit={save}/>
    </div>
  );
}
