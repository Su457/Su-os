# Su OS

Su OS 是一个面向个人使用的响应式 Personal OS 前端 MVP，用于集中管理任务、笔记、项目、学习数据与 AI 助手。

当前版本采用精致的纯 CSS「液态玻璃」视觉风格，在不引入 WebGL 或重型特效库的前提下，实现半透明玻璃、背景模糊、边缘高光、渐变光晕与轻量动态效果，同时兼顾桌面端和手机端使用。

GitHub 私有仓库：[Su457/Su-os](https://github.com/Su457/Su-os)

## 界面预览

### 桌面端

![Su OS 桌面端液态玻璃界面](./liquid-glass-preview.png)

### 手机端

![Su OS 手机端液态玻璃界面](./liquid-glass-mobile-preview.png)

## 设计特点

- 深色液态玻璃视觉系统
- 半透明卡片、悬浮导航与柔和边缘高光
- 多层渐变光晕和细腻背景纹理
- 桌面端侧边栏与手机端底部导航
- 响应式布局，适配不同屏幕尺寸
- 支持 `backdrop-filter` 的浏览器使用增强玻璃效果
- 为不支持玻璃模糊的浏览器提供可读性降级方案
- 尊重系统的“减少动态效果”设置

## 当前功能

- Dashboard 总览
- 今日任务
- 任务管理
- 笔记
- 项目管理
- 学习统计
- AI 助手界面
- 设置页面
- 本地 Mock 数据与基础前端交互

目前暂未接入登录、数据库、云同步和真实 AI 服务。

## 技术栈

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS 4
- 纯 CSS 液态玻璃效果

## 项目结构

```text
src/
├─ app/                    Next.js 页面、全局样式和路由入口
│  ├─ globals.css          液态玻璃视觉系统和响应式样式
│  ├─ page.tsx             Dashboard 首页
│  ├─ ai/                  AI 助手路由
│  ├─ learning/            学习统计路由
│  ├─ notes/               笔记路由
│  ├─ projects/            项目路由
│  ├─ settings/            设置路由
│  ├─ tasks/               任务管理路由
│  └─ today/               今日任务路由
├─ components/
│  ├─ ai/                  AI 助手界面
│  ├─ dashboard/           Dashboard 内容
│  ├─ layout/              页面骨架、侧边栏、顶栏和手机导航
│  ├─ settings/            设置界面
│  └─ ui/                  通用图标和页面组件
└─ lib/mock-data.ts        本地演示数据
```

## 设计与开发约定

- 优先保持纯 CSS 方案，不依赖 WebGL 或大型视觉特效库。
- 新页面应复用现有玻璃卡片、按钮、输入框和导航样式。
- 桌面端使用侧边栏，手机端使用底部导航；修改布局时需要同时验证两端。
- 文字可读性优先于透明度和模糊强度。
- 动效应轻量，并继续支持系统的“减少动态效果”设置。
- 演示数据目前统一维护在 `src/lib/mock-data.ts`。

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
2. 启动开发预览，并确保服务允许局域网访问。
3. 查询电脑当前的局域网 IPv4 地址。
4. 在手机浏览器中打开 `http://电脑IP:3000`。

示例：

```text
http://10.183.33.39:3000
```

局域网地址可能在切换 Wi-Fi 或重启网络后发生变化，应以电脑当前地址为准。如果手机无法访问，请检查系统防火墙、VPN、代理设置，以及路由器是否启用了设备隔离。

## 可用命令

```bash
npm run dev
npm run lint
npm run build
npm run start
```

## 项目状态

这是一个可继续迭代的前端 MVP。后续可以接入持久化数据、身份验证、真实 AI 能力、跨设备同步，以及更高级的 SVG/WebGL 液态玻璃效果。

## AI 协作说明

其他 AI 或开发者接手项目前，建议按以下顺序了解代码：

1. 阅读本 README，确认当前范围和技术边界。
2. 查看 `src/app/globals.css`，了解视觉变量和玻璃组件样式。
3. 查看 `src/components/layout/app-shell.tsx`，了解整体响应式布局。
4. 查看 `src/components/dashboard/dashboard.tsx` 和 `src/components/ui/section-page.tsx`，了解页面组织方式。
5. 修改完成后运行 `npm run lint` 和 `npm run build`。

私有仓库不会因分享链接而自动开放访问。AI 工具需要通过已授权的 GitHub 连接、协作者账号或本地项目目录读取代码。
