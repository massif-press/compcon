import { store } from '@/store'
import uuid from 'uuid/v4'
import _ from 'lodash'
import { Rules, Pilot, Frame, CoreBonus, Mount } from '@/class'
import { ImageTag } from '@/io/ImageManagement'
import { Bonus } from '../components/feature/bonus/Bonus'
import { ActivePeriod } from '../Action'
import { IMechLoadoutData } from './components/loadout/MechLoadout'
import {
  IPortraitContainer,
  IPortraitData,
  ISaveable,
  ISaveData,
  PortraitController,
  SaveController,
} from '../components'
import { IFeatureController } from '../components/feature/IFeatureController'
import { FeatureController } from '../components/feature/FeatureController'
import {
  IMechLoadoutSaveData,
  MechLoadoutController,
} from './components/loadout/MechLoadoutController'
import { IActor } from '../encounter/IActor'
import { CompendiumItem } from '../CompendiumItem'

class IMechData implements IPortraitData, ISaveData, IMechLoadoutSaveData {
  deleteTime: string
  expireTime: string
  lastModified: string
  isDeleted: boolean
  id: string
  name: string
  notes: string
  gm_note: string
  portrait: string
  cloud_portrait: string
  frame: string
  active: boolean
  current_structure: number
  current_move: number
  boost: number
  current_hp: number
  overshield: number
  current_stress: number
  current_heat: number
  current_repairs: number
  current_overcharge: number
  current_core_energy: number
  loadouts: IMechLoadoutData[]
  active_loadout_index: number
  statuses: string[]
  conditions: string[]
  resistances: string[]
  reactions: string[]
  burn: number
  destroyed: boolean
  defeat: string
  activations: number
  meltdown_imminent: boolean
  reactor_destroyed: boolean
  core_active: boolean
  cc_ver: string
}

class Mech implements IActor, IPortraitContainer, ISaveable, IFeatureController {
  public readonly ItemType: string = 'mech'

  public SaveController: SaveController
  public PortraitController: PortraitController
  public ImageTag = ImageTag.Mech
  public FeatureController: FeatureController
  public MechLoadoutController: MechLoadoutController

  private _id: string
  private _name: string
  private _notes: string
  private _gm_note: string
  private _frame: Frame
  private _missing_structure: number
  private _missing_hp: number
  private _overshield: number
  private _missing_stress: number
  private _missing_repairs: number
  private _current_heat: number
  private _current_core_energy: number
  private _current_overcharge: number
  private _activations: number
  private _active: boolean
  private _pilot: Pilot
  private _cc_ver: string
  private _statuses: string[]
  private _conditions: string[]
  private _resistances: string[]
  private _reactions: string[]
  private _destroyed: boolean
  private _defeat: string
  private _reactor_destroyed: boolean
  private _meltdown_imminent: boolean
  private _burn: number
  private _turn_actions: number
  private _currentMove: number
  private _boost: number
  private _core_active: boolean

  public constructor(frame: Frame, pilot: Pilot) {
    this._id = uuid()
    this._frame = frame
    this.SaveController = new SaveController(this)
    this.PortraitController = new PortraitController(this)
    this.FeatureController = new FeatureController(this)
    this.MechLoadoutController = new MechLoadoutController(this)

    this._name = ''
    this._notes = ''
    this._gm_note = ''
    this._pilot = pilot
    this._active = false
    this._overshield = 0
    this._current_heat = 0
    this._current_core_energy = 1
    this._current_overcharge = 0
    this._statuses = []
    this._conditions = []
    this._resistances = []
    this._reactions = []
    this._burn = 0
    this._destroyed = false
    this._defeat = ''
    this._reactor_destroyed = false
    this._meltdown_imminent = false
    this._missing_structure = 0
    this._missing_hp = 0
    this._missing_stress = 0
    this._missing_repairs = 0
    this._currentMove = frame.Speed
    this._boost = 0
    this._activations = 1
    this._turn_actions = 2
    this._core_active = false
    this._cc_ver = store.getters.getVersion || 'N/A'

    this.FeatureController.Register(
      this.Frame,
      this.MechLoadoutController,
      this.Parent.CoreBonusController,
      this.Parent.ReservesController
    )

    this.MechLoadoutController.UpdateLoadouts()
  }

  // -- Passthroughs ------------------------------------------------------------------------------
  public get Portrait(): string {
    return this.PortraitController.Portrait
  }

  public get BrewableItems(): CompendiumItem[] {
    return [
      this.Frame,
      ...this.MechLoadoutController.Loadouts.flatMap(l => l.Equipment),
    ] as CompendiumItem[]
  }

  // -- Info --------------------------------------------------------------------------------------
  public get ID(): string {
    return this._id
  }

  public RenewID(): void {
    this._id = uuid()
  }

  public get Name(): string {
    return this._name
  }

  public set Name(name: string) {
    this._name = name
    this.SaveController.save()
  }

  public get EncounterName(): string {
    return this.Pilot.Callsign
  }

  public get Icon(): string {
    return 'cci-pilot'
  }

  public get Notes(): string {
    return this._notes
  }

  public set Notes(notes: string) {
    this._notes = notes
    this.SaveController.save()
  }

  public get GmNote(): string {
    return this._gm_note
  }

  public set GmNote(val: string) {
    this._gm_note = val
    this.SaveController.save()
  }

  public get Frame(): Frame {
    return this._frame
  }

  public get Pilot(): Pilot {
    return this._pilot
  }

  public get Parent(): Pilot {
    return this._pilot
  }

  public get IsActive(): boolean {
    return this.Pilot.State.ActiveMech?.ID === this.ID
  }

  public get IsCascading(): boolean {
    if (!this.MechLoadoutController.ActiveLoadout.AICount) return false
    return !!this.MechLoadoutController.ActiveLoadout.Equipment.filter(x => x.IsCascading).length
  }

  public get RequiredLicenses(): ILicenseRequirement[] {
    const requirements = this.MechLoadoutController.ActiveLoadout
      ? this.MechLoadoutController.ActiveLoadout.RequiredLicenses
      : ([] as ILicenseRequirement[])

    if (this._frame.LicenseLevel === 0) {
      const gmsIdx = requirements.findIndex(x => x.source === 'GMS')
      if (gmsIdx > -1) requirements[gmsIdx].items.push(`${this._frame.Name.toUpperCase()} Frame`)
      else requirements.push(this.Frame.RequiredLicense)
    } else {
      const reqIdx = requirements.findIndex(x => x.name === `${this._frame.Name}` && x.rank === 2)
      if (reqIdx > -1) requirements[reqIdx].items.push(`${this._frame.Name.toUpperCase()} Frame`)
      else requirements.push(this.Frame.RequiredLicense)
    }

    for (const l of requirements) {
      if (l.source === 'GMS') continue
      l.missing = !this._pilot.has('License', l.name, l.rank)
    }

    return requirements.sort((a, b) => {
      return a.rank < b.rank ? -1 : a.rank > b.rank ? 1 : 0
    })
  }

  // -- Attributes --------------------------------------------------------------------------------
  public get SizeIcon(): string {
    return `cci-size-${this.Size === 0.5 ? 'half' : this.Size}`
  }

  public get Size(): number {
    let size =
      this._frame.Size >= Rules.MaxFrameSize
        ? this._frame.Size
        : Bonus.Int(this._frame.Size, 'size', this)
    if (size < 0.5) size = 0.5
    if (size > 0.5 && size % 1 !== 0) size = Math.floor(size)
    return size
  }

  public get SizeContributors(): string[] {
    const output = [`FRAME Base Size: ${this.Frame.Size}`]
    Bonus.Contributors('size', this).forEach(b => {
      const sign = b.val > -1 ? '+' : ''
      output.push(`${b.name}: ${sign}${b.val}`)
    })
    return output
  }

  public get Armor(): number {
    const armor = Bonus.Int(this._frame.Armor, 'armor', this)
    return armor > Rules.MaxMechArmor ? Rules.MaxMechArmor : armor
  }

  public get ArmorContributors(): string[] {
    const output = [`FRAME Base Armor: ${this.Frame.Armor}`]
    Bonus.Contributors('armor', this).forEach(b => {
      const sign = b.val > -1 ? '+' : ''
      output.push(`${b.name}: ${sign}${b.val}`)
    })
    return output
  }

  public get SaveTarget(): number {
    return Bonus.Int(this._frame.SaveTarget, 'save', this) + this._pilot.Grit
  }

  public get SaveTargetContributors(): string[] {
    const output = [
      `FRAME Base Save Target: ${this.Frame.SaveTarget}`,
      `Pilot GRIT Bonus: +${this._pilot.Grit}`,
    ]
    Bonus.Contributors('save', this).forEach(b => {
      const sign = b.val > -1 ? '+' : ''
      output.push(`${b.name}: ${sign}${b.val}`)
    })
    return output
  }

  public get Evasion(): number {
    if (this.IsStunned) return 5
    return Bonus.Int(this._frame.Evasion + this.Agi, 'evasion', this)
  }

  public get EvasionContributors(): string[] {
    if (this.IsStunned) return ['STUNNED']
    const output = [
      `FRAME Base Evasion: ${this.Frame.Evasion}`,
      `Pilot AGILITY Bonus: +${this.Agi}`,
    ]
    Bonus.Contributors('evasion', this).forEach(b => {
      const sign = b.val > -1 ? '+' : ''
      output.push(`${b.name}: ${sign}${b.val}`)
    })
    return output
  }

  public get Speed(): number {
    return Bonus.Int(this._frame.Speed + Math.floor(this.Agi / 2), 'speed', this)
  }

  public get SpeedContributors(): string[] {
    const output = [
      `FRAME Base Speed: ${this.Frame.Speed}`,
      `Pilot AGILITY Bonus: +${Math.floor(this.Agi / 2)}`,
    ]
    Bonus.Contributors('speed', this).forEach(b => {
      const sign = b.val > -1 ? '+' : ''
      output.push(`${b.name}: ${sign}${b.val}`)
    })
    return output
  }

  public get SensorRange(): number {
    return Bonus.Int(this._frame.SensorRange, 'sensor', this)
  }

  public get SensorRangeContributors(): string[] {
    const output = [`FRAME Base Sensor Range: ${this.Frame.SensorRange}`]
    Bonus.Contributors('sensor', this).forEach(b => {
      const sign = b.val > -1 ? '+' : ''
      output.push(`${b.name}: ${sign}${b.val}`)
    })
    return output
  }

  public get EDefense(): number {
    return Bonus.Int(this._frame.EDefense + this.Sys, 'edef', this)
  }

  public get EDefenseContributors(): string[] {
    const output = [
      `FRAME Base E-Defense: ${this.Frame.EDefense}`,
      `Pilot SYSTEMS Bonus: +${this.Sys}`,
    ]
    Bonus.Contributors('edef', this).forEach(b => {
      const sign = b.val > -1 ? '+' : ''
      output.push(`${b.name}: ${sign}${b.val}`)
    })
    return output
  }

  public get LimitedBonus(): number {
    return Bonus.Int(Math.floor(this.Eng / 2), 'limited_bonus', this)
  }

  public get LimitedContributors(): string[] {
    const output = [`Pilot ENGINEERING Bonus: +${Math.floor(this.Eng / 2)}`]
    Bonus.Contributors('limited_bonus', this).forEach(b => {
      const sign = b.val > -1 ? '+' : ''
      output.push(`${b.name}: ${sign}${b.val}`)
    })
    return output
  }

  public get AttackBonus(): number {
    return Bonus.Int(this._pilot.Grit, 'attack', this)
  }

  public get AttackBonusContributors(): string[] {
    const output = [`Pilot GRIT Bonus: ${this._pilot.Grit}`]
    Bonus.Contributors('attack', this).forEach(b => {
      const sign = b.val > -1 ? '+' : ''
      output.push(`${b.name}: ${sign}${b.val}`)
    })
    return output
  }

  public get TechAttack(): number {
    return Bonus.Int(this._frame.TechAttack + this.Sys, 'tech_attack', this)
  }

  public get TechAttackContributors(): string[] {
    const output = [
      `FRAME Base Tech Attack: ${this.Frame.TechAttack}`,
      `Pilot SYSTEMS Bonus: +${this.Sys}`,
    ]
    Bonus.Contributors('tech_attack', this).forEach(b => {
      const sign = b.val > -1 ? '+' : ''
      output.push(`${b.name}: ${sign}${b.val}`)
    })
    return output
  }

  public get Grapple(): number {
    return Bonus.Int(Rules.BaseGrapple, 'grapple', this)
  }

  public get GrappleContributors(): string[] {
    const output = [`Base Grapple Value: ${this.Grapple}`]
    Bonus.Contributors('grapple', this).forEach(b => {
      const sign = b.val > -1 ? '+' : ''
      output.push(`${b.name}: ${sign}${b.val}`)
    })
    return output
  }

  public get Ram(): number {
    return Bonus.Int(Rules.BaseRam, 'ram', this)
  }

  public get RamContributors(): string[] {
    const output = [`Base Ram Value: ${this.Ram}`]
    Bonus.Contributors('ram', this).forEach(b => {
      const sign = b.val > -1 ? '+' : ''
      output.push(`${b.name}: ${sign}${b.val}`)
    })
    return output
  }

  public get SaveBonus(): number {
    return Bonus.Int(this._pilot.Grit, 'save', this)
  }

  public get SaveBonusContributors(): string[] {
    const output = [`Pilot GRIT Bonus: ${this._pilot.Grit}`]
    Bonus.Contributors('save', this).forEach(b => {
      const sign = b.val > -1 ? '+' : ''
      output.push(`${b.name}: ${sign}${b.val}`)
    })
    return output
  }

  // -- HASE passthroughs -------------------------------------------------------------------------
  public get Hull(): number {
    return this._pilot.MechSkillsController.MechSkills.Hull
  }

  public get Agi(): number {
    return this._pilot.MechSkillsController.MechSkills.Agi
  }

  public get Sys(): number {
    return this._pilot.MechSkillsController.MechSkills.Sys
  }

  public get Eng(): number {
    return this._pilot.MechSkillsController.MechSkills.Eng
  }

  // -- Stats -------------------------------------------------------------------------------------
  public get CurrentStructure(): number {
    return this.MaxStructure - this._missing_structure
  }

  public set CurrentStructure(structure: number) {
    this._missing_structure = Math.min(
      Math.max(this.MaxStructure - structure, 0),
      this.MaxStructure
    )
    if (this._missing_structure === this.MaxStructure) this.Destroy()
    this.SaveController.save()
  }

  public get MaxStructure(): number {
    return Bonus.Int(this._frame.Structure, 'structure', this)
  }

  public get StructureContributors(): string[] {
    const output = [`FRAME Base Structure: ${this.Frame.Structure}`]
    Bonus.Contributors('structure', this).forEach(b => {
      const sign = b.val > -1 ? '+' : ''
      output.push(`${b.name}: ${sign}${b.val}`)
    })
    return output
  }

  public get Overshield(): number {
    return this._overshield
  }

  public set Overshield(val: number) {
    this._overshield = val < 0 ? 0 : val
    this.SaveController.save()
  }

  public get CurrentHP(): number {
    if (this._missing_hp < 0) this.CurrentHP = this.MaxHP
    return this.MaxHP - this._missing_hp
  }

  public set CurrentHP(hp: number) {
    if (hp > this.MaxHP) this._missing_hp = 0
    else if (hp <= 0) {
      this.CurrentStructure -= 1
      this.CurrentHP = this.MaxHP + hp
    } else this._missing_hp = this.MaxHP - hp
    this.SaveController.save()
  }

  public AddDamage(dmg: number, resistance?: string): void {
    if (resistance && this._resistances.includes(resistance)) {
      dmg = Math.ceil(dmg / 2)
    }
    this.CurrentHP -= dmg
  }

  public get MaxHP(): number {
    return Bonus.Int(this._frame.HP + this._pilot.Grit + this.Hull * 2, 'hp', this)
  }

  public get HPContributors(): string[] {
    const output = [
      `FRAME Base HP: ${this.Frame.HP}`,
      `Pilot GRIT Bonus: +${this._pilot.Grit}`,
      `Pilot HULL Bonus: +${this.Hull * 2}`,
    ]
    Bonus.Contributors('hp', this).forEach(b => {
      const sign = b.val > -1 ? '+' : ''
      output.push(`${b.name}: ${sign}${b.val}`)
    })
    return output
  }

  public get CurrentSP(): number {
    if (!this.MechLoadoutController.ActiveLoadout) return this.MaxSP
    return this.MechLoadoutController.ActiveLoadout.TotalSP
  }

  public get MaxSP(): number {
    return Bonus.Int(this.Frame.SP + this._pilot.Grit + Math.floor(this.Sys / 2), 'sp', this)
  }

  public get FreeSP(): number {
    return this.MaxSP - this.CurrentSP
  }

  public get SPContributors(): string[] {
    const output = [
      `FRAME Base SP: ${this.Frame.SP}`,
      `Pilot GRIT Bonus: +${this._pilot.Grit}`,
      `Pilot SYSTEMS Bonus: +${Math.floor(this.Sys / 2)}`,
    ]
    Bonus.Contributors('sp', this).forEach(b => {
      const sign = b.val > -1 ? '+' : ''
      output.push(`${b.name}: ${sign}${b.val}`)
    })
    return output
  }

  public get CurrentHeat(): number {
    return this._current_heat
  }

  public set CurrentHeat(heat: number) {
    if (heat > this.HeatCapacity) {
      this.CurrentStress = this.CurrentStress - 1
      this.CurrentHeat = heat - this.HeatCapacity
    } else if (heat < 0) this._current_heat = 0
    else this._current_heat = heat
    this.SaveController.save()
  }

  public AddHeat(heat: number): void {
    heat = this._resistances.includes('Heat') ? Math.ceil(heat / 2) : heat
    let newHeat = this._current_heat + heat
    while (newHeat > this.HeatCapacity) {
      this.CurrentStress -= 1
      newHeat -= this.HeatCapacity
    }
    this.CurrentHeat = newHeat
  }

  public ReduceHeat(heat: number, resist?: boolean): void {
    if (resist) heat = this._resistances.includes('Heat') ? Math.ceil(heat / 2) : heat
    while (heat > this.CurrentHeat) {
      heat -= this.CurrentHeat
      this.CurrentStress += 1
      this._current_heat = this.HeatCapacity
    }
    this.CurrentHeat -= heat
  }

  public get IsInDangerZone(): boolean {
    return this._current_heat >= Math.ceil(this.HeatCapacity / 2)
  }

  public get HeatCapacity(): number {
    return Bonus.Int(this._frame.HeatCap + this.Eng, 'heatcap', this)
  }

  public get HeatCapContributors(): string[] {
    const output = [
      `FRAME Base Heat Capacity: ${this.Frame.HeatCap}`,
      `Pilot ENGINEERING Bonus: +${this.Eng}`,
    ]
    Bonus.Contributors('heatcap', this).forEach(b => {
      const sign = b.val > -1 ? '+' : ''
      output.push(`${b.name}: ${sign}${b.val}`)
    })
    return output
  }

  public get CurrentStress(): number {
    return this.MaxStress - this._missing_stress
  }

  public set CurrentStress(stress: number) {
    this._missing_stress = Math.min(Math.max(this.MaxStress - stress, 0), this.MaxStress)
    if (this._missing_stress === this.MaxStress) this._pilot.State.ReactorCriticalDestruct()
    this.SaveController.save()
  }

  public get MaxStress(): number {
    return Bonus.Int(this._frame.HeatStress, 'stress', this)
  }

  public get StressContributors(): string[] {
    const output = [`FRAME Base Reactor Stress: ${this.Frame.HeatStress}`]
    Bonus.Contributors('stress', this).forEach(b => {
      const sign = b.val > -1 ? '+' : ''
      output.push(`${b.name}: ${sign}${b.val}`)
    })
    return output
  }

  public get CurrentRepairs(): number {
    return this.RepairCapacity - this._missing_repairs
  }

  public set CurrentRepairs(rep: number) {
    this._missing_repairs = Math.min(Math.max(this.RepairCapacity - rep, 0), this.RepairCapacity)
    this.SaveController.save()
  }

  public get RepairCapacity(): number {
    return Bonus.Int(this._frame.RepCap + Math.floor(this.Hull / 2), 'repcap', this)
  }

  public get RepCapContributors(): string[] {
    const output = [
      `FRAME Base Repair Capacity: ${this.Frame.RepCap}`,
      `Pilot HULL Bonus: +${Math.floor(this.Hull / 2)}`,
    ]
    Bonus.Contributors('repcap', this).forEach(b => {
      const sign = b.val > -1 ? '+' : ''
      output.push(`${b.name}: ${sign}${b.val}`)
    })
    return output
  }

  public get CurrentCoreEnergy(): number {
    return this.Frame.CoreSystem.Energy
  }

  public set CurrentCoreEnergy(energy: number) {
    this.Frame.CoreSystem.Energy = energy
    this.SaveController.save()
  }

  public get IsCoreActive(): boolean {
    return this.Frame.CoreSystem.IsActive
  }

  public set IsCoreActive(val: boolean) {
    this.Frame.CoreSystem.IsActive = val
    this.SaveController.save()
  }

  public get OverchargeTrack(): string[] {
    const b = Bonus.getUneval('overcharge', this)
    return b.length ? b[0].Value : Rules.Overcharge
  }

  public get CurrentOvercharge(): number {
    return this._current_overcharge
  }

  public set CurrentOvercharge(overcharge: number) {
    this._current_overcharge = overcharge
    if (this._current_overcharge < 0) this._current_overcharge = 0
    if (this._current_overcharge > this.OverchargeTrack.length - 1)
      this._current_overcharge = this.OverchargeTrack.length - 1
    this.SaveController.save()
  }

  // -- Encounter Management ----------------------------------------------------------------------
  public get Activations(): number {
    return this._activations
  }

  public set Activations(val: number) {
    this._activations = val
    this.SaveController.save()
  }

  public get TurnActions(): number {
    return this._turn_actions
  }

  public set TurnActions(val: number) {
    this._turn_actions = val
    this.SaveController.save()
  }

  public get Boost(): number {
    if (this.IsStunned || this.Destroyed) return 0
    return this._boost
  }

  public set Boost(val: number) {
    this._boost = val < 0 ? 0 : val
    this.SaveController.save()
  }

  public get CurrentMove(): number {
    if (this.IsStunned || this.Destroyed) return 0
    return this._currentMove
  }

  public set CurrentMove(val: number) {
    this._currentMove = val < 0 ? 0 : val
    this.SaveController.save()
  }

  public get MaxMove(): number {
    if (this.IsStunned || this.Destroyed) return 0
    return this.Speed
  }

  public get Reactions(): string[] {
    return this._reactions
  }

  public set Reactions(val: string[]) {
    this._reactions = val
  }

  public AddReaction(r: string): void {
    if (!this.Reactions.some(x => x === r)) this.Reactions.push(r)
  }

  public RemoveReaction(r: string): void {
    const idx = this.Reactions.findIndex(x => x === r)
    if (idx > -1) this.Reactions.splice(idx, 1)
  }

  public NewTurn(): void {
    this._activations = 1
    this._turn_actions = 2
    this._currentMove = this.MaxMove
    this.SaveController.save()
  }

  // -- Statuses and Conditions -------------------------------------------------------------------
  public get StatusString(): string[] {
    const out = []
    if (this.Destroyed) out.push('destroyed')
    if (this.MechLoadoutController.ActiveLoadout.Systems.filter(x => x.IsCascading).length)
      out.push('cascading')
    if (this.FreeSP < 0) out.push('overSP')
    if (this.FreeSP > 0) out.push('underSP')
    if (this.MechLoadoutController.ActiveLoadout.HasEmptyMounts) out.push('unfinished')
    if (this.RequiredLicenses.filter(x => x.missing).length) out.push('unlicensed')
    return out
  }

  public get Defeat(): string {
    return this._defeat
  }

  public set Defeat(val: string) {
    this._defeat = val
    this.SaveController.save()
  }

  public get Destroyed(): boolean {
    if (this._reactor_destroyed) return true
    return this._destroyed
  }

  public set Destroyed(b: boolean) {
    this._destroyed = b
    this._defeat = b ? 'Destroyed' : ''
    this.SaveController.save()
  }

  public get ReactorDestroyed(): boolean {
    return this._reactor_destroyed
  }

  public set ReactorDestroyed(destroyed: boolean) {
    this._meltdown_imminent = false
    this._destroyed = false
    this._reactor_destroyed = destroyed
    this._defeat = destroyed ? 'Reactor Destroyed' : ''
    this.SaveController.save()
  }

  public Destroy(): void {
    this._destroyed = true
    this._defeat = 'Destroyed'
    this.SaveController.save()
  }

  public Repair(): void {
    this._destroyed = false
    this._reactor_destroyed = false
    this._meltdown_imminent = false
    this._statuses = []
    this._conditions = []
    this.CurrentStress = 1
    this.CurrentStructure = 1
    this.CurrentHP = this.MaxHP
    this.SaveController.save()
  }

  public get IsShutDown(): boolean {
    return this.Statuses.includes('SHUT DOWN')
  }

  public get IsStunned(): boolean {
    return this._conditions.includes('STUNNED')
  }

  public get Conditions(): string[] {
    if (this.IsShutDown && !this.IsStunned) this._conditions.push('STUNNED')
    return this._conditions
  }

  public set Conditions(conditions: string[]) {
    this._conditions = conditions
    this.SaveController.save()
  }

  public AddCondition(condition: string): void {
    const stidx = this.Conditions.findIndex(x => x === condition)
    if (stidx === -1) this.Conditions.push(condition)
  }

  public RemoveCondition(condition: string): void {
    if (condition.toLowerCase() === 'stunned' && this.IsShutDown) return
    const stidx = this.Conditions.findIndex(x => x === condition)
    if (stidx > -1) this.Conditions.splice(stidx, 1)
  }

  public get Statuses(): string[] {
    return this._statuses
  }

  public set Statuses(statuses: string[]) {
    this._statuses = statuses
    this.SaveController.save()
  }

  public AddStatus(status: string): void {
    const stidx = this.Statuses.findIndex(x => x === status)
    if (stidx === -1) this.Statuses.push(status)
  }

  public RemoveStatus(status: string): void {
    const stidx = this.Statuses.findIndex(x => x === status)
    if (stidx > -1) this.Statuses.splice(stidx, 1)
  }

  public get Resistances(): string[] {
    return this._resistances
  }

  public set Resistances(resistances: string[]) {
    this._resistances = resistances
    this.SaveController.save()
  }

  public get Burn(): number {
    return this._burn
  }

  public set Burn(burn: number) {
    this._burn = burn
    if (this._burn < 0) this._burn = 0
    this.SaveController.save()
  }

  // -- Active Mode Utilities ---------------------------------------------------------------------
  public FullRepair(): void {
    this._destroyed = false
    this._reactor_destroyed = false
    this.CurrentStructure = this.MaxStructure
    this.CurrentHP = this.MaxHP
    this.CurrentStress = this.MaxStress
    this.CurrentHeat = 0
    this.CurrentRepairs = this.RepairCapacity
    this.CurrentCoreEnergy = 1
    this.CurrentOvercharge = 0
    this.Boost = 0
    this.MechLoadoutController.Loadouts.forEach(x => {
      x.Equipment.forEach(y => {
        if (y.Destroyed) y.Repair()
        if (y.IsLimited) y.Uses = y.getTotalUses(this.LimitedBonus)
      })
    })
    if (this.Frame.CoreSystem.PassiveActions)
      this.Frame.CoreSystem.PassiveActions.forEach(a => a.Reset(ActivePeriod.Mission))
    if (this.Frame.CoreSystem.DeployActions)
      this.Frame.CoreSystem.DeployActions.forEach(a => a.Reset(ActivePeriod.Mission))
    this._statuses = []
    this._conditions = []
    this._resistances = []
    this.Burn = 0
    this._defeat = ''
    this.IsCoreActive = false
    this.SaveController.save()
  }

  public BasicRepair(restoreReactor: boolean): void {
    this._destroyed = false
    if (restoreReactor) {
      this._reactor_destroyed = false
      this.CurrentStress = 1
    }
    this.CurrentStructure = 1
    this.CurrentHP = 1
    this.CurrentHeat = 0
    this._statuses = []
    this._conditions = []
    this._resistances = []
    this.Burn = 0
    this._defeat = ''
    this.SaveController.save()
  }

  // -- Loadouts ----------------------------------------------------------------------------------
  public get ActiveMounts(): Mount[] {
    return this.MechLoadoutController.ActiveLoadout.AllActiveMounts(this)
  }

  // -- Mountable CORE Bonuses --------------------------------------------------------------------
  public get PilotBonuses(): CoreBonus[] {
    return this.Pilot.CoreBonusController.CoreBonuses.filter(x => x.IsMountable)
  }

  public get AppliedBonuses(): CoreBonus[] {
    return _.flatten(
      this.MechLoadoutController.ActiveLoadout.AllEquippableMounts(true, true).map(x => x.Bonuses)
    )
  }

  public get AvailableBonuses(): CoreBonus[] {
    return this.PilotBonuses.filter(x => !this.AppliedBonuses.includes(x))
  }

  // -- I/O ---------------------------------------------------------------------------------------
  public static Serialize(m: Mech): IMechData {
    const data = {
      id: m.ID,
      name: m.Name,
      notes: m.Notes,
      gm_note: m.GmNote,
      frame: m.Frame.ID,
      active: m._active,
      current_structure: m.CurrentStructure,
      current_move: m._currentMove,
      boost: m._boost,
      current_hp: m.CurrentHP,
      overshield: m._overshield,
      current_stress: m.CurrentStress,
      current_heat: m._current_heat,
      current_repairs: m.CurrentRepairs,
      current_overcharge: m._current_overcharge,
      current_core_energy: m._current_core_energy,
      statuses: m._statuses,
      conditions: m._conditions,
      resistances: m._resistances,
      reactions: m._reactions,
      burn: m._burn,
      destroyed: m._destroyed,
      defeat: m._defeat,
      activations: m._activations,
      meltdown_imminent: m._meltdown_imminent,
      reactor_destroyed: m._reactor_destroyed,
      core_active: m._core_active,
      cc_ver: store.getters.getVersion || 'ERR',
    }

    SaveController.Serialize(m, data)
    PortraitController.Serialize(m, data)
    MechLoadoutController.Serialize(m, data)

    return data as IMechData
  }

  public static Deserialize(data: IMechData, pilot: Pilot): Mech {
    const f = store.getters.referenceByID('Frames', data.frame)
    const m = new Mech(f, pilot)
    // m.MechLoadoutController.UpdateLoadouts()

    m._id = data.id
    MechLoadoutController.Deserialize(m, data)

    m._name = data.name
    m._notes = data.notes
    m._gm_note = data.gm_note
    m._active = data.active
    m.CurrentStructure = data.current_structure
    m._currentMove = data.current_move || 0
    m._boost = data.boost || 0
    m.CurrentHP = data.current_hp
    m._overshield = data.overshield || 0
    m.CurrentStress = data.current_stress
    m._current_heat = data.current_heat
    m.CurrentRepairs = data.current_repairs
    m._current_overcharge = data.current_overcharge || 0
    m._current_core_energy = data.current_core_energy != null ? data.current_core_energy : 1
    m._statuses = data.statuses || []
    m._conditions = data.conditions || []
    m._resistances = data.resistances || []
    m._reactions = data.reactions || []
    m._burn = data.burn || 0
    m._destroyed = data.destroyed || false
    m._defeat = data.defeat || ''
    m._activations = data.activations || 1
    m._reactor_destroyed = data.reactor_destroyed || false
    m._core_active = data.core_active || false
    m._cc_ver = data.cc_ver || ''

    SaveController.Deserialize(m, data)
    PortraitController.Deserialize(m, data)
    
    m.SaveController.SetLoaded()
    return m
  }
}

export { Mech, IMechData }
