#!/usr/bin/env node
import { readFileSync } from 'node:fs'
import { execSync } from 'node:child_process'
import path from 'node:path'
import console from 'node:console'
import process from 'node:process'

const root = path.resolve(import.meta.dirname, '..')
const all = execSync('find src -name "*.ts" -not -path "*/node_modules/*"', {
  cwd: root,
  encoding: 'utf8',
})
  .split('\n')
  .filter(Boolean)

const files = all.filter(
  f => !f.endsWith('.spec.ts') && !f.endsWith('.d.ts') && !f.startsWith('src/__tests__/')
)
const specFiles = all.filter(f => f.endsWith('.spec.ts'))
const allSpecs = new Set(specFiles)

const importedBySpec = new Set()
for (const spec of specFiles) {
  const src = readFileSync(path.join(root, spec), 'utf8')
  const dir = path.dirname(spec)
  for (const match of src.matchAll(/from\s+'([^']+)'/g)) {
    const target = match[1]
    let resolved = null
    if (target.startsWith('@/')) resolved = path.join('src', target.slice(2))
    else if (target.startsWith('.')) resolved = path.normalize(path.join(dir, target))
    if (resolved) importedBySpec.add(resolved.replace(/\.ts$/, '') + '.ts')
  }
}

const rows = []
for (const file of files) {
  const src = readFileSync(path.join(root, file), 'utf8')
  const serialize = /static Serialize\s*\(/.test(src)
  const deserialize = /static Deserialize\s*\(/.test(src)
  const exportedFns = (src.match(/^export (async )?function \w+/gm) || []).length
  if (!serialize && !deserialize && !exportedFns) continue

  rows.push({
    file,
    pair: serialize && deserialize,
    serialize,
    deserialize,
    exportedFns,
    tested: allSpecs.has(file.replace(/\.ts$/, '.spec.ts')) || importedBySpec.has(file),
  })
}

const onlyMissing = process.argv.includes('--missing')
const shown = onlyMissing ? rows.filter(r => !r.tested) : rows

const group = f => (f.startsWith('src/io/') ? 'io' : f.split('/').slice(0, 3).join('/'))
const groups = [...new Set(shown.map(r => group(r.file)))].sort()

for (const g of groups) {
  const inGroup = shown.filter(r => group(r.file) === g)
  console.log(`\n${g}  (${inGroup.filter(r => r.tested).length}/${inGroup.length} covered)`)
  for (const r of inGroup.sort((a, b) => a.file.localeCompare(b.file))) {
    const marks = [
      r.serialize ? 'S' : '-',
      r.deserialize ? 'D' : '-',
      r.exportedFns ? `fn:${r.exportedFns}` : '',
    ].join('')
    console.log(`  ${r.tested ? '[x]' : '[ ]'} ${r.file.padEnd(70)} ${marks}`)
  }
}

const pairs = rows.filter(r => r.pair)
console.log(
  `\nTotals: ${rows.filter(r => r.tested).length}/${rows.length} modules with spec` +
    `, ${pairs.filter(r => r.tested).length}/${pairs.length} Serialize/Deserialize pairs`
)
