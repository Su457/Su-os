import { SectionPage } from "@/components/ui/section-page";

export default function ProjectsPage() {
  return (
    <SectionPage
      eyebrow="Active Spaces"
      title="项目"
      description="看清每个项目的方向、进度与下一步。"
      action="创建项目"
      stats={[{ label: "进行中", value: "3" }, { label: "已归档", value: "8" }, { label: "本月里程碑", value: "5" }]}
      items={[
        { title: "Su OS · 个人数字工作台", meta: "已完成 8 / 12 个任务", status: "67%" },
        { title: "2026 前端学习路径", meta: "已完成 14 / 30 个章节", status: "47%" },
        { title: "个人内容系统", meta: "需求梳理阶段", status: "12%" },
      ]}
    />
  );
}
