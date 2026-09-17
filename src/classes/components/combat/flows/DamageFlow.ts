import { Flow, step } from './Flow'
import type { IFlowStep } from './Flow'
import { DamageType } from '../../../enums'
import { StatKey } from '../stats/Stats'
import type { CombatController } from '../CombatController'
import { combatLogHooks } from './logHooks'

export interface IDamageResult {
  total: number
  resist: string[]
  condition: string[]
  tookDamage: boolean
}

export interface IDamageCalcState {
  cc: CombatController
  target: CombatController
  type: DamageType
  ap: boolean
  irreducible: boolean
  armorReduction: number
  out: IDamageResult
}

interface IDamageApplyState {
  cc: CombatController
  target: CombatController
  type: DamageType
  value: number
}

interface IHeatState extends Omit<IDamageApplyState, 'type'> {
  external: boolean
}

const DOUBLED_BY_EXPOSED = [DamageType.Kinetic, DamageType.Explosive, DamageType.Energy]

const UNREDUCIBLE_TYPES = [DamageType.Heat, DamageType.Burn, DamageType.AppliedBurn]

export function armorReduction(s: IDamageCalcState): number {
  if (s.irreducible || s.ap || UNREDUCIBLE_TYPES.includes(s.type)) return 0
  return s.target.StatController.getCurrent(StatKey.ARMOR) || 0
}

function resistanceOf(target: CombatController, type: DamageType) {
  return target.Resistances.find(r => r.type === type.toLowerCase())
}

const immunity: IFlowStep<IDamageCalcState> = {
  Name: 'immunity',
  Run: s => {
    const immune = s.target.Resistances.find(
      r => r.type === s.type.toLowerCase() && r.condition === 'immunity'
    )
    if (!immune) return 'continue'
    s.out.total = 0
    s.out.tookDamage = false
    s.out.resist.push('immunity')
    return 'halt'
  },
}

const exposed = step<IDamageCalcState>('exposed', s => {
  if (!s.cc.HasStatus('exposed') || !DOUBLED_BY_EXPOSED.includes(s.type)) return
  s.out.total *= 2
  s.out.condition.push('exposed')
})

const shredded = step<IDamageCalcState>('shredded', s => {
  if (!s.cc.HasStatus('shredded')) return
  s.out.condition.push('shredded')
  s.ap = true
})

const irreducible: IFlowStep<IDamageCalcState> = {
  Name: 'irreducible',
  Run: s => (s.irreducible ? 'halt' : 'continue'),
}

const armor = step<IDamageCalcState>('armor', s => {
  s.armorReduction = armorReduction(s)
  s.out.total = Math.max(0, s.out.total - s.armorReduction)
})

const resistance = step<IDamageCalcState>('resistance', s => {
  const resist = resistanceOf(s.target, s.type)
  if (!resist) return
  if (resist.condition === 'vulnerable') {
    s.out.total = Math.ceil(s.out.total * 2)
    s.out.resist.push('vulnerable')
  } else if (!s.cc.HasStatus('shredded') && resist.condition === 'resistance') {
    s.out.total = Math.ceil(s.out.total / 2)
    s.out.resist.push('resistance')
  }
})

export const DamageCalculationFlow = new Flow<IDamageCalcState>(
  'DamageCalculationFlow',
  [immunity, exposed, shredded, irreducible, armor, resistance],
  combatLogHooks
)

const heatRedirect: IFlowStep<IDamageApplyState> = {
  Name: 'heat-redirect',
  Run: s => {
    if (s.type.toLowerCase() !== DamageType.Heat.toLowerCase()) return 'continue'
    s.target.ApplyHeat(s.value)
    return 'halt'
  },
}

const burnAccumulation = step<IDamageApplyState>('burn-accumulation', s => {
  if (s.type.toLowerCase() !== DamageType.Burn.toLowerCase()) return
  s.target.StatController.bumpCurrentStat(StatKey.BURN, s.value)
})

const overshield: IFlowStep<IDamageApplyState> = {
  Name: 'overshield',
  Run: s => {
    const held = s.target.StatController.getCurrent(StatKey.OVERSHIELD) || 0
    if (held <= 0) return 'continue'
    if (s.value <= held) {
      s.target.StatController.setCurrentStat(StatKey.OVERSHIELD, held - s.value)
      return 'halt'
    }
    s.target.StatController.setCurrentStat(StatKey.OVERSHIELD, 0)
    s.value -= held
    return 'continue'
  },
}

const hitPoints = step<IDamageApplyState>('hit-points', s => {
  s.target.StatController.bumpCurrentStat(StatKey.HP, -s.value)
})

const structureCascade = step<IDamageApplyState>('structure-cascade', s => {
  const stats = s.target.StatController
  while (stats.getCurrent(StatKey.HP) <= 0 && stats.getCurrent(StatKey.STRUCTURE) > 0) {
    stats.bumpCurrentStat(StatKey.STRUCTURE, -1)
    stats.bumpCurrentStat(StatKey.HP, stats.getMax(StatKey.HP))
  }
  if (stats.getCurrent(StatKey.STRUCTURE) < 0) stats.setCurrentStat(StatKey.STRUCTURE, 0)
})

export const DamageApplicationFlow = new Flow<IDamageApplyState>(
  'DamageApplicationFlow',
  [heatRedirect, burnAccumulation, overshield, hitPoints, structureCascade],
  combatLogHooks
)

const gruntExternalHeat: IFlowStep<IHeatState> = {
  Name: 'grunt-external-heat',
  Run: s => {
    if (!s.external || !s.cc.IsGrunt) return 'continue'
    s.cc.SetDestroyed(true)
    return 'halt'
  },
}

const heatAccumulation = step<IHeatState>('heat-accumulation', s => {
  s.target.StatController.bumpCurrentStat(StatKey.HEATCAP, s.value)
  s.cc.Record('heat', {
    amount: s.value,
    current: s.target.StatController.getCurrent(StatKey.HEATCAP),
    cap: s.target.StatController.getMax(StatKey.HEATCAP),
    external: s.external,
    dangerZone: s.cc.IsInDangerZone,
  })
})

const heatCap: IFlowStep<IHeatState> = {
  Name: 'heat-cap',
  Run: s => {
    const stats = s.target.StatController
    if (stats.getCurrent(StatKey.HEATCAP) <= stats.getMax(StatKey.HEATCAP)) return 'continue'
    if (s.target.RollsStressChart) return 'continue'
    s.target.ClearHeat('cap', stats.getMax(StatKey.HEATCAP))
    s.target.AddStatus('exposed')
    return 'halt'
  },
}

const stressCascade = step<IHeatState>('stress-cascade', s => {
  const stats = s.target.StatController
  while (stats.getCurrent(StatKey.HEATCAP) > stats.getMax(StatKey.HEATCAP)) {
    stats.bumpCurrentStat(StatKey.STRESS, -1)
    if (stats.getCurrent(StatKey.STRESS) >= 0)
      s.target.ClearHeat(
        'cascade',
        stats.getCurrent(StatKey.HEATCAP) - stats.getMax(StatKey.HEATCAP)
      )
  }
  if (stats.getCurrent(StatKey.STRESS) < 0) stats.setCurrentStat(StatKey.STRESS, 0)
})

const meltdownWatch = step<IHeatState>('meltdown-watch', s => {
  if (s.target.StatController.getCurrent(StatKey.STRESS) === 0) s.cc.ScheduleReactorMeltdown(1)
})

export const HeatFlow = new Flow<IHeatState>(
  'HeatFlow',
  [gruntExternalHeat, heatAccumulation, heatCap, stressCascade, meltdownWatch],
  combatLogHooks
)
