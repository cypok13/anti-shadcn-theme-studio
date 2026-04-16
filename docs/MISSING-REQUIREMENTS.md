# Theme Studio — Missing Requirements

**Официальный документ требований на недостающий функционал.**
Basis: аудит tweakcn.com (2026-04-16) + component-spec.md + token-spec.md.

Статус каждого пункта ведётся здесь. Обновлять после каждой сессии.
Трекер общего прогресса: `docs/IMPLEMENTATION-TRACKER.md`

---

## Легенда

```
[ ] — не реализовано
[x] — реализовано и проверено
[~] — реализовано частично
```

Приоритеты: **P0** = блокирует personality (критично для продукта) | **P1** = блокирует запуск | **P2** = улучшает, не блокирует

---

---

# БЛОК A — TOKEN EDITOR

---

## A1. Font Injection в Preview Iframe

**Приоритет:** P0
**Файлы:** `src/components/preview/PreviewFrame.tsx`, `src/app/preview/page.tsx`
**Спека:** `docs/token-spec.md` → Font System

### Проблема
`preset.fonts.heading/body/mono` определены в каждом пресете, но не применяются в preview iframe. Весь preview рендерится системным шрифтом. Для personality-first продукта — провал: Concrete Brutalist (Courier New) выглядит идентично Garden Party (Georgia).

### Требования

Инъекция `<style>` тега в preview iframe при каждой смене пресета:

```css
body { font-family: [preset.fonts.body]; }
h1, h2, h3, h4, h5, h6 { font-family: [preset.fonts.heading]; }
code, pre, kbd, samp { font-family: [preset.fonts.mono]; }
```

Шрифты применяются через postMessage (тот же канал что и CSS vars). Не через `key={src}` remount.

### Acceptance Criteria

- [ ] Concrete Brutalist показывает `Courier New` в heading и body
- [ ] Quiet Tokyo показывает `Georgia` в heading
- [ ] Late-Night Terminal показывает `JetBrains Mono` в heading и body
- [ ] Смена пресета мгновенно меняет шрифт в preview (< 16ms, без remount)
- [ ] Typography tab визуально различается между пресетами
- [ ] Code/pre блоки используют preset.fonts.mono
- [ ] Светлый и тёмный режим не влияют на шрифтовую инъекцию

---

## A2. Shadow Styles в Preview

**Приоритет:** P0
**Файлы:** `src/components/preview/ComponentGallery.tsx`
**Спека:** `docs/token-spec.md` → Shadow System

### Проблема
`preset.shadowStyle` определён для каждого пресета (`none | flat | soft | dramatic | glow`), но в ComponentGallery все карточки используют `shadow-sm` хардкод. Glassmorphism и Concrete Brutalist выглядят одинаково.

### CSS маппинг

| shadowStyle | CSS |
|-------------|-----|
| `none` | `box-shadow: none` |
| `flat` | `box-shadow: 1px 1px 0 hsl(var(--border))` |
| `soft` | `box-shadow: 0 2px 8px hsl(var(--foreground) / 0.08)` |
| `dramatic` | `box-shadow: 0 8px 24px hsl(var(--foreground) / 0.15)` |
| `glow` | `box-shadow: 0 0 16px hsl(var(--primary) / 0.3)` |

Применяется через CSS custom property `--shadow-preset` на `:root` в iframe, или через postMessage как дополнительная переменная.

### Acceptance Criteria

- [ ] Concrete Brutalist: карточки без тени (`none`)
- [ ] Garden Party: мягкая тень (`soft`) на Card компонентах
- [ ] Glassmorphism: glow эффект на Card компонентах
- [ ] Broadsheet: flat тень (1px offset)
- [ ] Смена пресета мгновенно меняет shadow style
- [ ] Shadow применяется к: Card basic, Card feature, Card stats, Card pricing, Card profile, Alert
- [ ] Кнопки НЕ получают shadow (shadow только для контейнеров)

---

## A3. Token Editor — Расширение до полного покрытия

**Приоритет:** P1
**Файлы:** `src/components/tokens/TokenEditor.tsx`, `src/lib/themes/types.ts`
**Спека:** `docs/token-spec.md` → Token Groups

### Текущее состояние
Редактируется 4 из 29 токенов: primary (color), secondary (color), accent (color), radius (select).

### Требуемые группы и токены

#### Группа BASE / Page (сейчас: 0/2)

| Токен | CSS Var | Тип контрола |
|-------|---------|-------------|
| `background` | `--background` | color picker |
| `foreground` | `--foreground` | color picker |

WCAG check: contrast ratio background vs foreground ≥ 4.5:1.

**Acceptance Criteria:**
- [ ] Background и Foreground редактируемы
- [ ] WCAG AA badge показывает contrast ratio между ними
- [ ] Изменение background мгновенно меняет фон в preview

---

#### Группа PRIMARY (сейчас: 1/2 — foreground отсутствует)

| Токен | CSS Var | Тип контрола |
|-------|---------|-------------|
| `primary` | `--primary` | color picker (есть) |
| `primaryForeground` | `--primary-foreground` | color picker (ДОБАВИТЬ) |

**Acceptance Criteria:**
- [ ] `primaryForeground` редактируем
- [ ] WCAG badge обновляется при изменении primaryForeground

---

#### Группа SECONDARY (сейчас: 1/2)

| Токен | CSS Var | Тип контрола |
|-------|---------|-------------|
| `secondary` | `--secondary` | color picker (есть) |
| `secondaryForeground` | `--secondary-foreground` | color picker (ДОБАВИТЬ) |

**Acceptance Criteria:**
- [ ] `secondaryForeground` редактируем

---

#### Группа ACCENT (сейчас: 1/2)

| Токен | CSS Var | Тип контрола |
|-------|---------|-------------|
| `accent` | `--accent` | color picker (есть) |
| `accentForeground` | `--accent-foreground` | color picker (ДОБАВИТЬ) |

**Acceptance Criteria:**
- [ ] `accentForeground` редактируем

---

#### Группа MUTED (сейчас: 0/2)

| Токен | CSS Var | Тип контрола |
|-------|---------|-------------|
| `muted` | `--muted` | color picker |
| `mutedForeground` | `--muted-foreground` | color picker |

Используется в: table header bg, input placeholder, code block bg, caption text, inactive nav.

**Acceptance Criteria:**
- [ ] Оба токена редактируемы
- [ ] Изменение muted видно в table header и code blocks в preview

---

#### Группа DESTRUCTIVE (сейчас: 0/2)

| Токен | CSS Var | Тип контрола |
|-------|---------|-------------|
| `destructive` | `--destructive` | color picker |
| `destructiveForeground` | `--destructive-foreground` | color picker |

WCAG check: destructive vs destructiveForeground ≥ 4.5:1.

**Acceptance Criteria:**
- [ ] Оба токена редактируемы
- [ ] Изменение destructive видно в Alert (destructive) и Button (destructive) в preview
- [ ] WCAG badge для destructive

---

#### Группа BORDER & INPUT (сейчас: 0/3)

| Токен | CSS Var | Тип контрола |
|-------|---------|-------------|
| `border` | `--border` | color picker |
| `input` | `--input` | color picker |
| `ring` | `--ring` | color picker |

**Acceptance Criteria:**
- [ ] Все три токена редактируемы
- [ ] Изменение border видно на Card, Input, Table в preview
- [ ] Изменение ring видно на focused Input в preview

---

#### Группа CARD / POPOVER (сейчас: 0/4)

| Токен | CSS Var | Тип контрола |
|-------|---------|-------------|
| `card` | `--card` | color picker |
| `cardForeground` | `--card-foreground` | color picker |
| `popover` | `--popover` | color picker |
| `popoverForeground` | `--popover-foreground` | color picker |

**Acceptance Criteria:**
- [ ] Все четыре токена редактируемы
- [ ] Изменение card видно на Card компонентах в preview

---

#### Группа CHART (сейчас: 0/5)

| Токен | CSS Var | Тип контрола |
|-------|---------|-------------|
| `chart1` | `--chart-1` | color picker |
| `chart2` | `--chart-2` | color picker |
| `chart3` | `--chart-3` | color picker |
| `chart4` | `--chart-4` | color picker |
| `chart5` | `--chart-5` | color picker |

Отображаются в Color Palette tab (P2). В CSS export присутствуют.

**Acceptance Criteria:**
- [ ] Все 5 chart токенов редактируемы
- [ ] В CSS export chart токены отражают overrides

---

#### Группа SIDEBAR (сейчас: 0/8) — обнаружена в аудите

| Токен | CSS Var | Тип контрола |
|-------|---------|-------------|
| `sidebarBackground` | `--sidebar-background` | color picker |
| `sidebarForeground` | `--sidebar-foreground` | color picker |
| `sidebarPrimary` | `--sidebar-primary` | color picker |
| `sidebarPrimaryForeground` | `--sidebar-primary-foreground` | color picker |
| `sidebarAccent` | `--sidebar-accent` | color picker |
| `sidebarAccentForeground` | `--sidebar-accent-foreground` | color picker |
| `sidebarBorder` | `--sidebar-border` | color picker |
| `sidebarRing` | `--sidebar-ring` | color picker |

Нужно: добавить в `ThemeTokens` интерфейс + в каждый preset + в CSS export.

**Acceptance Criteria:**
- [ ] `ThemeTokens` расширен 8 sidebar токенами
- [ ] Все 8 preset'ов имеют sidebar значения (light + dark)
- [ ] Все 8 токенов редактируемы в Token Editor
- [ ] Кнопка "Sync" копирует значения primary/accent/border/ring в соответствующие sidebar токены
- [ ] В CSS export sidebar токены присутствуют

---

### Общий UX Token Editor

**Acceptance Criteria:**
- [ ] Токены организованы в коллапсируемые группы (как у референса)
- [ ] Каждая группа имеет label (BASE, PRIMARY, SECONDARY, ACCENT, MUTED, DESTRUCTIVE, BORDER & INPUT, CARD, CHART, SIDEBAR)
- [ ] Кнопка "Reset" сбрасывает ВСЕ overrides к defaults пресета
- [ ] При смене пресета все overrides очищаются (уже есть, проверить)
- [ ] Итого редактируемых токенов: 29/29

---

## A4. Typography Controls

**Приоритет:** P1
**Файлы:** `src/components/tokens/TokenEditor.tsx`

### Требования

| Контрол | Тип | Значения |
|---------|-----|---------|
| Heading font | Select | Preset default + список Google Fonts (минимум: Inter, Roboto, Playfair Display, Space Grotesk, Courier New, Georgia) |
| Body font | Select | Аналогично |
| Mono font | Select | Аналогично + JetBrains Mono, Fira Code, IBM Plex Mono |

На этапе P1: системные шрифты + web-safe (без загрузки из Google). Google Fonts — P2.

**Acceptance Criteria:**
- [ ] Select для heading font (минимум 6 вариантов)
- [ ] Select для body font
- [ ] Select для mono font
- [ ] Смена шрифта мгновенно применяется в preview (через font injection — A1)
- [ ] Выбранный шрифт отражается в CSS export

---

---

# БЛОК B — КОМПОНЕНТЫ В PREVIEW

---

## B1. Hover и Focus States на всех компонентах

**Приоритет:** P0
**Файлы:** `src/app/preview/page.tsx`, `src/components/preview/ComponentGallery.tsx`

Без hover/focus UI выглядит мёртвым. Это базовое требование для любого theme editor.

### Глобальные правила (применить ко всем компонентам)

```
Hover:  transition-[background-color,color,border-color,opacity,box-shadow] duration-150 ease-in-out
Focus:  focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--ring))] focus-visible:ring-offset-2 focus-visible:ring-offset-[hsl(var(--background))]
```

**Acceptance Criteria — Button:**
- [ ] Primary: hover `opacity-90` с 150ms transition
- [ ] Primary: focus ring `ring-2 ring-[hsl(var(--ring))] ring-offset-2`
- [ ] Primary: active `opacity-80 scale-[0.98]`
- [ ] Secondary: hover `opacity-90` с 150ms
- [ ] Secondary: focus ring
- [ ] Outline: hover `bg-[hsl(var(--accent))] text-[hsl(var(--accent-foreground))]`
- [ ] Ghost: hover `bg-[hsl(var(--accent))] text-[hsl(var(--accent-foreground))]`
- [ ] Destructive: hover `opacity-90`
- [ ] Все disabled кнопки: `opacity-50 cursor-not-allowed pointer-events-none`

**Acceptance Criteria — Input:**
- [ ] Focus: `ring-2 ring-[hsl(var(--ring))] ring-offset-0 outline-none`
- [ ] Placeholder: `text-[hsl(var(--muted-foreground))]`
- [ ] Disabled: `opacity-50 cursor-not-allowed bg-[hsl(var(--muted))]`

**Acceptance Criteria — Table:**
- [ ] Row hover: `bg-[hsl(var(--accent)/0.5)]` с 150ms transition
- [ ] Кликабельная строка показывает cursor-pointer

---

## B2. Checkbox

**Приоритет:** P1
**Таб:** `components`
**Референс:** Cards tab (Payment form, Cookie Settings)

| Элемент | CSS Токены |
|---------|-----------|
| Box default | `border border-[hsl(var(--input))] bg-transparent rounded-[calc(var(--radius)*0.5)]` |
| Box checked | `bg-[hsl(var(--primary))] border-[hsl(var(--primary))]` + checkmark иконка white |
| Focus ring | `ring-2 ring-[hsl(var(--ring))] ring-offset-2` |
| Disabled | `opacity-50 cursor-not-allowed` |
| Label | `text-sm text-[hsl(var(--foreground))]` |

**Acceptance Criteria:**
- [ ] Unchecked состояние: пустой border box
- [ ] Checked состояние: primary fill + white checkmark SVG
- [ ] Hover на label и box: cursor-pointer
- [ ] Focus ring видна при keyboard navigation
- [ ] Disabled: opacity-50, non-interactive
- [ ] Кликабелен (toggle в preview)
- [ ] Показать минимум 2 checkbox: один unchecked, один checked

---

## B3. Switch / Toggle

**Приоритет:** P1
**Таб:** `components`
**Референс:** Cards tab (Cookie Settings card)

| Элемент | CSS Токены |
|---------|-----------|
| Track OFF | `bg-[hsl(var(--input))] rounded-full` width 44px height 24px |
| Track ON | `bg-[hsl(var(--primary))]` |
| Thumb | `bg-white rounded-full` width 20px height 20px, translate-x анимация |
| Transition | `transition-[background-color,transform] duration-200 ease-in-out` |
| Focus | ring-2 на track |
| Disabled | `opacity-50 cursor-not-allowed` |

**Acceptance Criteria:**
- [ ] OFF состояние: muted track + thumb слева
- [ ] ON состояние: primary track + thumb справа + анимация перехода 200ms
- [ ] Кликабелен (toggle в preview)
- [ ] Показать минимум 2 switch: один OFF, один ON
- [ ] Label рядом со switch

---

## B4. Radio Button

**Приоритет:** P1
**Таб:** `components`
**Референс:** Cards tab (Plan selector в Payment form)

| Элемент | CSS Токены |
|---------|-----------|
| Circle default | `border-2 border-[hsl(var(--input))] rounded-full` 16px |
| Circle selected | `border-[hsl(var(--primary))]` + inner dot `bg-[hsl(var(--primary))]` 8px |
| Focus | ring-2 ring-[hsl(var(--ring))] |
| Label | text-sm foreground |

**Acceptance Criteria:**
- [ ] Unselected: пустой circle
- [ ] Selected: outer circle primary + inner dot primary
- [ ] Показать группу из 3 radio (Plan: Starter/Pro/Enterprise)
- [ ] Только один может быть selected одновременно (interactive)
- [ ] Focus ring при keyboard navigation

---

## B5. Select / Combobox

**Приоритет:** P1
**Таб:** `components`
**Референс:** Cards tab (role dropdown в Team Members)

| Элемент | CSS Токены |
|---------|-----------|
| Trigger | `border border-[hsl(var(--input))] bg-[hsl(var(--background))] rounded-[var(--radius)] h-9` |
| Trigger hover | `bg-[hsl(var(--accent))]` |
| Trigger focus | ring-2 ring-[hsl(var(--ring))] |
| Caret icon | `text-[hsl(var(--muted-foreground))]` |
| Dropdown content | `bg-[hsl(var(--popover))] border border-[hsl(var(--border))] shadow-md rounded-[var(--radius)]` |
| Option default | `text-[hsl(var(--popover-foreground))] px-3 py-1.5 text-sm` |
| Option hover | `bg-[hsl(var(--accent))] text-[hsl(var(--accent-foreground))]` |
| Option selected | checkmark icon `text-[hsl(var(--primary))]` |
| Placeholder | `text-[hsl(var(--muted-foreground))]` |

**Acceptance Criteria:**
- [ ] Trigger с placeholder видна в default state
- [ ] Hover на trigger меняет background
- [ ] Клик открывает dropdown с опциями
- [ ] Option hover подсвечивается accent
- [ ] Выбранная option отмечена checkmark
- [ ] Dropdown использует `--popover` background (может отличаться от card)
- [ ] Показать минимум 1 Select в preview

---

## B6. Progress Bar

**Приоритет:** P1
**Таб:** `components`

| Элемент | CSS Токены |
|---------|-----------|
| Track | `bg-[hsl(var(--muted))] rounded-full h-2` |
| Fill | `bg-[hsl(var(--primary))] h-full rounded-full` |
| Label | `text-sm text-[hsl(var(--muted-foreground))]` |

**Acceptance Criteria:**
- [ ] Track использует `--muted`
- [ ] Fill использует `--primary`
- [ ] Показать минимум 3 progress bar с разными % (25%, 60%, 85%)
- [ ] `--radius` применяется к track и fill

---

## B7. Slider

**Приоритет:** P2
**Таб:** `components`

| Элемент | CSS Токены |
|---------|-----------|
| Track | `bg-[hsl(var(--muted))] h-1 rounded-full` |
| Range (filled) | `bg-[hsl(var(--primary))]` |
| Thumb | `bg-white border-2 border-[hsl(var(--primary))] rounded-full h-4 w-4` |
| Focus | ring-2 ring-[hsl(var(--ring))] на thumb |

**Acceptance Criteria:**
- [ ] Track + range fill + thumb отображаются
- [ ] Thumb draggable (interactive)
- [ ] Focus ring на thumb

---

## B8. Tabs Component

**Приоритет:** P1
**Таб:** `components`

| Элемент | CSS Токены |
|---------|-----------|
| Tab list | `bg-[hsl(var(--muted))] p-1 rounded-[var(--radius)]` |
| Tab trigger default | `text-[hsl(var(--muted-foreground))] rounded-[calc(var(--radius)*0.75)]` |
| Tab trigger active | `bg-[hsl(var(--background))] text-[hsl(var(--foreground))] shadow-sm` |
| Tab trigger hover | `text-[hsl(var(--foreground))]` |
| Tab content | `mt-2 text-[hsl(var(--foreground))]` |

**Acceptance Criteria:**
- [ ] List с muted background
- [ ] Active tab: белый/background bg, foreground text
- [ ] Hover на inactive: foreground text
- [ ] Кликабельны (переключают контент)
- [ ] Показать 3 таба (Account / Password / Notifications)

---

## B9. Avatar

**Приоритет:** P1
**Таб:** `components`

| Элемент | CSS Токены |
|---------|-----------|
| Image fallback | `bg-[hsl(var(--muted))] rounded-full` 40x40px |
| Initials | `text-[hsl(var(--muted-foreground))] text-sm font-medium` |
| Border | optional `ring-2 ring-[hsl(var(--ring))]` |

Варианты: sm (32px), md (40px), lg (48px).

**Acceptance Criteria:**
- [ ] Показать 3 размера avatar
- [ ] Fallback с инициалами и muted background
- [ ] Группа overlapping avatars (3-4 штуки) как в team preview

---

## B10. Separator

**Приоритет:** P1
**Таб:** `components`

| Элемент | CSS Токены |
|---------|-----------|
| Line | `bg-[hsl(var(--border))] h-px` (horizontal) или `w-px` (vertical) |

**Acceptance Criteria:**
- [ ] Horizontal separator с label "Or continue with"
- [ ] Использует `--border` токен
- [ ] Видна в обоих режимах (light/dark)

---

## B11. Badge — расширение вариантов

**Приоритет:** P1
**Таб:** `components`

Сейчас есть: primary, secondary, outline.
Добавить:

| Вариант | CSS |
|---------|-----|
| `success` | `bg-green-100 text-green-800` или через custom token |
| `warning` | `bg-yellow-100 text-yellow-800` |
| `destructive` | `bg-[hsl(var(--destructive)/0.1)] text-[hsl(var(--destructive))]` |

Референс: Payments table использует `success` / `processing` / `failed` / `pending` badges.

**Acceptance Criteria:**
- [ ] 6 badge вариантов в preview: primary, secondary, outline, success, warning, destructive
- [ ] Destructive badge использует `--destructive` токен (не hardcoded red)

---

---

# БЛОК C — CARDS TAB — недостающие карточки

---

## C1. Payment Form Card

**Приоритет:** P2
**Компоненты внутри:** Input, Select, Textarea, Checkbox, Radio, Button

Демонстрирует как тема смотрится в реальной форме.

```
[Name input] [Email input]
[Card Number input] [MM/YY input] [CVC input]
Plan: (•) Starter ($9) ( ) Pro ($29)
[Notes textarea]
[x] I agree to Terms
[ ] Send me updates
[Cancel button] [Upgrade Plan button (primary)]
```

**Acceptance Criteria:**
- [ ] Все поля используют `--input` border и `--ring` на focus
- [ ] Radio group: только один выбран
- [ ] Checkboxes: интерактивны
- [ ] Primary button с hover state
- [ ] Cancel — outline/ghost вариант

---

## C2. Team Members Card

**Приоритет:** P2
**Компоненты внутри:** Avatar, Select, Button

```
Team Members          [+ Invite]
[Avatar] Alice K.     [Owner ▾]
[Avatar] Bob M.       [Developer ▾]
[Avatar] Carol S.     [Billing ▾]
```

**Acceptance Criteria:**
- [ ] 3 member rows с avatar fallback + name
- [ ] Role Select с dropdown
- [ ] Invite кнопка (outline variant)

---

## C3. Cookie Settings Card

**Приоритет:** P2
**Компоненты внутри:** Switch

```
Cookie Settings
We use cookies to improve your experience.
Necessary cookies    [ON  ●───]
Functional cookies   [───●  OFF]
[Save preferences]
```

**Acceptance Criteria:**
- [ ] 2 Switch: один ON, один OFF
- [ ] Primary button
- [ ] Description text использует `--muted-foreground`

---

## C4. Payments Table Card

**Приоритет:** P2
**Компоненты внутри:** Checkbox, Badge (status), Pagination

```
Invoice    Status          Email              Amount  [⋮]
[ ] INV-001  ● success     alice@example.com  $250    [⋮]
[ ] INV-002  ○ processing  bob@example.com    $150    [⋮]
[ ] INV-003  ✕ failed      carol@example.com  $350    [⋮]

[Previous]  1  [Next]
```

**Acceptance Criteria:**
- [ ] Checkbox в каждой строке (select row)
- [ ] Status badge: success (green), processing (blue/muted), failed (red/destructive), pending (yellow)
- [ ] Actions dropdown (⋮) с опциями
- [ ] Pagination Previous/Next с `--border`
- [ ] Row hover state

---

---

# БЛОК D — DASHBOARD TAB (P2)

---

## D1. Dashboard Layout

**Приоритет:** P2
**Новый файл:** секция в `ComponentGallery.tsx` → case 'dashboard'

### Layout structure

```
[Sidebar] | [Main content]
```

**Sidebar (240px, bg: --sidebar-background):**
- Лого / Brand name (h-12 border-b)
- Primary action button (full-width)
- Nav items: Dashboard (active), Analytics, Projects, Team
- Separator
- Secondary nav: Settings, Help
- Bottom: Search + User avatar

**Main content:**
- Header: "Documents" + action button
- 3 Metric cards (inline): Total Revenue (+12.5%), New Customers (-20%), Active Accounts
- Area/Line chart placeholder (date range Jun → Jun, uses chart tokens)

### Acceptance Criteria — Sidebar

- [ ] Background: `--sidebar-background`
- [ ] Text: `--sidebar-foreground`
- [ ] Active nav item: `bg-[hsl(var(--sidebar-accent))] text-[hsl(var(--sidebar-accent-foreground))]`
- [ ] Nav item hover: `bg-[hsl(var(--sidebar-accent)/0.5)]`
- [ ] Separator: `--sidebar-border`
- [ ] Primary button: `bg-[hsl(var(--sidebar-primary))]`
- [ ] Sidebar border-right: `--sidebar-border`

### Acceptance Criteria — Metric Cards

- [ ] 3 карточки в ряд
- [ ] Large number (2xl) + label + trend badge (green ▲ / red ▼)
- [ ] Использует `--card` background

### Acceptance Criteria — Chart Area

- [ ] Placeholder bar/area chart с осями
- [ ] Bars/line используют `--chart-1`
- [ ] Grid lines используют `--border`
- [ ] Background: `--card`

---

---

# БЛОК E — TOOLBAR / UX FEATURES

---

## E1. Undo / Redo

**Приоритет:** P2
**Файлы:** `src/components/shell/AppShell.tsx`, state management

State history через Zustand + zundo (уже в плане, `src/types/product-spec.ts`).

**Acceptance Criteria:**
- [ ] Undo кнопка (← иконка) в toolbar
- [ ] Redo кнопка (→ иконка) в toolbar
- [ ] Undo disabled если нет истории
- [ ] Redo disabled если нет forward истории
- [ ] Каждое изменение токена = один history entry
- [ ] Ctrl+Z / Cmd+Z работает как Undo
- [ ] Ctrl+Shift+Z / Cmd+Shift+Z работает как Redo

---

## E2. Reset Token

**Приоритет:** P2
**Файлы:** `src/components/tokens/TokenEditor.tsx`

**Acceptance Criteria:**
- [ ] Каждый токен имеет маленькую кнопку "×" (reset)
- [ ] Клик сбрасывает только этот токен к значению пресета
- [ ] Кнопка видна только при hover на строку токена (или если есть override)
- [ ] Кнопка "Reset all" в header группы сбрасывает всю группу

---

## E3. Import CSS Vars

**Приоритет:** P2
**Файлы:** `src/components/shell/AppShell.tsx`

Модал "Import Theme" — textarea для вставки CSS `:root { --var: value }`.

**Acceptance Criteria:**
- [ ] Кнопка Import в toolbar открывает модал
- [ ] Textarea принимает CSS в формате `:root { --background: 0 0% 100%; }`
- [ ] Парсинг HSL bare strings и hex
- [ ] После применения preview обновляется
- [ ] Ошибочные/неизвестные переменные игнорируются (no crash)

---

## E4. Search по токенам

**Приоритет:** P2
**Файлы:** `src/components/tokens/TokenEditor.tsx`

**Acceptance Criteria:**
- [ ] Input "Search colors..." в верхней части Token Editor
- [ ] Фильтрует группы/токены по имени в реальном времени
- [ ] При пустом поиске — все группы раскрыты

---

## E5. Fullscreen Preview

**Приоритет:** P2

**Acceptance Criteria:**
- [ ] Кнопка Fullscreen в правом верхнем углу preview panel
- [ ] Разворачивает preview на весь viewport (AppShell sidebar скрывается)
- [ ] ESC или кнопка выхода возвращает обычный layout

---

---

# БЛОК F — EXPORT IMPROVEMENTS

---

## F1. Цветовые форматы в Export

**Приоритет:** P1
**Файлы:** `src/components/export/ExportModal.tsx`, `src/lib/themes/css-export.ts`
**Референс:** tweakcn предлагает hex / rgb / hsl / oklch

**Acceptance Criteria:**
- [ ] Dropdown для выбора формата: HSL (default) | HEX | OKLCH
- [ ] HSL: `--background: 0 0% 100%;`
- [ ] HEX: `--background: #ffffff;`
- [ ] OKLCH: `--background: oklch(1 0 0);`
- [ ] Выбор формата применяется ко всем токенам во всех табах
- [ ] OKLCH конвертация через `oklch-engine.ts` (уже есть)

---

## F2. layout.tsx Export (Next.js fonts)

**Приоритет:** P2
**Файлы:** `src/components/export/ExportModal.tsx`

Новый файловый таб "layout.tsx" — показывает Next.js код для подключения Google Fonts.

**Acceptance Criteria:**
- [ ] Новый таб `layout.tsx` в Export модале
- [ ] Генерирует import из `next/font/google` для heading/body/mono шрифтов пресета
- [ ] Copy кнопка работает

---

---

# БЛОК G — PRESETS

---

## G1. Search по пресетам

**Приоритет:** P2
**Файлы:** `src/components/presets/PresetGrid.tsx`

**Acceptance Criteria:**
- [ ] Input "Search presets..." над гридом
- [ ] Фильтрует по name и vibe tags
- [ ] При пустом поиске — все пресеты

---

## G2. Random Preset

**Приоритет:** P2

**Acceptance Criteria:**
- [ ] Кнопка 🎲 в toolbar (или над preset grid)
- [ ] Выбирает случайный пресет отличный от текущего
- [ ] URL обновляется

---

---

# СВОДНАЯ ТАБЛИЦА ПРОГРЕССА

Обновлять после каждой реализованной фичи.

| Блок | Фича | Приоритет | Статус |
|------|------|-----------|--------|
| A1 | Font injection в preview | P0 | ❌ |
| A2 | Shadow styles в preview | P0 | ✅ ALE-737 |
| A3 | Token Editor: BASE group | P1 | ✅ ALE-737 |
| A3 | Token Editor: PRIMARY foreground | P1 | ✅ ALE-737 |
| A3 | Token Editor: SECONDARY foreground | P1 | ✅ ALE-737 |
| A3 | Token Editor: ACCENT foreground | P1 | ✅ ALE-737 |
| A3 | Token Editor: MUTED group | P1 | ✅ ALE-737 |
| A3 | Token Editor: DESTRUCTIVE group | P1 | ✅ ALE-737 |
| A3 | Token Editor: BORDER & INPUT group | P1 | ✅ ALE-737 |
| A3 | Token Editor: CARD group | P1 | ✅ ALE-737 |
| A3 | Token Editor: CHART group | P1 | ✅ ALE-737 |
| A3 | Token Editor: SIDEBAR group | P1 | ✅ ALE-737 |
| A4 | Typography controls | P1 | ✅ (был, проверен) |
| B1 | Hover/Focus states (Button + Input + Table) | P0 | ❌ |
| B2 | Checkbox | P1 | ✅ ALE-737 |
| B3 | Switch / Toggle | P1 | ✅ ALE-737 |
| B4 | Radio Button | P1 | ✅ ALE-737 |
| B5 | Select / Combobox | P1 | ✅ ALE-737 |
| B6 | Progress Bar | P1 | ✅ ALE-737 |
| B7 | Slider | P2 | ❌ |
| B8 | Tabs Component | P1 | ✅ ALE-737 |
| B9 | Avatar | P1 | ✅ ALE-737 |
| B10 | Separator | P1 | ✅ ALE-737 |
| B11 | Badge расширение (success/warning/destructive) | P1 | ✅ ALE-737 |
| C1 | Cards: Payment Form Card | P2 | ❌ |
| C2 | Cards: Team Members Card | P2 | ✅ ALE-737 |
| C3 | Cards: Cookie Settings Card | P2 | ✅ ALE-737 |
| C4 | Cards: Payments Table Card | P2 | ❌ |
| D1 | Dashboard Tab | P2 | ❌ |
| E1 | Undo / Redo | P2 | ❌ |
| E2 | Reset per-token | P2 | ❌ |
| E3 | Import CSS Vars | P2 | ❌ |
| E4 | Search по токенам | P2 | ❌ |
| E5 | Fullscreen Preview | P2 | ❌ |
| F1 | Export: цветовые форматы (hex/oklch) | P1 | ✅ ALE-737 |
| F2 | Export: layout.tsx (Google Fonts) | P2 | ❌ |
| G1 | Search по пресетам | P2 | ❌ |
| G2 | Random Preset | P2 | ❌ |

**P0 remaining (2):** A1 (font injection), B1 (hover/focus states)
**P1 remaining (0):** все P1 закрыты в ALE-737
**P2 remaining (9):** C1, C4, D1, E1–E5, F2, G1, G2

---

## Правила работы с этим документом

1. **Перед реализацией** — найти секцию, прочитать Acceptance Criteria полностью
2. **После реализации** — отметить `[ ] → [x]` в секции + обновить сводную таблицу `❌ → ✅`
3. **При сомнении** — сверяться с этим файлом, не идти на tweakcn
4. **Новое требование** — добавить секцию по тому же шаблону + строку в сводную таблицу
5. **В новой сессии** — читать сводную таблицу первой, она покажет что сделано
