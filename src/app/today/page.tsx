import { SectionPage } from "@/components/ui/section-page";
import { todayTasks } from "@/lib/mock-data";

export default function TodayPage() {
  return (
    <SectionPage
      eyebrow="Tuesday · Aug 18"
      title="今日任务"
      description="把注意力留给今天真正重要的事情。"
      action="添加任务"
      stats={[{ label: "待完成", value: "3" }, { label: "已完成", value: "2" }, { label: "预计专注", value: "3.5h" }]}
      items={todayTasks.map((task) => ({ title: task.title, meta: `${task.time} · ${task.tag}`, status: task.done ? "已完成" : task.priority }))}
    />
  );
}
