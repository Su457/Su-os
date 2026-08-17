"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Icon } from "@/components/ui/icon";
import { focusData, projects, todayTasks } from "@/lib/mock-data";

export function Dashboard() {
  const [tasks, setTasks] = useState(todayTasks);
  const [running, setRunning] = useState(false);
  const [seconds, setSeconds] = useState(25 * 60);
  const completed = tasks.filter((task) => task.done).length;
  const progress = Math.round((completed / tasks.length) * 100);

  useEffect(() => {
    if (!running || seconds <= 0) return;
    const timer = window.setInterval(() => setSeconds((value) => value - 1), 1000);
    return () => window.clearInterval(timer);
  }, [running, seconds]);

  const time = useMemo(() => `${String(Math.floor(seconds / 60)).padStart(2, "0")}:${String(seconds % 60).padStart(2, "0")}`, [seconds]);

  function toggleTask(id: number) {
    setTasks((current) => current.map((task) => task.id === id ? { ...task, done: !task.done } : task));
  }

  return (
    <div>
      <section className="mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div><p className="eyebrow mb-2">Tuesday · August 18</p><h1 className="text-2xl font-semibold tracking-[-0.03em] sm:text-3xl">你好，Su.</h1><p className="mt-2 text-sm text-[#8c8c98]">新的一天，从最重要的一件事开始。</p></div>
        <button className="primary-button flex w-fit items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-semibold text-white"><Icon name="plus" size={16}/>快速记录</button>
      </section>

      <section className="grid grid-cols-1 gap-4 lg:grid-cols-12">
        <article className="card relative overflow-hidden p-5 sm:p-6 lg:col-span-7">
          <div className="pointer-events-none absolute -right-16 -top-20 size-52 rounded-full bg-[#9b87f5]/10 blur-3xl"/>
          <div className="relative mb-5 flex items-start justify-between"><div><p className="eyebrow">Today</p><h2 className="mt-2 text-lg font-semibold">今日任务</h2></div><Link href="/today" className="flex items-center gap-1 text-xs text-[#9b87f5]">查看全部 <Icon name="arrow" size={13}/></Link></div>
          <div className="glass-control relative mb-5 flex items-center gap-4 rounded-2xl p-4">
            <div className="relative grid size-16 shrink-0 place-items-center rounded-full shadow-[0_0_28px_rgba(155,135,245,0.14)]" style={{ background: `conic-gradient(#aa98ff ${progress}%, rgba(255,255,255,.07) 0)` }}><div className="absolute size-[52px] rounded-full bg-[#111522]/90 backdrop-blur-xl"/><span className="relative text-xs font-bold">{progress}%</span></div>
            <div><p className="text-sm font-medium">今天已完成 {completed} / {tasks.length}</p><p className="mt-1 text-xs leading-5 text-[#777783]">保持节奏，你正在把计划变成现实。</p></div>
          </div>
          <div className="space-y-1.5">
            {tasks.slice(0, 3).map((task) => <button key={task.id} onClick={() => toggleTask(task.id)} className="group flex w-full items-center gap-3 rounded-xl p-2.5 text-left transition hover:bg-white/[0.025]"><span className={`grid size-5 shrink-0 place-items-center rounded-md border transition ${task.done ? "border-[#9b87f5] bg-[#9b87f5] text-white" : "border-white/15 text-transparent group-hover:border-[#9b87f5]/70"}`}><Icon name="check" size={12} strokeWidth={2.4}/></span><span className="min-w-0 flex-1"><span className={`block truncate text-[13px] ${task.done ? "text-[#666671] line-through" : "text-[#d2d2d8]"}`}>{task.title}</span><span className="mt-0.5 block text-[10px] text-[#676773]">{task.time} · {task.tag}</span></span><span className={`size-1.5 rounded-full ${task.priority === "高优先级" ? "bg-[#fb7185]" : task.priority === "中优先级" ? "bg-[#fbbf77]" : "bg-[#6ee7b7]"}`}/></button>)}
          </div>
        </article>

        <article className="card relative flex min-h-[330px] flex-col overflow-hidden p-5 sm:p-6 lg:col-span-5">
          <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-[#6ee7b7]/[0.055] to-transparent"/>
          <div className="relative flex items-start justify-between"><div><p className="eyebrow">Focus</p><h2 className="mt-2 text-lg font-semibold">专注时刻</h2></div><span className="grid size-9 place-items-center rounded-xl bg-[#6ee7b7]/10 text-[#6ee7b7]"><Icon name="clock" size={18}/></span></div>
          <div className="relative my-auto py-6 text-center"><p className="font-mono text-5xl font-light tracking-[-0.06em] text-white sm:text-6xl">{time}</p><p className="mt-3 text-[11px] uppercase tracking-[0.2em] text-[#71717d]">Deep work session</p></div>
          <div className="relative flex justify-center gap-2"><button onClick={() => setRunning((value) => !value)} className="primary-button min-w-28 rounded-xl px-5 py-2.5 text-xs font-semibold text-white">{running ? "暂停" : "开始专注"}</button><button onClick={() => { setRunning(false); setSeconds(25 * 60); }} className="glass-control rounded-xl px-4 py-2.5 text-xs text-[#a4a9b6] transition hover:bg-white/[0.08] hover:text-white">重置</button></div>
        </article>

        <article className="card p-5 sm:p-6 lg:col-span-7">
          <div className="mb-6 flex items-start justify-between"><div><p className="eyebrow">This Week</p><h2 className="mt-2 text-lg font-semibold">学习与专注</h2></div><div className="text-right"><p className="text-xl font-semibold">12.4<span className="ml-1 text-xs font-normal text-[#747480]">小时</span></p><p className="mt-1 text-[10px] text-[#6ee7b7]">↑ 18% 较上周</p></div></div>
          <div className="flex h-40 items-end justify-between gap-2 border-b border-white/[0.06] pb-1 sm:gap-4">
            {focusData.map((item, index) => <div key={item.day} className="flex h-full flex-1 flex-col items-center justify-end gap-2"><div className="relative flex h-full w-full items-end justify-center"><div className={`w-full max-w-8 rounded-t-lg transition hover:brightness-125 ${index === 6 ? "bg-gradient-to-t from-[#7562db] to-[#b5a8ff]" : "bg-white/[0.08]"}`} style={{ height: `${(item.minutes / 160) * 100}%` }}/></div><span className={`text-[10px] ${index === 6 ? "text-[#b5a8ff]" : "text-[#64646f]"}`}>{item.day}</span></div>)}
          </div>
        </article>

        <article className="card p-5 sm:p-6 lg:col-span-5">
          <div className="mb-5 flex items-start justify-between"><div><p className="eyebrow">Projects</p><h2 className="mt-2 text-lg font-semibold">项目进度</h2></div><Link href="/projects" className="grid size-8 place-items-center rounded-lg text-[#777783] hover:bg-white/[0.04]"><Icon name="arrow" size={16}/></Link></div>
          <div className="space-y-5">{projects.map((project) => <div key={project.title}><div className="mb-2 flex items-end justify-between"><div><p className="text-[13px] text-[#d0d0d6]">{project.title}</p><p className="mt-1 text-[10px] text-[#656570]">{project.category}</p></div><span className="text-xs font-semibold" style={{ color: project.color }}>{project.progress}%</span></div><div className="h-1.5 overflow-hidden rounded-full bg-white/[0.055]"><div className="h-full rounded-full" style={{ width: `${project.progress}%`, background: project.color }}/></div></div>)}</div>
        </article>

        <Link href="/notes" className="card card-hover group p-5 sm:p-6 lg:col-span-4"><div className="flex items-start justify-between"><span className="grid size-10 place-items-center rounded-xl bg-[#fbbf77]/10 text-[#fbbf77]"><Icon name="note" size={19}/></span><Icon name="arrow" size={16} className="text-[#5e5e69] transition group-hover:translate-x-1 group-hover:text-white"/></div><p className="mt-7 text-xs text-[#777783]">最近笔记</p><h3 className="mt-2 text-sm font-medium leading-6">个人工作台：从工具集合到生活系统</h3><p className="mt-3 text-[10px] text-[#5f5f6a]">8 分钟前 · 产品思考</p></Link>
        <Link href="/learning" className="card card-hover group p-5 sm:p-6 lg:col-span-4"><div className="flex items-start justify-between"><span className="grid size-10 place-items-center rounded-xl bg-[#6ee7b7]/10 text-[#6ee7b7]"><Icon name="book" size={19}/></span><Icon name="arrow" size={16} className="text-[#5e5e69] transition group-hover:translate-x-1 group-hover:text-white"/></div><p className="mt-7 text-xs text-[#777783]">连续学习</p><h3 className="mt-2 text-2xl font-semibold">18 <span className="text-xs font-normal text-[#777783]">天</span></h3><p className="mt-3 text-[10px] text-[#5f5f6a]">最长记录 24 天 · 继续保持</p></Link>
        <Link href="/ai" className="card card-hover group relative overflow-hidden p-5 sm:p-6 lg:col-span-4"><div className="absolute -bottom-12 -right-10 size-32 rounded-full bg-[#9b87f5]/15 blur-2xl"/><div className="relative flex items-start justify-between"><span className="grid size-10 place-items-center rounded-xl bg-[#9b87f5]/12 text-[#aa98fa]"><Icon name="sparkles" size={19}/></span><Icon name="arrow" size={16} className="text-[#5e5e69] transition group-hover:translate-x-1 group-hover:text-white"/></div><p className="relative mt-7 text-xs text-[#777783]">Su Assistant</p><h3 className="relative mt-2 text-sm font-medium">需要帮你整理今天吗？</h3><p className="relative mt-3 text-[10px] text-[#5f5f6a]">AI 功能当前为界面原型</p></Link>
      </section>
    </div>
  );
}
