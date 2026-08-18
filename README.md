# Su OS

Su OS 是一个面向个人使用的响应式 Personal OS。v0.2.2 是可日常使用的本地优先工作台，并完成了最小必要的架构整理，用于集中管理任务、笔记、项目、学习数据、专注记录与 AI 助手界面。

当前版本采用精致的纯 CSS「液态玻璃」视觉风格，在不引入 WebGL 或重型特效库的前提下，实现半透明玻璃、背景模糊、边缘高光、渐变光晕与轻量动态效果，同时兼顾桌面端和手机端使用。

GitHub 仓库：[Su457/Su-os](https://github.com/Su457/Su-os)

## 界面预览

### 桌面端

![Su OS 桌面端液态玻璃界面](./liquid-glass-preview.png)

### 手机端

![Su OS 手机端液态玻璃界面](./liquid-glass-mobile-preview.png)

## 设计特点

- 深色液态玻璃视觉系统
- 半透明卡片、悬浮导航与柔和边缘高光
- 多层渐变光晕和细腻背景纹理
- 桌面端侧边栏与手机端底部导航；“更多”菜单保留无需客户端 hydration 的原生交互降级
- 响应式布局，适配不同屏幕尺寸
- 支持 `backdrop-filter` 的浏览器使用增强玻璃效果
- 为不支持玻璃模糊的浏览器提供可读性降级方案
- 尊重系统的“减少动态效果”设置

## v0.2.2 当前功能

- Dashboard 从统一数据层实时汇总今日任务、MIT、专注、学习、项目进度和最近笔记
- Tasks 支持新增、编辑、删除、完成、日期/时间、优先级、项目、标签、搜索和组合筛选
- Today 直接读取当天任务，支持最多 3 个 MIT、排序和关联任务启动专注
- Notes 支持自动保存、全文搜索、标签、收藏、归档与项目关联
- Projects 支持完整状态管理、自动任务进度、关联任务/笔记和里程碑管理
- Learning 支持学习记录 CRUD、自动时长计算、7 日趋势、科目统计与连续学习天数
- Focus 完成后记录任务、项目、起止时间和专注分钟数
- Settings 支持 JSON 导入导出、恢复演示数据与清空本地数据
- AI 助手继续使用本地演示回复，不连接真实模型
- 手机端“更多”可展开项目、学习统计、AI 助手和设置，并在客户端脚本尚未接管时保持可用

所有核心数据统一保存在当前浏览器的 `localStorage` 中。刷新或关闭页面后数据仍然存在，但尚未接入登录、数据库或云同步。

## 技术栈

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS 4
- 纯 CSS 液态玻璃效果

## 项目结构

```text
src/
├─ app/                    Next.js 路由入口与全局样式；page.tsx 保持轻量
│  ├─ page.tsx             Dashboard 路由
│  ├─ today/               今日任务路由
│  ├─ tasks/               任务管理路由
│  ├─ notes/               笔记路由
│  ├─ projects/            项目路由
│  ├─ learning/            学习路由
│  ├─ ai/                  AI 演示路由
│  └─ settings/            设置路由
├─ modules/                按业务组织组件、薄 Hooks 与纯 Selectors
│  ├─ dashboard/
│  ├─ today/
│  ├─ tasks/
│  ├─ notes/
│  ├─ projects/
│  ├─ learning/
│  ├─ focus/
│  ├─ ai/
│  └─ settings/
├─ domain/                 Task、Note、Project、Learning、Focus 与快照类型
├─ data/
│  ├─ local/               LocalStorage 快照仓储和默认数据
│  └─ backup/              JSON 备份校验与解析
├─ store/                  React Context、业务 Mutation 与持久化协调
└─ shared/
   ├─ components/layout/   App Shell、Sidebar、Topbar 与移动端导航
   ├─ components/ui/       跨模块通用液态玻璃 UI
   ├─ config/              导航配置
   └─ lib/                 通用日期工具
```

各层职责、依赖方向和未来迁移边界详见 [ARCHITECTURE.md](./ARCHITECTURE.md)。

## 设计与开发约定

- 优先保持纯 CSS 方案，不依赖 WebGL 或大型视觉特效库。
- 新页面应复用现有玻璃卡片、按钮、输入框和导航样式。
- 桌面端使用侧边栏，手机端使用底部导航；修改布局时需要同时验证两端。
- 文字可读性优先于透明度和模糊强度。
- 动效应轻量，并继续支持系统的“减少动态效果”设置。
- 页面组件通过模块 Hook 和 Store 读写数据，不直接操作 `localStorage`。
- 筛选、排序和统计优先放在不依赖 React 或浏览器 API 的纯 Selector 中。
- 业务 UI 位于 `modules`，只有真正跨模块复用的布局和 UI 才进入 `shared`。

## 本地数据与备份

- 存储键：`su-os:data:v2`
- 数据格式包含 `schemaVersion: 2`，方便后续迁移
- 设置页可以导出完整 JSON 备份，也可以从同版本 JSON 恢复
- “重置为演示数据”和“清空全部数据”会替换当前浏览器中的数据，操作前建议先导出
- 浏览器清理站点数据、无痕模式结束或更换设备都会导致本地数据不可用；v0.2.2 不提供跨设备同步

## 本地运行

安装依赖：

```bash
npm install
```

启动开发预览：

```bash
npm run dev
```

电脑浏览器打开：

```text
http://localhost:3000
```

## 手机端查看

1. 确保手机与电脑连接同一个 Wi-Fi。
2. 将 `.env.example` 复制为不会提交到 Git 的 `.env.local`。
3. 查询电脑当前的局域网 IPv4 地址，并在 `.env.local` 中配置允许的开发来源：

```env
SU_OS_DEV_ORIGINS=你的局域网IP
```

多个地址使用英文逗号分隔：

```env
SU_OS_DEV_ORIGINS=第一个局域网IP,第二个局域网IP
```

4. 启动或重启局域网开发服务器：

```bash
npm run dev -- --hostname 0.0.0.0
```

5. 在手机浏览器中打开：

```text
http://<电脑局域网IP>:3000
```

`SU_OS_DEV_ORIGINS` 只需要填写 hostname 或 IP，不要包含协议或端口。未配置时，Next.js 使用默认的开发来源限制。局域网地址可能在切换 Wi-Fi 或重启网络后发生变化，应以电脑当前地址为准。如果手机无法访问，请检查环境变量、系统防火墙、VPN、代理设置，以及路由器是否启用了设备隔离。

如果手机已经显示页面外壳，但一直停在“正在读取本地数据…”或所有按钮都没有响应，通常表示客户端脚本没有完成 hydration：

- 确认 `.env.local` 中填写的是当前电脑的局域网 IP，并在修改后重启开发服务器。
- 优先使用手机系统浏览器。部分应用内置 WebView 会发送不透明来源，Next.js 开发服务器可能拒绝其 `/_next` 资源。
- 必须在内置 WebView 中检查时，可先运行 `npm run build`，再运行 `npm run start -- --hostname 0.0.0.0`，使用生产预览代替开发服务器。

手机和电脑浏览器拥有各自独立的 `localStorage`。手机首次打开会创建自己的演示数据，不会自动显示电脑浏览器中已经录入的数据。

## 可用命令

```bash
npm run dev
npm run lint
npm run build
npm run start
```

## 项目状态

v0.2.2 是可实际使用的本地优先版本，并将代码整理为 `Routes → Modules → Domain / Store → Data` 的结构。当前仓储保存的是整份浏览器本地快照；未来 Supabase 需要采用异步、表级 CRUD 和 Domain Mapper，不能把现有快照接口直接当作云仓储使用。

本版本不包含 Supabase、Auth、Cloud Sync、Vercel 配置、PWA、Capacitor Android 或真实 AI API。

## AI 协作说明

其他 AI 或开发者接手项目前，建议按以下顺序了解代码：

1. 阅读本 README，确认当前范围和技术边界。
2. 阅读 `ARCHITECTURE.md`，确认各层职责与数据兼容要求。
3. 查看 `src/app/globals.css`，了解视觉变量和玻璃组件样式。
4. 查看 `src/shared/components/layout/app-shell.tsx`，了解整体响应式布局。
5. 查看 `src/domain`、`src/store`、`src/data` 和目标 `src/modules` 目录，了解数据流与业务组织方式。
6. 修改完成后运行 `npm run lint` 和 `npm run build`。

AI 工具接手项目前，应以 GitHub 仓库最新代码和本地项目文档为准。
