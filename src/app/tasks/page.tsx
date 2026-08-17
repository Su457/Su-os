import { SectionPage } from "@/components/ui/section-page";

export default function TasksPage() {
  return (
    <SectionPage
      eyebrow="Task Library"
      title="任务管理"
      description="集中管理收件箱、下一步行动与长期待办。"
      action="新建任务"
      stats={[{ label: "全部任务", value: "24" }, { label: "本周完成", value: "18" }, { label: "完成率", value: "75%" }]}
      items={[
        { title: "整理 Su OS 首页需求", meta: "个人项目 · 今天", status: "进行中" },
        { title: "阅读 React Server Components", meta: "学习 · 明天", status: "计划" },
        { title: "复盘本周时间记录", meta: "个人成长 · 周日", status: "待处理" },
      ]}
    />
  );
}
