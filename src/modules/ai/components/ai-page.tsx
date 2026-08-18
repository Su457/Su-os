"use client";

import { useEffect, useRef, useState } from "react";
import type { FormEvent, KeyboardEvent } from "react";
import { Icon } from "@/shared/components/ui/icon";

type Message = { id: string; role: "assistant" | "user"; content: string };

const INITIAL_MESSAGES: Message[] = [
  { id: "assistant-welcome", role: "assistant", content: "你好，我可以帮你梳理今天的计划、任务和学习记录。当前是本地演示模式。" },
];

const QUICK_PROMPTS = ["规划今天", "整理任务", "总结学习笔记"];

function createDemoReply(input: string): string {
  if (input.includes("学习") || input.includes("笔记")) {
    return "可以先确定今晚最重要的学习目标，再安排一个专注时段，结束后用两三句话记录理解和下一步。";
  }
  if (input.includes("任务") || input.includes("计划") || input.includes("今天")) {
    return "建议先选出不超过 3 个 MIT，按重要程度排序，并为第一项安排一个明确的开始时间。";
  }
  return "已收到。这是本地演示回复；接入真实 AI 服务后，我会结合你的任务、项目和笔记给出更具体的建议。";
}

export function AiPage() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [replying, setReplying] = useState(false);
  const messageCounter = useRef(0);
  const replyTimer = useRef<number | null>(null);
  const messageListRef = useRef<HTMLDivElement>(null);
  const composerRef = useRef<HTMLTextAreaElement>(null);
  const autoScroll = useRef(true);

  useEffect(() => () => {
    if (replyTimer.current !== null) window.clearTimeout(replyTimer.current);
  }, []);

  useEffect(() => {
    if (!autoScroll.current) return;
    const frame = window.requestAnimationFrame(() => {
      const list = messageListRef.current;
      const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      list?.scrollTo({ top: list.scrollHeight, behavior: reducedMotion ? "auto" : "smooth" });
    });
    return () => window.cancelAnimationFrame(frame);
  }, [messages, replying]);

  useEffect(() => {
    const composer = composerRef.current;
    if (!composer) return;
    composer.style.height = "auto";
    composer.style.height = `${Math.min(composer.scrollHeight, 96)}px`;
  }, [input]);

  function nextMessageId(role: Message["role"]): string {
    messageCounter.current += 1;
    return `${role}-${messageCounter.current}`;
  }

  function send(rawValue = input) {
    const value = rawValue.trim();
    if (!value || replying) return;

    autoScroll.current = true;
    setMessages((current) => [...current, { id: nextMessageId("user"), role: "user", content: value }]);
    setInput("");
    setReplying(true);

    replyTimer.current = window.setTimeout(() => {
      setMessages((current) => [...current, { id: nextMessageId("assistant"), role: "assistant", content: createDemoReply(value) }]);
      setReplying(false);
      replyTimer.current = null;
    }, 700);
  }

  function submit(event: FormEvent) {
    event.preventDefault();
    send();
  }

  function handleComposerKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key !== "Enter" || event.shiftKey || event.nativeEvent.isComposing) return;
    event.preventDefault();
    send();
  }

  function clearConversation() {
    if (replyTimer.current !== null) window.clearTimeout(replyTimer.current);
    replyTimer.current = null;
    setReplying(false);
    setMessages(INITIAL_MESSAGES);
    setInput("");
    autoScroll.current = true;
    composerRef.current?.focus();
  }

  return (
    <div className="mx-auto h-[calc(100dvh-11.25rem)] min-h-[31rem] w-full min-w-0 max-w-5xl md:h-[calc(100dvh-4.5rem)] md:min-h-[36rem]">
      <section className="card grid h-full min-h-0 w-full min-w-0 grid-rows-[auto_minmax(0,1fr)_auto] overflow-hidden">
        <header className="flex min-w-0 items-center gap-3 border-b border-white/[0.06] px-4 py-3.5 sm:px-5">
          <span className="grid size-10 shrink-0 place-items-center rounded-2xl bg-[#9b87f5]/14 text-[#b3a4ff] shadow-[inset_0_1px_0_rgba(255,255,255,.1)]"><Icon name="sparkles" size={18} /></span>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2"><h1 className="text-sm font-semibold text-[#ececf3]">Su Assistant</h1><span className="rounded-full border border-[#9b87f5]/18 bg-[#9b87f5]/10 px-2 py-1 text-[9px] text-[#b7aaff]">本地演示</span></div>
            <p className="mt-1 text-[10px] text-[#686f7e]">不会上传数据，对话仅在当前页面会话中保留</p>
          </div>
          <button type="button" onClick={clearConversation} disabled={messages.length === 1 && !replying} className="secondary-button px-3 py-2 text-[10px] disabled:cursor-not-allowed disabled:opacity-35 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#aa98ff]">清空</button>
        </header>

        <div ref={messageListRef} role="log" aria-live="polite" aria-label="AI 对话消息" onScroll={() => { const list = messageListRef.current; if (list) autoScroll.current = list.scrollHeight - list.scrollTop - list.clientHeight < 96; }} className="scrollbar-none min-h-0 min-w-0 space-y-4 overflow-y-auto px-4 py-5 sm:px-6 sm:py-7">
          {messages.map((message) => <div key={message.id} className={`flex items-end gap-2.5 ${message.role === "user" ? "justify-end" : "justify-start"}`}>{message.role === "assistant" && <span className="grid size-8 shrink-0 place-items-center rounded-xl bg-[#8c77f5]/16 text-[10px] font-bold text-[#c2b7ff]">SU</span>}<div className={`max-w-[86%] whitespace-pre-wrap break-words rounded-2xl px-4 py-3 text-[13px] leading-6 sm:max-w-[72%] ${message.role === "user" ? "rounded-br-md bg-gradient-to-br from-[#9f8cff] to-[#735ee7] text-white shadow-[0_10px_30px_rgba(115,94,231,.18)]" : "rounded-bl-md border border-white/[0.07] bg-white/[0.045] text-[#c9cdd7]"}`}>{message.content}</div></div>)}
          {replying && <div className="flex items-end gap-2.5" aria-label="Su Assistant 正在思考"><span className="grid size-8 shrink-0 place-items-center rounded-xl bg-[#8c77f5]/16 text-[10px] font-bold text-[#c2b7ff]">SU</span><div className="flex items-center gap-1.5 rounded-2xl rounded-bl-md border border-white/[0.07] bg-white/[0.045] px-4 py-4">{[0, 1, 2].map((index) => <span key={index} className="size-1.5 animate-pulse rounded-full bg-[#a795ff] motion-reduce:animate-none" style={{ animationDelay: `${index * 140}ms` }} />)}</div></div>}
        </div>

        <div className="min-w-0 border-t border-white/[0.06] bg-[#090c15]/55 p-3 backdrop-blur-2xl sm:p-4">
          <div className="scrollbar-none mb-3 flex min-w-0 gap-2 overflow-x-auto">{QUICK_PROMPTS.map((prompt) => <button key={prompt} type="button" disabled={replying} onClick={() => send(prompt)} className="glass-control shrink-0 rounded-full px-3 py-2 text-[10px] text-[#aeb4c1] transition hover:border-[#9b87f5]/30 hover:text-white disabled:cursor-not-allowed disabled:opacity-40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#aa98ff]">{prompt}</button>)}</div>
          <form onSubmit={submit} className="glass-control flex min-w-0 items-end gap-2 rounded-2xl p-2">
            <textarea ref={composerRef} rows={1} value={input} onChange={(event) => setInput(event.target.value)} onKeyDown={handleComposerKeyDown} placeholder="输入问题…" aria-label="输入问题" className="min-h-9 min-w-0 flex-1 resize-none overflow-y-auto bg-transparent px-2 py-2 text-sm leading-5 text-white outline-none placeholder:text-[#5e6371]" />
            <button type="submit" aria-label="发送消息" disabled={!input.trim() || replying} className="primary-button grid size-10 shrink-0 place-items-center rounded-xl text-white disabled:cursor-not-allowed disabled:opacity-40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#d8d1ff]"><Icon name="send" size={16} /></button>
          </form>
          <p className="mt-2 px-1 text-[9px] text-[#555c6b]">Enter 发送 · Shift + Enter 换行</p>
        </div>
      </section>
    </div>
  );
}
