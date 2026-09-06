import { readFileSync, writeFileSync, readdirSync, appendFileSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import console from 'node:console'
import process from 'node:process'

const here = dirname(fileURLToPath(import.meta.url))
const RULES_DIR = resolve(here, '../src/__tests__/rules')
const SOURCE = join(RULES_DIR, 'lancer-rules.json')
const OUT = join(RULES_DIR, 'LANCER-RULES.md')

const CATEGORIES = [
  ['TURN', 'Turn structure'],
  ['ACTION', 'Actions and the action pool'],
  ['ATTACK', 'Attack rolls'],
  ['DMG', 'Damage'],
  ['RANGE', 'Range and areas'],
  ['HEAT', 'Heat and overheating'],
  ['STRESS', 'Overheat chart'],
  ['STRUCT', 'Structure chart'],
  ['REPAIR', 'Repair and rest'],
  ['STATUS', 'Statuses and conditions'],
  ['TAG', 'Tags'],
  ['STAT', 'Statistics'],
  ['ACTOR', 'Actors'],
  ['NPC', 'NPCs'],
  ['MOVE', 'Movement and cover'],
]

const ENGINE = [
  [
    'CombatController.ts',
    'the actor-bound combat engine. Most rules are represented by a function here',
  ],
  ['ActionPoolController.ts', 'the action pool, activations, reactions, uses, overcharge'],
  ['DamageController.ts', 'damage calculation and application'],
  ['StatusRules.ts', 'statuses and conditions'],
  ['StructureCheck.ts', 'rollable tables'],
  ['AttackRules.ts', 'bonus damage, area attacks, auxiliary attacks, object statistics'],
  ['Flow.ts, ActivationFlow.ts, WeaponAttackFlow.ts', 'step sequencing'],
  ['Duration.ts, Expiration.ts', 'how long an effect lasts'],
]

const CLASSIFICATIONS = ['AUTO', 'ASSIST']
const ID_SHAPE = /^T-([A-Z]+)-[a-z_]+-\d{2}$/
const INT_ID_SHAPE = /^T-INT-[a-z_]+-\d{2}$/
const TEST_NAME = /\b(?:it|test)(?:\.\w+)?\(\s*(['"`])(.+?)\1/g
const RULE_PREFIX = /^(T-[A-Z]+-[a-z_]+-\d+)\s*:/

function collectTests() {
  const files = new Map()
  const counts = new Map()
  for (const name of readdirSync(RULES_DIR).sort()) {
    if (!name.endsWith('.spec.ts') || name === 'coverage.spec.ts') continue
    const src = readFileSync(join(RULES_DIR, name), 'utf8')
    for (const match of src.matchAll(TEST_NAME)) {
      const id = RULE_PREFIX.exec(match[2])?.[1]
      if (!id) continue
      if (!files.has(id)) files.set(id, new Set())
      files.get(id).add(name.replace('.spec.ts', ''))
      counts.set(id, (counts.get(id) ?? 0) + 1)
    }
  }
  return { files, counts }
}

function validate(source, tests) {
  const known = new Set(CATEGORIES.map(([key]) => key))
  const seen = new Set()
  const errors = []

  for (const rule of source.rules) {
    const where = rule.id ?? JSON.stringify(rule).slice(0, 60)
    const shape = ID_SHAPE.exec(rule.id ?? '')
    if (!shape) {
      errors.push(`${where}: id must look like T-CATEGORY-name-01`)
      continue
    }
    if (seen.has(rule.id)) errors.push(`${rule.id}: duplicate id`)
    seen.add(rule.id)

    if (!known.has(shape[1])) errors.push(`${rule.id}: unknown category '${shape[1]}'`)
    else if (rule.category !== shape[1])
      errors.push(`${rule.id}: category '${rule.category}' does not match the id`)

    if (!rule.title?.trim()) errors.push(`${rule.id}: missing title`)
    if (!rule.statement?.trim()) errors.push(`${rule.id}: missing statement`)
    if (!CLASSIFICATIONS.includes(rule.classification))
      errors.push(`${rule.id}: classification must be AUTO or ASSIST`)
    if (rule.classification === 'ASSIST' && !rule.split?.trim())
      errors.push(
        `${rule.id}: ASSIST rules must declare a split naming what the app and the user each do`
      )
    if (rule.classification === 'AUTO' && rule.split)
      errors.push(`${rule.id}: AUTO rules must not declare a split`)
    if (!tests.files.has(rule.id)) errors.push(`${rule.id}: no test names this rule`)
  }

  for (const rule of source.interactions) {
    if (!INT_ID_SHAPE.test(rule.id ?? '')) {
      errors.push(`${rule.id ?? '?'}: interaction ids must look like T-INT-name-01`)
      continue
    }
    if (seen.has(rule.id)) errors.push(`${rule.id}: duplicate id`)
    seen.add(rule.id)
    if (!rule.statement?.trim()) errors.push(`${rule.id}: missing statement`)
    if (!rule.composes?.length) errors.push(`${rule.id}: must compose at least one rule`)
    for (const composed of rule.composes ?? [])
      if (!source.rules.some(r => r.id === composed))
        errors.push(`${rule.id}: composes '${composed}', which is not a rule`)
    if (!tests.files.has(rule.id)) errors.push(`${rule.id}: no test names this rule`)
  }

  const declared = new Set([...source.rules, ...source.interactions].map(r => r.id))
  for (const id of tests.files.keys())
    if (!declared.has(id))
      errors.push(`${id}: a test names this rule, but lancer-rules.json does not declare it`)

  if (errors.length) {
    console.error(`lancer-rules.json: ${errors.length} problem(s)`)
    for (const e of errors) console.error(`  ${e}`)
    process.exit(1)
  }
}

function render(source, { files, counts }) {
  const byCategory = new Map(CATEGORIES.map(([key]) => [key, []]))
  for (const rule of source.rules) byCategory.get(rule.category).push(rule)

  const total = [...counts.values()].reduce((a, b) => a + b, 0)
  const spec = id =>
    [...(files.get(id) ?? [])]
      .sort()
      .map(f => `\`${f}\``)
      .join(', ')

  const out = [
    '# Lancer Rules Implemented in Active Mode',
    '',
    '**Generated from `lancer-rules.json` by `scripts/gen-rules-table.mjs`. Do not edit.**',
    'Run `yarn rules:table` after adding or changing a rule. CI fails if this file is out of date.',
    '',
    `${source.rules.length} rules and ${source.interactions.length} interaction rules, ` +
      `covered by ${total} tests in \`src/__tests__/rules/\`.`,
    '',
    '| File | Holds |',
    '|---|---|',
    ...ENGINE.map(([file, holds]) => `| \`${file}\` | ${holds} |`),
    '',
    '---',
    '',
  ]

  for (const [key, title] of CATEGORIES) {
    const rules = byCategory
      .get(key)
      .slice()
      .sort((a, b) => a.id.localeCompare(b.id))
    if (!rules.length) continue
    out.push(`## ${title} (${rules.length})`, '')
    out.push('| Rule | Title | Statement | Class | Spec |', '|---|---|---|---|---|')
    for (const rule of rules)
      out.push(
        `| \`${rule.id}\` | ${rule.title} | ${rule.statement} | ${rule.classification} | ${spec(rule.id)} (${counts.get(rule.id)}) |`
      )
    out.push('')
  }

  const interactions = source.interactions.slice().sort((a, b) => a.id.localeCompare(b.id))
  out.push('---', '', `## Interaction rules (${interactions.length})`, '')
  out.push('Cases where two rules meet, and a bug could only appear at the seam.', '')
  out.push('| Rule | Statement | Composes | Spec |', '|---|---|---|---|')
  for (const rule of interactions) {
    const composes = rule.composes.map(c => `\`${c}\``).join(', ')
    out.push(
      `| \`${rule.id}\` | ${rule.statement} | ${composes} | ${spec(rule.id)} (${counts.get(rule.id)}) |`
    )
  }
  out.push('')

  return out.join('\n')
}

const source = JSON.parse(readFileSync(SOURCE, 'utf8'))
const tests = collectTests()
validate(source, tests)
const rendered = render(source, tests)

const summary =
  `rules table: ${source.rules.length} rules + ${source.interactions.length} interaction rules, ` +
  `${[...tests.counts.values()].reduce((a, b) => a + b, 0)} tests`

if (process.argv.includes('--check')) {
  let current = null
  try {
    current = readFileSync(OUT, 'utf8')
  } catch {
    console.error('gen-rules-table: LANCER-RULES.md is missing. Run `yarn rules:table` and commit.')
    process.exit(1)
  }
  if (current !== rendered) {
    console.error(
      'gen-rules-table: LANCER-RULES.md is out of date. Run `yarn rules:table` and commit the result.'
    )
    process.exit(1)
  }
  console.log(`${summary}. LANCER-RULES.md is up to date.`)
} else {
  writeFileSync(OUT, rendered)
  console.log(`${summary}. Wrote LANCER-RULES.md.`)
}

if (process.env.GITHUB_STEP_SUMMARY) appendFileSync(process.env.GITHUB_STEP_SUMMARY, summary + '\n')
