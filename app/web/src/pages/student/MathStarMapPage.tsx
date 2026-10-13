import { useState } from 'react';
import { Link } from 'react-router-dom';

/**
 * P04 章节星链图（演示版）：章节 = 星球，重要度决定星球大小（大/中/小），
 * 点击章节后在星链图下方展开该章全部小节。
 * MVP 静态 mock 数据（人教版三年级上学期示例）；真实数据与解锁计算见 TODO T4.2。
 */

type ChapterStatus = 'done' | 'current' | 'locked';
type ChapterSize = 'large' | 'medium' | 'small';

interface Section {
  order: number;
  title: string;
  status: ChapterStatus;
}

interface Chapter {
  id: number;
  name: string;
  size: ChapterSize;
  status: ChapterStatus;
  sections: Section[];
}

const SIZE_LABEL: Record<ChapterSize, string> = {
  large: '重点章节',
  medium: '普通章节',
  small: '次要章节',
};

const STATUS_LABEL: Record<ChapterStatus, string> = {
  done: '已完成',
  current: '进行中',
  locked: '未解锁',
};

/** 星球半径（px，SVG viewBox 内） */
const SIZE_RADIUS: Record<ChapterSize, number> = {
  large: 42,
  medium: 32,
  small: 24,
};

function sections(titles: string[], status: ChapterStatus): Section[] {
  return titles.map((title, index) => ({ order: index + 1, title, status }));
}

// 人教版三年级上学期示例章节（重要度与状态均为演示数据）
const CHAPTERS: Chapter[] = [
  { id: 1, name: '时分秒', size: 'small', status: 'done', sections: sections(['秒的认识', '时间的计算'], 'done') },
  {
    id: 2,
    name: '万以内的加减法',
    size: 'large',
    status: 'current',
    sections: [
      { order: 1, title: '加法', status: 'done' },
      { order: 2, title: '减法', status: 'current' },
      { order: 3, title: '整理和复习', status: 'locked' },
    ],
  },
  {
    id: 3,
    name: '测量',
    size: 'medium',
    status: 'locked',
    sections: sections(['毫米 分米的认识', '千米的认识', '吨的认识'], 'locked'),
  },
  { id: 4, name: '倍的认识', size: 'small', status: 'locked', sections: sections(['倍的认识', '解决问题'], 'locked') },
  {
    id: 5,
    name: '多位数乘一位数',
    size: 'large',
    status: 'locked',
    sections: sections(['口算乘法', '笔算乘法', '解决问题', '整理和复习'], 'locked'),
  },
  {
    id: 6,
    name: '长方形和正方形',
    size: 'medium',
    status: 'locked',
    sections: sections(['四边形', '周长'], 'locked'),
  },
  {
    id: 7,
    name: '分数的初步认识',
    size: 'medium',
    status: 'locked',
    sections: sections(['分数的初步认识', '分数的简单计算'], 'locked'),
  },
  { id: 8, name: '数学广角——集合', size: 'small', status: 'locked', sections: sections(['集合问题'], 'locked') },
];

const VIEW_WIDTH = 980;
const VIEW_HEIGHT = 260;
/** 星球横向均布的起点与间距 */
const X_START = 80;
const X_GAP = (VIEW_WIDTH - X_START * 2) / (CHAPTERS.length - 1);
/** 星球纵向交错（形成星链弧度） */
const Y_HIGH = 100;
const Y_LOW = 170;

function planetFill(status: ChapterStatus): string {
  if (status === 'done') return 'var(--color-star-done)';
  if (status === 'current') return 'var(--color-primary)';
  return 'var(--color-star-locked)';
}

function planetBorder(status: ChapterStatus): string {
  if (status === 'done') return 'var(--color-star-done-border)';
  if (status === 'current') return 'var(--color-primary-strong)';
  return 'var(--color-star-locked-border)';
}

export default function MathStarMapPage() {
  const [selectedId, setSelectedId] = useState<number>(2);
  const selected = CHAPTERS.find((chapter) => chapter.id === selectedId) ?? CHAPTERS[0];
  const doneCount = CHAPTERS.filter((chapter) => chapter.status === 'done').length;

  const centers = CHAPTERS.map((chapter, index) => ({
    x: X_START + index * X_GAP,
    y: index % 2 === 0 ? Y_LOW : Y_HIGH,
  }));

  return (
    <main className="mx-auto max-w-6xl px-8 py-8">
      <header className="mb-6 flex items-baseline justify-between">
        <div>
          <h1 className="text-2xl font-semibold">数学 · 三年级上 · 章节星链图</h1>
          <p className="mt-1 text-ink-secondary">
            星球大小代表章节重要度（大/中/小）；点击星球查看该章小节。MVP 阶段仅数学开放。
          </p>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-ink-secondary">
            进度 {doneCount}/{CHAPTERS.length}
          </span>
          <Link to="/student" className="rounded-lg bg-primary-soft px-4 py-2 font-bold text-primary">
            返回首页
          </Link>
        </div>
      </header>

      {/* 星链图：章节星球 + 虚线星链 */}
      <section className="rounded-2xl bg-card p-6 shadow-sm" aria-label="章节星链图">
        <svg viewBox={`0 0 ${VIEW_WIDTH} ${VIEW_HEIGHT}`} className="w-full" role="img">
          {/* 星链连线（虚线） */}
          {centers.slice(0, -1).map((center, index) => {
            const next = centers[index + 1];
            return (
              <line
                key={`chain-${index}`}
                x1={center.x}
                y1={center.y}
                x2={next.x}
                y2={next.y}
                stroke="var(--color-chain)"
                strokeWidth="2"
                strokeDasharray="6 6"
              />
            );
          })}

          {CHAPTERS.map((chapter, index) => {
            const center = centers[index];
            const radius = SIZE_RADIUS[chapter.size];
            const isSelected = chapter.id === selectedId;
            return (
              <g
                key={chapter.id}
                onClick={() => setSelectedId(chapter.id)}
                className="cursor-pointer"
                role="button"
                aria-label={`第${chapter.id}章 ${chapter.name} ${STATUS_LABEL[chapter.status]}`}
              >
                {/* 选中光环 */}
                {isSelected && (
                  <circle
                    cx={center.x}
                    cy={center.y}
                    r={radius + 8}
                    fill="none"
                    stroke="var(--color-primary)"
                    strokeWidth="3"
                    strokeDasharray="4 4"
                  />
                )}
                {/* 进行中外圈光环 */}
                {chapter.status === 'current' && !isSelected && (
                  <circle
                    cx={center.x}
                    cy={center.y}
                    r={radius + 6}
                    fill="none"
                    stroke="var(--color-primary)"
                    strokeWidth="2"
                    opacity="0.35"
                  />
                )}
                <circle
                  cx={center.x}
                  cy={center.y}
                  r={radius}
                  fill={planetFill(chapter.status)}
                  stroke={planetBorder(chapter.status)}
                  strokeWidth="2"
                />
                <text
                  x={center.x}
                  y={center.y + radius + 18}
                  textAnchor="middle"
                  fontSize="14"
                  fill="var(--color-ink)"
                >
                  {chapter.id}. {chapter.name}
                </text>
                <text
                  x={center.x}
                  y={center.y + radius + 36}
                  textAnchor="middle"
                  fontSize="12"
                  fill="var(--color-ink-secondary)"
                >
                  {STATUS_LABEL[chapter.status]}
                </text>
              </g>
            );
          })}
        </svg>
        <p className="mt-2 text-center text-sm text-ink-secondary">
          大星球 = 重点章节 ｜ 中星球 = 普通章节 ｜ 小星球 = 次要章节
        </p>
      </section>

      {/* 选中章节的小节列表 */}
      <section className="mt-6 rounded-2xl bg-card p-6 shadow-sm" aria-label="章节小节">
        <div className="mb-4 flex items-baseline justify-between">
          <h2 className="text-xl font-semibold">
            第{selected.id}章 {selected.name}
          </h2>
          <span className="text-ink-secondary">
            {SIZE_LABEL[selected.size]} ｜ {STATUS_LABEL[selected.status]}
          </span>
        </div>
        <ul className="divide-y divide-chain">
          {selected.sections.map((section) => (
            <li key={section.order} className="flex items-center justify-between py-3">
              <span className="text-ink">
                {section.order}. {section.title}
              </span>
              {section.status === 'locked' ? (
                <span className="text-ink-secondary">未解锁：先完成上节并清空错题</span>
              ) : (
                <button
                  type="button"
                  className="rounded-lg bg-primary px-5 py-2 text-base font-bold text-on-primary hover:bg-primary-strong"
                >
                  {section.status === 'done' ? '复习' : '进入'}
                </button>
              )}
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
