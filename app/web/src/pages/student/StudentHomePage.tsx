import { Link } from 'react-router-dom';

/** P03 学生首页（骨架，完整实现见 TODO T4.5） */
export default function StudentHomePage() {
  return (
    <main className="mx-auto max-w-5xl p-8">
      <header className="mb-8 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">学生端</h1>
        <Link to="/login" className="text-ink-secondary">
          返回登录
        </Link>
      </header>
      {/* MVP 选课：仅数学开放，其余学科锁定 */}
      <nav className="mb-6 flex gap-4" aria-label="学科选择">
        <Link
          to="/student/math"
          className="rounded-xl bg-primary px-8 py-3 font-bold text-on-primary hover:bg-primary-strong"
        >
          数学 · 章节星链图
        </Link>
        <span className="rounded-xl bg-card px-8 py-3 font-bold text-ink-secondary" aria-disabled="true">
          语文（暂未开放）
        </span>
        <span className="rounded-xl bg-card px-8 py-3 font-bold text-ink-secondary" aria-disabled="true">
          英语（暂未开放）
        </span>
      </nav>
      <p className="rounded-xl bg-card p-6 text-ink-secondary">
        骨架页 —— 学生端首页将在 M4（T4.5）实现：继续学习 / 今日任务 / 我的奖励
        三卡 + 本周打卡条。
      </p>
    </main>
  );
}
