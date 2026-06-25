#!/usr/bin/env node
import { readFileSync, writeFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import console from 'node:console'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const srdDir = resolve(root, 'src/assets/srd/lib')
const outPath = resolve(root, 'content/en/lancer-srd.json')

const FILES = ['basics', 'combat', 'mechs', 'narrative_play', 'pilots', 'using_compcon']

const catalog = {}

function visit(node, id) {
  node.id = id
  for (const field of ['title', 'content']) {
    const en = node[field]?.en
    if (en === undefined) continue
    node[field] = { en } // strip non-en
    if (String(en).trim()) catalog[`${id}.${field}`] = en
  }
  if (Array.isArray(node.children)) node.children.forEach((c, i) => visit(c, `${id}_${i}`))
}

for (const f of FILES) {
  const p = resolve(srdDir, `${f}.json`)
  const data = JSON.parse(readFileSync(p, 'utf8'))
  data.forEach((node, i) => visit(node, `${f}_${i}`))
  writeFileSync(p, JSON.stringify(data, null, 2) + '\n')
}

const sorted = Object.fromEntries(Object.entries(catalog).sort(([a], [b]) => a.localeCompare(b)))
writeFileSync(outPath, JSON.stringify(sorted, null, 2) + '\n')
console.log(
  `srd: ids injected into ${FILES.length} files, ${Object.keys(sorted).length} keys -> content/en/lancer-srd.json`
)
