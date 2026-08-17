"use client";

import type { Project } from "@/domain/project";
import type { Task, TaskInput } from "@/domain/task";
import { Modal } from "@/shared/components/ui/modal";
import { TaskForm } from "./task-form";

export function TaskModal({ open, task, projects, defaultDueDate, onClose, onSubmit }: { open: boolean; task?: Task; projects: Project[]; defaultDueDate?: string; onClose(): void; onSubmit(input: TaskInput): void }) {
  return <Modal open={open} title={task ? "编辑任务" : "新建任务"} description="任务会自动保存到此浏览器，并同步更新相关页面。" onClose={onClose}><TaskForm task={task} projects={projects} defaultDueDate={defaultDueDate} onCancel={onClose} onSubmit={onSubmit}/></Modal>;
}
