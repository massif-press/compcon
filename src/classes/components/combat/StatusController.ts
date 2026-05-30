import { markRaw } from 'vue'
import { Status } from '@/classes/Status'
import { CompendiumStore } from '@/features/compendium/store'
import { expiration } from './Expiration'
import {
  EffectSpecial,
  IEffectSpecialData,
} from '../feature/active_effects/effect_subtype/EffectSpecial'
import { EncounterInstance } from '@/classes/encounter/EncounterInstance'
import type { CombatController } from './CombatController'

class StatusController {
  private _parent: CombatController

  public Resistances: { type: string; condition: string }[] = []
  public Statuses: { status: Status; expires: expiration }[] = []
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

  public HasStatus(statusID: string): boolean {
    return this._active.StatusController.Statuses.some(s => s.status.ID === statusID)
  }

  public AddStatus(statusID: string, expires?: any): void {
    const status = CompendiumStore().Statuses.find(s => s.ID === statusID)
    if (!status) return
    const target = this._active.StatusController
    const resolvedExpires = this._resolveExpiration(expires, this._active)
    const existingIndex = target.Statuses.findIndex(s => s.status.ID === status.ID)
    if (existingIndex === -1) {
      target.Statuses.push({ status, expires: resolvedExpires })
      this._parent.log(`Gained ${status.Name}`)
    } else if (resolvedExpires) {
      target.Statuses[existingIndex].expires = resolvedExpires
    }
  }

  public RemoveStatus(statusID: string): void {
    const target = this._active.StatusController
    const existingIndex = target.Statuses.findIndex(s => s.status.ID === statusID)
    if (existingIndex !== -1) {
      target.Statuses.splice(existingIndex, 1)
    }
  }

  public ToggleStatus(status: Status, expires?: any, thisController = false): void {
    if (!status) return
    const target = thisController ? this : this._active.StatusController
    const resolvedExpires = this._resolveExpiration(expires, this._active)
    const existingIndex = target.Statuses.findIndex(s => s.status.ID === status.ID)
    if (existingIndex === -1) {
      target.Statuses.push({ status, expires: resolvedExpires })
      this._parent.log(`Gained ${status.Name}`)
    } else {
      target.Statuses.splice(existingIndex, 1)
      this._parent.log(`Lost ${status.Name}`)
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
      this._parent.log(`Gained special status: ${special.Attribute}`)
    } else if (expires) {
      this.CustomStatuses[existingIndex].expires = resolvedExpires
    } else {
      this.CustomStatuses.splice(existingIndex, 1)
      this._parent.log(`Lost special status: ${special.Attribute}`)
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

  public HasCustomStatus(attribute: string): boolean {
    return this._active.StatusController.CustomStatuses.some(
      s => s.status.Attribute === attribute
    )
  }

  public get InCascade(): boolean {
    return this.HasCustomStatus('In Cascade')
  }

  public RemoveCustomStatus(attribute: string): void {
    const target = this._active.StatusController
    const existingIndex = target.CustomStatuses.findIndex(s => s.status.Attribute === attribute)
    if (existingIndex !== -1) {
      target.CustomStatuses.splice(existingIndex, 1)
    }
  }

  public SetResistance(type: string, condition?: string, thisActor = false): void {
    condition = condition?.toLowerCase() || 'off'
    const target = thisActor ? this : this._active.StatusController

    const existingIndex = target.Resistances.findIndex(s => s.type === type)
    if (existingIndex === -1) {
      target.Resistances.push({ type, condition })
      this._parent.log(`Gained ${type} ${condition}`)
    } else if (condition && condition !== 'off') {
      target.Resistances[existingIndex].condition = condition
    } else {
      this.Resistances.splice(existingIndex, 1)
      this._parent.log(`Lost ${type} ${condition}`)
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
      this.Resistances.splice(existingIndex, 1)
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
    return this.Statuses.filter(s =>
      s.expires?.HasExpired(currentRound, currentActorID, currentTurn)
    )
  }
}

export { StatusController }
