import { SectionPage } from "@/components/ui/section-page";

export default function NotesPage() {
  return (
    <SectionPage
      eyebrow="Second Brain"
      title="笔记"
      description="收集灵感、知识与每一次值得保留的思考。"
      action="写一篇笔记"
      stats={[{ label: "全部笔记", value: "48" }, { label: "本周新增", value: "7" }, { label: "标签", value: "12" }]}
      items={[
        { title: "个人工作台：从工具集合到生活系统", meta: "产品思考 · 8 分钟前", status: "置顶" },
        { title: "Next.js App Router 学习摘录", meta: "前端 · 昨天", status: "学习" },
        { title: "八月复盘与九月计划", meta: "月度复盘 · 2 天前", status: "生活" },
      ]}
    />
  );
}
