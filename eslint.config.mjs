import tsParser from '@typescript-eslint/parser'

// Custom rule: blocks hardcoded color values in Tailwind arbitrary classes.
// Allows CSS custom property references: bg-[hsl(var(--primary))], text-[var(--foreground)]
// Blocks raw color literals: bg-[#fff], text-[rgb(0,0,0)], border-[rgba(0,0,0,0.5)]
const noHardcodedColors = {
  meta: { type: 'problem', schema: [] },
  create(context) {
    const COLOR_PATTERN = /\[(?:#[0-9a-fA-F]{3,8}|(?:rgba?|hsla?)\s*\()[^\]]*\]/
    const HAS_CSS_VAR = /var\(--/

    function checkValue(node, value) {
      if (typeof value !== 'string') return
      for (const cls of value.split(/\s+/)) {
        if (COLOR_PATTERN.test(cls) && !HAS_CSS_VAR.test(cls)) {
          context.report({
            node,
            message: `Hardcoded color in Tailwind class "${cls}" — use CSS custom properties instead (e.g. bg-[hsl(var(--primary))]).`,
          })
        }
      }
    }

    return {
      JSXAttribute(node) {
        if (node.name.name !== 'className') return
        const val = node.value
        if (!val) return
        if (val.type === 'Literal') {
          checkValue(node, val.value)
        } else if (val.type === 'JSXExpressionContainer') {
          const expr = val.expression
          if (expr.type === 'Literal') checkValue(node, expr.value)
          if (expr.type === 'TemplateLiteral') {
            expr.quasis.forEach(q => checkValue(node, q.value.raw))
          }
        }
      },
    }
  },
}

export default [
  {
    files: ['src/components/ui/**/*.tsx'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaFeatures: { jsx: true },
      },
    },
    plugins: { local: { rules: { 'no-hardcoded-colors': noHardcodedColors } } },
    rules: {
      'local/no-hardcoded-colors': 'error',
    },
  },
]
