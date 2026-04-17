# Documentation Architecture — Theme Studio

> Source of truth о том, как связаны docs/, scripts/, и src/.
> Создан: 2026-04-17 | Обновлять при изменении архитектуры пайплайна.

## Как читать эту диаграмму

Синие узлы — исходный код. Оранжевые — скрипты-генераторы. Зелёные — авто-сгенерированные документы (не трогать вручную). Серые — ручные документы (обновлять по протоколу Step 7). Красные — устаревшие файлы (не читать).

## Диаграмма

```mermaid
graph TD
    globals_css[src/app/globals.css]
    types_ts[src/lib/themes/types.ts]
    ui_components[src/components/ui/*.tsx]
    gallery[ComponentGallery.tsx]
    presets[src/lib/themes/presets/*.ts]

    gen_tokens{scripts/generate-token-index.ts}
    gen_components{scripts/generate-component-index.ts}
    docs_sync{npm run docs:sync}
    validate{npm run docs:validate}

    token_index[(docs/TOKEN-INDEX.md)]
    component_index[(docs/COMPONENT-INDEX.md)]

    claude_md[/CLAUDE.md]
    pipeline[docs/COMPONENT-PIPELINE.md]
    tracker[docs/IMPLEMENTATION-TRACKER.md]
    specs[docs/specs/*.md]

    deprecated_comp{{docs/component-spec.md DEPRECATED}}
    deprecated_token{{docs/token-spec.md DEPRECATED}}

    hook[PostToolUse hook]
    step7[Pipeline Step 7]

    globals_css --> gen_tokens
    types_ts --> gen_tokens
    gen_tokens --> token_index

    ui_components --> gen_components
    specs --> gen_components
    gen_components --> component_index

    docs_sync --> gen_tokens
    docs_sync --> gen_components

    validate --> token_index
    validate --> component_index
    validate --> ui_components
    validate --> specs

    hook --> |"ui/*.tsx or globals.css edited"| docs_sync
    step7 --> docs_sync
    step7 --> validate

    claude_md --> |"entry point"| tracker
    claude_md --> |"entry point"| component_index
    claude_md --> |"entry point"| token_index
    claude_md --> |"entry point"| pipeline

    deprecated_comp -. "replaced by" .-> component_index
    deprecated_token -. "replaced by" .-> token_index

    classDef source fill:#dbeafe,stroke:#2563eb,color:#1e3a8a
    classDef script fill:#ffedd5,stroke:#ea580c,color:#7c2d12
    classDef generated fill:#dcfce7,stroke:#16a34a,color:#14532d
    classDef manual fill:#f3f4f6,stroke:#6b7280,color:#111827
    classDef deprecated fill:#fee2e2,stroke:#dc2626,color:#7f1d1d
    classDef enforcement fill:#f5f3ff,stroke:#7c3aed,color:#3b0764

    class globals_css,types_ts,ui_components,gallery,presets source
    class gen_tokens,gen_components,docs_sync,validate script
    class token_index,component_index generated
    class claude_md,pipeline,tracker,specs manual
    class deprecated_comp,deprecated_token deprecated
    class hook,step7 enforcement
```

## Event Matrix — что обновляется когда

| Событие | Автоматически | Вручную |
|---------|--------------|---------|
| Добавлен `ui/*.tsx` компонент | COMPONENT-INDEX (`docs:sync`) | `docs/specs/[name]-spec.md` (по шаблону), IMPLEMENTATION-TRACKER |
| Добавлен CSS токен в `globals.css` | TOKEN-INDEX (`docs:sync`) | Решить: нужен ли в `ThemeTokens` (types.ts) |
| Обнаружена архитектурная ошибка | — | COMPONENT-PIPELINE.md Error Log + memory |
| Изменён пресет | — | IMPLEMENTATION-TRACKER секция 8 |
| Изменена архитектура пайплайна | — | Этот файл (DOCS-ARCHITECTURE.md) |

## Правила

```
AUTO-GENERATED (не редактировать вручную):
  docs/TOKEN-INDEX.md       ← npm run docs:sync
  docs/COMPONENT-INDEX.md   ← npm run docs:sync

MANUAL (обновлять по протоколу Step 7):
  docs/IMPLEMENTATION-TRACKER.md
  docs/specs/*.md
  docs/COMPONENT-PIPELINE.md  (Error Log E-001..E-010)
  CLAUDE.md

DEPRECATED (не читать):
  docs/component-spec.md    → заменён COMPONENT-INDEX.md
  docs/token-spec.md        → заменён TOKEN-INDEX.md
```
