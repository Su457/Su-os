"use client";

import { useState } from "react";
import { Icon } from "@/components/ui/icon";
import type { IconName } from "@/lib/mock-data";

const groups: { icon: IconName; title: string; description: string; toggle?: boolean }[] = [
  { icon: "palette", title: "外观与主题", description: "深色主题 · 紫色强调色" },
  { icon: "bell", title: "通知", description: "任务提醒与每日回顾", toggle: true },
  { icon: "database", title: "本地数据", description: "当前所有内容仅保存在浏览器中" },
  { icon: "shield", title: "隐私与安全", description: "个人数据与授权管理" },
  { icon: "moon", title: "专注偏好", description: "默认 25 分钟 · 自动休息", toggle: true },
];

export function SettingsPage() {
  const [enabled, setEnabled] = useState<Record<string, boolean>>({ "通知": true, "专注偏好": false });
  return (
    <div className="mx-auto max-w-3xl"><div className="mb-8"><p className="eyebrow mb-2">Preferences</p><h1 className="text-2xl font-semibold tracking-[-0.03em] sm:text-3xl">设置</h1><p className="mt-2 text-sm text-[#858591]">让 Su OS 更符合你的使用习惯。</p></div>
      <section className="card mb-4 flex items-center gap-4 p-5"><div className="primary-button grid size-12 place-items-center rounded-full text-sm font-bold">SU</div><div className="flex-1"><h2 className="text-sm font-semibold">Su</h2><p className="mt-1 text-[11px] text-[#747480]">本地个人工作台</p></div><button className="glass-control rounded-lg px-3 py-2 text-[11px] text-[#a4a9b6]">编辑资料</button></section>
      <section className="card overflow-hidden">{groups.map((group, index) => <div key={group.title} className={`flex items-center gap-4 p-4 sm:p-5 ${index !== groups.length - 1 ? "border-b border-white/[0.06]" : ""}`}><span className="grid size-10 shrink-0 place-items-center rounded-xl bg-white/[0.04] text-[#9d8dea]"><Icon name={group.icon} size={18}/></span><div className="min-w-0 flex-1"><p className="text-[13px] text-[#d2d2d8]">{group.title}</p><p className="mt-1 truncate text-[10px] text-[#686873]">{group.description}</p></div>{group.toggle ? <button aria-label={`切换${group.title}`} onClick={() => setEnabled((current) => ({ ...current, [group.title]: !current[group.title] }))} className={`relative h-6 w-11 rounded-full transition ${enabled[group.title] ? "bg-[#9b87f5]" : "bg-white/[0.09]"}`}><span className={`absolute top-1 size-4 rounded-full bg-white transition ${enabled[group.title] ? "left-6" : "left-1"}`}/></button> : <span className="text-[#5f5f6a]">›</span>}</div>)}</section>
      <p className="mt-5 text-center text-[10px] text-[#53535e]">Su OS · Frontend MVP 0.1.0</p>
    </div>
  );
}
