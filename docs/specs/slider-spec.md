# Component Spec: Slider

> Fill this out COMPLETELY before writing any implementation code.
> Source: ARIA APG → Radix UI → shadcn/ui → MUI / Carbon / Spectrum gap analysis (ALE-830 researcher report)

---

## Usage Guidelines

### When to use Slider

- Use when: user selects a **single numeric value from a continuous or discrete range** with visual feedback at the moment of change (volume, brightness, opacity, threshold).
- Use when: the spatial relationship of the value to its range matters (e.g. "near the max", "midpoint").
- Do NOT use when: the user must enter an exact precise number — use Input[type=number] instead.
- Do NOT use when: choosing between discrete labelled options (Small / Medium / Large) — use RadioGroup or Select.
- Do NOT use when: a binary on/off — use Switch.
- Do NOT use when: two endpoints needed (price range) — out of scope for v1, range slider ships separately.

### State decision tree

```
Numeric value across a continuous/discrete range, spatial feedback matters?
└── YES → Slider ✓

Need exact typed precision (e.g. tax rate 7.125%)?
└── YES → Input[type=number]

Two endpoints (min + max)?
└── NOT YET → range slider out of scope (v2)

Binary on/off?
└── YES → Switch
```

### Common patterns

```tsx
// Controlled (most common)
<Slider value={volume} onValueChange={setVolume} min={0} max={100} aria-label="Volume" />

// Uncontrolled with default
<Slider defaultValue={50} aria-label="Brightness" />

// With visible value + custom format
<Slider
  value={price}
  onValueChange={setPrice}
  min={0}
  max={500}
  step={5}
  showValue
  formatValue={(v) => `$${v}`}
  aria-label="Max price"
/>

// Async-coupled consumer (avoid spam)
<Slider
  defaultValue={50}
  onValueChange={setLocalPreview}
  onValueCommit={persistToServer}
  aria-label="Quality"
/>

// Disabled
<Slider value={70} disabled aria-label="Volume (locked)" />
```

### Anti-patterns

- Never use Slider when an exact numeric input is required — use Input[type=number].
- Never omit `aria-label` (or `aria-labelledby`) — required by APG; without it screen readers announce only "slider".
- Never use `pointer-events-none` on the track — breaks click-to-jump and cursor rendering (Error Log E-006).
- Never call an expensive consumer (network, heavy compute) directly from `onValueChange` — use `onValueCommit`.
- Never expose `step` smaller than the minimum visible pixel resolution — value drift looks broken.

---

## Identity

- **Component name:** Slider
- **File:** `src/components/ui/slider.tsx`
- **ARIA APG pattern:** https://www.w3.org/WAI/ARIA/apg/patterns/slider/
- **Reference:** https://www.radix-ui.com/primitives/docs/components/slider | https://ui.shadcn.com/docs/components/slider
- **Ticket:** ALE-830

---

## Variants

| Prop | Values | Default | Notes |
|------|--------|---------|-------|
| `size` | `"sm"` \| `"md"` | `"md"` | Track + thumb dimensions |
| `value` | `number` | `undefined` | Controlled |
| `defaultValue` | `number` | `undefined` | Uncontrolled |
| `min` | `number` | `0` | |
| `max` | `number` | `100` | |
| `step` | `number` | `1` | Must be > 0 |
| `disabled` | `boolean` | `false` | Removes from tab order, blocks pointer + keyboard |
| `aria-label` | `string` | required* | *required if no `aria-labelledby` |
| `aria-labelledby` | `string` | — | Use when label element exists in DOM |
| `label` | `string` | — | Visually-hidden helper; sets `aria-label` if no other label provided |
| `showValue` | `boolean` | `false` | Renders current value at end of track |
| `formatValue` | `(v: number) => string` | — | Formats both `showValue` text AND `aria-valuetext` |
| `onValueChange` | `(v: number) => void` | — | Fires on every increment (drag, key) |
| `onValueCommit` | `(v: number) => void` | — | Fires once on pointer-up / key-up — for expensive consumers |

No visual `variant` prop. Single style. Out of scope for v1: `range` (two thumbs), `orientation="vertical"`, `marks`/`ticks`, `dir="rtl"`.

---

## States

| State | How implemented | Token / class |
|-------|-----------------|---------------|
| default | unselected portion + selected portion + thumb | track `bg-[hsl(var(--muted))]`, range `bg-[hsl(var(--primary))]`, thumb `bg-[hsl(var(--background))] border-2 border-[hsl(var(--primary))]` |
| hover (thumb) | CSS `:hover` on thumb | thumb scales / shadow ring |
| focus-visible | keyboard Tab to thumb | `focus-visible:ring-2 focus-visible:ring-[hsl(var(--ring))] focus-visible:ring-offset-2 focus-visible:ring-offset-[hsl(var(--background))]` |
| dragging | pointer-down on thumb or track | thumb retains focus ring; cursor `grabbing` on body via `data-[dragging=true]` |
| disabled | `disabled` prop | `opacity-50 cursor-not-allowed`; thumb `tabindex="-1"`, `aria-disabled="true"`; pointer events on track ignored |
| at-min / at-max | value === min/max | no special visual — thumb sits at edge; ArrowDown at min and ArrowUp at max are no-ops |
| loading | N/A | — |
| error | N/A — validation at form wrapper level | — |

---

## Interaction Zones

- **Click on track:** thumb jumps to clicked position (snapped to step), focus moves to thumb.
- **Pointer drag on thumb:** value follows pointer (snapped to step). `pointermove` requires `setPointerCapture` to keep dragging when pointer leaves thumb.
- **Tab:** thumb is the single tab stop. Disabled slider is skipped.
- **Shift+Tab:** moves focus out.
- **ArrowRight / ArrowUp:** value += step (clamped to max).
- **ArrowLeft / ArrowDown:** value -= step (clamped to min).
- **PageUp:** value += large step (default = max(step × 10, (max − min) / 10)).
- **PageDown:** value -= large step.
- **Home:** value = min.
- **End:** value = max.
- **Touch:** track must have `touch-action: none` to prevent page scroll on drag (E-013 candidate).

---

## Visual Design

> All values on the 4px base scale. No arbitrary px. No hardcoded colors.

### Dimensions

| Size | Track height | Thumb | Tailwind |
|------|-------------|-------|----------|
| `sm` | 4px | 16px | track `h-1`, thumb `h-4 w-4` |
| `md` | 6px (allowed: 4 + 2 = 4px scale exception via `h-1.5`) | 20px | track `h-1.5`, thumb `h-5 w-5` |

> **Note:** `h-1.5` (6px) is the only sub-4px-grid token allowed in this component — Tailwind native, used in Carbon and Material 3 sliders, justified for visual proportion. All other dimensions on 4px scale.

Min interactive target: thumb 16/20px is below 44px — pointer-area is extended via padded hit zone (`before:absolute before:inset-y-[-12px]` on thumb) to reach 44px touch target without visual change. Track click-to-jump covers the rest.

### Internal proportions

| Property | Value | Class | Notes |
|----------|-------|-------|-------|
| Track horizontal padding | 0 | — | Track stretches full width of container |
| Track→value gap (when `showValue`) | 12px | `gap-3` | Value text rendered after the track |
| Thumb border width | 2px | `border-2` | Visible in all states |
| Thumb shadow on hover | none → soft ring | `hover:ring-4 hover:ring-[hsl(var(--primary)/0.15)]` | Soft ring tints; uses primary token at 15% opacity |
| Disabled opacity | 0.5 | `opacity-50` | Applied to root |

### Border & shape

| Property | Value | Token |
|----------|-------|-------|
| Track radius | full | `rounded-full` |
| Range radius | full | `rounded-full` |
| Thumb radius | full circle | `rounded-full` |
| Thumb border | 2px solid `--primary` | `border-2 border-[hsl(var(--primary))]` |

---

## Token Compliance (NO hardcoded values)

| CSS property | Token used |
|-------------|-----------|
| track bg (unfilled) | `hsl(var(--muted))` |
| range bg (filled portion) | `hsl(var(--primary))` |
| thumb bg | `hsl(var(--background))` |
| thumb border | `hsl(var(--primary))` |
| hover ring | `hsl(var(--primary) / 0.15)` |
| focus ring | `hsl(var(--ring))` |
| focus ring offset | `hsl(var(--background))` |
| value text (when `showValue`) | `hsl(var(--foreground))` font-medium tabular-nums |
| disabled opacity | `opacity-50` |

**Hardcoded values:** NONE.

---

## ARIA

- **role:** `slider` on the focusable thumb element (`<span role="slider" tabindex="0">` or `<button role="slider">`).
- **aria-label** OR **aria-labelledby:** required.
- **aria-valuemin / aria-valuemax / aria-valuenow:** numeric, mirror `min` / `max` / current value.
- **aria-valuetext:** set when `formatValue` is provided OR when raw number is insufficient (e.g. value 1 → "Quiet"). When set, screen readers announce text instead of `aria-valuenow`.
- **aria-orientation:** `"horizontal"` (default — vertical out of scope).
- **aria-disabled:** `"true"` when disabled; thumb gets `tabindex="-1"`.
- **Track:** decorative — no role, no ARIA. Pointer handler attached but invisible to AT.

---

## Animation

- Thumb position update during drag: no transition (real-time).
- Thumb position update from keyboard: `transition-transform duration-100`.
- Range fill width: same as thumb (instant during drag, animated on key).
- Hover ring: `transition-shadow duration-150`.
- Focus ring: `transition-shadow duration-150`.
- Honor `prefers-reduced-motion`: disable all transitions via `motion-safe:` prefix.

---

## Dark Mode

- [x] All tokens semantic (auto-switch via CSS vars)
- [x] No hardcoded colors
- [x] Hover ring uses `--primary` at 15% opacity (works on both modes — primary readjusts)

---

## Demo States (required in ComponentGallery — written BEFORE implementation)

| State | Label in demo | Notes |
|-------|--------------|-------|
| Default md | "Volume" — defaultValue 50, min 0, max 100, step 1 | Interactive |
| With value + format | "Max price" — defaultValue 100, max 500, step 5, `showValue`, `formatValue={v => $${v}}` | Interactive |
| At min | "Brightness" — value=0, min=0, max=100 | Edge state |
| At max | "Quality" — value=100, min=0, max=100 | Edge state |
| Disabled | "Volume (locked)" — value=70, disabled | Non-interactive, 50% opacity |
| Size sm | "Compact opacity" — defaultValue 80, sm size | Interactive |

> **GATE:** ComponentGallery / SliderSection must render all 6 demo sliders before Visual Gate.

---

## Test Plan (written BEFORE implementation)

### Gate 0 — Runtime integrity

- [ ] Slider renders without JS errors
- [ ] No hydration warnings
- [ ] No `<div>` inside `<button>` (E-002)

### Gate 1 — Token + a11y

- [ ] No inline hex in component (lint:ui)
- [ ] axe-core: 0 critical violations
- [ ] `cursor: grab` on thumb (default), `cursor: grabbing` while dragging
- [ ] `cursor: not-allowed` on disabled root

### Gate 2 — Real state changes

- [ ] Click on track at 75% → thumb moves there AND `document.activeElement` is the thumb
- [ ] `aria-valuenow` updates after pointer drag
- [ ] Disabled: click on track does NOT change `aria-valuenow`

### Gate 3 — Keyboard

- [ ] Tab focuses thumb (single tab stop)
- [ ] ArrowRight / ArrowUp: `aria-valuenow` += step (clamped at max)
- [ ] ArrowLeft / ArrowDown: `aria-valuenow` −= step (clamped at min)
- [ ] PageUp / PageDown: large step
- [ ] Home: `aria-valuenow == aria-valuemin`
- [ ] End: `aria-valuenow == aria-valuemax`
- [ ] Disabled slider: Tab skips it

### Gate 19 — Slider Preview Block (5-tab ComponentSection)

- [ ] preview-block: all 5 tabs rendered (Overview / API / Usage / Code / States)
- [ ] preview-block: clicking each tab swaps content (tab switching works)
- [ ] preview-block: shiki syntax highlighting loads in Code tab (≥5 `.shiki` token spans)
- [ ] preview-block: ≥1 `✓ Do` and ≥1 `✕ Don't` cards in Usage tab
- [ ] preview-block: tablist exists with role=tablist + aria-orientation=horizontal
- [ ] preview-block: active tab has aria-selected=true; only active is in tab order
- [ ] slider: Overview tab shows live slider with `role="slider"` + valuemin/max/now
- [ ] slider: ArrowRight increments aria-valuenow by step
- [ ] slider: Home → aria-valuemin, End → aria-valuemax
- [ ] slider: disabled slider in States tab — click + ArrowRight do NOT change aria-valuenow

---

## Spec Sign-off

- [x] Variants complete
- [x] All states addressed (N/A cases documented)
- [x] Visual Design filled with token-based values (no arbitrary px outside justified `h-1.5`)
- [x] All CSS → tokens
- [x] ARIA specified
- [x] Demo states listed
- [x] Test plan written

**Spec complete:** YES

---

## Retrospective

- `iterations_to_done`: **2**
- Root cause iter 2: focus-stealing — `handleTrackPointerDown` and `handleThumbPointerDown` did not call `e.preventDefault()` before explicit `thumb.focus()`. Browser's native focus-on-pointerdown algorithm then walked up to the surrounding `tabpanel[tabIndex=0]` ancestor and overrode the explicit focus. Single-line fix in both pointer handlers.
- New error code: **E-013** — pointer-down handlers that call `element.focus()` MUST also call `e.preventDefault()` first when the element lives inside any focusable ancestor (tabpanel, dialog, etc.). Otherwise native focus-on-pointerdown walks up the tree and overrides explicit focus. Affects every component with internal focus management nested in a tabpanel — pre-emptively audit Switch / RadioGroup / Tabs / Combobox.
- Automation ticket: not needed (single-line preventDefault fix; covered now via Gate 19 `track click → thumb focused` assertion). E-013 added to Error Log.
- Pipeline v2 mirror pattern: validated 4× in a row (Checkbox → Switch → Radio → Slider, all ≤2 iterations).
- Non-blocking from ux-reviewer (filed for follow-up): phantom vertical scrollbar in Overview card from `overflow-x-auto` implicit y-scroll (3px overflow); affects Radio Preview Block too — 1-line shared fix.
