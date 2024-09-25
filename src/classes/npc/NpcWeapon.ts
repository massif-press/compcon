import { Range, Damage } from '@/class'
import { IRangeData } from '@/interface'
import { NpcFeature, NpcFeatureType } from '.'
import { INpcFeatureData } from './interfaces'
import { DamageType } from '../enums'

export interface INpcDamageData {
  type: string
  damage: number[]
}

export interface INpcWeaponData extends INpcFeatureData {
  weapon_type: string
  damage: INpcDamageData[]
  range: IRangeData[]
  on_hit: string
  accuracy: number[]
  attack_bonus: number[]
  tags: ITagData[]
  type: NpcFeatureType.Weapon
}

export class NpcWeapon extends NpcFeature {
  private _weapon_type: string
  private _damage_data: INpcDamageData[]
  private _range: Range[]
  private _accuracy: number[]
  private _attack_bonus: number[]
  private _on_hit?: string

  public constructor(data: INpcWeaponData, packName?: string) {
    super(data, packName)
    this._on_hit = data.on_hit || ''
    this._weapon_type = data.weapon_type
    this._damage_data = data.damage
    this._accuracy = data.accuracy || [0, 0, 0]
    this._attack_bonus = data.attack_bonus || [0, 0, 0]
    this._range = data.range.map(x => new Range(x))
    this.type = NpcFeatureType.Weapon
  }

  public get WeaponType(): string {
    return this._weapon_type
  }

  public get OnHit(): string {
    return this._on_hit
  }

  public get IsLimited(): boolean {
    return this.Tags.some(x => x.IsLimited)
  }

  public get IsRecharging(): boolean {
    return this.Tags.some(x => x.IsRecharging)
  }

  public get ChargeRoll(): string {
    return this.Tags.find(x => x.IsRecharging).Value.toString()
  }

  public get Range(): Range[] {
    return this._range
  }

  public Damage(tier: number): Damage[] {
    return this._damage_data.map(
      (x: INpcDamageData) =>
        new Damage({
          type: x.type as DamageType,
          val: x.damage[tier - 1],
        })
    )
  }

  public Accuracy(tier: number): number {
    return this._accuracy[tier - 1]
  }

  public AttackBonus(tier: number): number {
    return this._attack_bonus[tier - 1]
  }

  public AttackSummary(tier: number): String {
    let output: String = ''
    if(this.AttackBonus(tier)<=0) {
      output += `${this.AttackBonus(tier)}`
    } else {
      output += `+${this.AttackBonus(tier)}`
    }
    if(this.Accuracy(tier)<0) {
      output += `, ${this.Accuracy(tier)} DIF`
    } else if(this.Accuracy(tier)>0) {
      output += `, ${this.Accuracy(tier)} ACC`
    }
    return output
  }

  public generateSummary(tier: number): string {
    let output = ''
    output += `${this.WeaponType}\n    `

    if(this.Tags.length){
      output += this.Tags.map(
        (item) => 
          `${item.GetName()}`
      ).join(', ')
      output += '\n    '
    }

    output += this.Range.map(
      (item) =>
        `${item.Type} ${item.Value} `
    ).join(' ')
    output += '| '
    output += this.Damage(tier).map(
      (item) =>
        `${item.Value} ${item.Type}`
    ).join(' ')
    output += ` | Attack Bonus: ${this.AttackSummary(tier)}`


    if(this.OnHit) {
      output += `\n    On Hit: ${this.OnHit}`
    }
    if(this.EffectByTier(tier)){
      output += `\n    ${this.EffectByTier(tier)}`
    }
    return output
  }
  
  public get Color(): string {
    return 'npc--weapon'
  }

  public get Icon(): string {
    return 'cci-weapon'
  }
}
