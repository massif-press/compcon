import { IContentPack, IRangeData, ITagData } from '@/interface'
import { INpcFeatureData, NpcFeature, NpcFeatureType } from '../NpcFeature'
import { ContentPack, Damage, DamageType, ItemType, Range } from '@/class'
import {
  ActiveEffect,
  IActiveEffectData,
} from '@/classes/components/feature/active_effects/ActiveEffect'
import { Npc } from '../../Npc'
import { Eidolon } from '../../eidolon/Eidolon'
import { Unit } from '../../unit/Unit'

export interface INpcDamageData {
  type: string
  val: string | number | (string | number)[]
}

export interface INpcWeaponData extends INpcFeatureData {
  weapon_type: string
  damage: INpcDamageData[]
  range: IRangeData[]
  on_miss?: string | IActiveEffectData
  on_attack?: string | IActiveEffectData
  on_hit?: string | IActiveEffectData
  on_crit?: string | IActiveEffectData
  accuracy?: number[]
  attack_bonus?: number[]
  attacks: number | number[]
}

export class NpcWeapon extends NpcFeature {
  public ItemType: ItemType = ItemType.NpcWeapon

  private _weapon_type: string
  private _damage_data: INpcDamageData[]
  private _range: Range[]
  private _accuracy: number[]
  private _attack_bonus: number[]
  public OnMiss?: ActiveEffect
  public OnAttack?: ActiveEffect
  public OnHit?: ActiveEffect
  public OnCrit?: ActiveEffect
  public readonly Attacks: number[]

  public constructor(data: INpcWeaponData, pack?: ContentPack) {
    super(data, pack)
    this._damage_data = data.damage

    this._range = data.range.map(x => new Range(x))
    this._weapon_type = data.weapon_type
    if (data.on_miss) {
      if (typeof data.on_miss === 'string')
        this.OnMiss = new ActiveEffect({ name: 'On Miss Effect', detail: data.on_miss }, this)
      else this.OnMiss = new ActiveEffect(data.on_miss, this)
    }
    if (data.on_attack) {
      if (typeof data.on_attack === 'string')
        this.OnAttack = new ActiveEffect({ name: 'On Attack Effect', detail: data.on_attack }, this)
      else this.OnAttack = new ActiveEffect(data.on_attack, this)
    }
    if (data.on_hit) {
      if (typeof data.on_hit === 'string')
        this.OnHit = new ActiveEffect({ name: 'On Hit Effect', detail: data.on_hit }, this)
      else this.OnHit = new ActiveEffect(data.on_hit, this)
    }
    if (data.on_crit) {
      if (typeof data.on_crit === 'string')
        this.OnCrit = new ActiveEffect({ name: 'On Crit Effect', detail: data.on_crit }, this)
      else this.OnCrit = new ActiveEffect(data.on_crit, this)
    }
    this.Attacks = this._expand(data.attacks)
    this._accuracy = this._expand(data.accuracy)
    this._attack_bonus = this._expand(data.attack_bonus)
    this.FeatureType = NpcFeatureType.Weapon
  }

  private _expand(x: any) {
    if (!x) return [0, 0, 0]
    if (Array.isArray(x)) return x
    return [x, x, x]
  }

  public get WeaponType(): string {
    return this._weapon_type
  }

  public get IsSuperheavy(): boolean {
    return this.WeaponType.toLowerCase().includes('superheavy')
  }

  // public get IsLimited(): boolean {
  //   return this.Tags.some((x) => x.IsLimited);
  // }

  public get IsRecharging(): boolean {
    return this.Tags.some(x => x.IsRecharging)
  }

  // public get ChargeRoll(): string {
  //   const rechargingTag = this.Tags.find((x) => x.IsRecharging);
  //   return rechargingTag ? rechargingTag.Value.toString() : '';
  // }

  public get RangeData(): Range[] {
    return this._range
  }

  public Range(tier: number, mods?: NpcWeapon[]): Range[] {
    if (!this._range) return []

    return this._range.map(r => {
      let rangemap
      if (!Array.isArray(r.Value)) rangemap = Array(3).fill(r.Value)
      else rangemap = r.Value

      let val = rangemap[tier - 1]

      const appliedMods = (
        mods
          ?.filter(m => m._range)
          .flatMap(m => m.Range(tier))
          .filter(mR => r.Type.toLowerCase() === mR.Type) || []
      ).sort((a, b) => {
        if (typeof a === typeof b) return 0
        return typeof a === 'number' ? -1 : 1
      })
      if (appliedMods.length) {
        appliedMods.forEach(mod => {
          if (mod.IsRollable) {
            val = `${val} + ${mod.TieredRange(tier)}`
          } else {
            val = parseInt(String(val)) + parseInt(mod.TieredRange(tier))
          }
        })
      }

      return new Range({
        type: r.Type,
        val,
      })
    })
  }

  public get DamageData(): INpcDamageData[] {
    return this._damage_data
  }

  public Damage(tier: number, mods?: NpcWeapon[]): Damage[] {
    if (!this._damage_data) return []

    return this._damage_data.map((x: INpcDamageData) => {
      let dmgArr = x.val || (x as any).damage
      if (!Array.isArray(dmgArr)) dmgArr = Array(3).fill(dmgArr)

      let val = dmgArr[tier - 1] as string | number

      const appliedMods = (
        mods
          ?.filter(m => m._damage_data)
          .flatMap(m => m.Damage(tier))
          .filter(mD => x.type.toLowerCase() === mD.Type) || []
      ).sort((a, b) => {
        if (typeof a === typeof b) return 0
        return typeof a === 'number' ? -1 : 1
      })

      if (appliedMods.length) {
        appliedMods.forEach(mod => {
          if (mod.IsRollable) {
            val = `${val} + ${mod.TieredDamage(tier)}`
          } else {
            val = parseInt(String(val)) + parseInt(mod.TieredDamage(tier))
          }
        })
      }

      const dmg = new Damage({
        type: x.type as DamageType,
        val,
      })

      dmg.setDamageAttributes(this)

      return dmg
    })
  }

  public get HasAccuracy(): boolean {
    return this._accuracy.some(x => x > 0)
  }

  public Accuracy(tier: number): number {
    return this._accuracy[tier - 1]
  }

  public AttackBonus(tier: number): number {
    return this._attack_bonus[tier - 1]
  }

  public get Color(): string {
    return 'npc--weapon'
  }

  public get Icon(): string {
    return 'cc:weapon'
  }

  public get ActivationCost(): string {
    if (this.WeaponType.toLowerCase().includes('superheavy')) return 'full'
    return 'quick'
  }

  public getAppliedMods(actor: Unit | Eidolon): NpcWeapon[] {
    if (!actor || actor instanceof Eidolon) return []
    return actor.NpcFeatureController.GetModifiers(this) as NpcWeapon[]
  }

  public toActiveEffectData(actor: Unit | Eidolon): IActiveEffectData {
    return {
      name: this.Name,
      detail: `Attack with ${this.Name}`,
      range: this.Range(actor.Tier, this.getAppliedMods(actor)).map(r => Range.Serialize(r)),
      damage: this.Damage(actor.Tier, this.getAppliedMods(actor)).map(d => Damage.Serialize(d)),
      attack: this.WeaponType.toLowerCase().includes('ranged')
        ? 'ranged'
        : this.WeaponType.toLowerCase().includes('tech')
          ? 'tech'
          : 'melee',
      can_crit: true,
    }
  }
}
