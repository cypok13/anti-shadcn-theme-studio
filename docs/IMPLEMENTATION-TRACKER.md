# Theme Studio — Implementation Tracker

**Источник истины для аудитов.** Обновлять после каждой сессии. Не ходить на tweakcn повторно — всё зафиксировано здесь.

Референс: https://tweakcn.com (аудит 2026-04-16)
Последнее обновление: 2026-04-16

---

## Легенда

| Символ | Значение |
|--------|---------|
| ✅ | Реализовано, соответствует спеке |
| ⚠️ | Реализовано частично / с отклонением |
| ❌ | Не реализовано |
| 🔒 | P2 — запланировано, не блокирует запуск |
| 🚫 | Out of scope — не делаем |

---

## 1. Preview Tabs

Референс: 7 табов — Custom | Cards | Dashboard | Mail | Pricing | Color Palette | Typography

| Таб | У референса | У нас | Статус |
|-----|-------------|-------|--------|
| `components` | Нет (у нас уникальный) | Есть | ✅ |
| `cards` | ✅ | Есть | ⚠️ (неполный — см. секцию 3) |
| `dashboard` | ✅ | Нет | 🔒 P2 |
| `mail` | ✅ | Нет | 🔒 P2 |
| `pricing` | ✅ | Нет | 🔒 P2 |
| `color-palette` | ✅ | Нет | 🔒 P2 |
| `typography` | ✅ | Есть | ⚠️ (шрифты пресета не применяются) |
| `custom` | ✅ (auth required) | Нет | 🚫 |

---

## 2. Компоненты — вкладка `components` (наш уникальный таб)

### Button

| Элемент | Спека | Статус | Gap |
|---------|-------|--------|-----|
| 5 вариантов (primary/secondary/outline/ghost/destructive) | component-spec.md | ✅ | — |
| 3 размера (sm/default/lg) | component-spec.md | ✅ | — |
| Hover (`opacity-90`, `transition 150ms ease`) | component-spec.md | ❌ | Нет transition, нет opacity change |
| Focus (`ring-2 ring-[--ring] ring-offset-2`) | component-spec.md | ❌ | Нет focus-visible |
| Active/pressed (`scale-[0.98]`, `opacity-80`) | component-spec.md | ❌ | Нет |
| Disabled (`opacity-50 cursor-not-allowed`) | component-spec.md | ⚠️ | Показан, состояние не проверено |
| `--radius` применяется | component-spec.md | ✅ | — |

### Input / Textarea

| Элемент | Спека | Статус | Gap |
|---------|-------|--------|-----|
| Text input с placeholder | component-spec.md | ✅ | — |
| Disabled input | component-spec.md | ✅ | — |
| Textarea | component-spec.md | ✅ | — |
| Focus ring (`ring-2 ring-[--ring]`) | component-spec.md | ❌ | Нет focus-visible |
| Placeholder цвет (`--muted-foreground`) | component-spec.md | ⚠️ | Не проверено |
| Error state (red border, `--destructive`) | component-spec.md | ❌ | Не реализован |

### Badge / Alert / Table

| Элемент | Спека | Статус | Gap |
|---------|-------|--------|-----|
| Badge: primary, secondary, outline | component-spec.md | ✅ | — |
| Alert info | component-spec.md | ✅ | — |
| Alert destructive | component-spec.md | ✅ | — |
| Table: header bg (`--muted`) | component-spec.md | ⚠️ | Не проверено |
| Table: row hover (`bg-[--accent/50]`) | component-spec.md | ❌ | Нет hover |
| Table: border-b (`--border`) | component-spec.md | ⚠️ | Не проверено |

### Компоненты из референса — ОТСУТСТВУЮТ У НАС

| Компонент | Где у референса | Статус |
|-----------|----------------|--------|
| Checkbox (check/uncheck) | Cards tab, Dashboard | ✅ ALE-737 |
| Switch / Toggle | Cards tab (Cookie Settings) | ✅ ALE-737 |
| Radio button | Cards tab (Plan selector) | ✅ ALE-737 |
| Select / Dropdown (combobox) | Cards tab (role dropdown), Team Members | ✅ ALE-737 |
| Progress bar | — | ✅ ALE-737 |
| Slider | Token Editor (но не в preview) | ❌ |
| Date picker / Calendar | Cards tab | ❌ |
| Pagination | Cards tab (Payments table) | ❌ |
| Avatar | Cards tab, Mail tab | ✅ ALE-737 |
| Stepper (increment/decrement) | Cards tab (Move Goal) | ❌ |
| Tabs component | Везде | ✅ ALE-737 |
| Dialog / Modal | — | ❌ |
| Tooltip | — | ❌ |
| Dropdown Menu (Actions) | Cards tab (Payments table) | ❌ |
| Toast / Sonner | — | ❌ |
| Skeleton loader | — | ❌ |
| Command / Search | Dashboard sidebar | ❌ |
| Separator | — | ✅ ALE-737 |

---

## 3. Компоненты — вкладка `cards`

### Что есть у нас

| Компонент | Статус |
|-----------|--------|
| Card basic | ✅ |
| Card feature (icon + CTA) | ✅ |
| Card stats/metric (large number + delta) | ✅ |
| Card pricing (feature list + full-width CTA) | ✅ |
| Card profile (avatar + social) | ✅ |
| Cookie Settings card (2 switches) | ✅ ALE-737 |
| Team Members card (avatars + role badges) | ✅ ALE-737 |
| Shadow styles (`--shadow-preset` CSS var) | ✅ ALE-737 |

### Что есть у референса и отсутствует у нас

| Компонент | Описание | Статус |
|-----------|----------|--------|
| Payment form card | Name/Email/Card Number/CVC, radio план, textarea, checkboxes, два button | ❌ |
| Team Members card | Список пользователей + role Select dropdown | ❌ |
| Cookie Settings card | Two Switches + Save button | ❌ |
| Create Account card | GitHub+Google OAuth buttons, Email/Password form | ❌ |
| Chat card | Сообщения + text input + disabled Send button | ❌ |
| GitHub repo card | Star button + TypeScript badge + stars count | ❌ |
| Date range picker | Calendar с выбором диапазона | ❌ |
| Move Goal card | Stepper (−/+) + radial chart | ❌ |
| Exercise Minutes card | Bar chart (Mon–Sun) | ❌ |
| Payments table | Checkbox column + Status badge + Email + Amount + Actions menu + pagination | ❌ |
| Share Document card | Link input + Copy Link + People with access + permission combobox | ❌ |

---

## 4. Компоненты — вкладка `dashboard` (P2)

Референс — полноценный sidebar layout:

| Элемент | Статус |
|---------|--------|
| Sidebar навигация (active/hover/inactive states) | 🔒 |
| Metric cards (4-up grid, trend arrow) | 🔒 |
| Area chart (date range) | 🔒 |
| Header с user avatar | 🔒 |
| Dropdown "Quick Create" | 🔒 |
| Поиск в sidebar | 🔒 |

---

## 5. Компоненты — вкладка `mail` (P2)

| Элемент | Статус |
|---------|--------|
| Account dropdown | 🔒 |
| Folder list с badge-счётчиками | 🔒 |
| Email list с тегами и avatars | 🔒 |
| Email viewer (открытое письмо) | 🔒 |
| All mail / Unread toggle | 🔒 |

---

## 6. Компоненты — вкладка `pricing` (P2)

| Элемент | Статус |
|---------|--------|
| Monthly/Yearly toggle | 🔒 |
| Plus/Pro карточки с feature list | 🔒 |
| Purchase buttons | 🔒 |

---

## 7. Token Editor

Референс: 4 таба — Colors | Typography | Other | Generate

### Colors tab — полный список токенов

| Группа | Токены | У нас редактируется | Статус |
|--------|--------|---------------------|--------|
| PRIMARY | Background (`--primary`), Foreground (`--primary-foreground`) | 2/2 | ✅ ALE-737 |
| SECONDARY | Background, Foreground | 2/2 | ✅ ALE-737 |
| ACCENT | Background, Foreground | 2/2 | ✅ ALE-737 |
| BASE | Background (`--background`), Foreground (`--foreground`) | 2/2 | ✅ ALE-737 |
| CARD | Background (`--card`), Foreground + Popover + Popover FG | 4/4 | ✅ ALE-737 |
| MUTED | Background (`--muted`), Foreground (`--muted-foreground`) | 2/2 | ✅ ALE-737 |
| DESTRUCTIVE | Background (`--destructive`), Foreground (`--destructive-foreground`) | 2/2 | ✅ ALE-737 |
| BORDER & INPUT | Border (`--border`), Input (`--input`), Ring (`--ring`) | 3/3 | ✅ ALE-737 |
| CHART | Chart 1–5 (`--chart-1` … `--chart-5`) | 5/5 | ✅ ALE-737 |
| SIDEBAR | 8 токенов (background/fg/primary/primary-fg/accent/accent-fg/border/ring) | 8/8 | ✅ ALE-737 |

**Итого: у нас редактируется 35 из 35 токенов (100%) — ALE-737**

Color picker тип: референс — нативный `<input type="color">` + Tailwind palette picker. У нас — только нативный `<input type="color">`. **Нет OKLCH пикера** ни у нас, ни у референса в UI (только в экспорте).

Search по токенам: у референса есть `Search colors...`. У нас: ❌

### Typography tab

| Элемент | У референса | У нас | Статус |
|---------|-------------|-------|--------|
| Font Family: Sans-Serif (select) | ✅ | ⚠️ (select системных шрифтов) | ⚠️ |
| Font Family: Serif (select) | ✅ | ❌ | ❌ |
| Font Family: Mono (select) | ✅ | ❌ | ❌ |
| Google Fonts интеграция | ✅ | ❌ | ❌ |
| Letter Spacing (slider) | ✅ | ❌ | ❌ |
| Font injection в preview iframe | ✅ | ❌ | ❌ **КРИТИЧНО** |

### Other tab

| Элемент | У референса | У нас | Статус |
|---------|-------------|-------|--------|
| HSL Adjustments: Hue slider | ✅ | ❌ | ❌ |
| HSL Adjustments: Saturation slider | ✅ | ❌ | ❌ |
| HSL Adjustments: Lightness slider | ✅ | ❌ | ❌ |
| Quick color presets (swatches) | ✅ | ❌ | ❌ |
| Radius slider | ✅ | ⚠️ (select, не slider) | ⚠️ |
| Spacing slider | ✅ | ❌ | ❌ |
| Shadow: Color | ✅ | ❌ | ❌ |
| Shadow: Opacity slider | ✅ | ❌ | ❌ |
| Shadow: Blur slider | ✅ | ❌ | ❌ |
| Shadow: Spread slider | ✅ | ❌ | ❌ |
| Shadow: Offset X slider | ✅ | ❌ | ❌ |
| Shadow: Offset Y slider | ✅ | ❌ | ❌ |

### Generate tab (AI)

| Элемент | У референса | У нас | Статус |
|---------|-------------|-------|--------|
| AI prompt → тема | ✅ | ❌ | 🔒 P2 (ALE-xxx) |
| Create / Remix / Tweak режимы | ✅ | ❌ | 🔒 |
| Image upload для генерации | ✅ | ❌ | 🔒 |

### Toolbar UX

| Элемент | У референса | У нас | Статус |
|---------|-------------|-------|--------|
| Undo | ✅ | ❌ | ❌ |
| Redo | ✅ | ❌ | ❌ |
| Reset (сброс всех overrides) | ✅ | ⚠️ (только смена пресета) | ⚠️ |
| Import CSS vars (модал) | ✅ | ❌ | ❌ |
| WCAG AA badge на primary | Нет в явном виде | ✅ | ✅ уникальная фича |
| SIDEBAR Sync кнопка | ✅ | ✅ | ✅ ALE-737 |
| Search по токенам | ✅ | ❌ | ❌ |

---

## 8. Preset UX

| Элемент | У референса | У нас | Статус |
|---------|-------------|-------|--------|
| Количество пресетов | 43 | 8 | ⚠️ |
| Выбор пресета | Dropdown/popover + search | Sidebar карточки | ✅ лучше чем у референса |
| Search по пресетам | ✅ | ❌ | ❌ |
| Карточка: 4 color swatches | ✅ | ✅ | ✅ |
| Карточка: name + tagline | Нет tagline | ✅ | ✅ уникально |
| Vibe tags | Нет | ✅ | ✅ уникально |
| Hover border change (150ms) | ✅ | ✅ | ✅ |
| Selected ring | ✅ | ✅ | ✅ |
| URL update (?theme=X) | ✅ | ✅ | ✅ |
| Random preset | ✅ | ❌ | ❌ |

---

## 9. Export

| Формат / Фича | У референса | У нас | Статус |
|---------------|-------------|-------|--------|
| CSS Variables Tailwind v3 | ✅ | ✅ | ✅ |
| CSS Variables Tailwind v4 | ✅ | ✅ (приблизительный OKLCH) | ⚠️ |
| Цветовые форматы: hex/hsl/oklch | ✅ | ✅ HSL+HEX+OKLCH | ✅ ALE-737 |
| Package manager таб (pnpm/npm/yarn/bun) | ✅ | ❌ | ❌ |
| layout.tsx (Next.js font import) | ✅ | ❌ | ❌ |
| AI Config (CLAUDE.md) | ❌ | ✅ | ✅ уникально |
| AI Rules (.cursorrules) | ❌ | ✅ | ✅ уникально |
| CLI команда (`npx shadcn@latest add URL`) | ✅ | ⚠️ (фикс ALE-720, нужна верификация) | ⚠️ |
| Open in v0 (Vercel) | ✅ | ❌ | 🔒 |
| Export to Figma | ✅ | ❌ | 🔒 |
| Share URL (копируемая ссылка) | ✅ | ✅ | ✅ |
| Save (cloud, auth) | ✅ | ❌ | 🔒 |
| Import CSS vars | ✅ | ❌ | ❌ |
| Copy button feedback | ✅ | ✅ | ✅ |
| Fullscreen preview | ✅ | ❌ | ❌ |

---

## 10. Community / Gallery

| Элемент | У референса | У нас | Статус |
|---------|-------------|-------|--------|
| `/community` страница | ✅ (93+ тем с тегами, лайки, авторы) | ❌ | 🔒 Phase 4 |
| Фильтрация по тегам | ✅ | ❌ | 🔒 |
| Лайки | ✅ | ❌ | 🔒 |
| Публикация темы | ✅ | ❌ | 🔒 |

---

## 11. Критические gaps (блокируют первое впечатление)

Приоритизированы по impact:

| # | Gap | Effort | Тикет |
|---|-----|--------|-------|
| 1 | **Font injection в preview iframe** — personality-first продукт без шрифтов = провал | S | — |
| 2 | ~~**Token Editor: 4/29 токенов**~~ | ~~M~~ | ✅ DONE ALE-737 — 35/35 |
| 3 | **Hover/focus states** на Button и Input — UI выглядит мёртвым | S | — |
| 4 | ~~**Shadow styles**~~ | ~~S~~ | ✅ DONE ALE-737 |
| 5 | **ALE-720 верификация** — CLI URL фикс задеплоен, тикет не закрыт | XS | ALE-720 |

---

## 12. P2 Backlog (не блокируют запуск)

| Фича | Тикет |
|------|-------|
| Dashboard preview tab | — |
| Mail preview tab | — |
| Pricing preview tab | — |
| Color Palette preview tab | — |
| OKLCH color picker (L/C/H sliders) | ALE-721 |
| Undo / Redo | — |
| Reset per-token | — |
| Import CSS vars | — |
| HSL Adjustments (hue/sat/light sliders) | — |
| Shadow builder (6 параметров) | — |
| Spacing token | — |
| SIDEBAR token group | — |
| Search по токенам | — |
| Random preset | — |
| Search по пресетам | — |
| AI Generate tab | — |
| layout.tsx export (Google Fonts) | — |
| Export color formats (hex/rgb/oklch) | — |
| Open in v0 | — |
| Export to Figma | — |
| Community / Gallery страница | Phase 4 |
| GIF демо + PH/HN launch page | ALE-706 |

---

## Как пользоваться этим файлом

1. **Перед сессией** — читать секцию 11 "Критические gaps" → выбрать что делаем
2. **После реализации** — обновить `❌ → ✅` + добавить тикет
3. **При аудите** — не запускать субагент на tweakcn. Сверяться здесь.
4. **Новый компонент** — добавить строку ДО имплементации
