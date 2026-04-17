import * as fs from 'fs'
import * as path from 'path'

const ROOT = path.resolve(__dirname, '..')

interface Violation {
  message: string
  fix: string
}

function main(): void {
  const violations: Violation[] = []

  // Check 1: every ui/*.tsx has a corresponding spec
  const uiDir = path.join(ROOT, 'src/components/ui')
  const specsDir = path.join(ROOT, 'docs/specs')

  if (fs.existsSync(uiDir)) {
    const files = fs.readdirSync(uiDir).filter((f) => f.endsWith('.tsx'))
    for (const file of files) {
      const name = file.replace('.tsx', '')
      const specPath = path.join(specsDir, `${name}-spec.md`)
      if (!fs.existsSync(specPath)) {
        violations.push({
          message: `src/components/ui/${file} — Missing spec: docs/specs/${name}-spec.md`,
          fix: `create docs/specs/${name}-spec.md using docs/specs/component-spec-template.md`,
        })
      }
    }
  }

  // Check 2: TOKEN-INDEX.md exists
  const tokenIndexPath = path.join(ROOT, 'docs/TOKEN-INDEX.md')
  if (!fs.existsSync(tokenIndexPath)) {
    violations.push({
      message: 'docs/TOKEN-INDEX.md does not exist',
      fix: "run 'npm run docs:sync' to generate it",
    })
  }

  // Check 3: COMPONENT-INDEX.md exists
  const componentIndexPath = path.join(ROOT, 'docs/COMPONENT-INDEX.md')
  if (!fs.existsSync(componentIndexPath)) {
    violations.push({
      message: 'docs/COMPONENT-INDEX.md does not exist',
      fix: "run 'npm run docs:sync' to generate it",
    })
  }

  // Check 4: No TODO lines in COMPONENT-INDEX.md
  if (fs.existsSync(componentIndexPath)) {
    const content = fs.readFileSync(componentIndexPath, 'utf-8')
    if (content.includes('TODO')) {
      violations.push({
        message: 'docs/COMPONENT-INDEX.md contains TODO items',
        fix: "resolve TODOs or remove them, then run 'npm run docs:components'",
      })
    }
  }

  if (violations.length === 0) {
    console.log('[docs:validate] All checks passed ✓')
    process.exit(0)
  }

  console.log(`[docs:validate] ${violations.length} violation(s) found:\n`)
  for (const v of violations) {
    console.log(`  ✗ ${v.message}`)
    console.log(`    Fix: ${v.fix}`)
    console.log('')
  }

  process.exit(1)
}

main()
