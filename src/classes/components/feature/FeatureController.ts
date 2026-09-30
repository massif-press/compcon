import { IFeatureContainer } from './IFeatureContainer'
import { Collect } from './FeatureCollector'
import { IFeatureController } from './IFeatureController'
import { Bonus } from './bonus/Bonus'
import { BonusController } from './bonus/BonusController'
import { Synergy } from '@/classes/components/feature/synergy/Synergy'
import { Action } from '@/classes/Action'
import { IDeployableData } from '@/classes/components/feature/deployable/Deployable'
import type { CompendiumItem } from '@/classes/CompendiumItem'
import { Counter } from '../combat/counters/Counter'
import type { MechSystem } from '../../mech/components/equipment/MechSystem'
import type { MechWeapon } from '../../mech/components/equipment/MechWeapon'
import { ActiveEffect } from './active_effects/ActiveEffect'
import { Parser } from 'expr-eval'
import { i18n } from '@/i18n'
import { ExpressionContext } from '@/classes/utility/ExpressionContext'

const strDict = [
  { key: 'll', prop: 'Level', label: 'classes.expressionVariable.ll' },
  { key: 'tier', prop: 'Tier', label: 'classes.expressionVariable.tier' },
  { key: 'grit', prop: 'Grit', label: 'active.panelBase.pilotGrit' },
  { key: 'hull', prop: 'Hull', label: 'stats.hull' },
  { key: 'agi', prop: 'Agi', label: 'stats.agility' },
  { key: 'sys', prop: 'Sys', label: 'stats.systems' },
  { key: 'eng', prop: 'Eng', label: 'stats.engineering' },
  { key: 'size', prop: 'Size', label: 'stats.size' },
  { key: 'structure', prop: 'Structure', label: 'classes.expressionVariable.structure' },
  { key: 'stress', prop: 'Stress', label: 'classes.expressionVariable.stress' },
  { key: 'armor', prop: 'Armor', label: 'stats.armor' },
  { key: 'hp', prop: 'HP', label: 'classes.expressionVariable.hp' },
  {
    key: 'current_structure',
    prop: 'CurrentStructure',
    label: 'classes.expressionVariable.currentStructure',
  },
  {
    key: 'current_stress',
    prop: 'CurrentStress',
    label: 'classes.expressionVariable.currentStress',
  },
  { key: 'current_hp', prop: 'CurrentHp', label: 'classes.expressionVariable.currentHp' },
  { key: 'overshield', prop: 'Overshield', label: 'common.overshield' },
  { key: 'speed', prop: 'Speed', label: 'stats.speed' },
  { key: 'evasion', prop: 'Evasion', label: 'stats.evasion' },
  { key: 'edef', prop: 'Edef', label: 'stats.edefense' },
  { key: 'heatcap', prop: 'Heatcap', label: 'common.heatCapacity' },
  { key: 'heat', prop: 'Heat', label: 'classes.expressionVariable.heat' },
  { key: 'sensors', prop: 'Sensors', label: 'common.sensorRange' },
  { key: 'repcap', prop: 'Repcap', label: 'common.repairCapacity' },
  { key: 'save', prop: 'Save', label: 'classes.expressionVariable.save' },
  { key: 'sp', prop: 'SP', label: 'common.systemPoints' },
]

class FeatureController {
  public readonly Parent: IFeatureController
  public Containers: IFeatureContainer[]
  public readonly BonusController: BonusController

  public constructor(parent: IFeatureController) {
    this.Parent = parent
    this.Containers = []
    this.BonusController = new BonusController(parent)
  }

  public Register(...containers: IFeatureContainer[]) {
    this.Containers = containers
  }

  private collectAll<T>(collection: string): T[] {
    if (!this.Containers.length) {
      return []
    }

    return this.Containers.flatMap(container => Collect(collection, container.FeatureSource))
  }

  private getRootEntity(node: object): object {
    if (node['Parent'] !== undefined) return this.getRootEntity((node as any).Parent)
    return node
  }

  public getRootProperty<T>(prop: string): T | null {
    const root = this.getRootEntity(this)
    if (root[prop] !== undefined) return (root as any)[prop]
    return null
  }

  public static RenderSpecialString(str: string | string[] | number | number[]): string {
    if (!str) return ''
    let sArr = str
    if (!Array.isArray(sArr)) sArr = [str as string]
    strDict.forEach(p => {
      sArr = (sArr as string[]).map(s =>
        s
          .toString()
          .replace(`_`, '')
          .replace(new RegExp(`{${p.key}}`, 'g'), i18n.global.t(p.label))
      )
    })

    return sArr.join(' ')
  }

  public EvaluateSpecial(str: string, returnString = false): string | number {
    if (!str) return returnString ? '' : 0
    let vStr = str

    const ctx = this.Parent.getExpressionContext?.() ?? this._buildLegacyContext()

    for (const [key, val] of Object.entries(ctx)) {
      vStr = vStr.replace(new RegExp(`\\{${key}\\}`, 'g'), String(val))
    }

    // deep references: {entity.stat}
    vStr = vStr.replace(/\{(\w+)\.(\w+)\}/g, (_, entityName, key) => {
      const ref = this.Parent.getEntityRef?.(entityName)
      if (!ref) return '0'
      const refCtx = ref.getExpressionContext?.() ?? {}
      return String(refCtx[key] ?? 0)
    })

    vStr = vStr.replace(/[^-()\d/*+.]/g, '')

    if (returnString) return vStr as string
    if (!vStr.trim()) return 0
    const parser = new Parser()
    try {
      const xpr = parser.parse(vStr)
      return Math.ceil(xpr.evaluate())
    } catch {
      return 0
    }
  }

  private _buildLegacyContext(): ExpressionContext {
    const ctx: ExpressionContext = {}
    strDict.forEach(p => {
      ctx[p.key] = Number(this.getRootProperty<number>(p.prop) ?? 0)
    })
    return ctx
  }

  private get isCoreActive(): boolean {
    return (this.Parent as any).CombatController?.CoreActive || false
  }

  public get Bonuses(): Bonus[] {
    return this.collectAll('Bonuses')
      .concat(this.collectAll('PassiveBonuses'))
      .concat(this.isCoreActive ? this.collectAll('ActiveBonuses') : []) as Bonus[]
  }

  public get Synergies(): Synergy[] {
    return this.collectAll('Synergies').concat(
      this.isCoreActive ? this.collectAll('ActiveSynergies') : []
    ) as Synergy[]
  }

  public get Actions(): Action[] {
    return this.collectAll('Actions')
      .concat(this.collectAll('PassiveActions'))
      .concat(this.isCoreActive ? this.collectAll('ActiveActions') : []) as Action[]
  }

  public get ActiveEffects(): ActiveEffect[] {
    return this.collectAll('ActiveEffects')
      .concat(this.collectAll('PassiveEffects'))
      .concat(this.isCoreActive ? this.collectAll('CoreActiveEffects') : []) as ActiveEffect[]
  }

  public get Deployables(): IDeployableData[] {
    return this.collectAll('Deployables')
  }

  public get IntegratedWeapons(): MechWeapon[] {
    return this.collectAll('IntegratedWeapons')
  }

  public get IntegratedSystems(): MechSystem[] {
    return this.collectAll('IntegratedSystems')
  }

  public get IntegratedSpecialEquipment(): CompendiumItem[] {
    return this.collectAll('SpecialEquipment')
  }

  public get Counters(): Counter[] {
    return this.collectAll('Counters')
  }

  public get AllItems(): CompendiumItem[] {
    return this.Containers.flatMap(container => container.FeatureSource).map(item => item)
  }
}

export { FeatureController }
