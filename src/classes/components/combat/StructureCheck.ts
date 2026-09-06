import { CompendiumStore } from '@/features/compendium/store'
import { DiceRoller } from '@/classes/dice/DiceRoller'
import type { RollableTable, ITableRoll } from '@/classes/narrative/elements/RollableTable'
import { DamageType } from '../../enums'
import { StatKey } from './stats/Stats'
import { hasUsesRemaining } from './AttackRules'
import type { CombatController } from './CombatController'
import type { IFlowRequest } from './flows/Flow'

type CheckKind = 'structure' | 'stress'

const CORE_STRUCTURE = 'core-structure-damage'
const CORE_MONSTROSITY = 'core-monstrosity-structure-damage'
const CORE_OVERHEATING = 'core-overheating'
const MONSTROSITY_CLASS_ID = 'npcc_monstrosity'

interface ICheckRollResult {
  table: RollableTable
  dice: number[]
  lowest: number
  multipleOnes: boolean
  row: ITableRoll | null
}

interface IPendingCheck {
  id: string
  kind: CheckKind
}

interface BranchCase {
  at_least?: number
  at_most?: number
  equals?: number
  label: string
  effects: Effect[]
}
interface SubRollCase {
  min: number
  max: number
  label: string
  effects: Effect[]
}
type Effect =
  | { type: 'status'; id: string; duration?: string; note?: string }
  | { type: 'destroy'; note?: string }
  | { type: 'reactor_meltdown'; delay?: number; delay_roll?: string; note?: string }
  | { type: 'damage'; roll: string; damage_type?: string; note?: string }
  | { type: 'branch'; on: CheckKind; cases: BranchCase[] }
  | {
      type: 'save' | 'check'
      check: 'hull' | 'agi' | 'sys' | 'eng'
      on_success: Effect[]
      on_fail: Effect[]
    }
  | { type: 'sub_roll'; die: number; cases: SubRollCase[] }
  | { type: 'destroy_equipment'; target: 'mount' | 'system'; note?: string }

type TerminalAction =
  | { kind: 'status'; id: string; duration?: string }
  | { kind: 'destroy' }
  | { kind: 'reactor_meltdown'; delayTurns: number }
  | { kind: 'destroy_equipment'; items: any[] }
  | { kind: 'damage'; damageType: DamageType; value: number }

interface ResolveContext {
  currentStructure: number
  currentStress: number
  rolls: Record<string, number>
  saveChoices: Record<string, 'success' | 'fail'>
  equipChoices: Record<string, string>
}

interface ResolveStep {
  path: string
  kind: 'apply' | 'branch' | 'save' | 'subroll' | 'equip' | 'damage' | 'note'
  label: string
  check?: 'hull' | 'agi' | 'sys' | 'eng'
  target?: 'mount' | 'system'
  options?: { id: string; label: string; items?: any[] }[]
  rolled?: number
  mode?: 'save' | 'check'
}

interface ResolveResult {
  steps: ResolveStep[]
  actions: TerminalAction[]
  complete: boolean
}

const DIRECT_HIT_KEY = 'core-structure-damage::Direct Hit'
const END_OF_NEXT_TURN = 'end_turn_self'
const REST_OF_SCENE = 'scene'

const EFFECT_MAP: Record<string, Effect[]> = {
  'core-structure-damage::Glancing Blow': [
    { type: 'status', id: 'impaired', duration: END_OF_NEXT_TURN },
  ],
  'core-structure-damage::System Trauma': [
    {
      type: 'sub_roll',
      die: 6,
      cases: [
        {
          min: 1,
          max: 3,
          label: 'All weapons on one mount are destroyed',
          effects: [{ type: 'destroy_equipment', target: 'mount' }],
        },
        {
          min: 4,
          max: 6,
          label: 'One system is destroyed',
          effects: [{ type: 'destroy_equipment', target: 'system' }],
        },
      ],
    },
  ],
  'core-structure-damage::Direct Hit': [
    {
      type: 'branch',
      on: 'structure',
      cases: [
        {
          at_least: 3,
          label: '3+ Structure',
          effects: [{ type: 'status', id: 'stunned', duration: END_OF_NEXT_TURN }],
        },
        {
          equals: 2,
          label: '2 Structure',
          effects: [
            {
              type: 'check',
              check: 'hull',
              on_success: [{ type: 'status', id: 'stunned' }],
              on_fail: [{ type: 'destroy' }],
            },
          ],
        },
        { at_most: 1, label: '1 Structure', effects: [{ type: 'destroy' }] },
      ],
    },
  ],
  'core-structure-damage::Crushing Hit': [{ type: 'destroy' }],
  'core-overheating::Emergency Shunt': [
    { type: 'status', id: 'impaired', duration: END_OF_NEXT_TURN },
  ],
  'core-overheating::Destabilized Power Plant': [{ type: 'status', id: 'exposed' }],
  'core-overheating::Meltdown': [
    {
      type: 'branch',
      on: 'stress',
      cases: [
        { at_least: 3, label: '3+ Stress', effects: [{ type: 'status', id: 'exposed' }] },
        {
          equals: 2,
          label: '2 Stress',
          effects: [
            {
              type: 'check',
              check: 'eng',
              on_success: [{ type: 'status', id: 'exposed' }],
              on_fail: [
                { type: 'reactor_meltdown', delay_roll: '1d6', note: 'after 1d6 of your turns' },
              ],
            },
          ],
        },
        {
          at_most: 1,
          label: '1 Stress',
          effects: [{ type: 'reactor_meltdown', delay: 1, note: 'at the end of your next turn' }],
        },
      ],
    },
  ],
  'core-overheating::Irreversible Meltdown': [
    { type: 'reactor_meltdown', delay: 1, note: 'at the end of your next turn' },
  ],
  'core-monstrosity-structure-damage::Glancing Hit': [
    { type: 'status', id: 'impaired', duration: END_OF_NEXT_TURN },
  ],
  'core-monstrosity-structure-damage::Powerful Hit': [{ type: 'status', id: 'prone' }],
  'core-monstrosity-structure-damage::Dismemberment': [
    { type: 'status', id: 'slow', duration: REST_OF_SCENE },
    { type: 'damage', roll: '1d6', damage_type: 'kinetic' },
  ],
  'core-monstrosity-structure-damage::Direct Hit': [
    {
      type: 'branch',
      on: 'structure',
      cases: [
        {
          at_least: 3,
          label: '3+ Structure',
          effects: [{ type: 'status', id: 'stunned', duration: END_OF_NEXT_TURN }],
        },
        {
          equals: 2,
          label: '2 Structure',
          effects: [
            { type: 'save', check: 'hull', on_success: [], on_fail: [{ type: 'destroy' }] },
          ],
        },
        { at_most: 1, label: '1 Structure', effects: [{ type: 'destroy' }] },
      ],
    },
  ],
  'core-monstrosity-structure-damage::Fatal': [{ type: 'destroy' }],
}

function effectsFor(tableId: string, row: ITableRoll | null): Effect[] {
  const custom = (row as { effects?: Effect[] } | null)?.effects
  if (custom) return custom
  if (!row?.title) return []
  return EFFECT_MAP[`${tableId}::${row.title}`] ?? []
}

function rollExpr(expr: string): number {
  const m = /^(\d+)d(\d+)$/i.exec(expr.trim())
  if (!m) return Number(expr) || 0
  const [n, die] = [Number(m[1]), Number(m[2])]
  let total = 0
  for (let i = 0; i < n; i++) total += DiceRoller.rollDie(die)
  return total
}

function prerollEffects(
  effects: Effect[],
  path = '',
  out: Record<string, number> = {}
): Record<string, number> {
  effects.forEach((e, i) => {
    const p = path ? `${path}.${i}` : String(i)
    if (e.type === 'sub_roll') {
      out[p] = DiceRoller.rollDie(e.die)
      e.cases.forEach((c, ci) => prerollEffects(c.effects, `${p}.c${ci}`, out))
    } else if (e.type === 'damage') {
      out[p] = rollExpr(e.roll)
    } else if (e.type === 'reactor_meltdown') {
      if (e.delay_roll) out[p] = rollExpr(e.delay_roll)
    } else if (e.type === 'branch') {
      e.cases.forEach((c, ci) => prerollEffects(c.effects, `${p}.c${ci}`, out))
    } else if (e.type === 'save' || e.type === 'check') {
      prerollEffects(e.on_success, `${p}.s`, out)
      prerollEffects(e.on_fail, `${p}.f`, out)
    }
  })
  return out
}

function toDamageType(raw?: string): DamageType {
  const key = (raw || '').toLowerCase()
  return (
    (Object.values(DamageType).find(d => d.toLowerCase() === key) as DamageType) ??
    DamageType.Kinetic
  )
}

const DURATION_LABEL: Record<string, string> = {
  [END_OF_NEXT_TURN]: 'until the end of its next turn',
  [REST_OF_SCENE]: 'for the rest of the scene',
}

function isDestroyable(item: any): boolean {
  if (item.Destroyed || item.IsIndestructible) return false
  if (item.IsMod) return false
  return hasUsesRemaining(item)
}

function structureDamageTargets(cc: CombatController): any[] {
  const features = (cc.Parent as any)?.NpcFeatureController?.Features
  if (features) return features.filter((f: any) => f.IsSystem && isDestroyable(f))

  const loadout = (cc.Parent as any)?.MechLoadoutController?.ActiveLoadout
  if (!loadout) return []
  const weapons = loadout.AllMounts(true, true, true).flatMap((m: any) => m.Weapons || [])
  return [...weapons, ...(loadout.Systems || [])].filter(isDestroyable)
}

function systemTraumaFallback(available: {
  mounts: unknown[]
  systems: unknown[]
}): 'mount' | 'system' | 'direct_hit' {
  if (available.mounts.length) return 'mount'
  if (available.systems.length) return 'system'
  return 'direct_hit'
}

function equipmentOptions(
  cc: CombatController,
  target: 'mount' | 'system'
): { id: string; label: string; items: any[] }[] {
  const loadout = (cc.Parent as any)?.MechLoadoutController?.ActiveLoadout
  if (!loadout) return []
  if (target === 'mount') {
    return loadout
      .AllMounts(true, true, true)
      .map((m: any, i: number) => ({ i, mount: m, live: (m.Weapons || []).filter(isDestroyable) }))
      .filter((x: any) => x.live.length)
      .map((x: any) => ({
        id: String(x.i),
        label: `${x.mount.Name}: ${x.live.map((w: any) => w.Name).join(', ')}`,
        items: x.live,
      }))
  }
  return (loadout.Systems || [])
    .filter(isDestroyable)
    .map((s: any, i: number) => ({ id: String(i), label: s.Name, items: [s] }))
}

function pickTraumaTarget(
  cc: CombatController,
  rolled: 'mount' | 'system'
): 'mount' | 'system' | 'direct_hit' {
  const mounts = equipmentOptions(cc, 'mount')
  const systems = equipmentOptions(cc, 'system')
  if (rolled === 'system' && systems.length) return 'system'
  return systemTraumaFallback({ mounts, systems })
}

function resolveEffects(
  effects: Effect[],
  ctx: ResolveContext,
  cc: CombatController,
  path = ''
): ResolveResult {
  const steps: ResolveStep[] = []
  const actions: TerminalAction[] = []
  let complete = true

  effects.forEach((e, i) => {
    const p = path ? `${path}.${i}` : String(i)
    switch (e.type) {
      case 'status': {
        const qualifier = e.note || (e.duration ? DURATION_LABEL[e.duration] : '')
        steps.push({
          path: p,
          kind: 'apply',
          label: `${e.id}${qualifier ? ` (${qualifier})` : ''}`,
        })
        actions.push({ kind: 'status', id: e.id, duration: e.duration })
        break
      }
      case 'destroy':
        steps.push({ path: p, kind: 'apply', label: `Destroyed${e.note ? ` (${e.note})` : ''}` })
        actions.push({ kind: 'destroy' })
        break
      case 'reactor_meltdown': {
        const turns = e.delay_roll ? ctx.rolls[p] : (e.delay ?? 0)
        steps.push({
          path: p,
          kind: 'apply',
          label: `Reactor meltdown${e.note ? ` (${e.note})` : ''}`,
          rolled: e.delay_roll ? turns : undefined,
        })
        if (typeof turns !== 'number') complete = false
        else actions.push({ kind: 'reactor_meltdown', delayTurns: turns })
        break
      }
      case 'damage': {
        const rolled = ctx.rolls[p]
        steps.push({
          path: p,
          kind: 'damage',
          label: `${e.roll} ${e.damage_type || ''} damage`.trim(),
          rolled,
        })
        if (typeof rolled !== 'number') complete = false
        else
          actions.push({ kind: 'damage', damageType: toDamageType(e.damage_type), value: rolled })
        break
      }
      case 'branch': {
        const val = e.on === 'stress' ? ctx.currentStress : ctx.currentStructure
        const hit = e.cases.find(
          c =>
            (c.at_least === undefined || val >= c.at_least) &&
            (c.at_most === undefined || val <= c.at_most) &&
            (c.equals === undefined || val === c.equals)
        )
        if (hit) {
          const ci = e.cases.indexOf(hit)
          steps.push({ path: p, kind: 'branch', label: hit.label })
          const sub = resolveEffects(hit.effects, ctx, cc, `${p}.c${ci}`)
          steps.push(...sub.steps)
          actions.push(...sub.actions)
          if (!sub.complete) complete = false
        }
        break
      }
      case 'check':
      case 'save': {
        const choice = ctx.saveChoices[p]
        steps.push({
          path: p,
          kind: 'save',
          label: e.check.toUpperCase(),
          check: e.check,
          mode: e.type,
        })
        if (!choice) {
          complete = false
        } else {
          const branch = choice === 'success' ? e.on_success : e.on_fail
          const sub = resolveEffects(branch, ctx, cc, `${p}.${choice === 'success' ? 's' : 'f'}`)
          steps.push(...sub.steps)
          actions.push(...sub.actions)
          if (!sub.complete) complete = false
        }
        break
      }
      case 'sub_roll': {
        const rolled = ctx.rolls[p]
        const hit = e.cases.find(c => rolled >= c.min && rolled <= c.max)
        steps.push({ path: p, kind: 'subroll', label: hit ? hit.label : '', rolled })
        if (hit) {
          const ci = e.cases.indexOf(hit)
          const sub = resolveEffects(hit.effects, ctx, cc, `${p}.c${ci}`)
          steps.push(...sub.steps)
          actions.push(...sub.actions)
          if (!sub.complete) complete = false
        }
        break
      }
      case 'destroy_equipment': {
        const target = pickTraumaTarget(cc, e.target)
        if (target === 'direct_hit') {
          steps.push({ path: p, kind: 'branch', label: 'Nothing destroyable — Direct Hit' })
          const sub = resolveEffects(EFFECT_MAP[DIRECT_HIT_KEY], ctx, cc, `${p}.dh`)
          steps.push(...sub.steps)
          actions.push(...sub.actions)
          if (!sub.complete) complete = false
          break
        }
        const options = equipmentOptions(cc, target)
        const chosen = ctx.equipChoices[p]
        steps.push({
          path: p,
          kind: 'equip',
          label: target === 'mount' ? 'Mount to destroy' : 'System to destroy',
          target,
          options,
        })
        if (!chosen) {
          complete = false
        } else {
          const opt = options.find(o => o.id === chosen)
          if (opt) actions.push({ kind: 'destroy_equipment', items: opt.items })
        }
        break
      }
    }
  })

  return { steps, actions, complete }
}

function applyCheckEffects(cc: CombatController, actions: TerminalAction[]): void {
  for (const a of actions) {
    if (a.kind === 'status') cc.AddStatus(a.id, a.duration)
    else if (a.kind === 'destroy') {
      cc.SetDestroyed(true)
      cc.Record('mech.status', { to: 'destroyed' })
    } else if (a.kind === 'reactor_meltdown') {
      if (a.delayTurns > 0) cc.ScheduleReactorMeltdown(a.delayTurns)
      else {
        cc.ReactorDestroyed = true
      }
    } else if (a.kind === 'destroy_equipment') {
      a.items.forEach(it => {
        it.Destroyed = true
      })
    } else if (a.kind === 'damage') {
      cc.TakeDamage(a.damageType, a.value)
    }
  }
}

function requestFor(step: ResolveStep): IFlowRequest | undefined {
  if (step.kind === 'save') return { kind: 'check', label: step.label }
  if (step.kind === 'equip')
    return {
      kind: 'select',
      label: step.label,
      options: (step.options ?? []).map(o => ({ id: o.id, label: o.label })),
    }
  if (step.kind === 'subroll') return { kind: 'roll', label: step.label }
  return undefined
}

function isMonstrosity(cc: CombatController): boolean {
  return cc.Parent.NpcClassController?.Class?.ID === MONSTROSITY_CLASS_ID
}

function selectTableId(kind: CheckKind, cc: CombatController): string {
  if (kind === 'stress') return CORE_OVERHEATING
  return isMonstrosity(cc) ? CORE_MONSTROSITY : CORE_STRUCTURE
}

function getCheckTable(kind: CheckKind, cc: CombatController): RollableTable | undefined {
  const id = selectTableId(kind, cc)
  return CompendiumStore().Tables.find(t => t.ID === id)
}

function markedPoints(cc: CombatController, kind: CheckKind): number {
  const key = kind === 'stress' ? StatKey.STRESS : StatKey.STRUCTURE
  return cc.StatController.getMax(key) - cc.StatController.getCurrent(key)
}

function rollCheck(table: RollableTable, marked: number): ICheckRollResult {
  const n = Math.max(1, marked)
  const dice: number[] = []
  for (let i = 0; i < n; i++) dice.push(DiceRoller.rollDie(table.Die))
  const lowest = Math.min(...dice)
  const multipleOnes = dice.filter(d => d === 1).length >= 2

  const results = table.Results
  let row: ITableRoll | null = null
  if (multipleOnes) row = results.find(r => r.min === -1 && r.max === -1) ?? null
  if (!row) row = results.find(r => lowest >= r.min && lowest <= r.max) ?? null

  return { table, dice, lowest, multipleOnes, row }
}

export {
  equipmentOptions,
  structureDamageTargets,
  isDestroyable,
  systemTraumaFallback,
  getCheckTable,
  markedPoints,
  rollCheck,
  isMonstrosity,
  effectsFor,
  requestFor,
  applyCheckEffects,
  prerollEffects,
  resolveEffects,
}
export type {
  CheckKind,
  ICheckRollResult,
  IPendingCheck,
  Effect,
  ResolveContext,
  ResolveStep,
  TerminalAction,
}
