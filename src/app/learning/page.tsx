import { SectionPage } from "@/components/ui/section-page";

export default function LearningPage() {
  return (
    <SectionPage
      eyebrow="Learning Analytics"
      title="学习统计"
      description="让每天一点点的积累，变成看得见的长期进步。"
      action="记录学习"
      stats={[{ label: "本周时长", value: "12.4h" }, { label: "连续学习", value: "18 天" }, { label: "本月完成", value: "26 节" }]}
      items={[
        { title: "Next.js 全栈开发", meta: "本周 5.2 小时", status: "+18%" },
        { title: "UI 设计基础", meta: "本周 3.8 小时", status: "+12%" },
        { title: "英语阅读", meta: "本周 3.4 小时", status: "+8%" },
      ]}
    />
  );
}
