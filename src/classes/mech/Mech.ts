import { store } from '@/store'
import uuid from 'uuid/v4'
import _ from 'lodash'
import { Rules, Pilot, Frame, MechLoadout, MechSystem, IntegratedMount, CoreBonus } from '@/class'
import { getImagePath, ImageTag } from '@/io/ImageManagement'
import { ActiveState } from './ActiveState'

class Mech implements IActor {
  private _id: string
  private _name: string
  private _notes: string
  private _gm_note: string
  private _portrait: string
  private _cloud_portrait: string
  private _built_in_img: string
  private _frame: Frame
  private _loadouts: MechLoadout[]
  private _active_loadout: MechLoadout
  private _current_structure: number
  private _current_hp: number
  private _overshield: number
  private _current_stress: number
  private _current_heat: number
  private _current_repairs: number
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
  private _ejected: boolean
  private _destroyed: boolean
  private _defeat: string
  private _reactor_destroyed: boolean
  private _meltdown_imminent: boolean
  private _burn: number
  private _actions: number
  private _currentMove: number
  private _state: ActiveState

  public constructor(frame: Frame, pilot: Pilot) {
    this._id = uuid()
    this._name = ''
    this._notes = ''
    this._gm_note = ''
    this._portrait = ''
    this._cloud_portrait = ''
    this._frame = frame
    this._pilot = pilot
    this._active = false
    this._current_structure = this.MaxStructure
    this._current_hp = this.MaxHP
    this._overshield = 0
    this._current_stress = this.MaxStress
    this._current_heat = 0
    this._current_repairs = this.RepairCapacity
    this._current_core_energy = 1
    this._current_overcharge = 0
    this._statuses = []
    this._conditions = []
    this._resistances = []
    this._reactions = []
    this._burn = 0
    this._ejected = false
    this._destroyed = false
    this._defeat = ''
    this._reactor_destroyed = false
    this._meltdown_imminent = false
    this._loadouts = [new MechLoadout(this)]
    this.ActiveLoadout = this._loadouts[0]
    this._activations = 1
    this._actions = 2
    this._currentMove = this.Speed
    this._state = new ActiveState(this)
    this._cc_ver = store.getters.getVersion || 'N/A'
  }
  // -- Utility -----------------------------------------------------------------------------------
  private save(): void {
    store.dispatch('saveData')
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
    this.save()
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
    this.save()
  }

  public get GmNote(): string {
    return this._gm_note
  }

  public set GmNote(val: string) {
    this._gm_note = val
    this.save()
  }

  public get Frame(): Frame {
    return this._frame
  }

  public get Pilot(): Pilot {
    return this._pilot
  }

  public get IsActive(): boolean {
    return this._active
  }

  public set IsActive(toggle: boolean) {
    this._active = toggle
    if (this.IsActive) this.FullRepair()
    this.save()
  }

  public get IsCascading(): boolean {
    if (!this.ActiveLoadout.AICount) return false
    return !!this.ActiveLoadout.Equipment.filter(x => x.IsCascading).length
  }

  public get RequiredLicenses(): ILicenseRequirement[] {
    const requirements = this.ActiveLoadout
      ? this.ActiveLoadout.RequiredLicenses
      : ([] as ILicenseRequirement[])

    if (this._frame.ID === 'mf_standard_pattern_i_everest') {
      const gmsIdx = requirements.findIndex(x => x.source === 'GMS')
      if (gmsIdx > -1) requirements[gmsIdx].items.push('STANDARD PATTERN I "EVEREST" Frame')
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

  public SetCloudImage(src: string): void {
    this._cloud_portrait = src
    this.save()
  }

  public get CloudImage(): string {
    return this._cloud_portrait
  }

  public SetLocalImage(src: string): void {
    this._portrait = src
    this.save()
  }

  public get LocalImage(): string {
    return this._portrait
  }

  public get Image(): string {
    return this.Portrait
  }

  public get Portrait(): string {
    if (this._cloud_portrait) return this._cloud_portrait
    if (this._portrait) return getImagePath(ImageTag.Mech, this._portrait)
    return this.Frame.DefaultImage
  }

  // -- Attributes --------------------------------------------------------------------------------
  public get Size(): number {
    if (this._frame.Size === Rules.MaxFrameSize) return Rules.MaxFrameSize
    const bonus = this._pilot.has('CoreBonus', 'cb_fomorian_frame')
    if (bonus) {
      return this._frame.Size === 0.5 ? 1 : this._frame.Size + 1
    } else return this._frame.Size
  }

  public get SizeIcon(): string {
    return `cci-size-${this.Size === 0.5 ? 'half' : this.Size}`
  }

  public get SizeContributors(): string[] {
    const output = [`FRAME Base Size: ${this.Frame.Size}`]
    if (this._pilot.has('CoreBonus', 'cb_fomorian_frame'))
      output.push(`FOMORIAN FRAME (IPS-N CORE Bonus): +1`)
    return output
  }

  public get Armor(): number {
    const bonus =
      this._pilot.has('CoreBonus', 'cb_sloped_plating') && this._frame.Armor < Rules.MaxMechArmor
        ? 1
        : 0
    return this._frame.Armor + bonus
  }

  public get ArmorContributors(): string[] {
    const output = [`FRAME Base Armor: ${this.Frame.Armor}`]
    if (this._pilot.has('CoreBonus', 'cb_sloped_plating'))
      output.push(`SLOPED PLATING (IPS-N CORE Bonus): +1`)
    return output
  }

  public get SaveTarget(): number {
    let bonus = this._pilot.Grit
    if (this._pilot.has('CoreBonus', 'cb_the_lesson_of_the_open_door')) bonus += 2
    return this._frame.SaveTarget + bonus
  }

  public get SaveTargetContributors(): string[] {
    const output = [
      `FRAME Base Save Target: ${this.Frame.SaveTarget}`,
      `Pilot GRIT Bonus: +${this._pilot.Grit}`,
    ]
    if (this._pilot.has('CoreBonus', 'cb_the_lesson_of_the_open_door'))
      output.push(`THE LESSON OF THE OPEN DOOR (HORUS CORE Bonus): +2`)
    return output
  }

  public get Evasion(): number {
    let bonus = this.Agi
    if (this._pilot.has('CoreBonus', 'cb_full_subjectivity_sync')) bonus += 2
    return this._frame.Evasion + bonus
  }

  public get EvasionContributors(): string[] {
    const output = [
      `FRAME Base Evasion: ${this.Frame.Evasion}`,
      `Pilot AGILITY Bonus: +${this.Agi}`,
    ]
    if (this._pilot.has('CoreBonus', 'cb_full_subjectivity_sync'))
      output.push(`FULL SUBJECTIVITY SYNC (SSC CORE Bonus): +2`)
    return output
  }

  public get Speed(): number {
    const bonus = Math.floor(this.Agi / 2)
    return this._frame.Speed + bonus
  }

  public get SpeedContributors(): string[] {
    return [
      `FRAME Base Speed: ${this.Frame.Speed}`,
      `Pilot AGILITY Bonus: +${Math.floor(this.Agi / 2)}`,
    ]
  }

  public get SensorRange(): number {
    return this._frame.SensorRange
  }

  public get SensorRangeContributors(): string[] {
    return [`FRAME Base Sensor Range: ${this.Frame.SensorRange}`]
  }

  public get EDefense(): number {
    let bonus = this.Sys
    if (this._pilot.has('CoreBonus', 'cb_the_lesson_of_disbelief')) bonus += 2
    return this._frame.EDefense + bonus
  }

  public get EDefenseContributors(): string[] {
    const output = [
      `FRAME Base E-Defense: ${this.Frame.EDefense}`,
      `Pilot SYSTEMS Bonus: +${this.Sys}`,
    ]
    if (this._pilot.has('CoreBonus', 'cb_the_lesson_of_disbelief'))
      output.push(`THE LESSON OF DISBELIEF (HORUS CORE Bonus): +2`)
    return output
  }

  public get LimitedBonus(): number {
    let bonus = 0
    if (this._pilot.has('CoreBonus', 'cb_integrated_ammo_feeds')) bonus += 2
    return Math.floor(this.Eng / 2) + bonus
  }

  public get LimitedContributors(): string[] {
    const output = [`Pilot ENGINEERING Bonus: +${Math.floor(this.Eng / 2)}`]
    if (this._pilot.has('CoreBonus', 'cb_integrated_ammo_feeds'))
      output.push(`INTEGRATED AMMO FEEDS (HA CORE Bonus): +2`)
    return output
  }

  public get AttackBonus(): number {
    return this._pilot.Grit
  }

  public get AttackBonusContributors(): string[] {
    return [`Pilot GRIT Bonus: ${this._pilot.Grit}`]
  }

  public get TechAttack(): number {
    const bonus = this.Sys
    return this._frame.TechAttack + bonus
  }

  public get TechAttackContributors(): string[] {
    return [`FRAME Base Tech Attack: ${this.Frame.TechAttack}`, `Pilot SYSTEMS Bonus: +${this.Sys}`]
  }

  public get Grapple(): number {
    return Rules.BaseGrapple
  }

  public get Ram(): number {
    return Rules.BaseRam
  }

  public get SaveBonus(): number {
    return this._pilot.Grit
  }

  public get SaveBonusContributors(): string[] {
    return [`Pilot GRIT Bonus: ${this._pilot.Grit}`]
  }

  // -- HASE --------------------------------------------------------------------------------------
  public get Hull(): number {
    return this._pilot.MechSkills.Hull
  }

  public get Agi(): number {
    return this._pilot.MechSkills.Agi
  }

  public get Sys(): number {
    return this._pilot.MechSkills.Sys
  }

  public get Eng(): number {
    return this._pilot.MechSkills.Eng
  }

  // -- Stats -------------------------------------------------------------------------------------
  public get CurrentStructure(): number {
    return this._current_structure
  }

  public set CurrentStructure(structure: number) {
    if (structure > this.MaxStructure) this._current_structure = this.MaxStructure
    else if (structure < 0) this._current_structure = 0
    else this._current_structure = structure
    this.save()
  }

  public get MaxStructure(): number {
    return this._frame.Structure
  }

  public get StructureContributors(): string[] {
    return [`FRAME Base Structure: ${this.Frame.Structure}`]
  }

  public get Overshield(): number {
    return this._overshield
  }

  public set Overshield(val: number) {
    this._overshield = val
  }

  public get CurrentHP(): number {
    if (this._current_hp > this.MaxHP) this.CurrentHP = this.MaxHP
    return this._current_hp
  }

  public set CurrentHP(hp: number) {
    if (hp > this.MaxHP) this._current_hp = this.MaxHP
    else if (hp <= 0) {
      this.CurrentStructure -= 1
      this.CurrentHP = this.MaxHP + hp
    } else this._current_hp = hp
    this.save()
  }

  public AddDamage(dmg: number, resistance?: string): void {
    if (resistance && this._resistances.includes(resistance)) {
      dmg = Math.ceil(dmg / 2)
    }
    this.CurrentHP -= dmg
  }

  public get MaxHP(): number {
    let bonus = this._pilot.Grit + this.Hull * 2
    if (this.ActiveLoadout) {
      const personalizations = this.ActiveLoadout.GetSystem('ms_personalizations')
      if (personalizations && !personalizations.Destroyed) bonus += 2
    }
    if (this._pilot.has('CoreBonus', 'cb_reinforced_frame')) bonus += 5
    return this._frame.HP + bonus
  }

  public get HPContributors(): string[] {
    const output = [
      `FRAME Base HP: ${this.Frame.HP}`,
      `Pilot GRIT Bonus: +${this._pilot.Grit}`,
      `Pilot HULL Bonus: +${this.Hull * 2}`,
    ]
    if (this.ActiveLoadout && this.ActiveLoadout.HasSystem('ms_personalizations'))
      output.push(`PERSONALIZATIONS (GMS System): +2`)
    if (this._pilot.has('CoreBonus', 'cb_reinforced_frame'))
      output.push(`REINFORCED FRAME (IPS-N CORE Bonus): +5`)
    return output
  }

  public get CurrentSP(): number {
    if (!this.ActiveLoadout) return this.MaxSP
    return this.ActiveLoadout.TotalSP
  }

  public get MaxSP(): number {
    const bonus = this._pilot.Grit + Math.floor(this.Sys / 2)
    return this.Frame.SP + bonus
  }

  public get FreeSP(): number {
    return this.MaxSP - this.CurrentSP
  }

  public get SPContributors(): string[] {
    return [
      `FRAME Base SP: ${this.Frame.SP}`,
      `Pilot GRIT Bonus: +${this._pilot.Grit}`,
      `Pilot SYSTEMS Bonus: +${Math.floor(this.Sys / 2)}`,
    ]
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
    this.save()
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
    return this.IsActive && this._current_heat >= Math.ceil(this.HeatCapacity / 2)
  }

  public get HeatCapacity(): number {
    let bonus = this.Eng
    if (this._pilot.has('CoreBonus', 'cb_superior_by_design')) bonus += 2
    return this._frame.HeatCap + bonus
  }

  public get HeatCapContributors(): string[] {
    const output = [
      `FRAME Base Heat Capacity: ${this.Frame.HeatCap}`,
      `Pilot ENGINEERING Bonus: +${this.Eng}`,
    ]
    if (this._pilot.has('CoreBonus', 'cb_superior_by_design'))
      output.push(`SUPERIOR BY DESIGN (HA CORE Bonus): +2`)
    return output
  }

  public get CurrentStress(): number {
    return this._current_stress
  }

  public set CurrentStress(stress: number) {
    if (stress > this.MaxStress) this._current_stress = this.MaxStress
    else if (stress < 0) this._current_stress = 0
    else this._current_stress = stress
    this.save()
  }

  public get MaxStress(): number {
    return this._frame.HeatStress
  }

  public get StressContributors(): string[] {
    return [`FRAME Base Reactor Stress: ${this.Frame.HeatStress}`]
  }

  public get CurrentRepairs(): number {
    return this._current_repairs
  }

  public set CurrentRepairs(rep: number) {
    if (rep > this.RepairCapacity) this._current_repairs = this.RepairCapacity
    else if (rep < 0) this._current_repairs = 0
    else this._current_repairs = rep
    this.save()
  }

  public get RepairCapacity(): number {
    const bonus = Math.floor(this.Hull / 2)
    return this._frame.RepCap + bonus
  }

  public get RepCapContributors(): string[] {
    return [
      `FRAME Base Repair Capacity: ${this.Frame.RepCap}`,
      `Pilot HULL Bonus: +${Math.floor(this.Hull / 2)}`,
    ]
  }

  public get CurrentCoreEnergy(): number {
    return this._current_core_energy
  }

  public set CurrentCoreEnergy(energy: number) {
    this._current_core_energy = energy
    this.save()
  }

  public get CurrentOvercharge(): number {
    return this._current_overcharge
  }

  public set CurrentOvercharge(overcharge: number) {
    this._current_overcharge = overcharge
    this.save()
  }

  // -- Encounter Management ----------------------------------------------------------------------
  public get Activations(): number {
    return this._activations
  }

  public set Activations(val: number) {
    this._activations = val
    this.save()
  }

  public get Actions(): number {
    return this._actions
  }

  public set Actions(val: number) {
    this._actions = val
    this.save()
  }

  public get CurrentMove(): number {
    return this._currentMove
  }

  public set CurrentMove(val: number) {
    this._currentMove = val
    this.save()
  }

  public get MaxMove(): number {
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
    this._actions = 2
    this._currentMove = this.MaxMove
    this.save()
  }

  // -- Statuses and Conditions -------------------------------------------------------------------
  public get StatusString(): string[] {
    const out = []
    if (this.ReactorDestroyed) out.push('reactorDestroyed')
    if (this.Destroyed) out.push('destroyed')
    if (this.Ejected) out.push('ejected')
    if (this.MeltdownImminent) out.push('meltdown')
    if (this.ActiveLoadout.Systems.filter(x => x.IsCascading).length) out.push('cascading')
    if (this.FreeSP < 0) out.push('overSP')
    if (this.FreeSP > 0) out.push('underSP')
    if (this.ActiveLoadout.HasEmptyMounts) out.push('unfinished')
    if (this.RequiredLicenses.filter(x => x.missing).length) out.push('unlicensed')
    return out
  }

  public get Defeat(): string {
    return this._defeat
  }

  public set Defeat(val: string) {
    this._defeat = val
    this.save()
  }

  public get Destroyed(): boolean {
    return this._destroyed
  }

  public set Destroyed(b: boolean) {
    this._destroyed = b
    this._defeat = b ? 'Destroyed' : ''
    this.save()
  }

  public get Ejected(): boolean {
    return this._ejected
  }

  public set Ejected(b: boolean) {
    this._ejected = b
    this.save()
  }

  public get MeltdownImminent(): boolean {
    return this._meltdown_imminent
  }

  public set MeltdownImminent(meltdown: boolean) {
    this._meltdown_imminent = meltdown
    this.save()
  }

  public get ReactorDestroyed(): boolean {
    return this._reactor_destroyed
  }

  public set ReactorDestroyed(destroyed: boolean) {
    this._meltdown_imminent = false
    this._destroyed = false
    this._reactor_destroyed = destroyed
    this._defeat = destroyed ? 'Reactor Destroyed' : ''
    this.save()
  }

  public Destroy(): void {
    this._destroyed = true
    this._defeat = 'Destroyed'
    this.save()
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
    this.save()
  }

  public get IsShutDown(): boolean {
    return this.Statuses.includes('Shut Down')
  }

  public get IsStunned(): boolean {
    return this._conditions.includes('Stunned')
  }

  public get Conditions(): string[] {
    return this._conditions
  }

  public set Conditions(conditions: string[]) {
    this._conditions = conditions
    this.save()
  }

  public get Statuses(): string[] {
    return this._statuses
  }

  public set Statuses(statuses: string[]) {
    this._statuses = statuses
    this.save()
  }

  public get Resistances(): string[] {
    return this._resistances
  }

  public set Resistances(resistances: string[]) {
    this._resistances = resistances
    this.save()
  }

  public get Burn(): number {
    return this._burn
  }

  public set Burn(burn: number) {
    this._burn = burn
    if (this._burn < 0) this._burn = 0
    this.save()
  }

  // -- Active Mode Utilities ---------------------------------------------------------------------
  public FullRepair(): void {
    this.CurrentStructure = this.MaxStructure
    this.CurrentHP = this.MaxHP
    this.CurrentStress = this.MaxStress
    this.CurrentHeat = 0
    this.CurrentRepairs = this.RepairCapacity
    this.CurrentCoreEnergy = 1
    this.CurrentOvercharge = 0
    this._loadouts.forEach(x => {
      x.Equipment.forEach(y => {
        if (y.Destroyed) y.Repair()
        if (y.IsLimited) y.Uses = y.getTotalUses(this.Pilot.LimitedBonus)
      })
    })
    this._statuses = []
    this._conditions = []
    this._resistances = []
    this.Burn = 0
    this._destroyed = false
    this._defeat = ''
    this._reactor_destroyed = false
    this._meltdown_imminent = false
    this.save()
  }

  // -- Integrated/Talents ------------------------------------------------------------------------
  public get IntegratedMounts(): IntegratedMount[] {
    const intg = []
    if (this._frame.CoreSystem.Integrated) {
      intg.push(new IntegratedMount(this._frame.CoreSystem.getIntegrated(), 'CORE System'))
    }
    if (this._pilot.has('Talent', 't_nuclear_cavalier', 3)) {
      const frWeapon = store.getters.referenceByID('MechWeapons', 'mw_fuel_rod_gun')
      intg.push(new IntegratedMount(frWeapon, 'Nuclear Cavalier'))
    }
    if (this._pilot.has('Talent', 't_engineer')) {
      const id = `mw_prototype_${this._pilot.getTalentRank('t_engineer')}`
      const engWeapon = store.getters.referenceByID('MechWeapons', id)
      intg.push(new IntegratedMount(engWeapon, 'Engineer'))
    }
    return intg
  }

  public get IntegratedSystems(): MechSystem[] {
    const intg = []
    if (this._pilot.has('Talent', 't_walking_armory')) {
      const arms = store.getters.instantiate(
        'MechSystems',
        `ms_walking_armory_${this._pilot.getTalentRank('t_walking_armory')}`
      )
      intg.push(arms)
    }
    if (this._pilot.has('Talent', 't_technophile')) {
      const techno = store.getters.instantiate(
        'MechSystems',
        `ms_technophile_${this._pilot.getTalentRank('t_technophile')}`
      )
      intg.push(techno)
    }
    return intg
  }

  // -- Loadouts ----------------------------------------------------------------------------------
  public get Loadouts(): MechLoadout[] {
    return this._loadouts
  }

  public set Loadouts(loadouts: MechLoadout[]) {
    this._loadouts = loadouts
    this.save()
  }

  public get ActiveLoadout(): MechLoadout {
    return this._active_loadout
  }

  public set ActiveLoadout(loadout: MechLoadout) {
    this._active_loadout = loadout
    this.save()
  }

  public AddLoadout(): void {
    this._loadouts.push(new MechLoadout(this))
    this.ActiveLoadout = this._loadouts[this._loadouts.length - 1]
    this.save()
  }

  public RemoveLoadout(): void {
    if (this._loadouts.length === 1) {
      console.error(`Cannot remove last Mech Loadout`)
    } else {
      const index = this._loadouts.findIndex(x => x.ID === this.ActiveLoadout.ID)
      this._active_loadout = this._loadouts[index + (index === 0 ? 1 : -1)]
      this._loadouts.splice(index, 1)
      this.save()
    }
  }

  public CloneLoadout(): void {
    const index = this._loadouts.findIndex(x => x.ID === this.ActiveLoadout.ID)
    const newLoadout = MechLoadout.Deserialize(MechLoadout.Serialize(this.ActiveLoadout), this)
    newLoadout.RenewID()
    newLoadout.Name += ' (Copy)'
    this._loadouts.splice(index + 1, 0, newLoadout)
    this._active_loadout = this._loadouts[index + 1]
    this.save()
  }

  public UpdateLoadouts(): void {
    this._loadouts.forEach(x => {
      x.UpdateIntegrated(this)
    })
  }

  // -- Mountable CORE Bonuses --------------------------------------------------------------------
  public get PilotBonuses(): CoreBonus[] {
    return this.Pilot.CoreBonuses.filter(x => x.IsMountable)
  }

  public get AppliedBonuses(): CoreBonus[] {
    return _.flatten(this.ActiveLoadout.AllEquippableMounts(true, true).map(x => x.Bonuses))
  }

  public get AvailableBonuses(): CoreBonus[] {
    return this.PilotBonuses.filter(x => !this.AppliedBonuses.includes(x))
  }

  // -- Active Mode -------------------------------------------------------------------------------
  public get State(): ActiveState {
    return this._state
  }

  // -- I/O ---------------------------------------------------------------------------------------
  public static Serialize(m: Mech): IMechData {
    return {
      id: m.ID,
      name: m.Name,
      notes: m.Notes,
      gm_note: m.GmNote,
      portrait: m._portrait,
      cloud_portrait: m._cloud_portrait,
      frame: m.Frame.ID,
      active: m._active,
      current_structure: m._current_structure,
      current_hp: m._current_hp,
      overshield: m._overshield,
      current_stress: m._current_stress,
      current_heat: m._current_heat,
      current_repairs: m._current_repairs,
      current_overcharge: m._current_overcharge,
      current_core_energy: m._current_core_energy,
      loadouts: m.Loadouts.map(x => MechLoadout.Serialize(x)),
      active_loadout_index: m.Loadouts.findIndex(x => x.ID === m.ActiveLoadout.ID),
      statuses: m._statuses,
      conditions: m._conditions,
      resistances: m._resistances,
      reactions: m._reactions,
      burn: m._burn,
      ejected: m._ejected,
      destroyed: m._destroyed,
      defeat: m._defeat,
      activations: m._activations,
      meltdown_imminent: m._meltdown_imminent,
      reactor_destroyed: m._reactor_destroyed,
      cc_ver: store.getters.getVersion || 'ERR',
      state: ActiveState.Serialize(m._state),
    }
  }

  public static Deserialize(data: IMechData, pilot: Pilot): Mech {
    const f = store.getters.referenceByID('Frames', data.frame)
    const m = new Mech(f, pilot)
    m._id = data.id
    m._name = data.name
    m._notes = data.notes
    m._gm_note = data.gm_note
    m._portrait = data.portrait
    m._cloud_portrait = data.cloud_portrait
    m._active = data.active
    m._current_structure = data.current_structure
    m._current_hp = data.current_hp
    m._overshield = data.overshield || 0
    m._current_stress = data.current_stress
    m._current_heat = data.current_heat
    m._current_repairs = data.current_repairs
    m._current_overcharge = data.current_overcharge || 0
    m._current_core_energy = data.current_core_energy != null ? data.current_core_energy : 1
    m._cc_ver = data.cc_ver
    if (
      data.active_loadout_index === null ||
      data.active_loadout_index === undefined ||
      !data.loadouts.length
    ) {
      m._loadouts = [new MechLoadout(m)]
      m._active_loadout = m._loadouts[0]
    } else {
      m._loadouts = data.loadouts.map((x: IMechLoadoutData) => MechLoadout.Deserialize(x, m))
      m._active_loadout = data.active_loadout_index
        ? m._loadouts[data.active_loadout_index]
        : m._loadouts[0]
    }
    m._statuses = data.statuses || []
    m._conditions = data.conditions || []
    m._resistances = data.resistances || []
    m._reactions = data.reactions || []
    m._burn = data.burn || 0
    m._ejected = data.ejected || false
    m._destroyed = data.destroyed || false
    m._defeat = data.defeat || ''
    m._activations = data.activations || 1
    m._meltdown_imminent = data.meltdown_imminent || false
    m._reactor_destroyed = data.reactor_destroyed || false
    m._cc_ver = data.cc_ver || ''
    m._state = data.state ? ActiveState.Deserialize(data.state, m) : new ActiveState(m)
    return m
  }
}

export default Mech
