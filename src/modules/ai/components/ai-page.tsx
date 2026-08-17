"use client";

import { FormEvent, useState } from "react";
import { Icon } from "@/shared/components/ui/icon";

type Message = { role: "assistant" | "user"; content: string };

export function AiPage() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: "你好，Su。我是你的个人助手原型。现在还没有连接 AI 服务，但我们可以先体验完整的交互界面。" },
  ]);

  function submit(event: FormEvent) {
    event.preventDefault();
    const value = input.trim();
    if (!value) return;
    setMessages((current) => [...current, { role: "user", content: value }, { role: "assistant", content: "已收到。这是前端 MVP 的本地演示回复；接入 AI 服务后，这里会返回真实建议。" }]);
    setInput("");
  }

  return (
    <div className="mx-auto flex max-w-4xl flex-col">
      <div className="mb-7"><p className="eyebrow mb-2">Su Assistant</p><h1 className="text-2xl font-semibold tracking-[-0.03em] sm:text-3xl">AI 助手</h1><p className="mt-2 text-sm text-[#858591]">未来连接你的任务、笔记与项目；当前为本地界面原型。</p></div>
      <div className="card flex min-h-[calc(100dvh-230px)] flex-col overflow-hidden">
        <div className="border-b border-white/[0.06] p-4"><div className="flex items-center gap-3"><span className="grid size-9 place-items-center rounded-xl bg-[#9b87f5]/12 text-[#aa98fa]"><Icon name="sparkles" size={18}/></span><div><p className="text-xs font-medium">Su Assistant</p><p className="mt-0.5 text-[10px] text-[#6d6d78]">演示模式 · 未连接模型</p></div></div></div>
        <div className="scrollbar-none flex-1 space-y-4 overflow-y-auto p-4 sm:p-6">{messages.map((message, index) => <div key={index} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}><div className={`max-w-[86%] rounded-2xl px-4 py-3 text-[13px] leading-6 sm:max-w-[70%] ${message.role === "user" ? "rounded-br-md bg-[#9b87f5] text-white" : "rounded-bl-md bg-white/[0.045] text-[#c5c5cc]"}`}>{message.content}</div></div>)}</div>
        <div className="border-t border-white/[0.06] p-3 sm:p-4"><div className="mb-3 flex gap-2 overflow-x-auto scrollbar-none">{["规划今天", "整理本周任务", "总结最近笔记"].map((prompt) => <button key={prompt} onClick={() => setInput(prompt)} className="glass-control shrink-0 rounded-full px-3 py-1.5 text-[10px] text-[#999eac] transition hover:text-white">{prompt}</button>)}</div><form onSubmit={submit} className="glass-control flex items-center gap-2 rounded-2xl p-2"><input value={input} onChange={(event) => setInput(event.target.value)} placeholder="问问 Su Assistant..." className="min-w-0 flex-1 bg-transparent px-2 text-sm text-white outline-none placeholder:text-[#5e6371]"/><button aria-label="发送" className="primary-button grid size-9 place-items-center rounded-xl text-white"><Icon name="send" size={16}/></button></form></div>
      </div>
    </div>
  );
}
