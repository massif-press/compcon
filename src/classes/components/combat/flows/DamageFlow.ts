import { Flow } from './Flow'
import type { IFlowStep } from './Flow'
import { DamageType } from '../../../enums'
import { StatKey } from '../stats/Stats'
import type { CombatController } from '../CombatController'

interface IDamageResult {
  total: number
  resist: string[]
  condition: string[]
  tookDamage: boolean
}

interface IDamageCalcState {
  cc: CombatController
  target: CombatController
  type: DamageType
  value: number
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

interface IHeatState {
  cc: CombatController
  target: CombatController
  value: number
  external: boolean
}

const DOUBLED_BY_EXPOSED = [DamageType.Kinetic, DamageType.Explosive, DamageType.Energy]

const UNREDUCIBLE_TYPES = [DamageType.Heat, DamageType.Burn, DamageType.AppliedBurn]

function armorReduction(s: IDamageCalcState): number {
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

const exposed: IFlowStep<IDamageCalcState> = {
  Name: 'exposed',
  Run: s => {
    if (!s.cc.HasStatus('exposed') || !DOUBLED_BY_EXPOSED.includes(s.type)) return 'continue'
    s.out.total *= 2
    s.out.condition.push('exposed')
    return 'continue'
  },
}

const shredded: IFlowStep<IDamageCalcState> = {
  Name: 'shredded',
  Run: s => {
    if (!s.cc.HasStatus('shredded')) return 'continue'
    s.out.condition.push('shredded')
    s.ap = true
    return 'continue'
  },
}

const irreducible: IFlowStep<IDamageCalcState> = {
  Name: 'irreducible',
  Run: s => (s.irreducible ? 'halt' : 'continue'),
}

const armor: IFlowStep<IDamageCalcState> = {
  Name: 'armor',
  Run: s => {
    s.armorReduction = armorReduction(s)
    s.out.total = Math.max(0, s.out.total - s.armorReduction)
    return 'continue'
  },
}

const resistance: IFlowStep<IDamageCalcState> = {
  Name: 'resistance',
  Run: s => {
    const resist = resistanceOf(s.target, s.type)
    if (!resist) return 'continue'
    if (resist.condition === 'vulnerable') {
      s.out.total = Math.ceil(s.out.total * 2)
      s.out.resist.push('vulnerable')
    } else if (!s.cc.HasStatus('shredded') && resist.condition === 'resistance') {
      s.out.total = Math.ceil(s.out.total / 2)
      s.out.resist.push('resistance')
    }
    return 'continue'
  },
}

const DamageCalculationFlow = new Flow<IDamageCalcState>('DamageCalculationFlow', [
  immunity,
  exposed,
  shredded,
  irreducible,
  armor,
  resistance,
])

const heatRedirect: IFlowStep<IDamageApplyState> = {
  Name: 'heat-redirect',
  Run: s => {
    if (s.type.toLowerCase() !== DamageType.Heat.toLowerCase()) return 'continue'
    s.target.ApplyHeat(s.value)
    return 'halt'
  },
}

const burnAccumulation: IFlowStep<IDamageApplyState> = {
  Name: 'burn-accumulation',
  Run: s => {
    if (s.type.toLowerCase() !== DamageType.Burn.toLowerCase()) return 'continue'
    s.target.StatController.setCurrentStat(
      StatKey.BURN,
      s.target.StatController.getCurrent(StatKey.BURN) + s.value
    )
    return 'continue'
  },
}

const overshield: IFlowStep<IDamageApplyState> = {
  Name: 'overshield',
  Run: s => {
    const held = s.target.StatController.getCurrent(StatKey.OVERSHIELD) || 0
    if (held <= 0) return 'continue'
    if (s.value <= held) {
      s.target.StatController.setCurrentStat(StatKey.OVERSHIELD, held - s.value)
      s.cc.log(`Overshield absorbed ${s.value} damage`)
      s.cc.CombatLog.StatChange(-s.value, 'overshield')
      return 'halt'
    }
    s.target.StatController.setCurrentStat(StatKey.OVERSHIELD, 0)
    s.value -= held
    s.cc.log(`Overshield absorbed ${held} damage before breaking`)
    s.cc.CombatLog.StatChange(-held, 'overshield')
    return 'continue'
  },
}

const hitPoints: IFlowStep<IDamageApplyState> = {
  Name: 'hit-points',
  Run: s => {
    s.target.StatController.setCurrentStat(
      StatKey.HP,
      s.target.StatController.getCurrent(StatKey.HP) - s.value
    )
    s.cc.log(`Took ${s.value} ${s.type} damage`)
    s.cc.CombatLog.StatChange(-s.value, 'hp')
    return 'continue'
  },
}

const structureCascade: IFlowStep<IDamageApplyState> = {
  Name: 'structure-cascade',
  Run: s => {
    const stats = s.target.StatController
    while (stats.getCurrent(StatKey.HP) <= 0 && stats.getCurrent(StatKey.STRUCTURE) > 0) {
      stats.setCurrentStat(StatKey.STRUCTURE, stats.getCurrent(StatKey.STRUCTURE) - 1)
      if (stats.getCurrent(StatKey.STRUCTURE) >= 0)
        s.cc.log(
          `Structure damaged! Remaining structure: ${stats.getCurrent(StatKey.STRUCTURE)}`
        )
      if (stats.getCurrent(StatKey.STRUCTURE) > 0) s.cc.CombatLog.StatChange(-1, 'structure')
      stats.setCurrentStat(StatKey.HP, stats.getCurrent(StatKey.HP) + stats.getMax(StatKey.HP))
    }
    if (stats.getCurrent(StatKey.STRUCTURE) < 0) stats.setCurrentStat(StatKey.STRUCTURE, 0)
    return 'continue'
  },
}

const DamageApplicationFlow = new Flow<IDamageApplyState>('DamageApplicationFlow', [
  heatRedirect,
  burnAccumulation,
  overshield,
  hitPoints,
  structureCascade,
])

const gruntExternalHeat: IFlowStep<IHeatState> = {
  Name: 'grunt-external-heat',
  Run: s => {
    if (!s.external || !s.cc.IsGrunt) return 'continue'
    s.cc.SetDestroyed(true)
    s.cc.log('Grunt destroyed by external heat')
    return 'halt'
  },
}

const heatAccumulation: IFlowStep<IHeatState> = {
  Name: 'heat-accumulation',
  Run: s => {
    s.target.StatController.setCurrentStat(
      StatKey.HEATCAP,
      s.target.StatController.getCurrent(StatKey.HEATCAP) + s.value
    )
    s.cc.log(`Gained ${s.value} Heat`)
    s.cc.CombatLog.StatChange(s.value, 'heat')
    return 'continue'
  },
}

const dangerZone: IFlowStep<IHeatState> = {
  Name: 'danger-zone',
  Run: s => {
    if (s.cc.IsInDangerZone)
      s.cc.log(
        `In Danger Zone! Current Heat: ${s.target.StatController.getCurrent(StatKey.HEATCAP)}`
      )
    return 'continue'
  },
}

const heatCap: IFlowStep<IHeatState> = {
  Name: 'heat-cap',
  Run: s => {
    const stats = s.target.StatController
    if (stats.getCurrent(StatKey.HEATCAP) <= stats.getMax(StatKey.HEATCAP)) return 'continue'
    if (s.target.RollsStressChart) return 'continue'
    stats.setCurrentStat(StatKey.HEATCAP, stats.getMax(StatKey.HEATCAP))
    s.target.AddStatus('exposed')
    s.cc.log('Heat capacity exceeded: Exposed')
    return 'halt'
  },
}

const stressCascade: IFlowStep<IHeatState> = {
  Name: 'stress-cascade',
  Run: s => {
    const stats = s.target.StatController
    while (stats.getCurrent(StatKey.HEATCAP) > stats.getMax(StatKey.HEATCAP)) {
      stats.setCurrentStat(StatKey.STRESS, stats.getCurrent(StatKey.STRESS) - 1)
      if (stats.getCurrent(StatKey.STRESS) >= 0)
        s.cc.log(`Reactor stressed! Remaining Reactor Stress: ${stats.getCurrent(StatKey.STRESS)}`)
      if (stats.getCurrent(StatKey.STRESS) > 0) s.cc.CombatLog.StatChange(-1, 'stress')
      stats.setCurrentStat(
        StatKey.HEATCAP,
        stats.getCurrent(StatKey.HEATCAP) - stats.getMax(StatKey.HEATCAP)
      )
    }
    if (stats.getCurrent(StatKey.STRESS) < 0) stats.setCurrentStat(StatKey.STRESS, 0)
    return 'continue'
  },
}

const meltdownWatch: IFlowStep<IHeatState> = {
  Name: 'meltdown-watch',
  Run: s => {
    if (s.target.StatController.getCurrent(StatKey.STRESS) === 0) s.cc.ScheduleReactorMeltdown(1)
    return 'continue'
  },
}

const HeatFlow = new Flow<IHeatState>('HeatFlow', [
  gruntExternalHeat,
  heatAccumulation,
  dangerZone,
  heatCap,
  stressCascade,
  meltdownWatch,
])

export { DamageCalculationFlow, DamageApplicationFlow, HeatFlow, armorReduction }
export type { IDamageCalcState, IDamageApplyState, IHeatState, IDamageResult }
