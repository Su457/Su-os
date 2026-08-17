"use client";

import { ChangeEvent, useRef, useState } from "react";
import { Icon } from "@/components/ui/icon";
import { LoadingState } from "@/components/ui/loading-state";
import { useSuOsStore } from "@/lib/store/su-os-store";
import type { IconName } from "@/lib/navigation";

const preferenceGroups: { icon: IconName; title: string; description: string }[] = [
  { icon: "palette", title: "外观与主题", description: "深色液态玻璃 · 紫色强调色" },
  { icon: "moon", title: "专注偏好", description: "默认 25 分钟专注计时" },
  { icon: "shield", title: "隐私模式", description: "不连接账号、后端或云服务" },
];

export function SettingsPageV2() {
  const store = useSuOsStore();
  const [message, setMessage] = useState("");
  const fileInput = useRef<HTMLInputElement>(null);
  if (!store.hydrated) return <LoadingState/>;

  function showMessage(value: string) {
    setMessage(value);
    window.setTimeout(() => setMessage(""), 3000);
  }

  function exportJson() {
    const blob = new Blob([store.exportData()], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `su-os-backup-${new Date().toISOString().slice(0, 10)}.json`;
    anchor.click();
    URL.revokeObjectURL(url);
    showMessage("数据已导出");
  }

  async function importJson(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!window.confirm("导入会替换当前全部 Su OS 数据，是否继续？")) { event.target.value = ""; return; }
    const result = store.importData(await file.text());
    showMessage(result.ok ? "数据导入成功" : result.error);
    event.target.value = "";
  }

  function resetDemo() {
    if (!window.confirm("确定用默认演示数据替换当前数据吗？建议先导出备份。")) return;
    store.resetDemoData(); showMessage("已恢复默认演示数据");
  }

  function clearData() {
    if (!window.confirm("这将清空全部任务、笔记、项目、学习和专注记录。是否继续？")) return;
    if (!window.confirm("最后确认：清空后无法撤销，确定继续吗？")) return;
    store.clearAllData(); showMessage("全部本地数据已清空");
  }

  const counts = [
    ["任务", store.data.tasks.length], ["笔记", store.data.notes.length], ["项目", store.data.projects.length], ["学习记录", store.data.learningSessions.length], ["专注记录", store.data.focusSessions.length],
  ];

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-8"><p className="eyebrow mb-2">Preferences</p><h1 className="text-2xl font-semibold tracking-[-0.03em] sm:text-3xl">设置</h1><p className="mt-2 text-sm text-[#858591]">管理本地数据与当前工作台偏好。</p></div>
      {message && <div className="glass-control fixed right-4 top-20 z-50 rounded-xl px-4 py-3 text-xs text-[#d8d3f9] shadow-xl">{message}</div>}
      <section className="card mb-4 flex items-center gap-4 p-5"><div className="primary-button grid size-12 place-items-center rounded-full text-sm font-bold">SU</div><div className="flex-1"><h2 className="text-sm font-semibold">Su</h2><p className="mt-1 text-[11px] text-[#747480]">本地个人工作台</p></div><span className="rounded-full bg-[#6ee7b7]/10 px-2.5 py-1 text-[9px] text-[#6ee7b7]">Local only</span></section>
      <section className="card mb-4 overflow-hidden"><div className="border-b border-white/[0.06] p-5"><div className="flex items-start gap-3"><span className="grid size-10 shrink-0 place-items-center rounded-xl bg-[#9b87f5]/10 text-[#a99af5]"><Icon name="database" size={18}/></span><div><h2 className="text-sm font-semibold">数据管理</h2><p className="mt-1 text-[10px] leading-5 text-[#727887]">数据当前保存在此浏览器的本地存储中，尚未启用云同步。</p></div></div><div className="mt-4 grid grid-cols-5 gap-2">{counts.map(([label, value]) => <div key={label} className="rounded-xl bg-white/[0.03] p-2 text-center"><p className="text-sm font-semibold">{value}</p><p className="mt-1 text-[8px] text-[#666c7a]">{label}</p></div>)}</div></div><div className="grid gap-2 p-4 sm:grid-cols-2"><button onClick={exportJson} className="secondary-button flex items-center justify-center gap-2 px-4 py-3 text-xs"><Icon name="download" size={15}/>导出全部 JSON</button><button onClick={() => fileInput.current?.click()} className="secondary-button flex items-center justify-center gap-2 px-4 py-3 text-xs"><Icon name="upload" size={15}/>从 JSON 导入</button><button onClick={resetDemo} className="secondary-button flex items-center justify-center gap-2 px-4 py-3 text-xs"><Icon name="refresh" size={15}/>重置为演示数据</button><button onClick={clearData} className="danger-button flex items-center justify-center gap-2 px-4 py-3 text-xs"><Icon name="trash" size={15}/>清空全部数据</button><input ref={fileInput} type="file" accept="application/json,.json" onChange={importJson} className="hidden"/></div></section>
      <section className="card overflow-hidden">{preferenceGroups.map((group, index) => <div key={group.title} className={`flex items-center gap-4 p-4 sm:p-5 ${index !== preferenceGroups.length - 1 ? "border-b border-white/[0.06]" : ""}`}><span className="grid size-10 shrink-0 place-items-center rounded-xl bg-white/[0.04] text-[#9d8dea]"><Icon name={group.icon} size={18}/></span><div className="min-w-0 flex-1"><p className="text-[13px] text-[#d2d2d8]">{group.title}</p><p className="mt-1 truncate text-[10px] text-[#686873]">{group.description}</p></div></div>)}</section>
      <p className="mt-5 text-center text-[10px] text-[#53535e]">Su OS · Local-first v0.2.0</p>
    </div>
  );
}
