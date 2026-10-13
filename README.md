# K12 智学系统（zhixue）

以 AI 为核心的 K12 智学系统：AI 引导教学 + 错题闭环 + 游戏化激励 + 家长监督。
第一阶段家庭自用，架构按多用户产品预留扩展。

## 文档

| 文档 | 说明 |
|---|---|
| [需求文档 PRD](docs/K12智学系统需求文档.md) | 角色、架构、六大业务场景、激励体系、里程碑 |
| [UX/UI 设计文档](docs/K12智学系统UX-UI设计文档.md) | 19 个页面：护眼视觉体系、章节星链图、线框图 |
| [style.md](docs/style.md) | **全局视觉规范（唯一配色来源）**：暖橘红主题、全学段统一 |
| [TODO List](docs/TODO.md) | M0–M8 可执行任务清单 |

## 目录结构

```
zhixueProject/
├── base/                        # 数据生产层（Python）
│   ├── paper-crawler/           # 试卷爬虫
│   └── paper-analysis/          # 试卷分析与整理
├── app/                         # 应用层（TypeScript）
│   ├── agent/                   # AI Agent 服务
│   ├── teaching-system/         # 教学系统
│   ├── mistake-book/            # 错题本系统
│   ├── admin/                   # 家长管理系统
│   ├── server/                  # 后端服务（NestJS，/api）
│   └── web/                     # 前端应用（React + Vite + Tailwind CSS 4）
└── docs/                        # 文档
```

## 技术栈

pnpm monorepo ｜ React 18 + TypeScript + Vite 6 + Tailwind CSS 4 ｜ Node.js 20 + NestJS 11 ｜ PostgreSQL 16 + Prisma ｜ 数据生产 Python（Scrapy + Playwright）｜ LLM 走 OpenAI 兼容协议（DeepSeek / GLM / 通义千问可切换）

## 快速开始

```bash
pnpm install
pnpm dev:server   # 后端 http://localhost:3000/api（健康检查 /api/health）
pnpm dev:web      # 前端 http://localhost:5173（/api 代理到 3000）
```

## 硬性约束（详见 CLAUDE.md）

- 配色唯一来源 [style.md](docs/style.md)：暖橘红主题全学段统一；全端**禁止 emoji**、禁止吉祥物与装饰性元素
- AI 严禁闲聊（话题护栏）；掌握式晋级（清空错题才解锁下一关）不可绕过；答疑不入错题本
- 护眼：禁大面积纯白/纯黑，正文对比度 ≥ 7:1，禁闪烁动画
- `提示词备注.md` 为本地私有笔记，禁止读取与提交（已在 .gitignore）
