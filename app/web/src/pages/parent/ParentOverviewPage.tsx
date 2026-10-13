import { Link } from 'react-router-dom';

/** P14 家长总览页（骨架，完整实现见 TODO T6.1） */
export default function ParentOverviewPage() {
  return (
    <main className="mx-auto max-w-5xl p-8">
      <header className="mb-8 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">家长中心</h1>
        <Link to="/login" className="text-ink-secondary">
          返回登录
        </Link>
      </header>
      <p className="rounded-xl bg-card p-6 text-ink-secondary">
        骨架页 —— 家长总览将在 M6（T6.1）实现：多孩切换 / 今日概况 / 薄弱点提示。
      </p>
    </main>
  );
}
