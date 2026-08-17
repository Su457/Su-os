"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { EmptyState } from "@/components/ui/empty-state";
import { LoadingState } from "@/components/ui/loading-state";
import { PageHeader } from "@/components/ui/page-header";
import { StatCard } from "@/components/ui/stat-card";
import { formatMinutes, toDateKey } from "@/lib/date-utils";
import { useSuOsStore } from "@/lib/store/su-os-store";
import type { Task, TaskInput } from "@/lib/types";
import { TaskItem } from "@/components/tasks/task-item";
import { TaskModal } from "@/components/tasks/task-modal";

export function TodayPage() {
  const router = useRouter();
  const { data, hydrated, addTask, updateTask, toggleTask, deleteTask, setTaskMit, reorderTasks, setFocusDraft } = useSuOsStore();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task>();
  const [message, setMessage] = useState("");
  const today = toDateKey();
  const tasks = useMemo(() => data.tasks.filter((task) => task.dueDate === today).sort((a, b) => a.order - b.order), [data.tasks, today]);

  if (!hydrated) return <LoadingState/>;
  const completed = tasks.filter((task) => task.completed).length;
  const focusMinutes = data.focusSessions.filter((session) => toDateKey(new Date(session.completedAt)) === today).reduce((sum, session) => sum + session.durationMinutes, 0);

  function saveTask(input: TaskInput) {
    if (editingTask) updateTask(editingTask.id, input); else addTask({ ...input, dueDate: today });
    setModalOpen(false);
    setEditingTask(undefined);
  }

  function toggleMit(task: Task) {
    const success = setTaskMit(task.id, !task.isMIT);
    setMessage(success ? (task.isMIT ? "已取消 MIT" : "已设为今日 MIT") : "每天最多只能设置 3 个 MIT。");
    window.setTimeout(() => setMessage(""), 2400);
  }

  function move(task: Task, direction: -1 | 1) {
    const ids = tasks.map((item) => item.id);
    const index = ids.indexOf(task.id);
    const next = index + direction;
    if (next < 0 || next >= ids.length) return;
    [ids[index], ids[next]] = [ids[next], ids[index]];
    reorderTasks(ids);
  }

  function startFocus(task: Task) {
    setFocusDraft({ taskId: task.id, projectId: task.projectId });
    router.push("/#focus");
  }

  return (
    <div>
      <PageHeader eyebrow={new Intl.DateTimeFormat("zh-CN", { weekday: "long", month: "long", day: "numeric" }).format(new Date())} title="今日任务" description="选出不超过三件 MIT，把注意力留给今天真正重要的事情。" actionLabel="添加今日任务" onAction={() => { setEditingTask(undefined); setModalOpen(true); }}/>
      {message && <div className="glass-control fixed right-4 top-20 z-50 rounded-xl px-4 py-3 text-xs text-[#d8d3f9] shadow-xl">{message}</div>}
      <div className="mb-4 grid grid-cols-2 gap-3 sm:grid-cols-5"><StatCard label="今日任务" value={String(tasks.length)}/><StatCard label="已完成" value={String(completed)}/><StatCard label="完成率" value={`${tasks.length ? Math.round(completed / tasks.length * 100) : 0}%`}/><StatCard label="待完成" value={String(tasks.length - completed)}/><StatCard label="今日专注" value={formatMinutes(focusMinutes)}/></div>
      <section className="card overflow-hidden">
        <div className="flex items-center justify-between border-b border-white/[0.06] p-4 sm:p-5"><div><h2 className="text-sm font-semibold">今日行动</h2><p className="mt-1 text-[10px] text-[#6d7382]">MIT {tasks.filter((task) => task.isMIT).length} / 3 · 使用箭头调整顺序</p></div><span className="rounded-full bg-[#9b87f5]/12 px-3 py-1.5 text-[10px] text-[#b8adf9]">{tasks.length - completed} 项待完成</span></div>
        {tasks.length ? tasks.map((task, index) => <TaskItem key={task.id} task={task} project={data.projects.find((project) => project.id === task.projectId)} onToggle={() => toggleTask(task.id)} onEdit={() => { setEditingTask(task); setModalOpen(true); }} onDelete={() => window.confirm(`确定删除“${task.title}”吗？`) && deleteTask(task.id)} onMit={() => toggleMit(task)} onFocus={() => startFocus(task)} onMoveUp={index > 0 ? () => move(task, -1) : undefined} onMoveDown={index < tasks.length - 1 ? () => move(task, 1) : undefined}/>) : <EmptyState title="今天还没有任务" description="添加一项今天要推进的行动，或者在任务管理中为任务设置今天的日期。" actionLabel="添加今日任务" onAction={() => setModalOpen(true)}/>}
      </section>
      <TaskModal open={modalOpen} task={editingTask} projects={data.projects} defaultDueDate={today} onClose={() => { setModalOpen(false); setEditingTask(undefined); }} onSubmit={saveTask}/>
    </div>
  );
}
