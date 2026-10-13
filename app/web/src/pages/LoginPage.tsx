import { useState } from 'react';
import type { FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * P01 登录页：账号登录，登录后按账号角色自动路由到学生端/家长端（无身份选择）。
 * MVP 阶段为静态演示：任意账号密码提交后进入学生端（T4.1 接真实登录接口）。
 */
export default function LoginPage() {
  const navigate = useNavigate();
  const [account, setAccount] = useState('');
  const [password, setPassword] = useState('');

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    // TODO(T4.1): 调用登录接口，根据返回的角色跳转 /student 或 /parent
    navigate('/student');
  }

  return (
    <main className="flex min-h-screen items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="w-96 rounded-2xl bg-card p-8 shadow-sm"
      >
        <h1 className="text-2xl font-semibold">K12 智学系统</h1>
        <p className="mb-8 mt-1 text-ink-secondary">
          账号登录，系统将按账号身份自动进入对应端
        </p>

        <label
          htmlFor="account"
          className="mb-1 block text-sm text-ink-secondary"
        >
          账号
        </label>
        <input
          id="account"
          value={account}
          onChange={(event) => setAccount(event.target.value)}
          placeholder="请输入手机号"
          className="mb-4 w-full rounded-lg border border-chain bg-elevated px-4 py-3 text-ink outline-none focus:border-primary"
        />

        <label
          htmlFor="password"
          className="mb-1 block text-sm text-ink-secondary"
        >
          密码
        </label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          placeholder="请输入密码"
          className="w-full rounded-lg border border-chain bg-elevated px-4 py-3 text-ink outline-none focus:border-primary"
        />

        <button
          type="submit"
          className="mt-8 w-full rounded-lg bg-primary px-6 py-3 text-lg font-bold text-on-primary hover:bg-primary-strong"
        >
          登录
        </button>
      </form>
    </main>
  );
}
