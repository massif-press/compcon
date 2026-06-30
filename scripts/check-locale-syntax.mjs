import { readdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import console from 'node:console'
import process from 'node:process'
import { baseCompile } from '@intlify/message-compiler'

const dir = 'src/i18n/locales'
const failures = []

const compileErrors = str => {
  const errs = []
  baseCompile(str, { onError: e => errs.push(e) })
  return errs
}

const walk = (node, path, file) => {
  if (typeof node === 'string') {
    for (const e of compileErrors(node)) {
      failures.push({ file, path, code: e.code, message: e.message, str: node })
    }
  } else if (Array.isArray(node)) {
    node.forEach((v, i) => walk(v, `${path}[${i}]`, file))
  } else if (node && typeof node === 'object') {
    for (const k in node) walk(node[k], path ? `${path}.${k}` : k, file)
  }
}

for (const f of readdirSync(dir).filter(f => f.endsWith('.json'))) {
  walk(JSON.parse(readFileSync(join(dir, f), 'utf8')), '', f)
}

if (failures.length) {
  console.error(`\ni18n: ${failures.length} locale message(s) fail to compile:`)
  for (const { file, path, code, message, str } of failures) {
    console.error(`  - ${file}  ${path}  (code ${code}: ${message})`)
    console.error(`      ${JSON.stringify(str)}`)
  }
  process.exit(1)
}

console.log('locale message syntax OK')
