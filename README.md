# Theme Studio

**Personality-first visual design token editor.** Pick a vibe, tune the tokens, preview in real time.

→ **[themestudio.notjustsasha.com](https://themestudio.notjustsasha.com)**

---

## The problem

Most component libraries ship with neutral defaults — and most apps end up looking identical because of it. You don't know your accent hex. You know the *feeling* you want: austere and serious, warm and editorial, brutal and unapologetic.

Theme Studio starts with personality, not pixels.

---

## How it works

1. **Pick a preset** — 10 opinionated themes, each with a distinct visual character
2. **Tune the tokens** — adjust colors, border radius, shadow, and typography
3. **Preview live** — your changes render instantly across real components
4. **Switch modes** — toggle dark/light to verify both themes hold up

---

## Presets

| Preset | Character |
|--------|-----------|
| **Zinc Violet** | Clean default with a purple accent |
| **Concrete Brutalist** | Raw structure. No apologies. |
| **Quiet Tokyo** | Stillness in complexity. |
| **Late Night Terminal** | Green on black, every night. |
| **Broadsheet** | Authority in ink. |
| **VC Pitch Deck** | Confident, scalable, clean. |
| **Garden Party** | Linen tablecloths and afternoon sun. |
| **Research Lab** | Data speaks for itself. |
| **Cassette Futurism** | Neon tape decks and analog dreams. |

Each preset ships with a coordinated color palette, typography pair, border radius, and shadow scale.

---

## Quick start

```bash
git clone https://github.com/cypok13/theme-studio.git
cd theme-studio
npm install
npm run dev
# → http://localhost:3005
```

**Requirements:** Node 20+

---

## Stack

- [Next.js 15](https://nextjs.org) App Router
- [Tailwind CSS v4](https://tailwindcss.com)
- TypeScript
- Zero backend — deploys to Vercel free tier

---

## Contributing

Presets live in `src/lib/themes/presets/`. Each preset is a single TypeScript file with colors, fonts, radius, and shadow values.

To add a preset:
1. Copy an existing preset file
2. Fill in the `ThemePreset` shape
3. Register it in `src/lib/themes/registry.ts`

PRs with new personality presets are welcome.

---

Built by [Alexander](https://notjustsasha.com)
