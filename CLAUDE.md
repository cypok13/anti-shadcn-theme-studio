# CLAUDE.md — Anti-shadcn Theme Studio

## Проект

Visual shadcn/ui theme editor. Позиционирование: Design System Control Center.
**Live:** https://theme-studio-beta.vercel.app
**GitHub:** https://github.com/cypok13/anti-shadcn-theme-studio
**Linear:** ALE-637

## Стек

Next.js 15 App Router, Tailwind v4, TypeScript, zero backend, Vercel free tier.

## Документация

| Файл | Назначение |
|------|-----------|
| `docs/PLAN.md` | Master index: статусы спринтов, ссылки на все артефакты |
| `docs/MISSING-REQUIREMENTS.md` | **ЧИТАТЬ ПЕРВЫМ** — официальные требования с Acceptance Criteria на всё недостающее. Сводная таблица прогресса внизу. |
| `docs/IMPLEMENTATION-TRACKER.md` | Статус каждого компонента/токена/фичи vs референс (tweakcn) |
| `docs/build-log.md` | Дневник сессий → источник для кейса на notjustsasha.com |
| `docs/research/personas.md` | День 1: персоны, JTBD, quotes |
| `docs/research/competitive-audit.md` | День 2: UX audit, heuristics, pain points |
| `docs/research/ai-testing-protocol.md` | День 11: AI persona testing protocol |
| `docs/research/sprint-details.md` | Дни 2-12: execution prompts |

## Component Pipeline (ОБЯЗАТЕЛЬНО — читать перед любым компонентом)

Полный пайплайн: **`docs/COMPONENT-PIPELINE.md`** (включает Error Log + ARIA APG links)
Шаблон спецификации: **`docs/specs/component-spec-template.md`**

**Правило: 1 компонент на сессию, не больше.**

### Обязательная последовательность (нельзя пропустить):

0. **RESEARCH** — запустить researcher subagent (см. Step 0.5 в COMPONENT-PIPELINE.md). Найти ARIA APG pattern, Radix docs, shadcn docs, GitHub examples. Spec пишется ПОСЛЕ research.
1. **SPEC** — заполнить `docs/specs/[name]-spec.md` из шаблона (ARIA APG → варианты → состояния → токены → тест-план). Файл должен существовать ДО написания кода.
2. **IMPLEMENT** — только токены (`var(--token)`), никаких hex. `cursor-pointer` на всех интерактивных элементах. Полная кликабельная зона для checkbox/radio/switch. **Читать Error Log в COMPONENT-PIPELINE.md перед реализацией.**
3. **LINT** — `npm run lint:ui` должен пройти без ошибок.
4. **PLAYWRIGHT** — `npm run test:components` (с запущенным dev server) должен пройти. **Pipeline автономный — фиксить все провалы ДО передачи CEO.**
5. **VISUAL GATE** — CEO смотрит на живой UI и явно апрувит. До апрува тикет не закрывается.
6. **MERGE + DEPLOY** — только после visual gate.

### Автоматические проверки (18 тестов, 4 gates):

| Gate | Проверка | Команда | Блокирует |
|------|---------|---------|-----------|
| 0 | Runtime integrity: JS errors, hydration, div-in-button | `npm run test:components` | merge |
| 1 | cursor, user-select, disabled cursor, inline hex, axe-core | `npm run test:components` | merge |
| 2 | Реальные state changes: checkbox/radio/switch/tabs/select | `npm run test:components` | merge |
| 3 | Keyboard: Tab достигает интерактивных элементов | `npm run test:components` | merge |
| — | Hardcoded hex в ui/ | `npm run lint:ui` | commit |
| — | Build | `npm run build` | deploy |

### Критические правила кода (из Error Log):

- **SVG**: всегда `stroke="currentColor"` + `className="text-[hsl(var(--token))]"` на `<svg>` — никогда `stroke="hsl(var(...))"` как SVG attribute
- **Переключатель thumb**: `bg-[hsl(var(--primary-foreground))]` — никогда `bg-white` или `bg-black`
- **Disabled кнопки**: `cursor-not-allowed` + `disabled` атрибут — никогда `pointer-events-none` (убивает cursor rendering)
- **Input labels**: всегда `<label htmlFor="id">` + `<input id="id">` — orphan inputs = axe critical violation
- **Nested layout**: только root `app/layout.tsx` содержит `<html><body>` — nested layouts возвращают fragment
- **Новые семантические цвета** (success/warning/info): добавить CSS переменную в `globals.css`, потом использовать

## Правило: фиксация данных каждого дня спринта

**Обязательно** после завершения каждого дня research sprint:

1. **`docs/build-log.md`** — добавить запись с:
   - Дата + номер дня
   - Ключевые инсайты (3-5 пунктов)
   - Ссылки на Figma/StackBlitz/Vercel артефакты
   - Что это меняет для следующего дня

2. **`docs/research/день-N-название.md`** — сырые данные:
   - Все цитаты с source URL
   - Таблицы сравнений
   - Промежуточные данные (не финальные выводы — они в build-log)

3. **`docs/PLAN.md`** — обновить статус дня: `⏳ → ✅`, добавить ссылки на node-id артефактов.

Без этих трёх шагов день считается незавершённым.

## Архитектурные ограничения (КРИТИЧНО)

- `AppShell.tsx`: ТОЛЬКО inline styles — `style={{ background: \`hsl(${tokens.background})\` }}`
  - NO Tailwind className с CSS-var ссылками — ломаются при билде
- `/preview` route: может использовать Tailwind className свободно
- ThemeTokens: HSL bare strings — `"210 40% 98%"` (без `hsl()` wrapper)
- iframe использует `key={src}` для forced remount (Phase 1 заменит на postMessage)
