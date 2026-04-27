# Component Spec: Combobox

---

## Usage Guidelines

### When to use this component

- Use when: selecting from 5+ options where filtering/search is helpful
- Use when: the option set is large enough that a dropdown list is not scannable at a glance
- Do NOT use when: fewer than 5 options — use RadioGroup or Select instead
- Do NOT use when: binary choice (on/off) — use Switch or Checkbox

### Variant decision tree

```
Need a selection control?
├── 2 options (on/off) → Switch or Checkbox
├── 3–4 options, all visible → RadioGroup
├── 5–10 options, no filtering needed → Select (button-trigger, ARIA 1.1)
└── 5+ options with search/filter → Combobox (editable input, ARIA 1.2)
```

### Common patterns

```tsx
// Uncontrolled (basic)
<Combobox placeholder="Search framework…" aria-label="Search framework">
  <ComboboxContent>
    <ComboboxItem value="react">React</ComboboxItem>
    <ComboboxItem value="vue">Vue</ComboboxItem>
    <ComboboxEmpty />
  </ComboboxContent>
</Combobox>

// Controlled with label
<ComboboxField id="country" label="Country" value={val} onValueChange={setVal}>
  <ComboboxItem value="us">United States</ComboboxItem>
  <ComboboxEmpty />
</ComboboxField>
```

### Anti-patterns

- Never use Combobox for binary choices — use Switch
- Never omit `aria-label` or `label` — every combobox must have an accessible name

---

## Identity

- **Component name:** Combobox
- **File:** `src/components/ui/combobox.tsx`
- **ARIA APG pattern:** https://www.w3.org/WAI/ARIA/apg/patterns/combobox/
- **Ticket:** ALE-831

---

## ARIA / Keyboard

### Attributes

| Attribute | Element | Value |
|-----------|---------|-------|
| `role="combobox"` | `<input>` | static |
| `aria-expanded` | `<input>` | `"true"` when open |
| `aria-controls` | `<input>` | listbox ID (always set) |
| `aria-autocomplete` | `<input>` | `"list"` |
| `aria-activedescendant` | `<input>` | active option ID |
| `role="listbox"` | `<ul>` | portal to body |
| `role="option"` | `<li>` | each item |

### Keyboard matrix

| Key | Closed | Open |
|-----|--------|------|
| ArrowDown | Open + focus first | Move to next option |
| ArrowUp | — | Move to prev; close if at top |
| Home | — | Jump to first option |
| End | — | Jump to last option |
| Enter | — | Select active option, close |
| Escape | — | Close, revert input |
| Tab | Natural tab | Natural tab out |
| Type | Open + filter | Filter options |

### Focus management

- DOM focus stays on input at all times (`aria-activedescendant` pattern)
- `onMouseDown={(e) => e.preventDefault()}` on options prevents blur-before-click
- Portal to `document.body` for z-index isolation
- Listbox unmounts on close (conditional render, not visibility:hidden)

---

## Token Compliance

- No raw hex colors
- No `h-3.5` (14px) — 4px scale only
- No mentions of Radix/shadcn in UI/props/comments

---

## Test Plan (Gate 20)

11 Playwright assertions:
1. All 5 tabs render (Overview/API/Usage/Code/States)
2. Tab switching swaps content
3. Shiki syntax highlighting in Code tab
4. Do/Don't cards in Usage tab
5. `aria-orientation=horizontal` on tablist
6. Active tab `aria-selected=true`
7. ARIA attrs: `role=combobox`, `aria-expanded=false`, `aria-autocomplete=list`, `aria-controls` set
8. Click opens listbox; click outside closes
9. ArrowDown from closed → opens listbox
10. Escape closes, focus stays on input
11. Enter selects active option, listbox closes, input shows label

---

## Retrospective

**iterations_to_done:** 3

**Root cause of extra iterations:**
- Designer subagent hallucinated file writes — both `combobox.tsx` and `ComboboxDocs.tsx` appeared to be created but were never on disk. Context compaction caused the context to show them as created but they were lost.
- Implementation bugs: `Combobox` root didn't render `ComboboxInputField` (Basic demo had no input), `aria-controls` conditional (null when closed), Enter key handler didn't close listbox, `useEffect` overwrote label with value after selection.

**HITL gate prediction:** ≤4 iterations — actual: 3. Within target.

**New error log entry:** E-015 — Subagent writes that only exist in conversation context (not on disk) are lost on context compaction. Verify with `wc -l` after every Write tool call in subagent prompts.
