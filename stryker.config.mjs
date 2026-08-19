import { execSync } from 'node:child_process'
import { existsSync } from 'node:fs'

const tested = execSync('find src -name "*.spec.ts" -not -path "*/node_modules/*"', {
  encoding: 'utf8',
})
  .split('\n')
  .filter(Boolean)
  .map(spec => spec.replace(/\.spec\.ts$/, '.ts'))
  .filter(
    file =>
      (file.startsWith('src/classes/') ||
        file.startsWith('src/io/') ||
        file.startsWith('src/util/')) &&
      !file.includes('/apis/') &&
      existsSync(file)
  )

export default {
  packageManager: 'yarn',
  testRunner: 'vitest',
  vitest: { configFile: 'vite.config.mts' },
  reporters: ['html', 'clear-text', 'progress'],
  coverageAnalysis: 'perTest',
  mutate: tested,
  incremental: true,
  incrementalFile: 'node_modules/.cache/stryker-incremental.json',
  thresholds: { high: 85, low: 75, break: null },
  timeoutMS: 20000,
  concurrency: 4,
}
