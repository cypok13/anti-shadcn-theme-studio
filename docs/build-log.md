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

---

## Research Sprint (старт 2026-04-07)

### Решение: 12 дней preparatory research до первой строки production кода

**Почему:** сравнение с tweakcn показало, что мы начали строить без полного понимания пользователей, конкурентов и happy flow. Принцип: каждый день = живой артефакт (Figma, StackBlitz, deployed URL) — не просто текст.

Полный план: `docs/PLAN.md` | Детали: `docs/research/sprint-details.md`

---

### День 1: User Personas + JTBD (2026-04-07) ✅

**Артефакт:** Figma — 3 детализированных персоны + 5 синтетических сценариев

**Ключевые инсайты:**
- Три distinct user type: Vibecoder (solo founder, боится CSS), Design Engineer (эксперт, проверяет edge cases), Agency Dev (time-is-money, ищет Export в первые 2 минуты)
- JTBD #3 — наш главный дифференциатор: "чтобы Cursor/Claude генерировали компоненты в моих токенах, не дефолтных"
- Главный страх Vibecoder: "потратить 3 часа и всё равно получить дефолтный синий shadcn"
- Agency Dev: не нашёл Export за 3 минуты → инструмент неполноценный

**Figma артефакты:**
- Персоны: https://www.figma.com/design/DaQQTAVGg6RnLlAH4E8Hlk/DS?node-id=10209-2
- Сценарии: https://www.figma.com/design/DaQQTAVGg6RnLlAH4E8Hlk/DS?node-id=10211-2

**Данные:** `docs/research/personas.md`

---

### День 2: Competitive UX Deep Dive (2026-04-08) ✅

**Артефакт:** Figma — Happy Flow (10 шагов), Friction Map, Heuristic Matrix (27/50), Feature Comparison (20×6)

**Ключевые инсайты:**

1. **Anti-paywall подтверждён данными:** существует fork `free-tweakcn` с явным посылом "no paywalls, no limits". На HN первый комментарий на попытку sharing: "into the trash it goes". Community backlash реален и задокументирован.

2. **tweakcn Nielsen score: 27/50** — провальные оценки в User Control (2/5), Error Prevention (2/5), Error Recovery (2/5), Help (2/5). Конкретные bugs: HSL ломает OKLCH (#245), Import ломает сайт (#132), Preview bleeding (#219).

3. **Наши уникальные дифференциаторы подтверждены** (ни у одного из 5 конкурентов нет):
   - Structural mutation (Neo-Brutalism/Glassmorphism)
   - W3C DTCG design tokens export
   - registry.json бесплатно (tweakcn делает, но за $8/mo)
   - Undo/Redo в free tier (только Shadcn Studio за $99-1299 OTP)

4. **Для Happy Flow Дня 3** — что НЕ делать: `<button>` вместо `<a>`, Auth wall без предупреждения, Reset без confirmation, paywall gate как modal interrupt.

**Figma артефакты:**
- Happy Flow: https://www.figma.com/design/DaQQTAVGg6RnLlAH4E8Hlk/DS?node-id=10222-20
- Friction Map: https://www.figma.com/design/DaQQTAVGg6RnLlAH4E8Hlk/DS?node-id=10222-146
- Heuristic Matrix: https://www.figma.com/design/DaQQTAVGg6RnLlAH4E8Hlk/DS?node-id=10222-246
- Feature Comparison: https://www.figma.com/design/DaQQTAVGg6RnLlAH4E8Hlk/DS?node-id=10222-318

**Данные:** `docs/research/competitive-audit.md`

---

### День 3: Happy Flow + User Journey Map (2026-04-08) ✅

**Артефакт:** Figma — Journey Map (6 этапов × 3 персоны) + 3 кликабельных wireflow (18 экранов)

**Ключевые инсайты:**

1. **EVALUATE = критическая точка провала** у всех трёх персон (2-3/5). Разблокируется одним условием: нет signup при входе + instant preview.

2. **Три разных пути активации:**
   - Артём: скопировал CSS → вставил → не похоже на дефолтный shadcn
   - Мария: экспортировала registry.json → CSS vars правильно именованы
   - Иван: отправил клиенту permalink → клиент одобрил без объяснений

3. **Export persistent в header** — главное решение против tweakcn friction. Иван ищет Export за 2 минуты — кнопка всегда видна, не спрятана в меню.

4. **Progressive disclosure через "Advanced Mode" toggle** — Мария видит OKLCH/W3C DTCG сразу, Артём не перегружен.

5. **Sharing = distribution channel** (не просто фича): Артём твитнул → новые пользователи. Permalink без signup = zero friction для вирального петли.

**Figma артефакты:**
- Journey Map: https://www.figma.com/design/DaQQTAVGg6RnLlAH4E8Hlk/DS?node-id=10226-3
- P1 Vibecoder: https://www.figma.com/design/DaQQTAVGg6RnLlAH4E8Hlk/DS?node-id=10230-2
- P2 Design Engineer: https://www.figma.com/design/DaQQTAVGg6RnLlAH4E8Hlk/DS?node-id=10231-2
- P3 Agency Dev: https://www.figma.com/design/DaQQTAVGg6RnLlAH4E8Hlk/DS?node-id=10232-2

**Влияние на следующие дни:**
- День 4 (OKLCH engine): должен считать WCAG contrast inline — Мария видит badge рядом с каждым токеном
- День 5 (preview protocol): ≤100ms — ACTIVATION зависит от скорости
- День 6 (registry endpoint): формат финализируется — P2 и P3 flow зависят от него

**Данные:** `docs/research/day3-happy-flow.md`

---

### День 4: OKLCH Color Engine (2026-04-09) ✅

**Артефакт:** `lib/colors/oklch-engine.ts` + demo app (`docs/day4-demo/`)

**Ключевые решения:**

1. **culori выбран** (не chroma.js, не color.js): Tailwind v4 уже использует его внутри → zero extra bundle cost. chroma.js отпал первым — не поддерживает OKLCH нативно.

2. **WCAG auto-fix через binary search по L-каналу** (20 итераций, O(log n)): сохраняет hue и chroma, меняет только lightness. Направление (goLighter) определяется через реальный relative luminance bg.

3. **Edge case: achromatic цвета** (#000, #fff) возвращают `h: undefined` в culori — защищено `?? 0`. Без этого весь engine ломается на white/black токенах shadcn.

4. **generateSemanticPair()** — одна функция решает главную боль персоны Мария (Design Engineer): дать base OKLCH → получить background + foreground с гарантированным AA контрастом.

5. **Демо 3 панели**: HSL vs OKLCH (наглядно: perceived brightness), WCAG Auto-Fix (до/после), Gamut Visualization (P3 dual-swatch).

**Влияние на следующие дни:**
- День 5 (preview protocol): `oklch-engine.ts` импортируется в preview worker
- День 12 (product spec): `OklchColor`, `ContrastResult`, `GamutInfo` — готовые TypeScript interfaces

**Код:** `lib/colors/oklch-engine.ts`
**Данные:** `docs/research/day4-oklch-engine.md`

---

### День 5: Performance Spike (2026-04-09) ✅

**Артефакт:** `lib/preview/preview-protocol.ts` + benchmark demo (`docs/day5-demo/`)

**Ключевые решения:**

1. **Shadow DOM исключён** — shadcn/ui использует Radix UI портали, которые рендерятся в `document.body` вне shadow scope. CSS vars не наследуются в обратную сторону. Dialog, Dropdown, Tooltip теряют токены → Shadow DOM не подходит.

2. **postMessage + rAF batching — победитель** (<5ms vs 200-500ms для iframe remount):
   - `PreviewSender` (parent): typed ACK map, per-message timeout, `waitForReady()` promise
   - `PreviewReceiver` (iframe): `pendingTokens` accumulator → flush в одном rAF callback
   - Результат: N токенов за 1 кадр = 1 style recalculation, а не N

3. **`diffTokens(prev, next)`** — при 1000 токенах и изменении 1 слайдера передаётся только 1 запись через postMessage. Critical path optimization для ThemeEditor onInput.

4. **Безопасность**: origin check + source check в обоих направлениях. `generateId()` через `crypto.randomUUID()` с `Math.random()` fallback.

5. **Latency budget**: <5ms avg в тестах → можно привязывать к `onInput` без debounce для большинства слайдеров. Это разблокирует pixel-perfect live preview.

**Влияние на следующие дни:**
- День 8 (IA): AppShell State Machine — один из переходов это "PreviewSender initialized"
- День 12 (product spec): `PreviewMessage`, `PreviewResponse`, `TokenMap` — готовые TypeScript interfaces

**Код:** `lib/preview/preview-protocol.ts`
**Данные:** `docs/research/day5-preview-protocol.md`

---

### День 6: shadcn Registry Endpoint (2026-04-09) ✅

**Артефакт:** `src/app/r/[name]/route.ts` + `src/types/registry.ts`

**Ключевые решения:**

1. **`registry:theme` с `cssVars.light + dark`** — не только `cssVars.theme`. Задокументированный баг [#7119](https://github.com/shadcn-ui/ui/issues/7119): CLI молча пропускает `globals.css` update если нет `light`/`dark` блока. Реализация включает оба.

2. **`tokensToVars()`** — bridge между внутренними camelCase ThemeTokens (`cardForeground`) и CSS-var именами (`--card-foreground`). Позволяет переиспользовать существующую `getPreset()` без изменения data model.

3. **OPTIONS handler** — 204 с CORS headers. `npx shadcn add` делает preflight запрос перед fetch — без OPTIONS CLI падает молча.

4. **`force-dynamic` первой строкой** — обязательно per CLAUDE.md rules, даже если env vars не используются сейчас. Предотвращает кэширование на билде.

5. **Все 8 пресетов через один endpoint** — `/r/concrete-brutalist`, `/r/quiet-tokyo` и т.д. работают из коробки через существующий `getPreset()` registry.

**Тест (после деплоя):** `npx shadcn@latest add https://theme-studio-beta.vercel.app/r/concrete-brutalist`

**Влияние на следующие дни:**
- День 12 (product spec): `RegistryEntry`, `CssVarsMap` — готовые TypeScript interfaces для spec
- Phase 4 (Social gallery): каждый shared пресет → живой registry endpoint

**Код:** `src/app/r/[name]/route.ts`, `src/types/registry.ts`
**Данные:** `docs/research/day6-registry-endpoint.md`

---

### День 7: Tailwind v4 ADR (2026-04-09) ✅

**Артефакт:** `docs/adr/001-tailwind-v4-token-strategy.md` + `src/lib/themes/css-export.ts`

**Ключевые решения:**

1. **Dual export принят** — `tokensToTailwindV4()` и `tokensToTailwindV3()`. Нельзя обслужить оба user сегмента одним форматом: v4 не поддерживает `hsl(var(...))` в tailwind.config.js.

2. **v4 формат: `@layer base` (не `@theme`)** — при `@theme inline` ценности bake at build time, dark mode ломается без `.dark` class на `<html>`. `@layer base` + `.dark {}` блок = shadcn-совместимо и работает с next-themes.

3. **`hslToOklch()` — линейное приближение (P2)** — ThemeTokens хранятся как HSL bare strings. Для v4 export конвертируем в OKLCH через приближение, не через culori. Для launch достаточно; заменить на `culori converter('oklch')` в Phase 1.

4. **14 задокументированных багов v3→v4** — ключевой: `hsl(var(--token))` в tailwind.config.js молча игнорируется v4 resolver'ом. Не баг — by design. Объясняет почему dual export необходим.

5. **OKLCH browser floor зафиксирован** — Chrome 111+, Safari 16.4+, Firefox 128+. ~7% глобальной аудитории. При v4 export добавить предупреждение в UI.

6. **Монорепо gotcha** — `@theme` не течёт между apps, но auto-scanner не захватывает `packages/ui/` без `base` в postcss.config. Зафиксировано для Phase 1.

**Влияние на следующие дни:**
- День 12 (product spec): ADR-001 входит в product-spec.md как принятое архитектурное решение
- Phase 1: заменить `hslToOklch()` приближение на `culori`; добавить v4/v3 toggle в ExportModal

**Код:** `src/lib/themes/css-export.ts`, `docs/adr/001-tailwind-v4-token-strategy.md`
**Данные:** `docs/research/day7-tailwind-v4-adr.md`

---

### День 8: Information Architecture (2026-04-09) ✅

**Артефакт:** Figma — 4 фрейма на странице "Day 8 — IA"

**Ключевые инсайты:**

1. **Два entry points — два разных пользователя**: Artёm (Vibecoder) → Presets tab; Мария (Design Engineer) → Tokens tab с accordion. Это решение по progressive disclosure подтверждено паттернами Storybook и Plasmic — "Basic/Advanced" через accordion, не отдельные views.

2. **Zustand + zundo = правильный выбор**: `partialize` до `tokenOverrides` — в undo history только дельта от пресета (~1-3 строки), не весь 50-токенный preset. Пауза temporal на pointerdown, resume на pointerup → один history entry на drag вместо ~1000.

3. **URL содержит только 4 params** — `preset`, `mode`, `preview`, `export`. Token overrides в URL только для "share theme" фичи — base64 сериализация, не individual params. Это решение предотвращает URL длиной 2KB.

4. **AppShell State Machine зафиксирована** — 5 состояний: IDLE → PRESET_SELECTED → OVERRIDES_APPLIED → EXPORTING → SHARED. Переход из IDLE по ?preset= URL param = deep link работает из коробки.

5. **Empty state rule**: никогда не показывать пустой preview iframe. Default preset загружается на mount до первого paint — tweakcn, Storybook, Figma Make все используют этот паттерн.

**Figma артефакты:**
- Sitemap: https://www.figma.com/design/DaQQTAVGg6RnLlAH4E8Hlk/DS?node-id=10238-3
- Component Inventory: https://www.figma.com/design/DaQQTAVGg6RnLlAH4E8Hlk/DS?node-id=10238-44
- Token Flow: https://www.figma.com/design/DaQQTAVGg6RnLlAH4E8Hlk/DS?node-id=10238-111
- State Machine: https://www.figma.com/design/DaQQTAVGg6RnLlAH4E8Hlk/DS?node-id=10238-186

**Влияние на следующие дни:**
- День 9 (Component Kit): Component Inventory таблица = список что строить в Figma
- День 10 (Structural Mutation): State Machine показывает где "Structural preset" входит в поток
- День 12 (product spec): Token Flow Diagram → Architecture Diagram

**Данные:** `docs/research/day8-information-architecture.md`

---

### День 9: Figma Component Kit (2026-04-09) ✅

**Артефакт:** Figma — 10 компонентов на странице "Day 9 — Component Kit"

**Ключевые решения:**

1. **Fixed height на всех интерактивных компонентах** — Button (36px), Input (36px), Badge — всегда Fixed, не Hug. Это предотвращает size drift при изменении текста и обеспечивает консистентный spacing grid.

2. **Layer naming как CSS variable reference** — слои называются `bg/primary`, `border/border`, `bg/muted-foreground`. Это связывает Figma компоненты с кодом на уровне семантики, не hex значений. Дизайнер читает токен, не цвет.

3. **Figma не поддерживает OKLCH** — зафиксировано как известное ограничение. Значения в kit = hex. При v4 export → конвертация hex→OKLCH через culori. Это не баг, это pipeline: Figma (hex) → ThemeTokens (HSL bare) → css-export.ts (OKLCH).

4. **4-collection variable architecture** (по shadcndesign.com): Tailwind CSS (utility values) + Theme (brand primitives) + Mode (semantic, Light/Dark switch) + Custom. Mode collection = единственная с Variable Modes.

5. **Variant Properties конвенция**: Title Case key + lowercase value. `State=hover`, `Variant=destructive`, `Size=sm`. Совпадает с shadcn prop API — дизайнер и разработчик используют одни слова.

**Figma:**
- Page: https://www.figma.com/design/DaQQTAVGg6RnLlAH4E8Hlk/DS?node-id=10240-2
- Button: node 10241:3 | Input: 10242:3 | Card: 10244:3 | Badge: 10244:23
- Select: 10245:3 | Table: 10245:28 | Dialog: 10246:3 | Tabs: 10246:28
- Alert: 10250:3 | Toggle: 10247:18

**Влияние на следующие дни:**
- День 10 (Structural Mutation): эти компоненты — основа для мутаций (Default/Flat/Neo-Brutalism/Glassmorphism × 5 компонентов)
- День 12 (product spec): Component Kit = UI reference для Phase 1 implementation

**Данные:** `docs/research/day9-component-kit.md`

---

## День 10 — Structural Mutation Design Exploration (2026-04-14)

**Ключевые инсайты:**

1. **Flat Design требует обязательного hover-состояния** — без теней и скруглений кнопка не выглядит кликабельной. NN/G (2017, updated 2024): flat affordance проблема → обязателен subtle color change на hover. Прописать как constraint в StructuralPreset.

2. **Neo-Brutalism hover pattern — "штамп"** — при нажатии `box-shadow` уменьшается (`4px 4px 0 0 #000` → `0px`) + `translate(2px, 2px)`. Это стандарт для neo-brutalism, создаёт ощущение физического нажатия. Transition: 0.1s.

3. **Glassmorphism требует non-solid фона** — без градиентного или image background эффект невидим. Это constraint, а не баг. UI должен показывать warning при выборе этого пресета и предлагать bundled gradient backgrounds.

4. **Structural presets = CSS var composition** — цветовые токены и структурные токены независимы. Любой цветовой пресет можно скомбинировать с любым структурным. Это даёт 4 × N комбинаций (где N = количество цветовых пресетов). Ключевое дифференциирование vs tweakcn.

5. **StructuralPreset interface** зафиксирован с 8 CSS переменными: `radius`, `shadow-sm`, `shadow-md`, `border-width`, `border-color?`, `backdrop-filter?`, `bg-alpha?`, `spacing-component`. Полный draft: `docs/research/day10-structural-mutation.md`.

**Figma:**
- Page: Day 10 — Structural Mutations (создаётся)
- 4 × 5 grid: Default/Flat/Neo-Brutalism/Glassmorphism × Button/Card/Input/Table/Dialog

**Влияние на следующие дни:**
- День 12: CSS mapping → StructuralPreset interface → product-spec.md ✅ зафиксировано
- Phase 3 coding: structural preset panel UI использует этот CSS var surface

**Данные:** `docs/research/day10-structural-mutation.md`

---

## День 11 — AI Persona Synthetic Usability Testing (2026-04-14)

**Ключевые инсайты:**

1. **CLI команда полностью сломана** — ExportModal.tsx хардкодит несуществующий домен `themestudio.vercel.app` и неверный путь `/r/themes/`. Иван дошёл до этой команды, получил 404 и немедленно написал клиенту "сделаю вручную". Это BLOCKER для релиза. Фикс: одна строка кода, ALE-720.

2. **OKLCH editor — feature promise gap** — продукт позиционирует OKLCH как главный дифференциатор, но в редакторе стоит `<input type="color">` (sRGB only). OKLCH существует только в output (Tailwind v4 export tab). Мария не смогла выполнить основную задачу. ALE-721 добавлен в Phase 1 P1.

3. **Copy button zero feedback** — пустой catch block глотает clipboard ошибки без уведомления. Оба "технически несложных" пользователя (Артём, Иван) кликнули дважды не понимая что произошло. Одностроковый фикс с большим UX-импактом. ALE-724.

4. **Validated: Export button placement** — все 3 персоны нашли кнопку Export без труда. Паттерн "bottom of sidebar" работает. Не трогать.

5. **Validated: Preset selection UX** — color swatch + name достаточно для выбора. Артём завершил задачу за 2 клика. Только индикатор "selected" слабый (border-only) → ALE-723.

**Linear тикеты:**
- ALE-720 (P1): CLI URL 404
- ALE-724 (P1): Copy button
- ALE-721 (P2): OKLCH picker
- ALE-722 (P2): Export tab labels
- ALE-723 (P2): Preset state

**Влияние на Phase 1 scope:**
- ALE-720 + ALE-724 — Phase 1 blockers, нельзя выпускать со сломанным CLI и немым Copy
- ALE-721 (OKLCH picker) перенесён из Phase 2 в Phase 1 — feature promise сломан без него
- Структура export modal требует ревью: 4 таба слишком много для Артёма и Ивана

**Данные:** `docs/day-11-usability-findings.md`

---

## День 12 — Product Decision Document (2026-04-14)

**Ключевые инсайты:**

1. **5 ADR зафиксированы в product-spec.md** — все архитектурные решения дней 4-10 собраны в единый документ с обоснованиями. Каждое решение валидировано кодом (tech spike), не только исследованием.

2. **TokenOverrides v2 = главный interface Phase 1** — добавляет OKLCH к каждому токену, разделяет light/dark явно, добавляет fonts. Обратная совместимость через адаптер в resolve.ts. Без v2 нельзя начать Phase 1.

3. **GalleryEntry через GitHub Gist** — zero backend cost. Gist = free CDN для JSON. shadcn registry format уже поддерживает прямой install с URL. Phase 4 = free social sharing без auth wall.

4. **RegistryExport расширяет shadcn spec структурным полем** — `structural` поле содержит StructuralPresetId + cssVars. shadcn CLI игнорирует неизвестные ключи → backward compatible. Документировать в docs для продвинутых пользователей.

5. **Phase 1 unlock** — после Day 12 все зависимости Phase 1 закрыты: oklch-engine.ts ✅, preview-protocol.ts ✅, registry route ✅, css-export.ts ✅, TokenOverrides v2 interface ✅.

**Артефакты:**
- `docs/product-spec.md` — главный артефакт спринта
- `src/types/product-spec.ts` — TypeScript interfaces (4 interface-а)
- `docs/PLAN.md` — обновлён (Дни 10-12 → ✅)

**Следующий шаг:** Phase 1 coding — отдельный тикет ALE-XXX


---

## День 13 — Component Pipeline запуск (2026-04-17)

**Ключевые инсайты:**

1. **Компонентный пайплайн формализован** — создан `docs/COMPONENT-PIPELINE.md` с обязательной последовательностью: spec → implement → lint → playwright → visual gate → docs sync. Error Log E-001–E-010 зафиксирован прямо в пайплайне.

2. **Инцидент делегирования (Checkbox, ALE-764)** — оркестратор реализовал компонент напрямую вместо делегирования дизайнеру. Результат: `h-3.5` (14px) в 16px боксе — нарушение 4px шкалы. Правило "orchestrator never implements" добавлено как блокирующее в CLAUDE.md.

3. **Switch, Radio Group, Input, Select, Tabs, Dialog, Popover** — компоненты реализованы через designer субагент. Каждый прошёл playwright gate (18 автотестов, 4 gates).

4. **ThemeSidebar redesign** — заменён нативный `<select>` на DS Select. Инцидент: нативные элементы были задеплоены в прод, CEO обнаружил баг визуально. Добавлено правило DS-only с проверочным grep перед деплоем.

5. **ButtonSizesGrid** — убрана колонка Radius из грида кнопок (HITL layout gate: CEO предлагается 3 варианта при риске горизонтального скрола).

**Linear:** ALE-764 (Checkbox), ALE-771 (Preview Redesign)

---

## День 14 — Preview UX Redesign: API/Usage/Code tabs, шрифты, синтаксис (2026-04-21)

**Ключевые инсайты:**

1. **ComponentSection: карточный layout SoT** — каждый компонент в отдельной карточке `rounded-2xl border p-8` с inline pill-табами. Sidebar стал sticky внутри единого scrollable root. Центрирование через `max-w-[1120px]`.

2. **Button: 5 табов документации** — добавлены API (DocPropsTable: union type pills, required badge), Usage (Do/Don't grid с цветными border-l картами, variant guide), Code (shiki syntax highlighting). Паттерн повторяется для всех будущих компонентов.

3. **RadiusPicker** — визуальный пикер с превью угла заменил Select в ThemeSidebar. Квадратные карточки, corner preview через border-top/left, selected state через `hsl(var(--primary))`.

4. **Типографика: все шрифты загружены** — добавлен `geist` package (Geist Sans + Geist Mono), 8 шрифтов через `next/font/google` (JetBrains Mono, IBM Plex Mono, Fira Code, Syne, Manrope, IBM Plex Sans). Font values в URL через `var(--font-*)` токены. Баг: `FONT_SAFE_RE` вырезал скобки из `var()` — исправлено.

5. **Syntax highlighting (shiki)** — `DocCodeBlock` получил подсветку синтаксиса через shiki dual-theme (`github-light` / `github-dark-dimmed`). Режим переключается через CSS inject в `page.tsx`. Загрузка лазивая — нет блокировки рендера.

6. **DS compliance incidents** — 4 инцидента за сессию: нативный `<select>`, `#111113` хардкод в DocCodeBlock, `rgb()` в DoDontCard, `--foreground` вместо `--primary` в RadiusPicker. Введено правило двойного дизайнера (implement → token audit).

7. **Удалены упоминания Radix/shadcn** — из prop descriptions, section titles, docsHref ссылок. Продукт — независимый DS инструмент, не враппер.

**Артефакты:**
- `src/components/preview/docs/` — DocCodeBlock, DocPropsTable, ButtonDocs (новые)
- `src/components/preview/RadiusPicker.tsx` — новый
- `src/app/layout.tsx` — 9 шрифтов через next/font
- `package.json` — добавлен `shiki`, `geist`

**Linear:** ALE-771

**Следующий шаг:** Компонент Checkbox/Switch/Radio (ALE-753), Usage Guidelines (ALE-752)

---

## День 15 — Radix UI Removal + Test Suite Reorganization (2026-04-21)

**Ключевые инсайты:**

1. **Как Radix попал в проект** — оригинальный MVP (ALE-637) имел нулевые Radix зависимости. Субагент-имплементор прочитал "исследуй Radix как референс" в COMPONENT-PIPELINE.md как "установи и используй". Пакеты накопились незакоммиченными. Обнаружено при попытке добавить `@radix-ui/react-checkbox` для Checkbox.

2. **Стратегия замены** — единственная новая зависимость: `@floating-ui/react-dom` (~3KB) только для позиционирования Tooltip/Popover/Select. Нативный `<dialog>` для Dialog (focus trap, scroll lock бесплатно с Chrome 37+). Custom React state machine для Tabs (~45 строк). Bundle: −28KB gzipped (176KB → 148KB).

3. **Focus trap без Radix** — нативный `<dialog>` + `showModal()` отклонён в пользу `<div role="dialog">` с ручным focus trap через `useEffect` + `querySelectorAll(FOCUSABLE_SELECTORS)`. Причина: паттерн `DialogPortal/DialogOverlay/DialogContent` уже существовал, переход на нативный `<dialog>` требовал рефактора API.

4. **ShadowPicker** — визуальный пикер по аналогии с RadiusPicker: 5 карточек (None/Flat/Soft/Dramatic/Glow), inline preview через `boxShadow` на `<span>`. Shadow применяется к demo-областям ComponentSection через `[box-shadow:var(--shadow-preset,none)]`.

5. **Тест-сьют: скрытый долг** — 15 тестов висели в `test.skip` не потому что компоненты сломаны, а потому что `ComponentsTab()` существовала как приватная функция и не рендерилась в `ComponentGallery()` return. Решение: expose всех в галерею. Результат: 42/42 тестов, 0 skip.

6. **Архитектура тестов** — Gate 0/1 кросс-компонентные (JS ошибки, CSS токены, axe-core — нужны для регрессий при изменении темы). Gate 2+ компонентные. При разработке: `npm run test:component -- <name>` вместо полного прогона.

7. **Popover a11y gap** — `PopoverContent` не имел `role` атрибута. Исправлено: `role="dialog"` — соответствует WAI-ARIA spec для интерактивного popover контента.

**Артефакты:**
- `src/components/ui/` — все 8 компонентов переписаны без Radix: separator, button, badge, tabs, dialog, tooltip, popover, select
- `src/components/preview/ShadowPicker.tsx` — новый
- `src/components/preview/ThemeSidebar.tsx` — компактный, ShadowPicker, scrollable
- `src/components/preview/ComponentGallery.tsx` — все demo функции экспонированы
- `tests/component-qa.spec.ts` — убраны дубли, 0 skip, добавлен test:component script
- `docs/adr/` — ALE-777 зафиксирован как архитектурное решение

**Linear:** ALE-777

**Следующий шаг:** Checkbox компонент (ALE-764), затем Switch/Radio (ALE-753)

## День 16 — Checkbox Preview Block + extended API (2026-04-24, ALE-812)

**Ключевые инсайты:**

1. **Pipeline v2 прошёл первое реальное испытание** — 2 итерации (initial build + 1 visual QA fix round) vs target ≤5. Валидация рабочая: subagent chain (researcher → designer×2 → qa-engineer → ux-reviewer → designer #4 → qa re-verify → CEO) не провалилась ни на одном этапе. Delegation hook (ALE-811) блокировал Edit/Write без `touch .claude/designer-active` — каждый designer subagent делал STEP 0 первым.

2. **Tri-valued checked вместо отдельного `indeterminate` prop** — Radix pattern `checked: boolean | "indeterminate"` выигрывает над `indeterminate: boolean`: (a) меньше prop surface, (b) невозможно одновременно задать `checked=true` и `indeterminate=true` — type system запрещает, (c) совпадает с ARIA семантикой `aria-checked="true|false|mixed"`. `useImperativeHandle` пробрасывает нативный `<input>` ref наружу при внутреннем `useRef` для `input.indeterminate` sync.

3. **DocPropsTable был системным bottleneck, не Checkbox** — API tab с типом `(event: ChangeEvent<HTMLInputElement>) => void` обрезался. Root cause: CSS Grid колонки `1fr` (≡ `minmax(auto, 1fr)`) не ужимаются ниже intrinsic content width — `break-words` не работает без `minmax(0, …)`. Фикс в `DocPropsTable.tsx` улучшает все будущие Preview Blocks (Button, Badge и др.).

4. **`!important` на error override — осознанный выбор, не хак** — `data-error=true` border должен побеждать `data-state=checked` border (оба рендерятся через Tailwind variant). Tailwind JIT не гарантирует source order между `peer-checked:` и `group-data-[error]:` variants. `!border-[hsl(var(--destructive))]` — единственный детерминированный win. Уже стандартная практика в проекте.

5. **Визуальный QA как независимый gate работает** — ux-reviewer нашёл 1 P1 (DocPropsTable overflow) + 2 P2 (error border, badge alignment), которые qa-engineer Playwright тесты пропустили. Тесты проверяли существование attrs/classes, не layout geometry. Для Preview Blocks визуальный loop обязателен — Playwright недостаточен.

**Артефакты:**
- `src/components/ui/checkbox.tsx` — API extended (63→138 строк): `checked: boolean | "indeterminate"`, `error`, `errorMessage`, `aria-required`, `data-state`, `data-error`
- `src/components/preview/docs/CheckboxDocs.tsx` — new (289 строк): 5 tabs (Overview/API/Usage/Code/States), DoDontCard inline copy
- `src/components/preview/docs/DocPropsTable.tsx` — grid `minmax(0, Nfr)`, `break-all` на type pill — project-wide fix
- `src/components/preview/ComponentGallery.tsx` — CheckboxSection заменил CheckboxDemo
- `docs/specs/checkbox-spec.md` — Usage Guidelines расширены, indeterminate/required/error из N/A → реальные states, Test Plan +7 пунктов
- `docs/research/checkbox-states-research.md` — ARIA APG + Radix/shadcn/Ariakit/Carbon/Material референс
- `docs/sessions/2026-04-24-ALE-812-visual.md` + 20 скринов
- `tests/component-qa.spec.ts` — Gate 16 (+8 assertions): 74 → 82/82

**Linear:** ALE-812 (parent: ALE-764 Checkbox component, ALE-771 Button Preview Block, ALE-811 Pipeline v2)

**Следующий шаг:** Switch/Radio Preview Blocks (ALE-753) или Input (ALE-754) — pipeline validated, следующие компоненты реалистично ≤2 итераций каждый.


## День 17 — Switch + Radio Preview Blocks + Vercel silent-fail incident (2026-04-26 → 2026-04-27, ALE-825 / ALE-829)

**Ключевые инсайты:**

1. **Pipeline v2 mirror pattern работает** — `SwitchDocs.tsx` + `RadioDocs.tsx` собраны зеркалированием `CheckboxDocs.tsx` (5 tabs: Overview/API/Usage/Code/States). 0 → 2 итерации на компонент, target ≤5 выдержан второй раз подряд. Гипотеза подтверждена: после первого Preview Block следующие из той же категории (form controls с `aria-checked`) собираются в ≤2 итерации без новых E-XXX. 82 → 101 tests passing. Wins: ARIA tabs unified в `ComponentSection`, disabled-off visibility fix применён к обоим компонентам одной правкой.

2. **`ComponentSection` как shared tabs primitive** — выделение tabs-обвязки из `CheckboxDocs` в `ComponentSection.tsx` (Pipeline v2 retrospective отметил это как automation candidate) — следующий Preview Block копирует только содержимое табов, не их структуру. Сократит iteration count для Slider/Combobox в Phase 3 ещё сильнее. Reusable shell + per-component content — паттерн для всех будущих Preview Blocks.

3. **Vercel auto-build silent-fail инцидент 4+ дней (CRITICAL)** — main был broken с ALE-812 Checkbox merge: 4 компонента импортировали `@radix-ui/*` без deps в package.json. Standalone repo Vercel автодеплой падал каждый push, но не сигнализировал — production висел на `a19ebc20` (день 15) пока main HEAD ушёл к `ac3f37b`. 13 последних production deploys на одном SHA = молчаливые retry-redeploys. Markdown rule `feedback_session_start_build_check.md` существовал, но не enforced — оператор пропускал. **Фикс (ALE-829):** (a) GitHub Actions `build.yml` на standalone (npm ci + build + lint:ui + test:components) как required status check + (b) n8n workflow polling Vercel API каждые 15 мин → Telegram alert на ERROR deployments. Memo: `memory/feedback_vercel_autobuild_silent_fail.md`. E-012 добавлен в COMPONENT-PIPELINE.md. **Урок:** standalone repos с auto-deploy MUST иметь CI gate + alerting слоем — markdown rule не enforcement.

**Артефакты:**
- `src/components/preview/docs/SwitchDocs.tsx` — new (зеркало CheckboxDocs)
- `src/components/preview/docs/RadioDocs.tsx` — new
- `src/components/preview/ComponentSection.tsx` — shared tabs shell
- `src/components/ui/switch.tsx` + `radio-group.tsx` — disabled-off visibility fix
- `docs/specs/switch-spec.md` + `radio-group-spec.md` — Usage Guidelines + States table extended
- `tests/component-qa.spec.ts` — 82 → 101 assertions
- `.github/workflows/build.yml` (standalone, ALE-829) — required CI status check
- n8n workflow `vercel-theme-studio-deploy-alert` (ALE-829) — Telegram alert on ERROR deploys
- `apps/theme-studio/CLAUDE.md` — Pipeline §9 + CI required check добавлено
- `docs/COMPONENT-PIPELINE.md` — E-012 (Vercel silent-fail)

**Linear:** ALE-825 (Switch/Radio, Done), ALE-827 (build fix), ALE-829 (CI gate + alert, In Progress)

**Следующий шаг:** Phase 3 — Slider Preview Block (mirror RadioDocs) или Combobox (более сложный — keyboard nav + listbox ARIA). Backlog tickets создаются без работы.



## День 18 — Slider Preview Block + E-013 focus-stealing (2026-04-27, ALE-830)

**Ключевые инсайты:**

1. **Pipeline v2 mirror pattern — 4-в-ряд.** Slider собран зеркалированием RadioDocs (5 tabs ComponentSection) за 2 итерации (target ≤5 hit). Полная цепочка валидаций: Checkbox → Switch → Radio → Slider, все ≤2 iter каждый. Гипотеза подтверждена: form-control Preview Blocks из той же категории (single-value, ARIA-managed) собираются предсказуемо дёшево через mirror. Следующий тест паттерна — Combobox (другая категория: keyboard nav + listbox).

2. **E-013: focus-stealing in pointer handlers.** Iter 2 нашёл новый класс багов: `handleTrackPointerDown` и `handleThumbPointerDown` вызывали `thumb.focus()`, но БЕЗ `e.preventDefault()`. Браузерный native focus-on-pointerdown потом проходит вверх по дереву и ставит фокус на ближайший focusable ancestor — в нашем случае `tabpanel[tabIndex=0]`. Симптом: track click двигает значение, но `document.activeElement` остаётся на tabpanel вместо thumb. Урок: любой компонент с internal focus management внутри tabpanel/dialog/etc. должен вызывать `e.preventDefault()` ДО `.focus()` в pointer handlers. Audit candidates: Switch / Tabs / Combobox.

3. **Phantom scrollbar в Preview Blocks (shared bug).** ux-reviewer заметил vertical scrollbar внутри Overview card на ВСЕХ Preview Blocks (Radio + Slider) — `overflow-x-auto` неявно включает `overflow-y: auto`, contentHeight 220 vs clientHeight 217 = 3px overflow от focus-ring offsets и thumb hit zones. Fix: одна строка в `ComponentSection.tsx` — добавил `[overflow-y:visible]` рядом с `overflow-x-auto`. Single shared fix для всех 4 Preview Blocks. Урок: implicit overflow promotion — Tailwind/CSS gotcha, документировано в spec retrospective.

4. **Stale dev server маскирует passing tests as failing.** Designer round 3 сообщил 7/20 passed после overflow fix, claim "pre-existing fail". Реальность: ux-reviewer оставил dev server на порту 3005 со старой версией страницы (HMR drift), Playwright reused его (`reuseExistingServer: !CI`). После `kill -9` старого процесса — 20/20 passed без изменений в коде. Урок: при подозрительных regression failures сначала kill orphan dev servers, потом дебажить код. Subagent verdicts по test results не доверять без независимой ре-проверки.

**Артефакты:**
- `src/components/ui/slider.tsx` (новый, 9.1KB)
- `src/components/preview/docs/SliderDocs.tsx` (новый, 11.1KB, 5 tabs)
- `src/components/preview/SliderSection.tsx` (новый, 706B)
- `src/components/preview/ComponentSection.tsx` (overflow-y fix, 1 строка)
- `src/components/preview/ComponentGallery.tsx` (SliderSection wired)
- `tests/component-qa.spec.ts` (+173 lines Gate 19)
- `docs/specs/slider-spec.md` (новый, retrospective filled)
- `memory/theme_studio_iterations_log.md` (Slider 2 iter row)

**Linear:** ALE-830 Done

**Следующий шаг:** ALE-831 Combobox (другая категория Preview Block — keyboard nav + listbox ARIA, ожидаемо больше итераций) — отдельная сессия.

## День 19 — Combobox Preview Block — первый popover-based component (2026-04-27, ALE-831)

1. **E-015: Subagent hallucination pattern** — designer субагент дважды reported "файлы созданы" но они не были на диске. Context compaction уничтожил работу. Правило: всегда `wc -l` после Write в subagent prompts. Оба файла пришлось писать заново.

2. **ARIA 1.2 combobox — 4 имплементационных бага в одном компоненте** — `Combobox` root не рендерил `ComboboxInputField` (Basic demo не имел input), `aria-controls` был null когда listbox закрыт (должен быть always-set), Enter key не закрывал listbox (handler только сбрасывал activeIndex), `useEffect([confirmedValue])` перезаписывал label со value ("react" вместо "React"). Все 4 исправлены.

3. **Pipeline v2 итерации: 3** — HITL gate предсказал ≤4, фактически 3. Цель соблюдена, несмотря на то что это первый popover-based Preview Block (принципиально другая категория чем form-controls).

**Артефакты:** `src/components/ui/combobox.tsx` (550 lines), `src/components/preview/docs/ComboboxDocs.tsx` (402 lines), `docs/specs/combobox-spec.md`, Gate 20 (11 assertions, 11/11 pass)

**Linear:** ALE-831 Done

**Следующий шаг:** ALE-832 Canarist fake-door или следующий компонент из backlog

## День 20 — Combobox: blur на Enter + stale-closure фикс (2026-04-27)

1. **React stale-closure race при sync blur()** — синхронный `inputRef.current?.blur()` внутри `onClick` вызывал `handleBlur` до того, как React флашил батченные state updates. `confirmedValue` в closure был старый → timer через 200ms сбрасывал inputValue к предыдущему значению. Симптом: выбирается не тот элемент. Фикс: `setTimeout(..., 0)` откладывает blur до после React flush.
2. **Enter key тоже должен снимать фокус** — та же паттерн добавлена в `handleKeyDown` для Enter. Обе точки выбора теперь единообразны.
3. **Extracted global skill** — `~/.claude/skills/learned/react-programmatic-blur-deferred.md` — переиспользуемый паттерн для любых React-компонентов с programmatic blur.

**Артефакты:** `src/components/ui/combobox.tsx` (commits 210098e, e34c846), `~/.claude/skills/learned/react-programmatic-blur-deferred.md`

**Linear:** ALE-831 (post-close fixes)

**Деплой:** https://theme-studio-beta.vercel.app ✅

**Следующий шаг:** ALE-832 Canarist fake-door или следующий компонент из backlog

## День 21 — ALE-833: Dropdown Drift on Scroll — root cause найден (2026-04-28)

1. **Root cause: `transition-duration` без `transition-property` = CSS transition on all** — `[transition-duration:var(--duration-fast)]` без явного `transition-property` → браузер применяет `all` → каждое DOM-мутация `style.top/left` при скролле запускала CSS-переход. Результат: drift-анимация при скролле. Исправление: `[animation-duration:var(--duration-fast)]` — `tailwindcss-animate` использует CSS `animation` (keyframes), а не `transition`.

2. **DOM mutation vs React state для позиционирования** — первоначальный open: `setPos()` через React state (animation fires once correctly). Scroll/resize: прямая мутация `floatingRef.current.style.*` без React re-render. Комбинация дала: анимация при открытии есть, drift при скролле нет. Но `transition-duration` всё равно применялась к positional props — отсюда оставшийся артефакт.

3. **Попытки до финального фикса** — Floating UI migration сломала позиционирование (reference element не резолвился корректно); close-on-scroll отклонён CEO; viewport-fixed отклонён. Финальный фикс: одна строка CSS — `transition-duration` → `animation-duration` в обоих компонентах.

**Артефакты:** `src/components/ui/select.tsx`, `src/components/ui/combobox.tsx` (commit 896c9cc), `memory/feedback_tailwindcss_animate_transition_vs_animation.md`

**Linear:** ALE-833 Done

**Следующий шаг:** ALE-830 Slider Preview Block (незакоммиченные изменения ждут)
