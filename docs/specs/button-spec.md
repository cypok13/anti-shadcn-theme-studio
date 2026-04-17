# Component Spec: Button

> Fill this out COMPLETELY before writing any implementation code.
> Source: ARIA APG → shadcn/ui → Radix UI

---

## Identity

- **Component name:** Button
- **File:** `src/components/ui/button.tsx`
- **ARIA APG pattern:** https://www.w3.org/WAI/ARIA/apg/patterns/button/
- **Reference:** https://ui.shadcn.com/docs/components/button · https://github.com/shadcn-ui/ui/blob/main/apps/www/registry/new-york/ui/button.tsx
- **Ticket:** ALE-751

---

## Variants (exhaustive)

| Prop | Values | Default |
|------|--------|---------|
| `variant` | `default` \| `secondary` \| `outline` \| `ghost` \| `destructive` \| `link` | `default` |
| `size` | `sm` \| `default` \| `lg` \| `icon` | `default` |
| `asChild` | `boolean` | `false` |
| `isLoading` | `boolean` | `false` |

**Notes:**
- `icon` size = квадратная кнопка 40×40px для icon-only
- `link` variant = underline текст, семантически `<button>` (не `<a>`)
- `asChild` = рендерит дочерний элемент (напр. `<Link>`) с пропсами кнопки

---

## States (ALL required)

| State | How implemented | CSS / attr |
|-------|-----------------|------------|
| default | base styles | — |
| hover | `enabled:hover:opacity-90` (primary/secondary/destructive); специфичные hover для outline/ghost/link | `cursor: pointer` |
| focus-visible | ring 2px offset 2px | `focus-visible:ring-2 ring-[hsl(var(--ring))]` |
| active (mousedown) | `enabled:active:opacity-80 enabled:active:scale-[0.98]` | `motion-safe:` prefix |
| disabled (native) | `disabled` attr — убирает из tab order; используется для submit кнопок | `cursor: not-allowed; opacity: 0.5` |
| aria-disabled | `aria-disabled="true"` — остаётся в tab order; для contextually disabled | `cursor: not-allowed; opacity: 0.5` |
| loading | `isLoading` prop → spinner + `aria-label="Loading"` + `aria-disabled` | spinner `aria-hidden="true"` |
| error | N/A — Button не валидирует, error state — задача родителя | — |
| selected/checked | N/A — для toggle используй `aria-pressed` prop (вне scope ALE-751) | — |

---

## Interaction Zones

- **Clickable area:** весь `<button>` элемент, включая padding
- **Trigger:** любой клик мышью / тач
- **Tab:** кнопка принимает фокус (tabindex по умолчанию для `<button>`)
- **Enter / Space:** активирует кнопку (нативное поведение `<button>`)
- **Escape:** N/A — кнопка не закрывает overlay сама
- **Minimum target:** 24×24px (WCAG 2.5.8 AA) — icon size = 40px ✓, sm = 36px высота ✓

---

## Token Compliance (NO hardcoded values)

| CSS property | Token |
|-------------|-------|
| primary bg | `var(--primary)` |
| primary fg | `var(--primary-foreground)` |
| secondary bg | `var(--secondary)` |
| secondary fg | `var(--secondary-foreground)` |
| outline border | `var(--border)` |
| outline hover bg | `var(--primary)` |
| ghost hover bg | `var(--accent)` |
| ghost hover fg | `var(--accent-foreground)` |
| destructive bg | `var(--destructive)` |
| destructive fg | `var(--destructive-foreground)` |
| focus ring | `var(--ring)` |
| focus ring offset bg | `var(--background)` |
| link fg | `var(--primary)` |

**Hardcoded values:** NONE.

---

## ARIA

- **role:** нативный `<button>` — role implicit
- **type:** `"button"` по умолчанию (предотвращает случайный form submit)
- **aria-disabled:** `"true"` когда кнопка contextually недоступна (остаётся в tab order)
- **disabled attr:** только для submit кнопок или форм (убирает из tab order)
- **aria-label:** обязателен для icon-only кнопок (consumer responsibility — передаётся через props)
- **aria-hidden на иконках:** `aria-hidden="true" focusable="false"` на всех SVG внутри кнопки
- **loading:** `aria-label="Loading"` на кнопке + `aria-disabled="true"`; spinner `aria-hidden="true"`

---

## Animation

- State change: `transition-[opacity,background-color,border-color,transform] duration-150 ease-in-out`
- Active scale: `motion-safe:enabled:active:scale-[0.98]` — отключается при `prefers-reduced-motion`
- Loading spinner: `animate-spin` — отключается при `prefers-reduced-motion: reduce` через Tailwind

---

## Dark Mode

- [x] Все токены семантические (auto-switch via `[data-theme="dark"]`)
- [x] Нет hardcoded цветов

---

## Test Plan (written BEFORE implementation)

- [x] Все 6 вариантов рендерятся без ошибок
- [x] `cursor:pointer` на enabled кнопках — Playwright Gate 1
- [x] `cursor:not-allowed` на disabled кнопках — Playwright Gate 1
- [x] No hover effect на disabled — Playwright Gate 1
- [x] No `style` с hex color — Playwright Gate 1
- [x] axe-core: 0 critical violations — Playwright Gate 1
- [x] Клик меняет state (Gate 2 smoke tests)
- [x] `npm run lint:ui` passes

---

## Spec Sign-off

- [x] Variants complete
- [x] All states addressed
- [x] All CSS → tokens
- [x] ARIA specified
- [x] Test plan written

**Spec complete:** YES
