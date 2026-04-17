# Component Spec: [ComponentName]

> Fill this out COMPLETELY before writing any implementation code.
> Empty sections = incomplete spec = blocked implementation.
> Source: ARIA APG pattern → reference library → Figma/design.

---

## Identity

- **Component name:**
- **File:** `src/components/ui/[name].tsx`
- **ARIA APG pattern:** https://www.w3.org/WAI/ARIA/apg/patterns/[pattern]/
- **Reference:** (MUI / Radix / shadcn source links)
- **Ticket:** ALE-XXX

---

## Variants (exhaustive — no "etc.")

| Prop | Values | Default |
|------|--------|---------|
| `variant` | | |
| `size` | | |

---

## States (ALL required — write "N/A — reason" if not applicable)

| State | How implemented | CSS / data-attr |
|-------|-----------------|-----------------|
| default | | |
| hover | cursor:pointer? bg change? | |
| focus-visible | ring-2 | |
| active (mousedown) | scale / opacity | |
| disabled | cursor:not-allowed, opacity | |
| loading | spinner / skeleton | |
| error | error color, aria-invalid | |
| selected/checked | data-state="checked" | |

---

## Interaction Zones

- **Clickable area:** (exact element — e.g. "entire label row, not just control")
- **Trigger:** (what click/keypress does)
- **Tab:** (what receives focus)
- **Enter/Space:** (what activates)
- **Escape:** (what closes, if applicable)
- **Arrow keys:** (if navigable list)

---

## Token Compliance (NO hardcoded values)

| CSS property | Token used |
|-------------|-----------|
| background | `var(--background-primary)` |
| text | `var(--text-primary)` |
| border | `var(--border-primary)` |
| ring | `var(--brand-primary)` |

**Hardcoded values:** NONE. Any hardcoded value = spec incomplete.

---

## ARIA

- **role:**
- **aria-live:** (assertive/polite/off — if dynamic)
- **aria-label / aria-labelledby:**
- **aria-disabled:**
- **aria-hidden on decorative icons:** yes

---

## Animation

- Enter: (e.g. fade-in 150ms ease-out)
- Exit: (e.g. fade-out 100ms ease-in)
- State change: (transition 200ms)
- `prefers-reduced-motion:` handled via `motion-safe:` prefix

---

## Dark Mode

- [ ] All tokens semantic (auto-switch via [data-theme="dark"])
- [ ] No hardcoded colors

---

## Test Plan (written BEFORE implementation)

- [ ] All variants render without errors
- [ ] `cursor:pointer` on interactive elements — Playwright
- [ ] `cursor:not-allowed` on disabled — Playwright
- [ ] No `style` with hex color — Playwright
- [ ] Full-row click zone — Playwright
- [ ] axe-core: 0 critical violations
- [ ] Keyboard: Tab → focus visible, Enter/Space → action
- [ ] Dark mode renders correctly
- [ ] `npm run lint:ui` passes

---

## Spec Sign-off

- [ ] Variants complete
- [ ] All states addressed
- [ ] All CSS → tokens
- [ ] ARIA specified
- [ ] Test plan written

**Spec complete:** YES / NO

> Implementation starts only when "Spec complete: YES"
