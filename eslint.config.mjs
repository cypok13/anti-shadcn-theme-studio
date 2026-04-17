import tsParser from '@typescript-eslint/parser'
import tailwind from 'eslint-plugin-tailwindcss'

export default [
  {
    files: ['src/components/ui/**/*.tsx'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaFeatures: { jsx: true },
      },
    },
    plugins: { tailwindcss: tailwind },
    rules: {
      'tailwindcss/no-arbitrary-value': 'error',
    },
  },
]
