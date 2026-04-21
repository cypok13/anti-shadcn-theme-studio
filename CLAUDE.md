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

### Delegation rule (КРИТИЧНО — добавлено 2026-04-17)

Оркестратор НЕ реализует компоненты сам. Прямая реализация → hallucinated values
(нестандартные px, визуальные решения без референса — инцидент: h-3.5=14px в 16px боксе).

> **БЛОКИРУЮЩЕЕ ПРАВИЛО (добавлено 2026-04-21):** Любая задача с вёрсткой (новый компонент,
> стилевое изменение, цвет, отступы) требует ДВУХ шагов делегирования — реализация + токен-аудит.
> Деплой без второго шага ЗАПРЕЩЁН.

| Этап | Субагент / скилл |
|------|-----------------|
| Research | `researcher` субагент |
| Implementation | `designer` субагент (Design System specialist, token-aware) |
| **Token/DS diff** | **`designer` субагент #2 — аудит токенов, нативных элементов, 4px spacing** |
| Visual QA | `/audit` скилл → `ux-reviewer` субагент (Playwright, живой UI) |
| Acceptance criteria | `qa-engineer` субагент (`test:components` + spec Done When) |

**Шаблон вызова аудит-дизайнера (шаг Token/DS diff):**
```
Agent(subagent_type="designer", prompt="""
Audit changed files for DS compliance — do NOT change logic.
Files: [list]
Check: (1) hardcoded hex/rgba → must be hsl(var(--token))
       (2) native <select>/<input> outside DS utility → must use src/components/ui/
       (3) spacing off 4px scale → flag
       (4) border/shadow not using DS token → flag
Report violations as file:line. Zero violations → "PASS".
""")
```

### Обязательная последовательность (нельзя пропустить):

0. **RESEARCH** → `researcher` субагент. ARIA APG, Radix docs, shadcn, GitHub examples. Spec пишется ПОСЛЕ.
1. **SPEC** — заполнить `docs/specs/[name]-spec.md` из шаблона. Файл существует ДО кода.
2. **IMPLEMENT** → `designer` субагент. Токены только, spacing только 4px шкала. **Читать Error Log E-001–E-010 в COMPONENT-PIPELINE.md.**
3. **LINT** — `npm run lint:ui` без ошибок.
4. **PLAYWRIGHT** → `qa-engineer` субагент (`npm run test:components`). Фиксить все провалы ДО CEO.
5. **VISUAL GATE** — сначала `ux-reviewer` субагент (Playwright QA), затем CEO апрувит явно.
6. **DOCS SYNC** — `npm run docs:sync && npm run docs:validate` (exit 0 обязателен).
7. **MERGE + DEPLOY** — только после шагов 5 и 6.

### Автоматические проверки (18 тестов, 4 gates):

| Gate | Проверка | Команда | Блокирует |
|------|---------|---------|-----------|
| 0 | Runtime integrity: JS errors, hydration, div-in-button | `npm run test:components` | merge |
| 1 | cursor, user-select, disabled cursor, inline hex, axe-core | `npm run test:components` | merge |
| 2 | Реальные state changes: checkbox/radio/switch/tabs/select | `npm run test:components` | merge |
| 3 | Keyboard: Tab достигает интерактивных элементов | `npm run test:components` | merge |
| — | Hardcoded hex в ui/ | `npm run lint:ui` | commit |
| — | Build | `npm run build` | deploy |

### Критические правила кода (из Error Log E-001–E-010):

- **SVG**: всегда `stroke="currentColor"` + `className="text-[hsl(var(--token))]"` на `<svg>` — никогда `stroke="hsl(var(...))"` как SVG attribute
- **Переключатель thumb**: `bg-[hsl(var(--primary-foreground))]` — никогда `bg-white` или `bg-black`
- **Disabled кнопки**: `cursor-not-allowed` + `disabled` атрибут — никогда `pointer-events-none` (убивает cursor rendering)
- **Input labels**: всегда `<label htmlFor="id">` + `<input id="id">` — orphan inputs = axe critical violation
- **Nested layout**: только root `app/layout.tsx` содержит `<html><body>` — nested layouts возвращают fragment
- **Новые семантические цвета** (success/warning/info): добавить CSS переменную в `globals.css`, потом использовать
- **Spacing**: только 4px шкала — `p-[10px]`, `h-3.5` (14px) FORBIDDEN. Маппинг: `gap-2`=8px, `p-3`=12px, `p-4`=16px. Иконки в индикаторах: `h-3` (12px = `--icon-indicator`), не `h-3.5` или `h-4`

## Правило: build-log обновляется КАЖДУЮ сессию (ОБЯЗАТЕЛЬНО)

> **БЛОКИРУЮЩЕЕ ПРАВИЛО** — сессия не считается завершённой без записи в build-log.

`docs/build-log.md` — источник для кейс-стади на notjustsasha.com. Без актуального лога кейс не написать.

**Когда обновлять:** в конце каждой рабочей сессии, перед `/session-end`.

**Что писать:**
```markdown
## День N — Краткое название (YYYY-MM-DD)

1. **Инсайт / решение** — что сделали, почему важно, какой инцидент был
2. ...

**Артефакты:** список новых/изменённых файлов
**Linear:** тикеты сессии
**Следующий шаг:** что дальше
```

**Правила:**
- Нумерация дней сквозная (текущий максимум — смотреть в конец файла)
- Минимум 3 пункта на сессию
- Писать инсайты, а не changelog — что узнали, что сломалось, какое решение выбрали
- Инциденты и pivot-решения особенно важны для кейса

---

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

<!-- gitnexus:start -->
# GitNexus — Code Intelligence

This project is indexed by GitNexus as **theme-studio** (819 symbols, 1209 relationships, 37 execution flows). Use the GitNexus MCP tools to understand code, assess impact, and navigate safely.

> If any GitNexus tool warns the index is stale, run `npx gitnexus analyze` in terminal first.

## Always Do

- **MUST run impact analysis before editing any symbol.** Before modifying a function, class, or method, run `gitnexus_impact({target: "symbolName", direction: "upstream"})` and report the blast radius (direct callers, affected processes, risk level) to the user.
- **MUST run `gitnexus_detect_changes()` before committing** to verify your changes only affect expected symbols and execution flows.
- **MUST warn the user** if impact analysis returns HIGH or CRITICAL risk before proceeding with edits.
- When exploring unfamiliar code, use `gitnexus_query({query: "concept"})` to find execution flows instead of grepping. It returns process-grouped results ranked by relevance.
- When you need full context on a specific symbol — callers, callees, which execution flows it participates in — use `gitnexus_context({name: "symbolName"})`.

## When Debugging

1. `gitnexus_query({query: "<error or symptom>"})` — find execution flows related to the issue
2. `gitnexus_context({name: "<suspect function>"})` — see all callers, callees, and process participation
3. `READ gitnexus://repo/theme-studio/process/{processName}` — trace the full execution flow step by step
4. For regressions: `gitnexus_detect_changes({scope: "compare", base_ref: "main"})` — see what your branch changed

## When Refactoring

- **Renaming**: MUST use `gitnexus_rename({symbol_name: "old", new_name: "new", dry_run: true})` first. Review the preview — graph edits are safe, text_search edits need manual review. Then run with `dry_run: false`.
- **Extracting/Splitting**: MUST run `gitnexus_context({name: "target"})` to see all incoming/outgoing refs, then `gitnexus_impact({target: "target", direction: "upstream"})` to find all external callers before moving code.
- After any refactor: run `gitnexus_detect_changes({scope: "all"})` to verify only expected files changed.

## Never Do

- NEVER edit a function, class, or method without first running `gitnexus_impact` on it.
- NEVER ignore HIGH or CRITICAL risk warnings from impact analysis.
- NEVER rename symbols with find-and-replace — use `gitnexus_rename` which understands the call graph.
- NEVER commit changes without running `gitnexus_detect_changes()` to check affected scope.

## Tools Quick Reference

| Tool | When to use | Command |
|------|-------------|---------|
| `query` | Find code by concept | `gitnexus_query({query: "auth validation"})` |
| `context` | 360-degree view of one symbol | `gitnexus_context({name: "validateUser"})` |
| `impact` | Blast radius before editing | `gitnexus_impact({target: "X", direction: "upstream"})` |
| `detect_changes` | Pre-commit scope check | `gitnexus_detect_changes({scope: "staged"})` |
| `rename` | Safe multi-file rename | `gitnexus_rename({symbol_name: "old", new_name: "new", dry_run: true})` |
| `cypher` | Custom graph queries | `gitnexus_cypher({query: "MATCH ..."})` |

## Impact Risk Levels

| Depth | Meaning | Action |
|-------|---------|--------|
| d=1 | WILL BREAK — direct callers/importers | MUST update these |
| d=2 | LIKELY AFFECTED — indirect deps | Should test |
| d=3 | MAY NEED TESTING — transitive | Test if critical path |

## Resources

| Resource | Use for |
|----------|---------|
| `gitnexus://repo/theme-studio/context` | Codebase overview, check index freshness |
| `gitnexus://repo/theme-studio/clusters` | All functional areas |
| `gitnexus://repo/theme-studio/processes` | All execution flows |
| `gitnexus://repo/theme-studio/process/{name}` | Step-by-step execution trace |

## Self-Check Before Finishing

Before completing any code modification task, verify:
1. `gitnexus_impact` was run for all modified symbols
2. No HIGH/CRITICAL risk warnings were ignored
3. `gitnexus_detect_changes()` confirms changes match expected scope
4. All d=1 (WILL BREAK) dependents were updated

## Keeping the Index Fresh

After committing code changes, the GitNexus index becomes stale. Re-run analyze to update it:

```bash
npx gitnexus analyze
```

If the index previously included embeddings, preserve them by adding `--embeddings`:

```bash
npx gitnexus analyze --embeddings
```

To check whether embeddings exist, inspect `.gitnexus/meta.json` — the `stats.embeddings` field shows the count (0 means no embeddings). **Running analyze without `--embeddings` will delete any previously generated embeddings.**

> Claude Code users: A PostToolUse hook handles this automatically after `git commit` and `git merge`.

## CLI

| Task | Read this skill file |
|------|---------------------|
| Understand architecture / "How does X work?" | `.claude/skills/gitnexus/gitnexus-exploring/SKILL.md` |
| Blast radius / "What breaks if I change X?" | `.claude/skills/gitnexus/gitnexus-impact-analysis/SKILL.md` |
| Trace bugs / "Why is X failing?" | `.claude/skills/gitnexus/gitnexus-debugging/SKILL.md` |
| Rename / extract / split / refactor | `.claude/skills/gitnexus/gitnexus-refactoring/SKILL.md` |
| Tools, resources, schema reference | `.claude/skills/gitnexus/gitnexus-guide/SKILL.md` |
| Index, status, clean, wiki CLI commands | `.claude/skills/gitnexus/gitnexus-cli/SKILL.md` |

<!-- gitnexus:end -->
