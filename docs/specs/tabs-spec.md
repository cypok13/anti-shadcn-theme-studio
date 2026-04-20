# Component Spec: Tabs

---

## Usage Guidelines

### When to use this component

- Use when: переключение между несколькими связанными панелями контента без перехода на новую страницу — sub-tabs внутри секций Preview page (Variants/Sizes/States)
- Do NOT use when: нужна навигация между страницами → используй `<Link>`; меньше 2 вариантов → используй Switch или Toggle; контент должен быть виден одновременно → используй Accordion или Stack

### Variant decision tree

```
Какой визуальный стиль?
├── Sub-tabs внутри секции (компактный) → variant="default" (pill/contained)
└── Page-level navigation (с весом) → variant="line" (underline)
```

### Common patterns

```tsx
// Sub-tabs в preview секции
<Tabs defaultValue="variants">
  <TabsList>
    <TabsTrigger value="variants">Variants</TabsTrigger>
    <TabsTrigger value="sizes">Sizes</TabsTrigger>
    <TabsTrigger value="states">States</TabsTrigger>
  </TabsList>
  <TabsContent value="variants">...</TabsContent>
  <TabsContent value="sizes">...</TabsContent>
  <TabsContent value="states">...</TabsContent>
</Tabs>

// Controlled
<Tabs value={activeTab} onValueChange={setActiveTab}>...</Tabs>

// With disabled tab
<TabsTrigger value="preview" disabled>Preview</TabsTrigger>
```

### Anti-patterns

- DO NOT use single tab — minimum 2
- DO NOT put tabs inside tabs (nested tablist is ARIA violation)
- DO NOT use `forceMount` by default — breaks aria-hidden semantics on inactive panels

---

## Identity

- **Component name:** Tabs
- **File:** `src/components/ui/tabs.tsx`
- **ARIA APG pattern:** https://www.w3.org/WAI/ARIA/apg/patterns/tabs/
- **Reference:** [Radix UI Tabs](https://www.radix-ui.com/primitives/docs/components/tabs), [shadcn v4 new-york tabs](https://github.com/shadcn-ui/ui/blob/main/apps/v4/registry/new-york-v4/ui/tabs.tsx)
- **Ticket:** ALE-774

---

## Industry Parity Check

| Feature / Prop | Material 3 | Carbon | Spectrum | Fluent 2 | Atlassian | shadcn v4 | **Include?** | Reason if excluded |
|----------------|-----------|--------|----------|----------|-----------|-----------|-------------|-------------------|
| `orientation` h/v | yes | yes | yes | yes | — | yes | YES | Present in 5/6 |
| `disabled` on Trigger | yes | yes | yes | yes | yes | yes | YES | Present in 6/6 |
| Arrow key navigation | yes | yes | yes | yes | yes | yes (Radix) | YES | ARIA requirement |
| `defaultValue` (uncontrolled) | yes | yes | yes | yes | yes | yes | YES | Present in 5/6 |
| `value` + `onValueChange` (controlled) | yes | yes | yes | yes | yes | yes | YES | Present in 6/6 |
| `activationMode` manual/automatic | yes | yes | yes | implicit | yes | yes (Radix) | YES | Present in 5/6 |
| Visual variants (pill vs underline) | yes | yes | — | yes | — | yes | YES | Present in 4/6 |
| Icon support in trigger | yes | yes | yes | yes | — | — | NO | Low priority for sub-tabs use case |
| Overflow / scrollable | yes | yes | yes | yes | — | — | NO | Not needed (max 4 sub-tabs) |
| `loop` on List | — | yes | yes | yes | — | yes (Radix) | YES | Arrow key wrapping |
| `forceMount` on Content | — | — | yes | — | — | yes (Radix) | OPTIONAL | For animations — not default |

**GATE:** ✅ Table complete.

---

## Variants

| Prop | Values | Default |
|------|--------|---------|
| `variant` (on TabsList) | `"default" \| "line"` | `"default"` |
| `orientation` (on Root) | `"horizontal" \| "vertical"` | `"horizontal"` |
| `activationMode` (on Root) | `"automatic" \| "manual"` | `"automatic"` |

**Exports:** `Tabs` (Root), `TabsList`, `TabsTrigger`, `TabsContent`

---

## States

| State | How implemented | CSS / data-attr |
|-------|-----------------|-----------------|
| default (inactive) | transparent bg, muted text | `data-state="inactive"`, `tabindex="-1"` |
| active | bg-background, foreground text, shadow-sm | `data-state="active"`, `tabindex="0"` |
| hover | foreground text (from 60% opacity) | `hover:text-[hsl(var(--foreground))]` |
| focus-visible | ring-[3px] brand color | `focus-visible:ring-[3px] focus-visible:ring-[hsl(var(--ring)/0.5)]` |
| disabled | opacity-50, pointer-events-none | `data-disabled`, `disabled` attr |
| loading | N/A — content is pre-loaded | — |
| selected/active | see "active" above | `aria-selected="true"` |

---

## Interaction Zones

- **Clickable area:** entire TabsTrigger button
- **Trigger:** click or ArrowLeft/ArrowRight (automatic mode: activates immediately)
- **Tab key:** from active trigger → jumps INTO tabpanel (skips inactive triggers via roving tabindex)
- **Enter/Space:** activates focused tab in manual mode only
- **Escape:** N/A (tabs don't close)
- **Arrow keys:** Left/Right for horizontal, Up/Down for vertical. Home → first tab, End → last tab. Wraps (`loop={true}`)

---

## Visual Design

### TabsList

| Property | Value | Token / Tailwind class |
|----------|-------|------------------------|
| Height | 36px | `h-9` (`--sizing-sm`) |
| Background | muted | `bg-[hsl(var(--muted))]` |
| Border radius | 8px | `rounded-lg` |
| Padding | 3px | `p-[3px]` (accepted exception from 4px scale) |
| Layout | inline-flex | `inline-flex items-center` |

### TabsTrigger

| Property | Active | Inactive | Token / class |
|----------|--------|----------|---------------|
| Height | `calc(100%-1px)` ≈ 34px | same | `h-[calc(100%-1px)]` |
| Padding H | 8px | 8px | `px-2` |
| Padding V | 4px | 4px | `py-1` |
| Font size | 14px | 14px | `text-sm` |
| Font weight | 500 | 500 | `font-medium` |
| Background | `--background` | transparent | `data-[state=active]:bg-[hsl(var(--background))]` |
| Text | `--foreground` | `--foreground` 60% | `data-[state=active]:text-[hsl(var(--foreground))]` |
| Border radius | 6px | 6px | `rounded-md` |
| Shadow | `shadow-sm` | none | `data-[state=active]:shadow-sm` |
| Border | transparent | transparent | `border border-transparent` |

### Anti-patterns (visual)

- DO NOT remove `border border-transparent` from inactive — causes layout shift when border appears on active
- DO NOT set height to `h-full` — use `h-[calc(100%-1px)]` to leave 1px gap for visual shadow
- DO NOT use `py-0.5` or `py-0` — minimum vertical padding is 4px (`py-1`)

---

## Token Compliance

| CSS property | Token used |
|-------------|-----------|
| TabsList background | `hsl(var(--muted))` |
| Active trigger background | `hsl(var(--background))` |
| Active text | `hsl(var(--foreground))` |
| Inactive text | `hsl(var(--foreground) / 0.6)` |
| Focus ring | `hsl(var(--ring) / 0.5)` |
| Border | transparent |

**Hardcoded values:** NONE.

---

## ARIA

- **role:** `tablist` on List, `tab` on each Trigger, `tabpanel` on each Content — set by Radix automatically
- **aria-selected:** `"true"` on active tab, `"false"` on all others — Radix
- **aria-controls:** each `tab` → ID of its `tabpanel` — Radix
- **aria-labelledby:** each `tabpanel` → ID of its `tab` — Radix
- **aria-orientation:** `"horizontal"` (implicit default) or `"vertical"` — Radix
- **tabindex:** `0` on active trigger, `-1` on inactive (roving tabindex) — Radix
- **aria-disabled:** on disabled triggers — Radix
- **aria-hidden on decorative icons:** yes — `[&_svg]:pointer-events-none`

---

## Animation

- Enter/exit content: none by default (`data-[state=inactive]:hidden` hides inactive panels)
- Active trigger transition: `transition-all duration-150` on background/shadow
- `prefers-reduced-motion:` transition is lightweight, acceptable without explicit override

---

## Dark Mode

- [x] All tokens semantic — auto-switches via CSS injection
- [x] No hardcoded colors
- [x] Verify at `/preview?tab=components&mode=dark`

---

## Demo States (required in ComponentGallery)

| State | Label in demo | Notes |
|-------|--------------|-------|
| Default (first tab active) | "Tab 1" | Shows `variant="default"` |
| Second tab clickable | "Tab 2" | |
| Third tab disabled | "Tab 3" | `disabled` prop |

**GATE:** Все три таба должны быть видны, disabled стейт visible до Visual Gate.

---

## Test Plan

### Universal gates (уже в component-qa.spec.ts — no action needed)

- [x] No JS errors
- [x] axe-core: 0 critical violations
- [x] No inline hex colors

### Component-specific Playwright assertions

```typescript
// 1. tablist role visible
await expect(page.getByRole('tablist').first()).toBeVisible()

// 2. Active tab: aria-selected="true" + data-state="active"
const activeTab = page.locator('[role="tablist"]').first().getByRole('tab', { selected: true })
await expect(activeTab).toHaveAttribute('aria-selected', 'true')
await expect(activeTab).toHaveAttribute('data-state', 'active')

// 3. Inactive tab: aria-selected="false" + data-state="inactive"
const inactiveTabs = page.locator('[role="tablist"]').first().getByRole('tab', { selected: false })
await expect(inactiveTabs.first()).toHaveAttribute('aria-selected', 'false')
await expect(inactiveTabs.first()).toHaveAttribute('data-state', 'inactive')

// 4. Click inactive tab → becomes active
await inactiveTabs.first().click()
await page.waitForTimeout(100)
await expect(inactiveTabs.first()).toHaveAttribute('aria-selected', 'true')

// 5. tabpanel visible with content
await expect(page.getByRole('tabpanel').first()).toBeVisible()

// 6. Roving tabindex: active tab=0, inactive=-1
const firstActiveTab = page.locator('[role="tablist"]').first().getByRole('tab', { selected: true })
await expect(firstActiveTab).toHaveAttribute('tabindex', '0')

// 7. ArrowRight moves focus to next tab
await firstActiveTab.focus()
await page.keyboard.press('ArrowRight')
const allTabs = page.locator('[role="tablist"]').first().getByRole('tab')
await expect(allTabs.nth(1)).toBeFocused()

// 8. Disabled tab has data-disabled
const disabledTab = page.locator('[role="tab"][data-disabled]').first()
if (await disabledTab.count() > 0) {
  await expect(disabledTab).toBeDisabled()
}
```

### Dark mode
- [ ] Verified at `/preview?tab=components&mode=dark`

---

## Spec Sign-off

- [x] Industry Parity Check table filled
- [x] Variants complete
- [x] All states addressed
- [x] Visual Design section with token-based values
- [x] All CSS → tokens
- [x] ARIA specified
- [x] Test plan written

**Spec complete:** YES
