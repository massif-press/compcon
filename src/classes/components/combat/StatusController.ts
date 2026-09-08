import { markRaw } from 'vue'
import { Status } from '@/classes/Status'
import { ruleFor, customRuleFor, kindsFor } from './StatusRules'
import type { IStatusRule } from './StatusRules'
import { normalizeActivation } from './ActionPoolController'
import { statusRef } from './log/refs'
import { AddStatusFlow } from './flows/StatusFlow'
import { expiration } from './Expiration'
import { EffectSpecial } from '../feature/active_effects/effect_subtype/EffectSpecial'
import { EncounterInstance } from '@/classes/encounter/EncounterInstance'
import { CompendiumStore } from '@/features/compendium/store'
import type { CombatController } from './CombatController'
import { expiredIn } from './Duration'

class StatusController {
  private _parent: CombatController

  public Resistances: { type: string; condition: string }[] = []
  public Statuses: { status: Status; expires: expiration; selfInflicted?: boolean }[] = []
  public CustomStatuses: { status: EffectSpecial; expires: expiration }[] = []

  constructor(parent: CombatController) {
    this._parent = parent
  }

  private get _active(): CombatController {
    return this._parent.ActiveActor.CombatController
  }

  private _resolveExpiration(expires: any, target?: CombatController): expiration {
    if (typeof expires === 'string') return markRaw(new expiration(expires, this._parent, target))
    if (expires) return markRaw(expires) as expiration
    return expires as expiration
  }

  public ResolveExpiration(expires: any, target?: CombatController): expiration {
    return this._resolveExpiration(expires, target)
  }

  public get ActiveController(): CombatController {
    return this._active
  }

  public get ActiveStatusController(): StatusController {
    return this._active.StatusController
  }

  public LogStatusGained(status: Status, duration?: string, selfInflicted?: boolean): void {
    this._parent.Record('status.gain', {
      status: statusRef(status),
      duration,
      selfInflicted,
    })
  }

  public HasStatus(statusID: string): boolean {
    return this._active.StatusController.Statuses.some(s => s.status.ID === statusID)
  }

  public AddStatus(statusID: string, expires?: any, opts: { selfInflicted?: boolean } = {}): void {
    AddStatusFlow.Begin({
      sc: this,
      cc: this._parent,
      statusID,
      expires,
      selfInflicted: !!opts.selfInflicted,
      applied: false,
    })
  }

  public RemoveStatus(
    statusID: string,
    reason: 'expired' | 'removed' | 'cleared' | 'replaced' | 'consumed' = 'removed'
  ): void {
    const target = this._active.StatusController
    const existingIndex = target.Statuses.findIndex(s => s.status.ID === statusID)
    if (existingIndex === -1) return
    const [lost] = target.Statuses.splice(existingIndex, 1)
    this._parent.Record('status.lose', { status: statusRef(lost.status), reason })
    ruleFor(statusID)?.implies?.forEach(id => this.RemoveStatus(id, reason))
  }

  public ToggleStatus(status: Status, expires?: any, thisController = false): void {
    if (!status) return
    const target = thisController ? this : this._active.StatusController
    const resolvedExpires = this._resolveExpiration(expires, this._active)
    const existingIndex = target.Statuses.findIndex(s => s.status.ID === status.ID)
    if (existingIndex === -1) {
      target.Statuses.push({ status, expires: resolvedExpires })
      this._parent.Record('status.gain', { status: statusRef(status) })
    } else {
      target.Statuses.splice(existingIndex, 1)
      this._parent.Record('status.lose', { status: statusRef(status), reason: 'removed' })
    }
  }

  public SetCustomStatus(special: EffectSpecial, expires?: any): void {
    if (!special) return
    const resolvedExpires = this._resolveExpiration(expires)
    const existingIndex = this.CustomStatuses.findIndex(
      s => s.status.Attribute === special.Attribute
    )
    if (existingIndex === -1) {
      this.CustomStatuses.push({ status: special, expires: resolvedExpires })
      this._parent.Record('status.gain', { status: statusRef(special) })
    } else if (expires) {
      this.CustomStatuses[existingIndex].expires = resolvedExpires
    } else {
      this.CustomStatuses.splice(existingIndex, 1)
      this._parent.Record('status.lose', { status: statusRef(special), reason: 'removed' })
    }
  }

  public ApplyCustomStatus(
    customStatus: EffectSpecial,
    expires: string,
    owner: CombatController,
    target: CombatController,
    encounter: EncounterInstance
  ): void {
    if (this._parent.SaveLock) return
    if (!customStatus) return
    const expirationObj = markRaw(new expiration(expires, owner, target, encounter))
    const activeTarget = this._active.StatusController
    const existingIndex = activeTarget.CustomStatuses.findIndex(
      s => s.status.Attribute === customStatus.Attribute
    )
    if (existingIndex === -1) {
      activeTarget.CustomStatuses.push({ status: customStatus, expires: expirationObj })
    } else {
      activeTarget.CustomStatuses[existingIndex].expires.Raw = expires
    }
  }

  public HasCondition(id: string): boolean {
    if (this.HasStatus(id)) return true
    const key = id.toLowerCase()
    return this._active.StatusController.CustomStatuses.some(
      s => s.status.Attribute?.toLowerCase() === key
    )
  }

  public HasCustomStatus(attribute: string): boolean {
    return this._active.StatusController.CustomStatuses.some(s => s.status.Attribute === attribute)
  }

  public static readonly CASCADE_ATTRIBUTE = 'In Cascade'
  public static readonly CASCADE_DETAIL =
    'An installed NHP has entered CASCADE and has taken full control of the mech. The mech is in control of the GM until the Pilot reclaims control by choosing to Shut Down the mech.'

  public get InCascade(): boolean {
    return this.HasCustomStatus(StatusController.CASCADE_ATTRIBUTE)
  }

  public RemoveCustomStatus(attribute: string): void {
    const target = this._active.StatusController
    const existingIndex = target.CustomStatuses.findIndex(s => s.status.Attribute === attribute)
    if (existingIndex !== -1) {
      target.CustomStatuses.splice(existingIndex, 1)
      this._parent.CombatLogVersion++
    }
  }

  public SetResistance(type: string, condition?: string, thisActor = false): void {
    condition = condition?.toLowerCase() || 'off'
    const target = thisActor ? this : this._active.StatusController

    const existingIndex = target.Resistances.findIndex(s => s.type === type)
    if (existingIndex === -1) {
      target.Resistances.push({ type, condition })
      this._parent.Record('resist.change', { damageType: type, condition })
    } else if (condition && condition !== 'off') {
      target.Resistances[existingIndex].condition = condition
      this._parent.Record('resist.change', { damageType: type, condition })
    } else {
      target.Resistances.splice(existingIndex, 1)
      this._parent.Record('resist.change', { damageType: type, condition, removed: true })
    }
  }

  public AddResist(type: string, condition = 'vulnerable'): void {
    this.SetResistance(type, condition)
  }

  public RemoveResist(type: string): void {
    type = type.toLowerCase()
    const target = this._active.StatusController
    const existingIndex = target.Resistances.findIndex(s => s.type === type)
    if (existingIndex > -1) {
      target.Resistances.splice(existingIndex, 1)
      this._parent.CombatLogVersion++
    }
  }

  public GetResistance(damageType: string): string {
    const resist = this._active.StatusController.Resistances.find(
      r => r.type === damageType.toLowerCase()
    )

    if (!resist || !resist.condition) return 'none'

    if (resist.condition === 'vulnerable') {
      return resist.condition
    } else {
      return this.HasStatus('shredded') ? 'none' : resist.condition
    }
  }

  public getExpiredStatuses(
    currentRound: number,
    currentActorID: string,
    currentTurn: number
  ): { status: Status; expires: expiration }[] {
    return expiredIn(this.Statuses, {
      round: currentRound,
      actorId: currentActorID,
      turn: currentTurn,
    })
  }

  private get _activeRules(): IStatusRule[] {
    return [
      ...this.Statuses.map(s => ruleFor(s.status.ID)),
      ...this.CustomStatuses.map(s => customRuleFor(s.status.Attribute || '')),
    ].filter(Boolean) as IStatusRule[]
  }

  public DifficultyFor(kind: string): number {
    const kinds = kindsFor(kind)
    return this._activeRules.reduce(
      (sum, r) => sum + kinds.reduce((k, key) => k + (r.difficulty?.[key] ?? 0), 0),
      0
    )
  }

  public AccuracyAgainst(): number {
    return this._activeRules.reduce((sum, r) => sum + (r.accuracyAgainst ?? 0), 0)
  }

  public DifficultyAgainst(): number {
    return this._activeRules.reduce((sum, r) => sum + (r.difficultyAgainst ?? 0), 0)
  }

  public AutoFails(check: string): boolean {
    const key = check.toLowerCase()
    return this._activeRules.some(r => r.autoFail?.includes(key as any))
  }

  public DeniesActivation(action: string, actionId?: string): boolean {
    const keys = [normalizeActivation(action), (actionId || '').toLowerCase()].filter(Boolean)
    return this._activeRules.some(r => {
      if (r.permits?.some(p => keys.includes(p))) return false
      if (r.denies?.includes('*')) return true
      return !!r.denies?.some(d => keys.includes(d))
    })
  }

  public StatCap(stat: string): number | undefined {
    const key = stat.toLowerCase()
    const caps = this._activeRules
      .map(r => r.caps?.[key])
      .filter((v): v is number => typeof v === 'number')
    return caps.length ? Math.min(...caps) : undefined
  }

  public get CanBeTargeted(): boolean {
    return !this._activeRules.some(r => r.untargetable)
  }

  public get InvisibilityMissChance(): number {
    return Math.max(0, ...this._activeRules.map(r => r.missChance ?? 0))
  }

  public get ImmuneToTech(): boolean {
    return this._activeRules.some(r => r.immuneToTech)
  }

  public get ImmuneToAlliedTech(): boolean {
    return this._activeRules.some(r => r.immuneToAlliedTech)
  }

  public ImmuneTo(kind: string, action: string, fromAlly = false): boolean {
    if (kind.toLowerCase() !== 'tech') return false
    if (this.ImmuneToTech) return true
    if (fromAlly && this.ImmuneToAlliedTech) return true
    if (!this._parent.IsBiological && !this._parent.IsPilot) return false
    return !['scan', 'lock_on', 'lockon'].includes(action.toLowerCase())
  }

  public ClearableConditions(): { status: Status; expires: expiration; selfInflicted?: boolean }[] {
    return this.Statuses.filter(s => s.status.StatusType === 'Condition' && !s.selfInflicted)
  }

  public DropStatuses(flag: 'dropsOnAttack' | 'dropsOnHostileAction' | 'fromTechAction'): void {
    this.Statuses.filter(s => ruleFor(s.status.ID)?.[flag]).forEach(s =>
      this.RemoveStatus(s.status.ID)
    )
  }

  public Serialize(target: any): void {
    target.statuses = this.Statuses.map(s => ({
      status: s.status.ID,
      expires: expiration.Serialize(s.expires),
      selfInflicted: s.selfInflicted,
    }))
    target.customStatuses = this.CustomStatuses.map(s => ({
      status: EffectSpecial.Serialize(s.status),
      expires: s.expires?.Raw,
    }))
    target.resistances = this.Resistances.map(r => ({ ...r }))
  }

  public Deserialize(data: any): void {
    this.Resistances = data?.resistances || []
    this.Statuses = (data?.statuses || [])
      .map((s: any) => ({
        status: CompendiumStore().Statuses.find(st => st.ID === s.status),
        expires: markRaw(expiration.Deserialize(s.expires)),
        selfInflicted: s.selfInflicted ?? false,
      }))
      .filter((s: any) => s.status != null)
    this.CustomStatuses = (data?.customStatuses || []).map((s: any) => ({
      status: EffectSpecial.Deserialize(s.status),
      expires: markRaw(expiration.Deserialize(s.expires)),
    }))
  }
}

export { StatusController }
