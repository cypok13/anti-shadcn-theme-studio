# Anti-shadcn Theme Studio

**Personality-first shadcn/ui theme generator.** Start with a vibe, ship a theme.

→ **[theme-studio-beta.vercel.app](https://theme-studio-beta.vercel.app)**

---

## The problem

shadcn/ui is everywhere — 111K stars, 300K+ sites. And they all look the same.

Every hex-editor theme tool asks you to pick colors first. That's backwards. You don't know your accent hex — you know the *feeling* you want. Austere and serious? Warm and editorial? Brutal and unapologetic?

Anti-shadcn Theme Studio starts with personality, not pixels.

---

## How it works

1. **Pick a personality** — 8 opinionated presets, each with a distinct character
2. **Tune the tokens** — adjust primary/secondary/accent colors and border radius
3. **Preview in context** — components, cards, and typography rendered live
4. **Export** — CSS variables, shadcn CLI command, or AI rules for your editor

No backend. No sign-up. Your URL encodes your theme state completely.

---

## Presets

| Preset | Tagline |
|--------|---------|
| **Concrete Brutalist** | Raw structure. No apologies. |
| **Quiet Tokyo** | Stillness in complexity. |
| **Late Night Terminal** | Green on black, every night. |
| **Broadsheet** | Authority in ink. |
| **VC Pitch Deck** | Confident, scalable, clean. |
| **Garden Party** | Linen tablecloths and afternoon sun. |
| **Research Lab** | Data speaks for itself. |
| **Cassette Futurism** | Neon tape decks and analog dreams. |

Each preset ships with colors, fonts, border-radius, and an AI personality block.

---

## Export formats

**CSS Variables (v3 / v4)** — drop into your `globals.css`

**shadcn CLI** — one command to bootstrap a new project with your theme

**CLAUDE.md** — system prompt for Claude Code with color palette + design tone

**.cursorrules** — same for Cursor AI, with do/don't component guidelines

---

## Quick start

```bash
# Clone and run locally
git clone https://github.com/cypok13/anti-shadcn-theme-studio.git
cd anti-shadcn-theme-studio
npm install
npm run dev
# → http://localhost:3005
```

**Requirements:** Node 20+

---

## Stack

- [Next.js 15](https://nextjs.org) App Router
- [Tailwind CSS v4](https://tailwindcss.com)
- [nuqs](https://nuqs.47ng.com) — URL-encoded state (no backend needed)
- TypeScript
- Vitest — 26 unit tests

Zero backend. Deploys to Vercel free tier.

---

## Contributing

Presets live in `src/lib/themes/presets/`. Each preset is a single TypeScript file with colors, fonts, and an `aiPersonality` block.

To add a preset:
1. Copy an existing preset file
2. Fill in the `ThemePreset` shape
3. Register it in `src/lib/themes/registry.ts`
4. Add tests in `src/__tests__/`

PRs with new personality presets are welcome.

---

## Why "anti-shadcn"?

Not anti-shadcn/ui the library — it's great. Anti the sameness. Anti the beige soup of indistinguishable apps. The name is the point.

---

Built by [@cypok13](https://github.com/cypok13)
