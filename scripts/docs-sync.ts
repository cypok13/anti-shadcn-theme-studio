import { execSync } from 'child_process'
import * as path from 'path'

const ROOT = path.resolve(__dirname, '..')

function run(script: string, label: string, outFile: string): void {
  try {
    execSync(`npx tsx ${path.join(ROOT, script)}`, { stdio: 'inherit' })
    console.log(`[docs:sync] ${label} → ${outFile} ✓`)
  } catch (err) {
    console.error(`[docs:sync] ERROR running ${script}`)
    process.exit(1)
  }
}

run('scripts/generate-token-index.ts', 'Token Index', 'docs/TOKEN-INDEX.md')
run('scripts/generate-component-index.ts', 'Component Index', 'docs/COMPONENT-INDEX.md')

console.log('')
console.log("[docs:sync] Done. Run 'npm run docs:validate' to check for violations.")
