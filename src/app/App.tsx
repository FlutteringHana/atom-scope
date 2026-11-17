import { useEffect, useState } from 'react';
import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  Atom,
  BookOpen,
  ChevronRight,
  FlaskConical,
  GitBranch,
  Grid2X2,
  Menu,
  Search,
  X,
} from 'lucide-react';
import { parts, relationships, topics } from '../content/knowledge';
import { C } from '../physics/constants';
import { Workspace } from '../features/Workspace';

function useRoute() {
  const [route, setRoute] = useState(() => window.location.hash.slice(1) || '/');
  useEffect(() => {
    const update = () => {
      setRoute(window.location.hash.slice(1) || '/');
      window.scrollTo(0, 0);
    };
    window.addEventListener('hashchange', update);
    return () => window.removeEventListener('hashchange', update);
  }, []);
  return route;
}
function PartArt({ part }: { part: number }) {
  return (
    <svg viewBox="0 0 300 150" aria-hidden="true" className="part-art">
      {part === 1 ? (
        <g fill="none" stroke="currentColor">
          <circle cx="150" cy="75" r="45" opacity=".35" />
          <circle cx="150" cy="75" r="4" fill="currentColor" />
          <path d="M20 88L120 88 Q155 88 170 55L194 15M20 108L130 108 Q175 108 194 86L280 20M20 130H280" />
          <circle cx="100" cy="88" r="3" fill="currentColor" />
          <circle cx="95" cy="108" r="3" fill="currentColor" />
        </g>
      ) : part === 2 ? (
        <g stroke="currentColor" fill="none">
          {[37, 46, 63, 105].map((y, i) => (
            <g key={y}>
              <line x1="60" x2="240" y1={y} y2={y} opacity={0.4 + i * 0.15} />
              <text x="250" y={y + 4} fontSize="10" fill="currentColor" stroke="none">
                {4 - i}
              </text>
            </g>
          ))}
          <path d="M170 46V102m-5-7 5 7 5-7" />
          <path d="M178 74q10-8 20 0t20 0t20 0" />
        </g>
      ) : (
        <g fill="none" stroke="currentColor">
          <path
            d={Array.from(
              { length: 141 },
              (_, i) =>
                `${i ? 'L' : 'M'}${i * 2 + 10},${75 + Math.sin(i / 9) * 33 * Math.exp(-(((i - 70) / 50) ** 2))}`,
            ).join(' ')}
            strokeWidth="1.6"
          />
          <path d="M10 75H290" opacity=".2" />
          <ellipse cx="150" cy="75" rx="70" ry="50" strokeDasharray="2 5" opacity=".4" />
        </g>
      )}
    </svg>
  );
}
function KnowledgeMap({ partId }: { partId?: number }) {
  const [query, setQuery] = useState('');
  const [mode, setMode] = useState('cards');
  const [filter, setFilter] = useState('all');
  const part = parts.find((p) => p.id === partId);
  const filtered = topics.filter(
    (t) =>
      (!partId || t.part === partId) &&
      (!query ||
        `${t.title} ${t.english} ${t.description}`.toLowerCase().includes(query.toLowerCase())) &&
      (filter === 'all' || (filter === 'interactive' ? !!t.engine : t.priority === '核心')),
  );
  return (
    <div className="map-page">
      <section className="hero">
        <div className="hero-copy">
          <div className="eyebrow">
            <span className="tiny-dot" /> AN INTERACTIVE ATLAS OF ATOMIC PHYSICS
          </div>
          <h1>
            {part ? (
              part.title
            ) : (
              <>
                把抽象的物理，
                <br />
                变成可探索的<span>直觉。</span>
              </>
            )}
          </h1>
          <p>
            {part
              ? part.question
              : '从原子核到量子态。在模型、实验与数学之间建立联系，亲手探索微观世界的运行方式。'}
          </p>
          <div className="hero-actions">
            <a
              className="primary-button"
              href={`#/topic/${partId === 1 ? 'rutherford' : partId === 3 ? 'matter-waves' : 'bohr'}`}
            >
              开始探索 <ArrowUpRight size={17} />
            </a>
            <a
              className="text-link"
              href="#course-topics"
              onClick={(e) => {
                e.preventDefault();
                document.getElementById('course-topics')?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              浏览知识地图 <ArrowDown size={15} />
            </a>
          </div>
          <div className="hero-meta">
            <span>03 个知识领域</span>
            <i />
            <span>{topics.length} 个知识主题</span>
            <i />
            <span>{topics.filter((t) => t.engine).length} 个交互模块</span>
          </div>
        </div>
        <a className="hero-figure" href="#/topic/bohr" aria-label="探索玻尔原子模型">
          <svg viewBox="0 0 420 320" role="img" aria-label="氢原子玻尔模型示意">
            <defs>
              <radialGradient id="hero-glow">
                <stop stopColor="#c0ca9e" stopOpacity=".25" />
                <stop offset="1" stopColor="#c0ca9e" stopOpacity="0" />
              </radialGradient>
            </defs>
            <circle cx="210" cy="150" r="145" fill="url(#hero-glow)" />
            {[40, 78, 116].map((r, i) => (
              <g key={r}>
                <circle cx="210" cy="150" r={r} stroke="#aab59a" fill="none" strokeWidth=".8" />
                <text x={215 + r} y="146" fontSize="10" fill="#7b876d">
                  n = {i + 1}
                </text>
              </g>
            ))}
            <circle cx="210" cy="150" r="7" fill="#65794c" />
            <circle cx="133" cy="63" r="4" fill="#63754c" />
            <circle cx="133" cy="63" r="12" fill="#63754c" opacity=".08" />
            <path d="M136 70L180 120" stroke="#a67848" strokeDasharray="3 4" />
            <text x="24" y="245" fill="#7b876d" fontSize="10">
              HYDROGEN / Z = 1
            </text>
            <text
              x="24"
              y="267"
              fill="#3c4d32"
              fontFamily="Georgia,serif"
              fontStyle="italic"
              fontSize="20"
            >
              Eₙ = −13.6 / n² eV
            </text>
            <text x="24" y="292" fill="#8a907f" fontSize="9">
              玻尔模型示意 · 非真实尺度
            </text>
          </svg>
          <span>
            模型是理解自然的一扇窗。
            <ArrowUpRight size={14} />
          </span>
        </a>
      </section>
      {!part && (
        <section className="parts-section">
          <div className="section-heading">
            <div>
              <span className="eyebrow">THE LEARNING LANDSCAPE</span>
              <h2>三个视角，一个微观世界。</h2>
            </div>
            <span className="muted small-text">循着问题探索，不必按顺序前进。</span>
          </div>
          <div className="part-cards">
            {parts.map((p) => (
              <a href={`#/part/${p.id}`} className={`part-card ${p.color}`} key={p.id}>
                <div className="part-card-top">
                  <span>PART {p.numeral}</span>
                  <ArrowUpRight size={18} />
                </div>
                <PartArt part={p.id} />
                <span className="eyebrow">{p.label}</span>
                <h3>{p.title}</h3>
                <p>{p.description}</p>
                <div className="part-card-bottom">
                  <span>{topics.filter((t) => t.part === p.id).length} 个主题</span>
                  <span>
                    进入探索 <ArrowRight size={13} />
                  </span>
                </div>
              </a>
            ))}
          </div>
        </section>
      )}
      <section id="course-topics" className="topics-section">
        <div className="section-heading">
          <div>
            <span className="eyebrow">YOUR FIELD GUIDE</span>
            <h2>{part ? `Part ${part.numeral} · 知识主题` : '选择一个问题，开始。'}</h2>
          </div>
          <div className="segmented" aria-label="知识导航方式">
            <button className={mode === 'cards' ? 'active' : ''} onClick={() => setMode('cards')}>
              <Grid2X2 size={14} />
              主题
            </button>
            <button
              className={mode === 'relations' ? 'active' : ''}
              onClick={() => setMode('relations')}
            >
              <GitBranch size={14} />
              知识关联
            </button>
          </div>
        </div>
        {mode === 'cards' ? (
          <>
            <div className="topic-tools">
              <div className="filter-buttons">
                {[
                  ['all', '全部主题'],
                  ['interactive', '交互探索'],
                  ['core', '核心知识'],
                ].map(([id, label]) => (
                  <button
                    key={id}
                    className={filter === id ? 'active' : ''}
                    onClick={() => setFilter(id)}
                  >
                    {label}
                  </button>
                ))}
              </div>
              <label className="search">
                <Search size={15} />
                <input
                  aria-label="搜索知识主题"
                  placeholder="搜索概念、模型或实验…"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
                {query && (
                  <button aria-label="清空搜索" onClick={() => setQuery('')}>
                    <X size={13} />
                  </button>
                )}
              </label>
            </div>
            <div className="topic-list">
              {filtered.length ? (
                filtered.map((t) => (
                  <a href={`#/topic/${t.id}`} className="topic-row" key={t.id}>
                    <span className={`topic-index ${parts[t.part - 1].color}`}>
                      {parts[t.part - 1].numeral}
                    </span>
                    <div>
                      <h3>
                        {t.title}
                        <span>{t.english}</span>
                      </h3>
                      <p>{t.description}</p>
                    </div>
                    <span className="priority">{t.priority}</span>
                    <span className={`topic-type ${t.engine ? 'is-interactive' : ''}`}>
                      {t.engine ? <FlaskConical size={13} /> : <BookOpen size={13} />}
                      {t.engine ? '交互探索' : '概念笔记'}
                    </span>
                    <ChevronRight size={17} />
                  </a>
                ))
              ) : (
                <div className="empty-state">
                  <Search size={24} />
                  <h3>没有匹配的主题</h3>
                  <p>试试“玻尔”“光谱”或英文名称。</p>
                  <button
                    className="outline-button"
                    onClick={() => {
                      setQuery('');
                      setFilter('all');
                    }}
                  >
                    显示全部主题
                  </button>
                </div>
              )}
            </div>
            <div className="topic-count">
              显示 {filtered.length} / {topics.filter((t) => !partId || t.part === partId).length}{' '}
              个主题 <span>概念笔记的专题交互可视化将分阶段补充。</span>
            </div>
          </>
        ) : (
          <div className="relationship-list">
            <p className="muted">关联表示不同类型的知识联系，并非单一的必修先后顺序。</p>
            {relationships
              .filter(
                (r) =>
                  !partId ||
                  topics.find((t) => t.id === r.from)!.part === partId ||
                  topics.find((t) => t.id === r.to)!.part === partId,
              )
              .map((r) => (
                <article key={`${r.from}-${r.to}`}>
                  <div>
                    <a href={`#/topic/${r.from}`}>{topics.find((t) => t.id === r.from)!.title}</a>
                    <span>
                      {r.label}
                      <ArrowRight size={14} />
                    </span>
                    <a href={`#/topic/${r.to}`}>{topics.find((t) => t.id === r.to)!.title}</a>
                  </div>
                  <p>{r.note}</p>
                </article>
              ))}
          </div>
        )}
      </section>
      <section className="map-footnote">
        <Atom size={28} strokeWidth={1} />
        <div>
          <h3>不止观看，更要理解。</h3>
          <p>每个交互模型都标注假设、单位与适用边界。用可验证的数学，支撑可探索的直觉。</p>
        </div>
        <a href="#/reference" className="text-link">
          数学与常数参考 <ArrowRight size={15} />
        </a>
      </section>
    </div>
  );
}
function Reference() {
  const rows = [
    ['光速 c', C.c.toString(), 'm·s⁻¹', '定义值（精确）'],
    ['普朗克常数 h', C.h.toExponential(8), 'J·s', '定义值（精确）'],
    ['元电荷 e', C.e.toExponential(9), 'C', '定义值（精确）'],
    ['玻尔兹曼常数 kB', C.kB.toExponential(6), 'J·K⁻¹', '定义值（精确）'],
    ['电子质量 me', C.electronMass.toExponential(10), 'kg', 'CODATA 2022'],
    ['α 粒子质量 mα', C.alphaMass.toExponential(9), 'kg', 'CODATA 2022 · 固定靶模型'],
    ['真空介电常数 ε₀', C.epsilon0.toExponential(10), 'F·m⁻¹', 'CODATA 2022'],
    ['玻尔半径 a₀', C.bohrRadius.toExponential(11), 'm', 'CODATA 2022'],
    ['里德伯常数 R∞', String(C.rydberg), 'm⁻¹', '无限核质量约定'],
  ];
  return (
    <div className="reference-page">
      <span className="eyebrow">THE SCIENTIFIC TOOLKIT</span>
      <h1>数学、常数与单位</h1>
      <p className="page-lead">保持符号清晰，让每一个数值都有来处。</p>
      <div className="reference-note">
        内部计算使用 SI，界面按需换算为 eV、nm 与
        fm。玻尔模型采用无限核质量约定；显示的小数位数不代表实验精度。
      </div>
      <div className="table-scroll">
        <table>
          <caption>
            物理常数 ·{' '}
            <a href="https://physics.nist.gov/cuu/pdf/all.pdf" target="_blank" rel="noreferrer">
              NIST 2022 CODATA ↗
            </a>
          </caption>
          <thead>
            <tr>
              <th>常数</th>
              <th>数值</th>
              <th>SI 单位</th>
              <th>约定</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row[0]}>
                {row.map((cell) => (
                  <td key={cell}>{cell}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="section-heading">
        <h2>公式与物理意义</h2>
      </div>
      <div className="formula-grid">
        {topics
          .filter((t) => t.engine)
          .map((t) => (
            <a key={t.id} href={`#/topic/${t.id}`}>
              <h3>
                {t.title}
                <ArrowUpRight size={15} />
              </h3>
              <div className="equation">{t.equation}</div>
              <p>{t.description}</p>
            </a>
          ))}
      </div>
    </div>
  );
}
export function App() {
  const route = useRoute();
  const [menuOpen, setMenuOpen] = useState(false);
  useEffect(() => {
    setMenuOpen(false);
  }, [route]);
  const topic = route.startsWith('/topic/')
    ? topics.find((t) => t.id === route.split('/')[2])
    : undefined;
  const partId = route.startsWith('/part/') ? Number(route.split('/')[2]) : undefined;
  const isMap = route === '/' || (!!partId && parts.some((p) => p.id === partId));
  const valid = isMap || topic || route === '/reference';
  useEffect(() => {
    document.title = `${topic?.title || (route === '/reference' ? '数学与常数' : '原子物理探索')} · AtomScope`;
  }, [topic, route]);
  return (
    <>
      <a
        className="skip-link"
        href="#main-content"
        onClick={(e) => {
          e.preventDefault();
          document.getElementById('main-content')?.focus();
        }}
      >
        跳至主要内容
      </a>
      <header className="app-header">
        <a className="brand" href="#/" aria-label="AtomScope 首页">
          <span className="brand-icon">
            <Atom size={23} strokeWidth={1.35} />
          </span>
          Atom<span>Scope</span>
          <small>PHYSICS, MADE TANGIBLE.</small>
        </a>
        <nav aria-label="主导航">
          <a href="#/" className={isMap ? 'active' : ''}>
            <Grid2X2 size={15} />
            知识地图
          </a>
          <a href="#/reference" className={route === '/reference' ? 'active' : ''}>
            <BookOpen size={15} />
            数学参考
          </a>
        </nav>
        <div className="header-end">
          <span className="edition-label">
            ATOMIC PHYSICS <i /> VOL. 01
          </span>
          <button
            className="mobile-menu-button icon-button"
            aria-label={menuOpen ? '关闭目录' : '打开目录'}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </header>
      <div className="app-layout">
        <aside className={`sidebar ${menuOpen ? 'menu-open' : ''}`} aria-label="课程目录">
          <div className="sidebar-intro">
            <span className="eyebrow">EXPLORATION INDEX</span>
            <a href="#/">
              原子物理 <ChevronRight size={14} />
            </a>
            <span>从经典模型到量子世界</span>
          </div>
          {parts.map((p) => (
            <section className="sidebar-part" key={p.id}>
              <a
                className={`sidebar-part-title ${p.color} ${partId === p.id ? 'current-part' : ''}`}
                href={`#/part/${p.id}`}
              >
                <span>{p.numeral.padStart(2, '0')}</span>
                {p.title}
              </a>
              <div>
                {topics
                  .filter((t) => t.part === p.id)
                  .map((t) => (
                    <a
                      key={t.id}
                      className={topic?.id === t.id ? 'active' : ''}
                      href={`#/topic/${t.id}`}
                      aria-current={topic?.id === t.id ? 'page' : undefined}
                    >
                      {t.title}
                      {t.engine && <span className="sidebar-dot" />}
                    </a>
                  ))}
              </div>
            </section>
          ))}
          <div className="sidebar-bottom">
            <span className="eyebrow">A NOTE ON MODELS</span>
            <p>
              模型帮助我们理解自然，
              <br />
              也有自己的适用边界。
            </p>
            <a href="#/reference">
              常数与单位 <ArrowUpRight size={13} />
            </a>
          </div>
        </aside>
        <main id="main-content" tabIndex={-1}>
          {topic ? (
            <Workspace key={topic.id} topic={topic} />
          ) : route === '/reference' ? (
            <Reference />
          ) : isMap ? (
            <KnowledgeMap key={partId || 0} partId={partId} />
          ) : (
            <div className="empty-state">
              <h1>没有找到这个知识入口</h1>
              <p>请从课程地图中选择主题。</p>
              <a className="primary-button" href="#/">
                返回知识地图
              </a>
            </div>
          )}
          <footer className="app-footer">
            <span>
              AtomScope <span className="footer-separator">/</span>{' '}
              {valid ? '让知识相连，让物理可见。' : 'Atomic Physics'}
            </span>
            <span>THEORY · EXPERIMENT · UNDERSTANDING</span>
          </footer>
        </main>
      </div>
    </>
  );
}
