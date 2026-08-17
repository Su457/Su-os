"use client";

import { useMemo, useState } from "react";
import { EmptyState } from "@/components/ui/empty-state";
import { GlassSelect } from "@/components/ui/glass-select";
import { LoadingState } from "@/components/ui/loading-state";
import { PageHeader } from "@/components/ui/page-header";
import { StatCard } from "@/components/ui/stat-card";
import { toDateKey } from "@/lib/date-utils";
import { useSuOsStore } from "@/lib/store/su-os-store";
import type { Task, TaskInput, TaskPriority } from "@/lib/types";
import { TaskItem } from "./task-item";
import { TaskModal } from "./task-modal";

type TaskView = "inbox" | "today" | "upcoming" | "completed" | "all";

const views: { value: TaskView; label: string }[] = [
  { value: "inbox", label: "Inbox" }, { value: "today", label: "Today" }, { value: "upcoming", label: "Upcoming" }, { value: "completed", label: "Completed" }, { value: "all", label: "All" },
];

export function TasksPage() {
  const { data, hydrated, addTask, updateTask, toggleTask, deleteTask } = useSuOsStore();
  const [view, setView] = useState<TaskView>("inbox");
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [priority, setPriority] = useState<"all" | TaskPriority>("all");
  const [projectId, setProjectId] = useState("all");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task>();
  const today = toDateKey();

  const filteredTasks = useMemo(() => data.tasks.filter((task) => {
    const matchesView = view === "inbox" ? !task.completed && !task.dueDate : view === "today" ? task.dueDate === today : view === "upcoming" ? !task.completed && Boolean(task.dueDate && task.dueDate > today) : view === "completed" ? task.completed : true;
    const query = search.trim().toLocaleLowerCase();
    const matchesSearch = !query || [task.title, task.description, ...task.tags].join(" ").toLocaleLowerCase().includes(query);
    return matchesView && matchesSearch && (status === "all" || (status === "completed") === task.completed) && (priority === "all" || task.priority === priority) && (projectId === "all" || task.projectId === projectId);
  }).sort((a, b) => a.order - b.order), [data.tasks, view, today, search, status, priority, projectId]);

  if (!hydrated) return <LoadingState/>;
  const completed = data.tasks.filter((task) => task.completed).length;

  function saveTask(input: TaskInput) {
    if (editingTask) updateTask(editingTask.id, input); else addTask(input);
    setModalOpen(false);
    setEditingTask(undefined);
  }

  function confirmDelete(task: Task) {
    if (window.confirm(`确定删除任务“${task.title}”吗？`)) deleteTask(task.id);
  }

  return (
    <div>
      <PageHeader eyebrow="Task Library" title="任务管理" description="所有计划、今日行动与完成记录，都来自同一份本地任务数据。" actionLabel="新建任务" onAction={() => { setEditingTask(undefined); setModalOpen(true); }}/>
      <div className="mb-4 grid grid-cols-3 gap-3 sm:gap-4"><StatCard label="全部任务" value={String(data.tasks.length)}/><StatCard label="未完成" value={String(data.tasks.length - completed)}/><StatCard label="完成率" value={`${data.tasks.length ? Math.round(completed / data.tasks.length * 100) : 0}%`}/></div>
      <section className="card overflow-hidden">
        <div className="border-b border-white/[0.06] p-4 sm:p-5">
          <div className="scrollbar-none mb-4 flex gap-2 overflow-x-auto">{views.map((item) => <button key={item.value} onClick={() => setView(item.value)} className={`shrink-0 rounded-full px-3 py-2 text-[11px] ${view === item.value ? "bg-[#9b87f5]/18 text-[#c2b8ff]" : "chip"}`}>{item.label}</button>)}</div>
          <div className="grid grid-cols-2 gap-2 lg:grid-cols-[minmax(220px,1fr)_repeat(3,150px)]"><input value={search} onChange={(event) => setSearch(event.target.value)} className="field-input col-span-2 lg:col-span-1" placeholder="搜索标题、备注或标签…"/><GlassSelect ariaLabel="任务状态筛选" value={status} onChange={setStatus} options={[{ value: "all", label: "全部状态" }, { value: "open", label: "未完成" }, { value: "completed", label: "已完成" }]}/><GlassSelect ariaLabel="任务优先级筛选" value={priority} onChange={(value) => setPriority(value as "all" | TaskPriority)} options={[{ value: "all", label: "全部优先级" }, { value: "high", label: "高优先级" }, { value: "medium", label: "中优先级" }, { value: "low", label: "低优先级" }]}/><div className="col-span-2 lg:col-span-1"><GlassSelect ariaLabel="任务项目筛选" value={projectId} onChange={setProjectId} options={[{ value: "all", label: "全部项目" }, ...data.projects.map((project) => ({ value: project.id, label: project.name }))]}/></div></div>
        </div>
        {filteredTasks.length ? <div>{filteredTasks.map((task) => <TaskItem key={task.id} task={task} project={data.projects.find((project) => project.id === task.projectId)} onToggle={() => toggleTask(task.id)} onEdit={() => { setEditingTask(task); setModalOpen(true); }} onDelete={() => confirmDelete(task)}/>)}</div> : <EmptyState title="没有符合条件的任务" description="调整筛选条件，或者创建一条新的任务。" actionLabel="新建任务" onAction={() => setModalOpen(true)}/>}
      </section>
      <TaskModal open={modalOpen} task={editingTask} projects={data.projects} defaultDueDate={view === "today" ? today : undefined} onClose={() => { setModalOpen(false); setEditingTask(undefined); }} onSubmit={saveTask}/>
    </div>
  );
}
