---
ticket_id: ALE-721
ticket_url: https://linear.app/alexander53/issue/ALE-721
branch: cypok13/ale-721-theme-studio-replace-native-color-input-with-oklch-picker
allowed_paths: []
out_of_scope:
  - Phase 2 (structural mutation, postMessage sync beyond basic)
  - OKLCH gamut clipping UI
  - Color palette generation
created_at: "2026-04-30"
updated_at: "2026-04-30"
---

## Spec Summary

Replace the native `<input type="color">` (sRGB only) in the token editor with a proper OKLCH picker: L/C/H range sliders + hex text input + contrast ratio display. The `oklch-engine.ts` already exists from Day 4 spike. This is the #1 product promise — the current state makes OKLCH editing impossible.

## Acceptance Criteria

### AC-1: OKLCH sliders
- Given a token color swatch in the editor
- When the user opens the picker
- Then L (0–1), C (0–0.4), H (0–360) sliders are shown

### AC-2: Hex input
- Given the OKLCH picker is open
- When the user types a hex value
- Then the sliders update to reflect the color

### AC-3: Contrast ratio
- Given a color is selected
- When displayed in the picker
- Then contrast ratio is shown as number e.g. "4.7:1 AA"

### AC-4: Touch target
- Given the picker controls
- When measured
- Then all interactive targets are ≥ 44×44px (WCAG 2.5.5)

### AC-5: Live preview sync
- Given the picker is open
- When the user adjusts sliders
- Then the live preview updates in real time

## Notes
