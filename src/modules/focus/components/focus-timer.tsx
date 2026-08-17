"use client";

import { useEffect, useMemo, useState } from "react";
import { Icon } from "@/shared/components/ui/icon";
import { GlassSelect } from "@/shared/components/ui/glass-select";
import { formatMinutes, toDateKey } from "@/shared/lib/date-utils";
import { useFocus } from "../hooks/use-focus";
import { getAvailableFocusProjects, getAvailableFocusTasks, getFocusMinutesForDate, getFocusProject, getFocusTask } from "../selectors";

const SESSION_SECONDS = 25 * 60;

export function FocusTimer() {
  const { focusSessions, focusDraft, tasks, projects, addFocusSession, setFocusDraft } = useFocus();
  const [seconds, setSeconds] = useState(SESSION_SECONDS);
  const [running, setRunning] = useState(false);
  const [startedAt, setStartedAt] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const task = getFocusTask(tasks, focusDraft);
  const project = getFocusProject(projects, focusDraft, task);
  const todayMinutes = getFocusMinutesForDate(focusSessions, toDateKey());
  const availableTasks = getAvailableFocusTasks(tasks);
  const availableProjects = getAvailableFocusProjects(projects);

  useEffect(() => {
    if (!running || seconds <= 0) return;
    const timer = window.setInterval(() => setSeconds((current) => Math.max(0, current - 1)), 1000);
    return () => window.clearInterval(timer);
  }, [running, seconds]);

  const display = useMemo(() => `${String(Math.floor(seconds / 60)).padStart(2, "0")}:${String(seconds % 60).padStart(2, "0")}`, [seconds]);

  function toggleRunning() {
    if (!startedAt) setStartedAt(new Date().toISOString());
    setRunning((value) => !value);
  }

  function reset() {
    setRunning(false); setStartedAt(null); setSeconds(SESSION_SECONDS); setMessage("");
  }

  function complete() {
    if (!startedAt) return;
    const durationMinutes = seconds === 0 ? 25 : Math.max(1, Math.round((SESSION_SECONDS - seconds) / 60));
    addFocusSession({ taskId: task?.id ?? null, projectId: project?.id ?? null, durationMinutes, startedAt, completedAt: new Date().toISOString() });
    setRunning(false); setStartedAt(null); setSeconds(SESSION_SECONDS); setMessage(`已记录 ${durationMinutes} 分钟专注`);
    window.setTimeout(() => setMessage(""), 2600);
  }

  return (
    <article id="focus" className="card relative flex min-h-[350px] min-w-0 scroll-mt-24 flex-col overflow-hidden p-5 sm:p-6 lg:col-span-5">
      <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-[#6ee7b7]/[0.055] to-transparent"/>
      <div className="relative flex items-start justify-between"><div><p className="eyebrow">Focus</p><h2 className="mt-2 text-lg font-semibold">专注时刻</h2><p className="mt-1 text-[10px] text-[#6f7584]">今日累计 {formatMinutes(todayMinutes)}</p></div><span className="grid size-9 place-items-center rounded-xl bg-[#6ee7b7]/10 text-[#6ee7b7]"><Icon name="clock" size={18}/></span></div>
      <div className="relative z-20 mt-5 grid min-w-0 grid-cols-1 gap-2 sm:grid-cols-2"><label className="min-w-0"><span className="field-label">关联任务</span><GlassSelect ariaLabel="关联任务" disabled={running} value={task?.id ?? ""} onChange={(value) => { const next = tasks.find((item) => item.id === value); setFocusDraft(next ? { taskId: next.id, projectId: next.projectId } : null); }} options={[{ value: "", label: "自由专注", meta: "不关联具体任务" }, ...availableTasks.map((item) => ({ value: item.id, label: item.title, meta: projects.find((projectItem) => projectItem.id === item.projectId)?.name ?? "无项目" }))]}/></label><label className="min-w-0"><span className="field-label">关联项目</span><GlassSelect ariaLabel="关联项目" disabled={running || Boolean(task)} value={project?.id ?? ""} onChange={(value) => setFocusDraft({ taskId: null, projectId: value || null })} options={[{ value: "", label: "无项目", meta: "自由专注" }, ...availableProjects.map((item) => ({ value: item.id, label: item.name, meta: item.goal || "进行中的项目" }))]}/></label></div>
      <div className="relative my-auto py-6 text-center"><p className="font-mono text-5xl font-light tracking-[-0.06em] text-white sm:text-6xl">{display}</p><p className="mt-3 truncate px-3 text-[10px] text-[#858b9a]">{task ? `正在专注：${task.title}` : project ? `项目：${project.name}` : "自由专注"}</p></div>
      {message && <p className="relative mb-3 text-center text-[10px] text-[#6ee7b7]">{message}</p>}
      <div className="relative flex flex-wrap justify-center gap-2"><button onClick={toggleRunning} className="primary-button flex min-w-28 items-center justify-center gap-1.5 rounded-xl px-5 py-2.5 text-xs font-semibold text-white"><Icon name={running ? "pause" : "play"} size={13}/>{running ? "暂停" : startedAt ? "继续" : "开始专注"}</button>{startedAt && <button onClick={complete} className="secondary-button px-3 py-2.5 text-xs">完成并记录</button>}<button onClick={reset} className="secondary-button px-3 py-2.5 text-xs">重置</button></div>
    </article>
  );
}
