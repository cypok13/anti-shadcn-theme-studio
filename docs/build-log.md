# Anti-shadcn Theme Studio — Build Log
> Для кейс-стади на notjustsasha.com

---

## Метаданные проекта

- **Название:** Anti-shadcn Theme Studio
- **Linear:** ALE-637
- **Ветка:** ale-637/anti-shadcn-theme-studio
- **Старт:** 2026-04-06
- **Стек:** Next.js 15, Tailwind v4, TypeScript, Vercel, zero backend
- **Тип:** Free OSS tool + portfolio case study + content play
- **Цель:** GitHub stars, трафик на notjustsasha.com, LinkedIn контент

---

## Стратегический контекст

### Почему этот продукт

shadcn/ui — 111K GitHub stars, 301K сайтов, 132K weekly npm downloads.
Проблема: все shadcn-приложения выглядят одинаково — "sameness problem", признана
самим создателем shadcn.

Целевой пользователь: Next.js/shadcn разработчик, использующий v0/Bolt/Cursor,
получающий идентичный визуальный output.

### Pivot A — Free OSS

PM validation score: 4.95/10 как paid продукт → пивот на free OSS + portfolio play.
- Builder fit: 9/10
- Multi-kill: 7/10 (портфолио, OSS, контент, hiring signal)
- Market viability as paid: 3/10

### Дифференциатор

"Personality-first theming" — intent → atmosphere, не hex → CSS.
Нулевая конкуренция в контентном пространстве по этой концепции.

---

## Конкурентный ландшафт (первичное исследование)

| Продукт | Stars | Модель | Подход |
|---------|-------|--------|--------|
| tweakcn.com | 9.6K | Free (был paid) | hex → CSS, manual editor |
| shadcn/create | — | Free (official) | 5 presets, без personality |
| Shadcn Studio | — | $99-849 | themes + blocks + Figma |
| shadcn.io | — | $19-159/mo | bundle |
| SeedFlip | — | Paid | color-based |

---

## Research Phase (2026-04-06)

Проведено 5 исследований:
1. Competitive landscape → tweakcn paper tiger (15 watchers тогда → реально 9.6K stars)
2. Tailwind v3 vs v4 adoption → решение: toggle оба формата в P1
3. AI rules export formats → .cursorrules (50K+ repos) + CLAUDE.md в P1
4. Personality presets generation → 8 handcrafted presets
5. Market validation → Pivot A confirmed

---

## Архитектурные решения

| Решение | Обоснование |
|---------|-------------|
| Theme = TypeScript object | CSS derives at runtime, не статические файлы |
| Preview via iframe `/preview?theme=X` | CSS vars изолированы от shell |
| URL state через nuqs | Type-safe, SSR-friendly, readable URLs |
| Gallery = статический markup | Без shadcn пакета → контроль рендеринга, нет version coupling |
| Zero backend | Vercel free tier, чистый SSG/client |

---

## Personality Presets (8 штук)

| # | Название | Tagline | Radius | Shadows |
|---|----------|---------|--------|---------|
| 1 | Concrete Brutalist | "Raw structure. No apologies." | 0px | none |
| 2 | Quiet Tokyo | "Space is the loudest element." | 4px | soft |
| 3 | Late-Night Terminal | "Ships at 2am. Looks like it too." | 0px | glow |
| 4 | Broadsheet | "Editorial gravity. Analog soul." | 0-4px | flat |
| 5 | VC Pitch Deck | "Raise or die. Look like both." | 8px | dramatic |
| 6 | Garden Party | "Warm, analog, embarrassingly charming." | 12-16px | soft warm |
| 7 | Research Lab | "Rigorous enough to publish." | 4px | flat |
| 8 | Cassette Futurism | "The future someone already imagined." | 8-12px | soft tinted |

---

## Build Timeline

### Phase 1: Scaffold + Theme Engine (2026-04-06)
- ThemePreset / ThemeTokens типы
- CSS resolver: v3 (HSL :root{}) и v4 (OKLCH @theme{})
- AI rules generator (CLAUDE.md + .cursorrules)
- URL codec + useTheme hook (nuqs)
- 2 начальных пресета
- Tests: 15/15 ✅

### Phase 2: Preview iframe + UI shell (2026-04-06)
- Preview page /preview?theme=X&mode=Y
- ComponentGallery (6 секций)
- AppShell: sidebar + iframe main area
- PresetCard с 4-цветным swatch
- Build: PASS ✅
- Bug: layout сломан после деплоя (Tailwind v4 не резолвил arbitrary CSS-var классы)

### Phase 2 Bugfix (2026-04-07)
- Root cause: Tailwind v4 arbitrary CSS-var expressions не работают в shell
- Fix: inline styles с fallback значениями в AppShell
- Build: PASS ✅, кликабельно ✅

### Phase 3: Export modal + 6 пресетов (2026-04-07)
- Все 8 пресетов реализованы
- ExportModal: CSS (v3/v4 toggle) + CLAUDE.md + .cursorrules
- Share кнопка
- Build: PASS ✅, Tests: 15/15 ✅

---

## Gap Discovery (2026-04-07) — КРИТИЧЕСКИЙ МОМЕНТ

### Что произошло

После сравнения с tweakcn.com выявлено:
наш инструмент не соответствует функциональному уровню reference product.

### Функциональный gap

| Функция | tweakcn | Наш инструмент |
|---------|---------|----------------|
| Ручной редактор токенов (color picker, sliders) | ✅ | ❌ |
| Rich preview (Dashboard, Mail, Pricing, Cards) | ✅ | ⚠️ базовые компоненты |
| AI-генерация темы по тексту | ✅ | ❌ |
| Typography editor | ✅ | ❌ |
| Undo/Redo | ✅ | ❌ |
| Import theme | ✅ | ❌ |
| Export to Figma | ✅ | out of scope |
| CLAUDE.md / .cursorrules export | ❌ | ✅ (наш дифференциатор) |
| Personality presets с характером | ❌ | ✅ (наш дифференциатор) |

### Root Cause анализ

Tweakcn был проанализирован как конкурент для ПОЗИЦИОНИРОВАНИЯ,
но не был проведён ФУНКЦИОНАЛЬНЫЙ AUDIT.

Системная ошибка: при наличии reference product — обязателен feature inventory
ДО написания спеки. Этот шаг отсутствовал в нашем workflow.

---

## Discovery Pipeline (запущен 2026-04-07)

Для восполнения пробелов запущен полный discovery цикл:

### Фаза 1 (параллельно)
- pm-market-research:competitor-analysis → feature inventory tweakcn
- ux-strategy:benchmark → UX audit tweakcn
- pm-market-research:customer-journey-map → user journey при theming

### Фаза 2
- design-research:synthesize → данные → инсайты → gap list

### Фаза 3
- pm-product-strategy:value-proposition → пересмотр value prop
- pm-product-discovery:prioritize-features → приоритизация

### Фаза 4
- /spec update → обновить ALE-637

### Фаза 5
- Revised implementation

### Фаза 6
- everything-claude-code:continuous-learning → зафиксировать урок

---

## Уроки (будут дополняться)

### Урок 1: Reference Product Rule
При наличии reference product (продукт на который ориентируемся) —
ОБЯЗАТЕЛЕН functional feature audit ДО написания любой спеки.
Competitive analysis для позиционирования ≠ feature inventory.


---

## Discovery Phase Results (2026-04-07)

### Feature Inventory: tweakcn (полный аудит)

**Что есть у tweakcn, чего нет у нас:**

| Функция | Детали |
|---------|--------|
| Token editor | 32+ токена в 11 группах (Primary/Secondary/Accent/Base/Card/Popover/Muted/Destructive/Border&Input/Chart/Sidebar) |
| HSL adjustment sliders | Hue shift ±180°, Saturation scale, Lightness scale + 10 bulk presets |
| Typography editor | font-sans/serif/mono, 20+ Google Fonts, letter-spacing, spacing |
| Other tokens | radius, shadow-color/opacity/blur/spread/offset |
| Preview tabs (7) | Custom, Cards (15 variants!), Dashboard, Mail, Pricing, Typography, Color Palette |
| Inspector mode | Hover компонент → видишь Tailwind classes |
| 42 presets | Catppuccin, Neo Brutalism, Cyberpunk, Supabase, Vercel, Claude и др. |
| AI generation | Text→theme streaming, Image→theme (Pro), @mention system, multi-turn chat |
| Undo/Redo | 30 steps, 500ms debounce |
| Import CSS | Paste existing :root block |
| shadcn CLI command | `shadcn@latest add https://tweakcn.com/r/themes/[id]` |
| MCP integration | JSON config для Cursor/VSCode — AI assistants читают registry |
| Contrast checker | WCAG AA для всех token pairs |
| Share/Save | Public permalink + account saves |

**Слабые места tweakcn (возможности для нас):**
- Нативный color picker (input type=color) — нет HSL/OKLCH gradient picker
- Все preview — SaaS/финансовый контент, нет e-commerce/blog/landing
- Authwall на AI без trial
- Нет "personality description" у пресетов — только имена
- Нет responsive/mobile preview
- Нет per-component overrides
- Import багованный (issue #132)

### UX Benchmark Insights

**Минимальный путь "открыл → скопировал CSS":**
- tweakcn: 4 действия (без логина)
- tweakcn/ai: authwall на первом действии
- shadcn/create: 5 действий

**Лучшие практики для adoption:**
1. Instant preview при выборе пресета (no apply button)
2. Готовая shadcn CLI команда в export
3. Package manager selector (pnpm/npm/yarn/bun)
4. Dark/light toggle в preview — обязательно
5. "No login required" как явное сообщение

**shadcn/create делает правильно:**
- Style personalities (Nova, Maia, Lyra) — близко к нашей концепции, но не объяснены
- URL-based shareable state без логина
- Shuffle button — снижает paralysis of choice

### Customer Journey Map: Key Insights

**Triggers (почему разработчик ищет тему):**
1. Клиент говорит "это как дефолтный Vercel шаблон"
2. Видит что его UI идентичен чужому продукту
3. Начинает клиентский проект, нужен бренд

**Top Pain Points:**
1. Все vibe-coded приложения выглядят одинаково
2. CSS-переменные непрозрачны (30+ переменных, непонятно что что делает)
3. HSL→OKLCH mismatch при Tailwind v4
4. Preview ≠ реальный проект (шрифты, sidebar, charts)
5. Нет сохранения темы для итерации
6. AI (Cursor/Claude) не знает текущей темы → хардкодит hex

**JTBD (Jobs to be Done):**
- "Сделать проект визуально отличным от дефолтного shadcn за 20 минут"
- "Вернуться и итерировать тему когда клиент попросил правки"
- "Чтобы Cursor генерировал компоненты в моих токенах, не в дефолтных"

**Нас больше всего интересует JTBD #3** — это наш уникальный дифференциатор (CLAUDE.md / .cursorrules export) и никто другой это не решает.

### Revised Feature Gap Analysis

**Критично для P1 (без этого нет продукта):**
- [ ] Полноценный token editor (хотя бы Colors + Radius + Fonts)
- [ ] Rich component preview (минимум 3 tabs с реальными компонентами)
- [ ] WCAG contrast checker встроенный
- [ ] shadcn CLI command в export

**Важно для дифференциации (наш moat):**
- [x] AI rules export (CLAUDE.md + .cursorrules) — РЕАЛИЗОВАНО, но нужно усилить
- [x] Personality presets с описанием — РЕАЛИЗОВАНО
- [ ] MCP integration (как у tweakcn — для Cursor/VSCode)

**P2 / Nice-to-have:**
- [ ] AI-генерация по тексту
- [ ] Responsive preview (375px/768px/1440px)
- [ ] Diverse preview layouts (e-commerce, blog, landing)
- [ ] Shuffle button


---

## Full Market Discovery (2026-04-07)

### TAM/SAM/SOM

| Рынок | Объём (users) | Объём ($, freemium) | Confidence |
|-------|--------------|---------------------|------------|
| TAM — React developers с UI libs | 5-7M | $500-700M | MEDIUM |
| SAM — shadcn/ui developers | 2-3M | $200-300M | HIGH |
| SOM — активно кастомизирующие | 300-600K | $15-30M | MEDIUM |

Demand score: **8/10**. tweakcn 9.6K stars за 13 месяцев = прямое доказательство спроса.

### Unit Economics (если freemium)

- Freemium conversion: 1-3% (developer tools benchmark)
- ARPU: $9/mo или $49 lifetime
- LTV: $180 (при 5% churn, $9/mo)
- Path to $1K MRR: 12-18 месяцев органика
- Revenue ceiling как CSS tool: $500-2K one-time (launch), $50-150/mo ongoing
- ВЫВОД: монетизация слабая. Реальная ценность — нематериальная (portfolio, stars, hiring signal)

### Конкурентный ландшафт (полный)

**Прямые конкуренты (15+):**
- tweakcn: 9.6K stars, $0/$8mo, активен, visual editor — лидер рынка
- shadcn studio: 1.3K stars, $99-849 lifetime, активен
- ui.jln.dev: 1.3K stars, ЗАБРОШЕН (последний коммит янв 2024)
- themecn: 249 stars, март 2025, активен
- 10+ мелких хобби-проектов (<200 stars, большинство заброшены)

**Незанятые ниши:**
1. Personality-first/brand-driven подход — никто не начинает с "настроение/индустрия"
2. Editorial experience как продукт (не утилита)
3. AI rules export специфичные для ТЕМЫ (не компонентов)

### GTM стратегия

**Топ-каналы по ROI:**
1. @shadcn retweet — gamebreaker. Он ретвитнул tweakcn напрямую. 1 tweet = 1K+ stars
2. HN Show HN — ~121 stars/24h average, spike 48h
3. awesome-shadcn-ui PR — пассивный приток discovery
4. Reddit r/nextjs (180K members) — правильный формат "I built this because..."
5. This Week in React, Bytes.dev newsletters (215K subscribers)

**Launch playbook:** один координированный день — HN + X + Reddit + awesome-shadcn-ui PR

### Idea Validation: ВЕРДИКТ

**GO — как OSS portfolio play. NO-GO — как бизнес.**

| Критерий | Оценка |
|----------|--------|
| Problem validation | PASS |
| Market size (OSS) | PASS |
| Market size (revenue) | FAIL |
| Differentiation | CONDITIONAL (3-6 мес. окно) |
| Moat | FAIL (технически легко скопировать) |
| Distribution | PASS |
| Team fit | PASS |
| Time to value | PASS |

**КРИТИЧЕСКИЙ РИСК:** shadcn/skills (March 2026) — официальная AI agent интеграция в shadcn CLI.
Частично нейтрализует наш AI rules export дифференциатор.
Переформулировка: наш export = rules специфичные для ТЕМЫ (palette + tone + personality),
shadcn/skills = rules для КОМПОНЕНТОВ. Разные слои, но пересечение есть.

### Ключевые условия успеха

1. Launch в течение 4 недель (окно уникальности 3-6 месяцев)
2. Не более 7-8 presets на launch, но с design rationale для каждого
3. AI rules export как headline feature, не footnote
4. Shareable preset URLs с первого дня (единственный вирусный механизм)
5. Координированный launch day: HN + X + Reddit + directories

### Roadmap (после вердикта)

**M1-2:** MVP launch (7 presets + token editor minimal + shareable URLs) → цель 300-500 stars
**M3-6:** community presets, diverse preview layouts, integration v0/Bolt → цель 1000+ stars
**M6-12:** Decision point — если 1000+ stars и community → рассмотреть Pro tier

### Урок 2 (из этой сессии)

При наличии reference product — ОБЯЗАТЕЛЕН полный market discovery ДО написания спеки.
Порядок: Feature audit → UX benchmark → Customer journey → TAM/SAM → GTM → Validation → SPEC.
Нарушение этого порядка = неправильный scope = потерянное время на реализацию не того.

---

## Confirmed MVP Scope (2026-04-07, согласовано CEO)

### Нужно реализовать в Phase 4

| Фича | Статус |
|------|--------|
| Token editor: primary/secondary/accent + radius | ❌ нужно |
| Rich preview: 3 tabs (Components / Cards / Typography) | ❌ нужно |
| Dark/Light toggle | ❌ нужно |
| WCAG AA contrast badge | ❌ нужно |
| shadcn CLI command в export | ❌ нужно |
| 8 personality presets | ✅ готово |
| AI rules export (CLAUDE.md + .cursorrules) | ✅ готово |
| Shareable URL | ✅ готово (баг: AppShell использует useState вместо useTheme) |

### Out of Scope навсегда
- AI generation по тексту/изображению
- Figma export
- Платные фичи / auth / backend

### Roadmap
- **Phase 1 MVP** → launch, цель 300-500 stars
- **Phase 2** → MCP, shuffle, import CSS, responsive preview
- **Phase 3** → community presets, diverse layouts

