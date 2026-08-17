"use client";

import type { Project, ProjectInput } from "@/domain/project";
import { Modal } from "@/shared/components/ui/modal";
import { ProjectForm } from "./project-form";

export function ProjectModal({ open, project, onClose, onSubmit }: { open: boolean; project?: Project; onClose(): void; onSubmit(input: ProjectInput): void }) {
  return <Modal open={open} title={project ? "编辑项目" : "创建项目"} description="项目进度会根据关联任务的完成情况自动计算。" onClose={onClose}><ProjectForm project={project} onCancel={onClose} onSubmit={onSubmit}/></Modal>;
}
