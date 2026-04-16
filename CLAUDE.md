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

## Правило аудита (ОБЯЗАТЕЛЬНО)

Перед началом любой реализации и при проверке "что сделано":
1. Читать `docs/MISSING-REQUIREMENTS.md` → сводная таблица внизу
2. НЕ ходить на tweakcn — всё зафиксировано в трекере
3. После реализации — отметить `❌ → ✅` в сводной таблице

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
