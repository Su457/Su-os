"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { EmptyState } from "@/components/ui/empty-state";
import { Icon } from "@/components/ui/icon";
import { LoadingState } from "@/components/ui/loading-state";
import { PageHeader } from "@/components/ui/page-header";
import { formatDate } from "@/lib/date-utils";
import { useSuOsStore } from "@/lib/store/su-os-store";
import type { Milestone, MilestoneInput, Project, ProjectInput, ProjectStatus } from "@/lib/types";
import { MilestoneModal } from "./milestone-modal";
import { ProjectModal } from "./project-modal";

const statusLabels: Record<ProjectStatus, string> = { active: "进行中", paused: "已暂停", completed: "已完成", archived: "已归档" };

export function ProjectsPage() {
  const store = useSuOsStore();
  const { data, hydrated } = store;
  const [filter, setFilter] = useState<"current" | ProjectStatus>("current");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [mobileDetail, setMobileDetail] = useState(false);
  const [projectModal, setProjectModal] = useState(false);
  const [editingProject, setEditingProject] = useState<Project>();
  const [milestoneModal, setMilestoneModal] = useState(false);
  const [editingMilestone, setEditingMilestone] = useState<Milestone>();

  const projects = useMemo(() => data.projects.filter((project) => filter === "current" ? project.status !== "archived" : project.status === filter), [data.projects, filter]);
  if (!hydrated) return <LoadingState/>;
  const selected = data.projects.find((project) => project.id === selectedId) ?? projects[0];
  const projectTasks = selected ? data.tasks.filter((task) => task.projectId === selected.id).sort((a, b) => a.order - b.order) : [];
  const projectNotes = selected ? data.notes.filter((note) => note.projectId === selected.id).sort((a, b) => b.updatedAt.localeCompare(a.updatedAt)) : [];
  const projectMilestones = selected ? data.milestones.filter((milestone) => milestone.projectId === selected.id).sort((a, b) => a.order - b.order) : [];
  const completedTasks = projectTasks.filter((task) => task.completed).length;
  const progress = projectTasks.length ? Math.round(completedTasks / projectTasks.length * 100) : 0;

  function saveProject(input: ProjectInput) {
    if (editingProject) store.updateProject(editingProject.id, input); else setSelectedId(store.addProject(input));
    setProjectModal(false); setEditingProject(undefined);
  }

  function saveMilestone(input: MilestoneInput) {
    if (editingMilestone) store.updateMilestone(editingMilestone.id, input); else store.addMilestone(input);
    setMilestoneModal(false); setEditingMilestone(undefined);
  }

  function removeProject(project: Project) {
    if (!window.confirm(`确定删除项目“${project.name}”吗？任务和笔记会保留，但将解除项目关联。`)) return;
    store.deleteProject(project.id); setSelectedId(null); setMobileDetail(false);
  }

  function moveMilestone(milestone: Milestone, direction: -1 | 1) {
    if (!selected) return;
    const ids = projectMilestones.map((item) => item.id); const index = ids.indexOf(milestone.id); const next = index + direction;
    if (next < 0 || next >= ids.length) return;
    [ids[index], ids[next]] = [ids[next], ids[index]]; store.reorderMilestones(selected.id, ids);
  }

  return (
    <div>
      <PageHeader eyebrow="Active Spaces" title="项目" description="围绕目标组织任务、笔记与里程碑，进度由真实任务自动计算。" actionLabel="创建项目" onAction={() => { setEditingProject(undefined); setProjectModal(true); }}/>
      <section className="card overflow-hidden lg:grid lg:grid-cols-[320px_minmax(0,1fr)]">
        <aside className={`${mobileDetail ? "hidden" : "block"} border-white/[0.06] lg:block lg:border-r`}><div className="scrollbar-none flex gap-1.5 overflow-x-auto border-b border-white/[0.06] p-3">{(["current", "active", "paused", "completed", "archived"] as const).map((value) => <button key={value} onClick={() => { setFilter(value); setSelectedId(null); }} className={`shrink-0 rounded-full px-2.5 py-2 text-[10px] ${filter === value ? "bg-[#9b87f5]/16 text-[#bcb1ff]" : "chip"}`}>{value === "current" ? "当前" : statusLabels[value]}</button>)}</div><div className="max-h-[720px] overflow-y-auto">{projects.length ? projects.map((project) => { const tasks = data.tasks.filter((task) => task.projectId === project.id); const done = tasks.filter((task) => task.completed).length; const value = tasks.length ? Math.round(done / tasks.length * 100) : 0; return <button key={project.id} onClick={() => { setSelectedId(project.id); setMobileDetail(true); }} className={`w-full border-b border-white/[0.05] p-4 text-left transition hover:bg-white/[0.03] ${selected?.id === project.id ? "bg-[#9b87f5]/[0.055]" : ""}`}><div className="flex items-center justify-between gap-3"><h3 className="truncate text-[13px] text-[#d5d8e1]">{project.name}</h3><span className="text-[10px] text-[#9d90ea]">{value}%</span></div><p className="mt-1.5 line-clamp-2 text-[10px] leading-4 text-[#707685]">{project.goal || project.description || "尚未设置项目目标"}</p><div className="mt-3 h-1 overflow-hidden rounded-full bg-white/[0.06]"><div className="h-full rounded-full bg-gradient-to-r from-[#836fff] to-[#72e6c0]" style={{ width: `${value}%` }}/></div><p className="mt-2 text-[9px] text-[#5f6573]">{statusLabels[project.status]} · {done}/{tasks.length} 个任务</p></button>; }) : <EmptyState icon="folder" title="还没有项目" description="创建一个项目，把相关任务与笔记放在同一上下文中。" actionLabel="创建项目" onAction={() => setProjectModal(true)}/>}</div></aside>
        <div className={`${mobileDetail ? "block" : "hidden"} lg:block`}>{selected ? <div>
          <header className="border-b border-white/[0.06] p-4 sm:p-6"><div className="flex flex-wrap items-start gap-3"><button onClick={() => setMobileDetail(false)} className="secondary-button grid size-9 place-items-center lg:hidden"><Icon name="arrow" className="rotate-180" size={15}/></button><div className="min-w-0 flex-1"><div className="flex flex-wrap items-center gap-2"><h2 className="text-xl font-semibold">{selected.name}</h2><span className="chip px-2.5 py-1 text-[9px]">{statusLabels[selected.status]}</span></div><p className="mt-2 text-xs leading-5 text-[#7e8493]">{selected.description || "尚未添加项目说明。"}</p>{selected.goal && <p className="mt-3 text-[11px] text-[#b5b9c5]"><span className="text-[#8175cd]">目标：</span>{selected.goal}</p>}</div><div className="flex gap-1.5"><button onClick={() => { setEditingProject(selected); setProjectModal(true); }} className="secondary-button grid size-9 place-items-center"><Icon name="edit" size={14}/></button><button onClick={() => removeProject(selected)} className="danger-button grid size-9 place-items-center"><Icon name="trash" size={14}/></button></div></div><div className="mt-5 grid grid-cols-3 gap-3"><div><p className="text-[9px] text-[#656b79]">进度</p><p className="mt-1 text-lg font-semibold text-[#aa9cff]">{progress}%</p></div><div><p className="text-[9px] text-[#656b79]">开始</p><p className="mt-1 text-xs">{formatDate(selected.startDate)}</p></div><div><p className="text-[9px] text-[#656b79]">截止</p><p className="mt-1 text-xs">{formatDate(selected.dueDate)}</p></div></div><div className="mt-4 flex flex-wrap gap-2">{selected.status === "active" && <button onClick={() => store.updateProject(selected.id, { status: "paused" })} className="secondary-button px-3 py-2 text-[10px]">暂停项目</button>}{selected.status === "paused" && <button onClick={() => store.updateProject(selected.id, { status: "active" })} className="secondary-button px-3 py-2 text-[10px]">恢复项目</button>}{selected.status !== "completed" && <button onClick={() => store.updateProject(selected.id, { status: "completed" })} className="secondary-button px-3 py-2 text-[10px]">标记完成</button>}{selected.status !== "archived" && <button onClick={() => store.updateProject(selected.id, { status: "archived" })} className="secondary-button px-3 py-2 text-[10px]">归档</button>}</div></header>
          <div className="grid gap-4 p-4 sm:p-6 xl:grid-cols-2"><section className="glass-control rounded-2xl p-4"><div className="mb-3 flex items-center justify-between"><h3 className="text-xs font-semibold">任务 · {completedTasks}/{projectTasks.length}</h3><Link href="/tasks" className="text-[10px] text-[#9d90ea]">前往任务 →</Link></div>{projectTasks.length ? <div className="space-y-2">{projectTasks.map((task) => <button key={task.id} onClick={() => store.toggleTask(task.id)} className="flex w-full items-center gap-2 rounded-xl bg-white/[0.025] p-3 text-left"><span className={`grid size-4 place-items-center rounded border ${task.completed ? "border-[#9b87f5] bg-[#9b87f5] text-white" : "border-white/15 text-transparent"}`}><Icon name="check" size={10}/></span><span className={`min-w-0 flex-1 truncate text-[11px] ${task.completed ? "text-[#676d7b] line-through" : "text-[#c8ccd6]"}`}>{task.title}</span></button>)}</div> : <p className="py-8 text-center text-[10px] text-[#686e7d]">这个项目还没有关联任务</p>}</section>
            <section className="glass-control rounded-2xl p-4"><div className="mb-3 flex items-center justify-between"><h3 className="text-xs font-semibold">笔记 · {projectNotes.length}</h3><Link href="/notes" className="text-[10px] text-[#9d90ea]">前往笔记 →</Link></div>{projectNotes.length ? <div className="space-y-2">{projectNotes.slice(0, 5).map((note) => <div key={note.id} className="rounded-xl bg-white/[0.025] p-3"><p className="truncate text-[11px] text-[#c8ccd6]">{note.title}</p><p className="mt-1 truncate text-[9px] text-[#686e7d]">{note.tags.map((tag) => `#${tag}`).join(" ") || "无标签"}</p></div>)}</div> : <p className="py-8 text-center text-[10px] text-[#686e7d]">这个项目还没有关联笔记</p>}</section>
            <section className="glass-control rounded-2xl p-4 xl:col-span-2"><div className="mb-3 flex items-center justify-between"><h3 className="text-xs font-semibold">里程碑 · {projectMilestones.filter((item) => item.completed).length}/{projectMilestones.length}</h3><button onClick={() => { setEditingMilestone(undefined); setMilestoneModal(true); }} className="secondary-button px-3 py-2 text-[10px]">＋ 新建里程碑</button></div>{projectMilestones.length ? <div>{projectMilestones.map((milestone, index) => <div key={milestone.id} className="flex items-center gap-2 border-t border-white/[0.05] py-3 first:border-0"><button onClick={() => store.updateMilestone(milestone.id, { completed: !milestone.completed })} className={`grid size-5 place-items-center rounded-md border ${milestone.completed ? "border-[#6ee7b7] bg-[#6ee7b7]/15 text-[#6ee7b7]" : "border-white/15 text-transparent"}`}><Icon name="check" size={11}/></button><div className="min-w-0 flex-1"><p className={`truncate text-[11px] ${milestone.completed ? "text-[#6b7180] line-through" : "text-[#cbd0da]"}`}>{milestone.title}</p><p className="mt-1 text-[9px] text-[#626877]">{formatDate(milestone.dueDate)}</p></div>{index > 0 && <button onClick={() => moveMilestone(milestone, -1)} className="secondary-button grid size-7 place-items-center"><Icon name="chevronUp" size={12}/></button>}{index < projectMilestones.length - 1 && <button onClick={() => moveMilestone(milestone, 1)} className="secondary-button grid size-7 place-items-center"><Icon name="chevronDown" size={12}/></button>}<button onClick={() => { setEditingMilestone(milestone); setMilestoneModal(true); }} className="secondary-button grid size-7 place-items-center"><Icon name="edit" size={12}/></button><button onClick={() => window.confirm(`删除里程碑“${milestone.title}”？`) && store.deleteMilestone(milestone.id)} className="danger-button grid size-7 place-items-center"><Icon name="trash" size={12}/></button></div>)}</div> : <p className="py-8 text-center text-[10px] text-[#686e7d]">还没有里程碑</p>}</section></div>
        </div> : <EmptyState icon="folder" title="选择一个项目" description="查看项目中的任务、笔记与里程碑。"/>}</div>
      </section>
      <ProjectModal open={projectModal} project={editingProject} onClose={() => { setProjectModal(false); setEditingProject(undefined); }} onSubmit={saveProject}/>
      {selected && <MilestoneModal key={editingMilestone?.id ?? "new"} open={milestoneModal} projectId={selected.id} milestone={editingMilestone} nextOrder={projectMilestones.length} onClose={() => { setMilestoneModal(false); setEditingMilestone(undefined); }} onSubmit={saveMilestone}/>}
    </div>
  );
}
