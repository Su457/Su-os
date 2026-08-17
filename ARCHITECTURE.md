# Su OS 架构说明

本文描述 Su OS v0.2.1 的代码边界。v0.2.1 是一次最小必要的架构整理：保持现有功能、液态玻璃界面和本地数据兼容，不引入云端能力。

## 总体数据流

```text
Routes (app)
  ↓
Modules (components / hooks / selectors)
  ↓
Domain + Store
  ↓
Data (local snapshot / backup validation)

Shared 为各层提供通用 UI、布局、配置和无业务状态的工具。
```

依赖方向应保持单向：路由引用模块；模块通过领域 Hook 使用 Store，并通过纯 selector 推导数据；Store 协调 mutation 与持久化；Data 层负责具体的本地存取。Domain 不依赖 React、浏览器 API 或持久化实现。

## 目录职责

### `src/app`

Next.js App Router 的路由入口和全局样式。`page.tsx` 只组装对应模块的页面入口，不承载 CRUD、统计或持久化逻辑。

### `src/modules`

按业务模块组织 Dashboard、Today、Tasks、Notes、Projects、Learning、Focus、AI 和 Settings。每个模块可按实际需要包含：

- `components/`：页面和业务专属 UI；
- `hooks/`：面向该业务的薄 API，内部可调用全局 Store；
- `selectors.ts`：不依赖 React、`window` 或 `localStorage` 的纯数据推导函数。

Dashboard 优先组合 Tasks、Projects、Learning 等模块公开的 selector，不重复实现同一套统计逻辑。

### `src/domain`

保存稳定的领域类型：

- `task.ts`：`Task`、优先级和输入类型；
- `note.ts`：`Note` 和输入类型；
- `project.ts`：`Project`、`Milestone`、状态和输入类型；
- `learning.ts`：`LearningSession` 和输入类型；
- `focus.ts`：`FocusSession`、`FocusDraft` 和输入类型；
- `snapshot.ts`：当前本地快照 `SuOsData`。

领域类型使用前端友好的 camelCase，不依赖未来 Supabase Row 的 snake_case 结构。业务代码直接从对应领域文件导入类型，避免再形成单一的巨型类型入口。

Milestone 继续沿用 v2 数据中的字段，本次不增加必填 `createdAt` / `updatedAt`。未来设计 PostgreSQL Schema 时再补充这些时间字段和兼容映射，优先保证现有浏览器数据可以直接读取。

### `src/data`

- `local/`：默认演示数据和浏览器 Local Snapshot Repository；
- `backup/`：导入 JSON 的结构校验与解析。

当前 LocalStorage Repository 是同步的、浏览器本地的整份快照持久化实现。它只负责 `load`、`save` 和 `clear`，不是一个通用云仓储协议。

未来 Supabase 应采用表级 CRUD、异步持久化、冲突和同步策略，并通过 Mapper 在 Supabase Row 与 Domain Entity 之间转换。不能简单地用“整份 `SuOsData` 保存”模拟 Supabase，也不应假定现有 `load()/save(SuOsData)` 接口可以无改动替换成云端实现。

### `src/store`

React Context Store 负责：

- 应用内统一状态；
- 业务 mutation；
- 本地持久化协调；
- 数据导入、导出、重置和清空。

筛选、排序、统计和页面展示逻辑应放在模块 selector 中。业务组件优先使用 `useTasks()`、`useNotes()`、`useProjects()`、`useLearning()`、`useFocus()` 等薄 Hook，避免依赖整个 Store 的内部结构。

### `src/shared`

保存跨模块复用且不属于某项业务的内容：

- `components/layout/`：App Shell、桌面 Sidebar、移动端 Bottom Navigation 和 Topbar；
- `components/ui/`：玻璃选择器、弹窗、图标、空状态等通用 UI；
- `config/navigation.ts`：导航配置；
- `lib/date-utils.ts`：无业务状态的日期工具。

业务专属组件不得放入 `shared`。模块间关联通过 Domain ID、selector 和 Store 完成，而不是互相导入内部组件。

## 本地数据兼容

v0.2.1 保持以下约定不变：

- LocalStorage key：`su-os:data:v2`；
- `SuOsData.schemaVersion`：`2`；
- 已有 v0.2 浏览器数据和同版本 JSON 备份可继续读取；
- 本次不要求数据迁移，也不会静默重置有效数据。

### Durable Data 与 Device State

未来可同步到云端的 Durable Data：

- `Task`
- `Note`
- `Project`
- `Milestone`
- `LearningSession`
- 已完成的 `FocusSession`

`FocusDraft` 是当前设备上的临时计时关联状态，不是默认的云同步数据。为了保持 v2 快照兼容，它暂时仍位于 `SuOsData` 中；未来拆分持久化时应继续把它视为 Device State。

## 扩展约定

新增业务模块时，优先按以下最小路径扩展：

```text
domain entity
  ↓
modules/<feature> (components / hooks / selectors)
  ↓
app route + navigation
  ↓
store mutation
  ↓
local persistence
```

Dashboard 如需新模块数据，应消费该模块公开的 selector，而不是读取或复制其内部 UI 逻辑。

## 后续路线

```text
LocalStorage
  ↓
Supabase PostgreSQL
  ↓
Auth + RLS
  ↓
Vercel
  ↓
PWA
  ↓
Capacitor Android
```

未来接入 Supabase 时，需要先确定表级 Repository/Service、异步状态、迁移、离线与冲突策略，再引入 Auth、`user_id` 和 RLS。UI 与 Domain 不直接依赖 Supabase SDK 或数据库行结构。

## v0.2.1 范围外

当前版本明确不包含：

- Supabase 或其他后端数据库；
- Auth、账号与 RLS；
- Cloud Sync；
- Vercel 部署配置；
- PWA / Service Worker；
- Capacitor Android；
- 真实 AI API。
