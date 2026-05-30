import { Bonus, BonusId } from '../../components/feature/bonus/Bonus'
import { Rules } from '../../utility/Rules'
import { ExpressionContext } from '../../utility/ExpressionContext'
import { IFeatureController } from '../../components/feature/IFeatureController'
import type { Mech } from '../Mech'

class MechStatProvider {
  private _mech: Mech

  constructor(mech: Mech) {
    this._mech = mech
  }

  private get _frame() {
    return this._mech.Frame
  }

  private get _pilot() {
    return this._mech.Pilot
  }

  public get Size(): number {
    let size =
      this._frame.Size >= Rules.MaxFrameSize
        ? this._frame.Size
        : Bonus.Int(this._frame.Size, BonusId.SIZE, this._mech)
    if (size < 0.5) size = 0.5
    if (size > 0.5 && size % 1 !== 0) size = Math.floor(size)
    return size
  }

  public get SizeContributors(): string[] {
    const output = [`FRAME Base Size: ${this._frame.Size}`]
    Bonus.Contributors(BonusId.SIZE, this._mech).forEach(b => {
      const sign = b.val > -1 ? '+' : ''
      output.push(`${b.name}: ${sign}${b.val}`)
    })
    return output
  }

  public get Armor(): number {
    const armor = Bonus.Int(this._frame.Armor, BonusId.ARMOR, this._mech)
    return armor > Rules.MaxMechArmor ? Rules.MaxMechArmor : armor
  }

  public get ArmorContributors(): string[] {
    const output = [`FRAME Base Armor: ${this._frame.Armor}`]
    Bonus.Contributors(BonusId.ARMOR, this._mech).forEach(b => {
      const sign = b.val > -1 ? '+' : ''
      output.push(`${b.name}: ${sign}${b.val}`)
    })
    return output
  }

  public get SaveTarget(): number {
    return Bonus.Int(this._frame.SaveTarget, BonusId.SAVE, this._mech) + this._pilot.Grit
  }

  public get SaveTargetContributors(): string[] {
    const output = [
      `FRAME Base Save Target: ${this._frame.SaveTarget}`,
      `Pilot GRIT Bonus: +${this._pilot.Grit}`,
    ]
    Bonus.Contributors(BonusId.SAVE, this._mech).forEach(b => {
      const sign = b.val > -1 ? '+' : ''
      output.push(`${b.name}: ${sign}${b.val}`)
    })
    return output
  }

  public get Evasion(): number {
    return Bonus.Int(this._frame.Evasion + this._mech.Agi, BonusId.EVASION, this._mech)
  }

  public get EvasionContributors(): string[] {
    const output = [
      `FRAME Base Evasion: ${this._frame.Evasion}`,
      `Pilot AGILITY Bonus: +${this._mech.Agi}`,
    ]
    Bonus.Contributors(BonusId.EVASION, this._mech).forEach(b => {
      const sign = b.val > -1 ? '+' : ''
      output.push(`${b.name}: ${sign}${b.val}`)
    })
    return output
  }

  public get Speed(): number {
    return Bonus.Int(this._frame.Speed + Math.floor(this._mech.Agi / 2), BonusId.SPEED, this._mech)
  }

  public get SpeedContributors(): string[] {
    const output = [
      `FRAME Base Speed: ${this._frame.Speed}`,
      `Pilot AGILITY Bonus: +${Math.floor(this._mech.Agi / 2)}`,
    ]
    Bonus.Contributors(BonusId.SPEED, this._mech).forEach(b => {
      const sign = b.val > -1 ? '+' : ''
      output.push(`${b.name}: ${sign}${b.val}`)
    })
    return output
  }

  public get SensorRange(): number {
    return Bonus.Int(this._frame.SensorRange, BonusId.SENSOR, this._mech)
  }

  public get SensorRangeContributors(): string[] {
    const output = [`FRAME Base Sensor Range: ${this._frame.SensorRange}`]
    Bonus.Contributors(BonusId.SENSOR, this._mech).forEach(b => {
      const sign = b.val > -1 ? '+' : ''
      output.push(`${b.name}: ${sign}${b.val}`)
    })
    return output
  }

  public get EDefense(): number {
    return Bonus.Int(this._frame.EDefense + this._mech.Sys, BonusId.EDEF, this._mech)
  }

  public get EDefenseContributors(): string[] {
    const output = [
      `FRAME Base E-Defense: ${this._frame.EDefense}`,
      `Pilot SYSTEMS Bonus: +${this._mech.Sys}`,
    ]
    Bonus.Contributors(BonusId.EDEF, this._mech).forEach(b => {
      const sign = b.val > -1 ? '+' : ''
      output.push(`${b.name}: ${sign}${b.val}`)
    })
    return output
  }

  public get LimitedBonus(): number {
    return Bonus.Int(Math.floor(this._mech.Eng / 2), BonusId.LIMITED_BONUS, this._mech)
  }

  public get LimitedContributors(): string[] {
    const output = [`Pilot ENGINEERING Bonus: +${Math.floor(this._mech.Eng / 2)}`]
    Bonus.Contributors(BonusId.LIMITED_BONUS, this._mech).forEach(b => {
      const sign = b.val > -1 ? '+' : ''
      output.push(`${b.name}: ${sign}${b.val}`)
    })
    return output
  }

  public get AttackBonus(): number {
    return Bonus.Int(this._pilot.Grit, BonusId.ATTACK, this._mech)
  }

  public get AttackBonusContributors(): string[] {
    const output = [`Pilot GRIT Bonus: ${this._pilot.Grit}`]
    Bonus.Contributors(BonusId.ATTACK, this._mech).forEach(b => {
      const sign = b.val > -1 ? '+' : ''
      output.push(`${b.name}: ${sign}${b.val}`)
    })
    return output
  }

  public get TechAttack(): number {
    return Bonus.Int(this._frame.TechAttack + this._mech.Sys, BonusId.TECH_ATTACK, this._mech)
  }

  public get TechAttackContributors(): string[] {
    const output = [
      `FRAME Base Tech Attack: ${this._frame.TechAttack}`,
      `Pilot SYSTEMS Bonus: +${this._mech.Sys}`,
    ]
    Bonus.Contributors(BonusId.TECH_ATTACK, this._mech).forEach(b => {
      const sign = b.val > -1 ? '+' : ''
      output.push(`${b.name}: ${sign}${b.val}`)
    })
    return output
  }

  public get Grapple(): number {
    return Bonus.Int(Rules.BaseGrapple, BonusId.GRAPPLE, this._mech)
  }

  public get GrappleContributors(): string[] {
    const output = [`Base Grapple Value: ${this.Grapple}`]
    Bonus.Contributors(BonusId.GRAPPLE, this._mech).forEach(b => {
      const sign = b.val > -1 ? '+' : ''
      output.push(`${b.name}: ${sign}${b.val}`)
    })
    return output
  }

  public get Ram(): number {
    return Bonus.Int(Rules.BaseRam, BonusId.RAM, this._mech)
  }

  public get RamContributors(): string[] {
    const output = [`Base Ram Value: ${this.Ram}`]
    Bonus.Contributors(BonusId.RAM, this._mech).forEach(b => {
      const sign = b.val > -1 ? '+' : ''
      output.push(`${b.name}: ${sign}${b.val}`)
    })
    return output
  }

  public get SaveBonus(): number {
    return Bonus.Int(this._pilot.Grit, BonusId.SAVE, this._mech)
  }

  public get SaveBonusContributors(): string[] {
    const output = [`Pilot GRIT Bonus: ${this._pilot.Grit}`]
    Bonus.Contributors(BonusId.SAVE, this._mech).forEach(b => {
      const sign = b.val > -1 ? '+' : ''
      output.push(`${b.name}: ${sign}${b.val}`)
    })
    return output
  }

  public get MaxStructure(): number {
    return Bonus.Int(this._frame.Structure, BonusId.STRUCTURE, this._mech)
  }

  public get StructureContributors(): string[] {
    const output = [`FRAME Base Structure: ${this._frame.Structure}`]
    Bonus.Contributors(BonusId.STRUCTURE, this._mech).forEach(b => {
      const sign = b.val > -1 ? '+' : ''
      output.push(`${b.name}: ${sign}${b.val}`)
    })
    return output
  }

  public get MaxHP(): number {
    return Bonus.Int(
      this._frame.HP + this._pilot.Grit + this._mech.Hull * 2,
      BonusId.HP,
      this._mech
    )
  }

  public get HPContributors(): string[] {
    const output = [
      `FRAME Base HP: ${this._frame.HP}`,
      `Pilot GRIT Bonus: +${this._pilot.Grit}`,
      `Pilot HULL Bonus: +${this._mech.Hull * 2}`,
    ]
    Bonus.Contributors(BonusId.HP, this._mech).forEach(b => {
      const sign = b.val > -1 ? '+' : ''
      output.push(`${b.name}: ${sign}${b.val}`)
    })
    return output
  }

  public get MaxSP(): number {
    return Bonus.Int(
      this._frame.SP + this._pilot.Grit + Math.floor(this._mech.Sys / 2),
      BonusId.SP,
      this._mech
    )
  }

  public get SPContributors(): string[] {
    const output = [
      `FRAME Base SP: ${this._frame.SP}`,
      `Pilot GRIT Bonus: +${this._pilot.Grit}`,
      `Pilot SYSTEMS Bonus: +${Math.floor(this._mech.Sys / 2)}`,
    ]
    Bonus.Contributors(BonusId.SP, this._mech).forEach(b => {
      const sign = b.val > -1 ? '+' : ''
      output.push(`${b.name}: ${sign}${b.val}`)
    })
    return output
  }

  public get HeatCapacity(): number {
    return Bonus.Int(this._frame.HeatCap + this._mech.Eng, BonusId.HEATCAP, this._mech)
  }

  public get HeatCapContributors(): string[] {
    const output = [
      `FRAME Base Heat Capacity: ${this._frame.HeatCap}`,
      `Pilot ENGINEERING Bonus: +${this._mech.Eng}`,
    ]
    Bonus.Contributors(BonusId.HEATCAP, this._mech).forEach(b => {
      const sign = b.val > -1 ? '+' : ''
      output.push(`${b.name}: ${sign}${b.val}`)
    })
    return output
  }

  public get MaxStress(): number {
    return Bonus.Int(this._frame.HeatStress, BonusId.STRESS, this._mech)
  }

  public get StressContributors(): string[] {
    const output = [`FRAME Base Reactor Stress: ${this._frame.HeatStress}`]
    Bonus.Contributors(BonusId.STRESS, this._mech).forEach(b => {
      const sign = b.val > -1 ? '+' : ''
      output.push(`${b.name}: ${sign}${b.val}`)
    })
    return output
  }

  public get RepairCapacity(): number {
    return Bonus.Int(
      this._frame.RepCap + Math.floor(this._mech.Hull / 2),
      BonusId.REPCAP,
      this._mech
    )
  }

  public get RepCapContributors(): string[] {
    const output = [
      `FRAME Base Repair Capacity: ${this._frame.RepCap}`,
      `Pilot HULL Bonus: +${Math.floor(this._mech.Hull / 2)}`,
    ]
    Bonus.Contributors(BonusId.REPCAP, this._mech).forEach(b => {
      const sign = b.val > -1 ? '+' : ''
      output.push(`${b.name}: ${sign}${b.val}`)
    })
    return output
  }

  public get OverchargeTrack(): string[] {
    const b = Bonus.getUneval(BonusId.OVERCHARGE, this._mech)
    return b.length ? b[0].Value : Rules.Overcharge
  }

  public getExpressionContext(): ExpressionContext {
    const grit = this._pilot?.Grit ?? 0
    const hull = this._mech.Hull
    const agi = this._mech.Agi
    const sys = this._mech.Sys
    const eng = this._mech.Eng
    return {
      grit,
      ll: this._pilot?.Level ?? 0,
      hull,
      agi,
      sys,
      eng,
      size: this._frame.Size,
      structure: this._frame.Structure,
      stress: this._frame.HeatStress,
      hp: this._frame.HP + grit + hull * 2,
      armor: this._frame.Armor,
      speed: this._frame.Speed + Math.floor(agi / 2),
      evasion: this._frame.Evasion + agi,
      edef: this._frame.EDefense + sys,
      heatcap: this._frame.HeatCap + eng,
      sensors: this._frame.SensorRange,
      repcap: this._frame.RepCap + Math.floor(hull / 2),
      save: this._frame.SaveTarget + grit,
      sp: this._frame.SP + grit + Math.floor(sys / 2),
      overshield: 0,
    }
  }

  public getEntityRef(name: string): IFeatureController | null {
    switch (name.toLowerCase()) {
      case 'pilot':
        return this._pilot ?? null
      case 'self':
      case 'mech':
        return this._mech
      default:
        return null
    }
  }

  public SetStats(): void {
    const m = this._mech
    const kvps = [
      { key: 'size', val: this.Size },
      { key: 'armor', val: this.Armor },
      { key: 'save', val: this.SaveTarget },
      { key: 'structure', val: this.MaxStructure },
      { key: 'hull', val: m.Hull },
      { key: 'agi', val: m.Agi },
      { key: 'sys', val: m.Sys },
      { key: 'eng', val: m.Eng },
      { key: 'evasion', val: this.Evasion },
      { key: 'speed', val: this.Speed },
      { key: 'sensors', val: this.SensorRange },
      { key: 'edef', val: this.EDefense },
      { key: 'limitedBonus', val: this.LimitedBonus },
      { key: 'attack', val: this.AttackBonus },
      { key: 'techAttack', val: this.TechAttack },
      { key: 'grapple', val: this.Grapple },
      { key: 'ram', val: this.Ram },
      { key: 'hp', val: this.MaxHP },
      { key: 'sp', val: this.MaxSP },
      { key: 'heatcap', val: this.HeatCapacity },
      { key: 'stress', val: this.MaxStress },
      { key: 'repcap', val: this.RepairCapacity },
      { key: 'saveTarget', val: this.SaveTarget },
      { key: 'activations', val: 1 },
      { key: 'burn', val: 0 },
      { key: 'overshield', val: 0 },
      { key: 'overcharge', val: 0 },
    ]

    m.CombatController.setStats(kvps)
  }
}

export { MechStatProvider }
