---
name: github-commit
escription: 使用 GitHub MCP 把本地代码提交并推送到 GitHub（无需本地 git 凭证），涵盖首次建仓初始化、日常增量提交、大改动建分支走 PR。只要用户说「提交代码」「推送到 GitHub」「push」「commit」「同步到远程」「上传代码」「建仓库 / 初始化仓库」，或任何想把代码放到 GitHub 上的请求，都应使用本 skill——即使用户没有明确提到 MCP 或 GitHub（只说"提交一下代码"），只要本会话有 GitHub MCP 工具可用，就用本 skill。
---

# GitHub MCP 提交代码

用 GitHub MCP 工具（而非本地 `git push`）把本地改动提交到 GitHub。适用于没有配置本地 git 凭证、或希望统一走 API 提交的场景。

## 核心原则

1. **本地 git 只用来"看"，不用来"推"**：用 `git status` / `git diff` / `git log` 判断改了什么；实际提交全部通过 MCP 的 `push_files` / `delete_file` / `create_repository` 完成。
2. **本地与远程是两条独立历史**。MCP 的 `push_files` 是把文件内容在 GitHub 上新建 commit，它不知道本地 commit SHA，本地也不知道远程的 SHA。同步进度靠 `.claude/github-sync.json` 记录（见下节），不要试图让两边 SHA 对齐。
3. **安全第一**：推送前必须做安全检查（第 2 步），发现密钥、禁推文件一律中止并报告，绝不静默带上。

## 同步状态文件 `.claude/github-sync.json`

```json
{
  "owner": "LJinbo",
  "repo": "<仓库名>",
  "branch": "main",
  "lastSyncedCommit": "<上次同步成功时的本地 HEAD sha>"
}
```

- 文件存在且 `lastSyncedCommit` 指向的提交可达 → **增量模式**：变更集 = `git diff --name-status <lastSyncedCommit> HEAD` 的增/改/删 + 未跟踪新文件（`git ls-files --others --exclude-standard`）
- 文件不存在 → **全量模式**：文件清单 = `git ls-files --cached --others --exclude-standard`（自动排除 .gitignore 内容），无删除项
- 每次推送**成功后**才更新 `lastSyncedCommit` 为当时的本地 HEAD；推送失败不要更新

## 工作流程

### 第 0 步：收集信息

1. `git -c core.quotepath=false status --short` 和 `git log --oneline -5`（仓库可能还没有任何提交，`git log` 报错属正常，跳过即可）。加 `core.quotepath=false` 是为了中文文件名不显示成转义串
2. 读 `.claude/github-sync.json`（可能不存在）
3. 确定 owner/repo，优先级：sync 文件 > `git remote get-url origin` 解析 > 询问用户；owner 默认用 `get_me` 返回的 login
4. 探测远程仓库是否存在：`get_file_contents` 读根路径，报错/404 → 视为不存在，走「首次初始化」

### 第 1 步：本地提交（先落本地历史）

把待提交改动在本地提交：`git add -A && git commit`（首次提交也一样）。提交信息用规范格式（`feat:` / `fix:` / `docs:` / `chore:` + 中文简述），末尾加：

```
Co-Authored-By: Claude Code <noreply@anthropic.com>
```

后续 MCP 提交信息与本地 commit 保持一致，便于两边对照。

### 第 2 步：安全检查（推送前必做）

1. **禁推文件**：读项目 CLAUDE.md，其中声明禁止读取的文件同样禁止推送（本项目即 `提示词备注.md`）。若它出现在待提交列表且未被 .gitignore 覆盖 → 先帮用户加进 .gitignore（一行 `提示词备注.md`，并告知用户），再继续
2. **密钥扫描**：把待推送文件内容交给 `run_secret_scanning`；发现密钥 → 中止，报告文件与位置，等用户处理完再继续
3. **环境文件**：`.env*` 一律不推，发现即在 .gitignore 中补上
4. **二进制文件**：`push_files` 只支持文本内容。按扩展名剔除二进制（png jpg jpeg gif webp ico woff woff2 ttf otf eot zip gz tar 7z rar pdf doc docx xls xlsx ppt pptx mp3 mp4 wav mov avi sqlite db exe dll so dylib 等），把跳过的文件列给用户，并说明这些文件需要用户自行通过其他方式上传
5. **超大文件**：单个文本文件 > 5MB，先向用户确认

### 第 3 步：选择提交策略（智能判断）

| 场景 | 策略 |
|---|---|
| 首次初始化 / 全量推送 | 直接推默认分支 |
| 增量 ≤ 5 个文件 | 直接推默认分支 |
| 增量 > 5 个文件 | 新建分支 `sync/<yyyymmdd-主题>` 推送 + `create_pull_request` |

- 走 PR 时：`create_pull_request`（base=默认分支，head=新分支），标题与本地 commit 一致，描述末尾加 `🤖 Generated with [Claude Code](https://claude.com/claude-code)`，把 PR 链接交给用户，本次不更新 `lastSyncedCommit`（等用户合并后下次增量会自然对齐——注意：合并后 delta 会包含被合并的全部文件，这是预期行为）
- 删除的文件走 `delete_file`（提供 branch 和 message），删除与修改混合时按总变更数套用上表

### 第 4 步：执行推送

- **首次初始化**：`create_repository`（name、description 可选、`autoInit: true`、private 默认 true 除非用户另说）。必须 `autoInit: true`，否则没有初始分支，`push_files` 无处落commit。随后按全量模式推送
- **push_files**：一次携带全部增/改文件，message 与本地 commit 一致；文件多时分批（每批 ≤ 20 个）顺序执行，任何一批失败即停止
- 从 `create_repository` 响应或 `list_branches` 确认默认分支名（通常是 main）

### 第 5 步：收尾

1. 更新 `.claude/github-sync.json` 的 `lastSyncedCommit` 为当前本地 HEAD（走 PR 时除外）
2. 本地关联远程：`git remote add origin https://github.com/<owner>/<repo>.git`（已存在则 `set-url`），方便日后需要时直接用 git
3. 向用户报告：仓库/分支、提交信息、commit 链接（可用 `get_commit` 拿 html_url）、跳过的文件及原因

## 常见坑

- 中文文件名：始终用 `git -c core.quotepath=false ...`，否则文件名是 `"\346\217\220..."` 转义串，后续按路径读文件会失败
- 仓库还没有任何提交时 `git diff <sha> HEAD` 不可用，此时必然是全量模式
- 远程仓库不存在时 push_files 会报错——先探测，再创建，不要反复重试同一个报错
- 全量模式会覆盖远程同名文件；若怀疑远程有网页端手工改动，先 `get_file_contents` 对比再推
- 用户本地若曾手动 git push 过（两条历史不同），以本地 HEAD 为准增量推送即可；但**远程有而本地没有的文件不要主动删**
