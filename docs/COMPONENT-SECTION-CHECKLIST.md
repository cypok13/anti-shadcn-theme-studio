# Component Section Done-Gate Checklist

> Этот чеклист обязателен перед каждым `git commit` компонентной секции.
> Источник: аудит Button section (2026-04-21, ALE-771).
> Цель: нулевые правки после первой итерации.

## Token Compliance
- [ ] Zero raw hex values (`#fff`, `#1a1a1a`, etc.) in component files
- [ ] Zero `rgb()` / `rgba()` / `hsl()` with literal numbers in className or style
- [ ] Zero Tailwind named colors (`red-500`, `blue-600`, `green-400`) — use `[hsl(var(--token))]`
- [ ] All color references: `hsl(var(--token))` pattern (не `var(--token)` — без hsl() ломаются opacity modifiers)
- [ ] `--success` / `--warning` / `--info` без hardcoded fallback значений в `var(--token, LITERAL)`

## Spacing (4px scale only)
- [ ] No `py-2.5`, `px-2.5`, `gap-2.5` (10px — off-scale)
- [ ] No `h-3.5` (14px — off-scale)
- [ ] No arbitrary: `p-[10px]`, `gap-[6px]`, `mt-[14px]`
- [ ] Allowed: 0/2/4/6/8/12/16/20/24/32/48/64/80px
- [ ] Icons: только `h-3`(12px) / `h-4`(16px) / `h-5`(20px) / `h-6`(24px)

## Typography
- [ ] No hardcoded `font-family` strings — использовать `var(--font-sans)` / `var(--font-mono)` / `var(--font-heading)`
- [ ] No `text-[10px]` — минимум `text-xs` (12px)
- [ ] Font weights через стандартную шкалу Tailwind

## DS Component Usage (no native elements)
- [ ] No `<select>` — использовать `src/components/ui/select.tsx`
- [ ] No `<input>` — использовать `src/components/ui/input.tsx`
- [ ] No `<button>` для интерактивных контролов вне shell навигации — использовать DS `Button`

## Layout — No Overflow, No Clipping
- [ ] `DocPropsTable` с fixed-column grid имеет `overflow-x-auto` на родителе
- [ ] Демо-область (`ButtonVariantsGrid` pattern) имеет `overflow-x-auto` на wrapper
- [ ] `grid-cols-2` DoDont layouts нормально выглядят при минимальной ширине контейнера
- [ ] Нет клиппинга внутри `ComponentSection` demo area
- [ ] Все табы рендерятся в `max-w-[1120px]` без горизонтального скрола при 1440px

## Tab — API
- [ ] Все props задокументированы (variant, size, disabled, asChild, специфичные)
- [ ] `required` props помечены `req` badge через `required: true`
- [ ] Каждый prop: name, type (pipe-separated union), default, description ≥ 1 предложение
- [ ] Описания объясняют *зачем*, не только *что*

## Tab — Usage
- [ ] Минимум 3 Do/Don't пары
- [ ] Variant guide таблица если у компонента есть variants
- [ ] Do: зелёный (--success) left border, Don't: красный (--destructive) left border
- [ ] `grid-cols-2` проверен на минимальной ширине контейнера

## Tab — Code
- [ ] Минимум 4 сниппета для разных кейсов
- [ ] Каждый сниппет имеет `label` prop с описанием
- [ ] Реалистичные имена (`handleSave`, `isSubmitting`, не `foo`)
- [ ] `asChild` + Next.js `<Link>` пример если компонент поддерживает `asChild`
- [ ] Loading/disabled state пример если компонент поддерживает эти состояния
- [ ] Accessibility пример (aria-label, aria-disabled, role)

## Dark Mode
- [ ] Все token-based цвета переключаются корректно
- [ ] `color-scheme` соответствует active mode (dark page → `color-scheme: dark`)
- [ ] Shiki highlighting переключается между light/dark themes
- [ ] Нет цветов визуально застрявших в light mode

## No Reference Library Mentions
- [ ] Нет "Radix", "@radix-ui", "shadcn", "cmdk", "vaul", "sonner" в видимом тексте табов

## Automated Gates (обязательно запускать локально)
- [ ] `npm run lint:ui` → exit 0
- [ ] `npm run build` → exit 0, 0 TypeScript errors
- [ ] `npm run test:components` (Playwright, Gates 0-3) → PASS
- [ ] Нет `console.error` / hydration warnings в браузере при первой загрузке
- [ ] Нет JS errors при переключении всех 5 табов
