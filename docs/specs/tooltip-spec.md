# Component Spec: Tooltip

---

## Usage Guidelines

### When to use

- Use when: supplementary description needed for an icon button, truncated text, or ambiguous control
- Use when: text is non-interactive — pure read-only hint (no links, no buttons inside)
- Do NOT use when: content is interactive → use Popover instead
- Do NOT use when: information is critical and must always be visible → use inline label or helper text
- Do NOT use when: target is a disabled button → wrap disabled button in `<span>` with tooltip on span

### Variant decision tree

```
Need hover/focus contextual info?
├── Pure text description → Tooltip ✓
├── Contains links or buttons → Popover (separate component)
├── Status/validation message → Form error message (inline)
└── Always visible → Helper text (label)
```

### Common patterns

```tsx
// Basic — icon button with accessible label
<Tooltip>
  <TooltipTrigger asChild>
    <Button variant="ghost" size="icon" aria-label="Settings">
      <SettingsIcon className="h-4 w-4" />
    </Button>
  </TooltipTrigger>
  <TooltipContent>Settings</TooltipContent>
</Tooltip>

// With placement
<Tooltip>
  <TooltipTrigger asChild>
    <Button>Hover me</Button>
  </TooltipTrigger>
  <TooltipContent side="right">Opens to the right</TooltipContent>
</Tooltip>

// Disabled button — wrap in span
<Tooltip>
  <TooltipTrigger asChild>
    <span tabIndex={0} aria-label="Delete (unavailable)">
      <Button disabled aria-hidden="true">Delete</Button>
    </span>
  </TooltipTrigger>
  <TooltipContent>You don't have permission to delete</TooltipContent>
</Tooltip>
```

### Anti-patterns

- NEVER put interactive content (links, buttons) inside TooltipContent — use Popover
- NEVER use `aria-label` on the trigger when tooltip text IS the accessible name — use `aria-describedby` (Radix handles automatically)
- NEVER attach tooltip directly to `disabled` button — pointer events are suppressed; wrap in `<span>`
- NEVER set `disableHoverableContent={true}` globally — breaks WCAG 1.4.13 (hoverable content)
- NEVER hardcode colors — always use `var(--token)`

---

## Identity

- **Component name:** Tooltip
- **File:** `src/components/ui/tooltip.tsx`
- **ARIA APG pattern:** https://www.w3.org/WAI/ARIA/apg/patterns/tooltip/
- **Reference:** https://www.radix-ui.com/primitives/docs/components/tooltip · https://ui.shadcn.com/docs/components/tooltip
- **Ticket:** ALE-743

---

## Industry Parity Check

| Feature / Prop | Material 3 | Carbon | Spectrum | Fluent 2 | Atlassian | shadcn | **Include?** | Reason if excluded |
|----------------|:----------:|:------:|:--------:|:--------:|:---------:|:------:|:-----------:|-------------------|
| 4 placement sides (top/right/bottom/left) | partial | YES | YES | YES | YES | YES | **YES** | Universal |
| Arrow/caret | optional | YES | YES | optional | YES | NO | **YES** | 4/5 DS, improves legibility |
| Collision detection / auto-flip | — | YES | YES | YES | YES | YES | **YES** | Universal via Radix |
| Hover delay (configurable) | YES | — | YES | — | YES | via Provider | **YES** | Via TooltipProvider.delayDuration |
| Keyboard instant open (focus) | YES | — | YES | YES | YES | YES | **YES** | ARIA APG required |
| Escape dismiss | YES | — | YES | YES | YES | YES | **YES** | WCAG 1.4.13 + APG required |
| Hoverable content (cursor can enter) | — | — | — | — | — | YES | **YES** | WCAG 1.4.13 required |
| Max-width constraint | — | 208–288px | configurable | — | ~300px | YES | **YES** | Prevents unreadable wide tooltips |
| Size variants (sm/md) | NO | YES (sm/lg) | NO | NO | NO | NO | **NO** | Only 1 DS; single size sufficient |
| Semantic color variants (info/error/warning) | NO | NO | partial | NO | NO | NO | **NO** | Only Spectrum; out of scope for MVP |
| Rich tooltip (title + body) | YES | via Definition | NO | NO | NO | NO | **NO** | Only 1–2 DS; use Popover instead |

**GATE:** Parity check complete. All REQUIRED features included.

---

## Variants

| Prop | Values | Default |
|------|--------|---------|
| `side` | `"top"` \| `"right"` \| `"bottom"` \| `"left"` | `"top"` |
| `align` | `"start"` \| `"center"` \| `"end"` | `"center"` |
| `sideOffset` | `number` | `6` |
| `showArrow` | `boolean` | `true` |
| `children` | `React.ReactNode` | — |

No `variant` or `size` prop — single style, single size. Placement/alignment only.

---

## States

| State | How implemented | CSS / data-attr |
|-------|-----------------|-----------------|
| closed | default | `data-state="closed"` on Content |
| delayed-open | after hover delay | `data-state="delayed-open"` on Content |
| instant-open | on focus (keyboard) | `data-state="instant-open"` on Content |
| side resolved | Radix auto-flips | `data-side="top|right|bottom|left"` on Content |
| align resolved | Radix | `data-align="start|center|end"` on Content |

---

## Interaction Zones

- **Hover trigger:** pointer enters trigger → opens after `delayDuration` (default 500ms)
- **Focus trigger:** Tab focus on trigger → opens instantly (no delay) — required by APG
- **Close:** pointer leaves trigger and content area → closes; Escape → closes; blur → closes
- **Hover into content:** cursor can move from trigger into tooltip without it closing (`disableHoverableContent={false}`)
- **Tab:** moves through triggers only — tooltip content itself never receives focus

---

## Visual Design

### Dimensions

| Property | Value | Token / class |
|----------|-------|---------------|
| Padding | 6px × 12px | `py-1.5 px-3` |
| Max-width | 240px | `max-w-[240px]` |
| Border-radius | `var(--radius)` | `rounded-[var(--radius)]` |
| Font size | 12px | `text-xs` |
| Font weight | 500 | `font-medium` |
| Arrow size | 8×4px | `w-2 h-1` (via TooltipArrow width=8 height=4) |
| Gap trigger→content | 6px | `sideOffset={6}` |

### Border & shape

| Property | Value |
|----------|-------|
| Border | 1px `border` |
| Shadow | `shadow-md` |

---

## Token Compliance

| CSS property | Token used |
|-------------|-----------|
| Background | `var(--popover)` → `bg-[hsl(var(--popover))]` |
| Text | `var(--popover-foreground)` → `text-[hsl(var(--popover-foreground))]` |
| Border | `var(--border)` → `border-[hsl(var(--border))]` |
| Arrow fill | matches bg → `fill-[hsl(var(--popover))]` |

**Hardcoded values:** NONE.

---

## ARIA

- **role:** `tooltip` — set automatically by Radix on Content
- **aria-describedby:** set automatically by Radix on Trigger — points to tooltip id
- **Focus on tooltip:** FORBIDDEN — tooltip is never in tab order
- **Escape:** closes tooltip — Radix handles natively
- **TooltipProvider:** must wrap the entire app (or preview section) — set in layout

---

## Animation

- Enter: `data-[state=delayed-open]:animate-in data-[state=delayed-open]:fade-in-0 data-[state=delayed-open]:zoom-in-95`
- Enter (instant/focus): same classes, instant-open state
- Exit: `data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95`
- Side slide: `data-[side=bottom]:slide-in-from-top-2 data-[side=top]:slide-in-from-bottom-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2`
- Duration: 150ms / 100ms — fast enough to feel responsive
- `prefers-reduced-motion`: handled via Tailwind `motion-safe:` prefix

---

## Dark Mode

- [ ] All tokens semantic — dark mode activates via `?mode=dark` URL param (NOT CSS class toggle / NOT `data-theme`)
- [ ] No hardcoded colors
- [ ] `--popover` and `--popover-foreground` flip automatically in dark preset
- [ ] Verified at `/preview?tab=components&mode=dark`

---

## Demo States (required in ComponentGallery)

| State | Label in demo | Notes |
|-------|--------------|-------|
| Default (top) | "Default" | Plain text tooltip, button trigger |
| Right placement | "Right" | `side="right"` |
| Bottom placement | "Bottom" | `side="bottom"` |
| Left placement | "Left" | `side="left"` |
| No arrow | "No arrow" | `showArrow={false}` |
| Long text | "Long text" | Multi-word tooltip testing max-width |
| Icon button trigger | "Icon button" | Common real-world pattern |

---

## Test Plan

- [ ] No JS errors or hydration failures (Gate 0)
- [ ] No `<div>` inside `<button>` (Gate 0)
- [ ] `cursor:pointer` on trigger buttons (Gate 1)
- [ ] No inline hex in style attributes (Gate 1)
- [ ] axe-core: 0 critical violations (Gate 1)
- [ ] Hover trigger → tooltip appears (Gate 2)
- [ ] Tooltip content visible after hover (Gate 2)
- [ ] Keyboard: Tab to trigger → tooltip opens instantly (Gate 2)
- [ ] Escape closes tooltip (Gate 2)
- [ ] All 4 sides render without clipping (Visual gate)
- [ ] Arrow visible and matches bg color (Visual gate)
- [ ] Dark mode: correct colors via `?mode=dark` (Visual gate)
- [ ] `npm run lint:ui` passes
- [ ] `npm run docs:validate` passes

---

## Spec Sign-off

- [x] Industry Parity Check table filled
- [x] Variants complete
- [x] All states addressed
- [x] Visual Design filled with token-based values
- [x] All CSS → tokens
- [x] ARIA specified
- [x] Test plan written

**Spec complete:** YES
