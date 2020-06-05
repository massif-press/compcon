import uuid from 'uuid/v4'
import { store } from '@/store'
import { Capacitor } from '@capacitor/core'
import { getImagePath, ImageTag } from '@/io/ImageManagement'
import { NpcStats, NpcClass, NpcTemplate, NpcFeature, NpcItem } from './'
import { INpcStats, INpcItemSaveData } from './interfaces'
import { EncounterSide } from '@/class'
import { ICounterData } from '@/interface'

export interface INpcData {
  active: boolean
  id: string
  class: string
  tier: number | string
  name: string
  subtitle: string
  campaign: string
  labels: string[]
  tag: string
  templates: string[]
  items: INpcItemSaveData[]
  stats: INpcStats
  currentStats: INpcStats
  note: string
  side: string
  cloudImage: string
  localImage: string
  statuses: string[]
  conditions: string[]
  resistances: string[]
  burn: number
  destroyed: boolean
  defeat: string
  actions: number
  counter_data: ICounterSaveData[]
  custom_counters: object[]
  cc_ver: string
}

export class Npc implements IActor {
  private _active: boolean
  private _id: string
  private _name: string
  private _subtitle: string
  private _campaign: string
  private _tier: string | number
  private _class: NpcClass
  private _side: EncounterSide
  private _templates: NpcTemplate[]
  private _items: NpcItem[]
  private _stats: NpcStats
  private _current_stats: NpcStats
  private _note: string
  private _cloud_image: string
  private _local_image: string
  private _tag: string
  private _user_labels: string[]
  private _statuses: string[]
  private _conditions: string[]
  private _resistances: string[]
  private _burn: number
  private _actions: number
  private _destroyed: boolean
  private _defeat: string
  private cc_ver: string

  public constructor(npcClass: NpcClass, tier?: number) {
    const t = tier || 1
    this._active = false
    this._id = uuid()
    this._name = `New ${npcClass.Name[0].toUpperCase()}${npcClass.Name.slice(1)}`
    this._subtitle = ''
    this._tier = t
    this._templates = []
    this._user_labels = []
    this._side = EncounterSide.Enemy
    this._note = this._cloud_image = this._local_image = ''
    this._campaign = ''
    this._class = npcClass
    this._tag = this.Class.Role.toLowerCase() === 'biological' ? 'Biological' : 'Mech'
    this._stats = NpcStats.FromClass(npcClass, t)
    this._current_stats = NpcStats.FromMax(this._stats)
    this._items = []
    npcClass.BaseFeatures.forEach(f => {
      this._items.push(new NpcItem(f, t))
    })
    this._burn = 0
    this._actions = 2
    this._destroyed = false
    this._defeat = ''
    this._statuses = []
    this._conditions = []
    this._resistances = []
    this.cc_ver = process.env.npm_package_version || 'UNKNOWN'
  }

  public get Active(): boolean {
    return this._active
  }

  public set Active(val: boolean) {
    this._active = val
    this._current_stats.Active = val
  }

  private save(): void {
    if (this.Active) store.dispatch('mission/saveActiveMissionData')
    else store.dispatch('npc/saveNpcData')
  }

  public get ID(): string {
    return this._id
  }

  public RenewID(): void {
    this._id = uuid()
  }

  public get Power(): number {
    // TODO: calc stat power for custom
    const multiplier = typeof this.Tier === 'number' ? this.Tier : 3.5
    return (this.Class.Power + this.Templates.reduce((a, b) => +a + +b.Power, 0)) * multiplier
  }

  public get PowerTier(): number {
    return Math.ceil(this.Power / 100) * 100
  }

  public get Stats(): NpcStats {
    return this._stats
  }

  public get CurrentStats(): NpcStats {
    return this._current_stats
  }

  public ResetStats(): void {
    this._current_stats = NpcStats.FromMax(this._stats)
  }

  public get EncounterName(): string {
    return this._name
  }

  public get Icon(): string {
    return this.Class.RoleIcon
  }

  public get Name(): string {
    return this._name
  }

  public set Name(val: string) {
    this._name = val
    this.save()
  }

  public get Subtitle(): string {
    return this._subtitle
  }

  public set Subtitle(val: string) {
    this._subtitle = val
    this.save()
  }

  public get Side(): EncounterSide {
    return this._side
  }

  public set Side(val: EncounterSide) {
    this._side = val
    this.save()
  }

  public get Campaign(): string {
    return this._campaign
  }

  public set Campaign(val: string) {
    this._campaign = val
    this.save()
  }

  public get Note(): string {
    return this._note
  }

  public set Note(val: string) {
    this._note = val
    this.save()
  }

  public get IsBiological(): boolean {
    return this._tag.toLowerCase() === 'biological'
  }

  public get Tag(): string {
    if (this.IsBiological) return 'Biological'
    return this._tag
  }

  public set Tag(val: string) {
    this._tag = val
  }

  public get Labels(): string[] {
    return this._user_labels
  }

  public set Labels(val: string[]) {
    this._user_labels = val
  }

  public get Tier(): number | string {
    return this._tier
  }

  public set Tier(newTier: number | string) {
    this._tier = newTier
    if (typeof newTier === 'number') {
      this._stats = NpcStats.FromClass(this.Class, newTier)
      this._items.forEach(i => {
        i.Tier = newTier
      })
      this.RecalcBonuses()
    }
    this.save()
  }

  public get IsCustomTier(): boolean {
    return this._tier === 'custom'
  }

  public get Class(): NpcClass {
    return this._class
  }

  public get BaseClassFeatures(): NpcFeature[] {
    return this.Class.BaseFeatures
  }

  public get BaseTemplateFeatures(): NpcFeature[] {
    return this._templates.flatMap(x => x.BaseFeatures)
  }

  public get BaseFeatures(): NpcFeature[] {
    return this.BaseClassFeatures.concat(this.BaseTemplateFeatures)
  }

  public get SelectedFeatures(): NpcFeature[] {
    return this.Items.map(x => x.Feature)
  }

  public get Features(): NpcFeature[] {
    return this.BaseFeatures.concat(this.SelectedFeatures)
  }

  public get AvailableFeatures(): NpcFeature[] {
    return this.Class.OptionalFeatures.concat(
      this._templates.flatMap(x => x.OptionalFeatures)
    ).filter(x => !this.SelectedFeatures.some(y => y.ID === x.ID))
  }

  public get Templates(): NpcTemplate[] {
    return this._templates
  }

  public set Templates(temps: NpcTemplate[]) {
    this._templates = temps
  }

  public AddTemplate(temp: NpcTemplate): void {
    this._templates.push(temp)
    temp.BaseFeatures.forEach(f => this.AddFeature(f, true))
    this.RecalcBonuses()
  }

  public RemoveTemplate(temp: NpcTemplate): void {
    const idx = this._templates.findIndex(x => x.ID === temp.ID)
    if (idx > -1) {
      this._templates.splice(idx, 1)
      temp.BaseFeatures.forEach(f => this.RemoveFeature(f, true))
      temp.OptionalFeatures.forEach(f => this.RemoveFeature(f, true))
      this.RecalcBonuses()
    }
  }

  setStatBonuses(): void {
    this._stats.ClearBonuses()
    this._items.forEach(item => {
      if (item.Feature.Override) {
        for (const key in item.Feature.Override) {
          const o = Array.isArray(item.Feature.Override[key])
            ? item.Feature.Override[key][item.Tier - 1]
            : item.Feature.Override[key]
          this._stats.Overrides[key] = o
        }
      } else {
        if (item.Feature.Bonus) {
          for (const key in item.Feature.Bonus) {
            const b = Array.isArray(item.Feature.Bonus[key])
              ? item.Feature.Bonus[key][item.Tier - 1]
              : item.Feature.Bonus[key]
            this._stats.Bonuses[key] += parseInt(b)
          }
        }
      }
    })
  }

  public RecalcBonuses(): void {
    this.setStatBonuses()
    this.ResetStats()
    this.save()
  }

  public AddFeature(feat: NpcFeature, skipRecalc?: boolean): void {
    const t = typeof this.Tier === 'number' ? this.Tier : 1
    const item = new NpcItem(feat, t)
    this._items.push(item)
    if (!skipRecalc) this.RecalcBonuses()
  }

  public RemoveFeature(feat: NpcFeature, skipRecalc?: boolean): void {
    const j = this._items.findIndex(x => x.Feature.ID === feat.ID)
    if (j > -1) {
      this._items.splice(j, 1)
      if (!skipRecalc) this.RecalcBonuses()
    }
  }

  public get Items(): NpcItem[] {
    return this._items
  }

  public SetCloudImage(src: string): void {
    this._cloud_image = src
    this.save()
  }

  public get CloudImage(): string {
    return this._cloud_image
  }

  public SetLocalImage(src: string): void {
    this._local_image = src
    this.save()
  }

  public get LocalImage(): string {
    return this._local_image
  }

  public get HasImage(): boolean {
    return !!this._cloud_image || !!this._local_image
  }

  public get Image(): string {
    if (this._cloud_image) return this._cloud_image
    else if (Capacitor.platform !== 'web' && this._local_image)
      return getImagePath(ImageTag.NPC, this._local_image)
    else return getImagePath(ImageTag.Frame, 'nodata.png', true)
  }

  // -- COUNTERS ----------------------------------------------------------------------------------

  private _counterSaveData = []
  public get CounterSaveData(): ICounterSaveData[] {
    return this._counterSaveData
  }
  public saveCounter(inputData: ICounterSaveData): void {
    const index = this._counterSaveData.findIndex(datum => datum.id === inputData.id)
    if (index < 0) {
      this._counterSaveData = [...this._counterSaveData, inputData]
    } else {
      this._counterSaveData[index] = inputData
      this._counterSaveData = [...this._counterSaveData]
    }
    this.save()
  }

  private _customCounters: ICounterData[] = []
  public get CustomCounterData(): ICounterData[] {
    return this._customCounters || []
  }

  public createCustomCounter(name: string): void {
    const counter = {
      name,
      id: uuid(),
      custom: true,
    }
    this._customCounters = [...this._customCounters, counter]
    this.save()
  }

  public deleteCustomCounter(id: string): void {
    const index = this._customCounters.findIndex(c => c.custom && c.id === id)
    if (index > -1) {
      this._customCounters.splice(index, 1)
      this._customCounters = [...this._customCounters]
    }
    this.save()
  }

  public get CounterData(): ICounterData[] {
    // TODO: handle features that require a counter
    return [this.CustomCounterData].flat().filter(x => x)
  }

  // -- Encounter Management ----------------------------------------------------------------------

  public get CurrentStructure(): number {
    return this.CurrentStats.Structure
  }

  public set CurrentStructure(val: number) {
    this.CurrentStats.Structure = val
    if (this.Active && this.CurrentStats.Structure === 0) {
      this.CurrentStats.HP = 0
      this.Destroyed = true
    }
  }

  public get CurrentHP(): number {
    return this.CurrentStats.HP
  }

  public set CurrentHP(val: number) {
    if (val > this.MaxHP) this.CurrentStats.HP = this.MaxHP
    else if (val <= 0) {
      this.CurrentStats.HP = this.MaxHP + val
      this.CurrentStructure -= 1
    } else this.CurrentStats.HP = val
  }

  public get CurrentStress(): number {
    return this.CurrentStats.Stress
  }

  public set CurrentStress(val: number) {
    this.CurrentStats.Stress = val
    if (this.Active && this.CurrentStats.Stress === 0 && !this.Statuses.includes('EXPOSED')) {
      this.Statuses.push('EXPOSED')
    }
  }

  public get CurrentHeat(): number {
    return this.CurrentStats.HeatCapacity
  }

  public set CurrentHeat(val: number) {
    if (val > this.HeatCapacity) {
      this.CurrentStress -= 1
      this.CurrentStats.HeatCapacity = val - this.HeatCapacity
    } else this.CurrentStats.HeatCapacity = val
  }

  public get MaxStructure(): number {
    return this.Stats.Structure
  }

  public get MaxHP(): number {
    return this.Stats.HP
  }

  public get MaxStress(): number {
    return this.Stats.Stress
  }

  public get HeatCapacity(): number {
    return this.Stats.HeatCapacity
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

  public get Destroyed(): boolean {
    return this._destroyed
  }

  public set Destroyed(val: boolean) {
    this._destroyed = val
    this._defeat = val ? 'Destroyed' : ''
    this.save()
  }

  public get Defeat(): string {
    return this._defeat
  }

  public set Defeat(val: string) {
    this._defeat = val
    this.save()
  }

  public get Activations(): number {
    return this.CurrentStats.Activations
  }

  public set Activations(val: number) {
    this.CurrentStats.Activations = val
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
    return this.CurrentStats.Speed
  }

  public set CurrentMove(val: number) {
    this.CurrentStats.Speed = val
    this.save()
  }

  public get MaxMove(): number {
    return this.Stats.Speed
  }

  public get Evasion(): number {
    return this.Stats.Evade
  }

  public get EDefense(): number {
    return this.Stats.EDefense
  }

  public get Reactions(): string[] {
    return this.CurrentStats.Reactions
  }

  public AddReaction(r: string): void {
    this.CurrentStats.AddReaction(r)
  }

  public RemoveReaction(r: string): void {
    this.CurrentStats.RemoveReaction(r)
  }

  public FullRepair(): void {
    this.CurrentStats.Reset(this.Stats)
    this.Items.forEach(e => e.Repair())
    this._defeat = ''
    this._destroyed = false
  }

  public NewTurn(): void {
    this.CurrentStats.Activations = this.Stats.Activations
    this._actions = 2
    this.CurrentStats.Speed = 0
    this.CurrentStats.AddReaction('Overwatch')
    this.save()
  }

  public get SizeIcon(): string {
    return `cci-size-${this.Stats.Size === 0.5 ? 'half' : this.Stats.Size}`
  }

  public static Serialize(npc: Npc): INpcData {
    return {
      active: npc.Active,
      id: npc.ID,
      class: npc.Class.ID,
      tier: npc._tier,
      name: npc._name,
      subtitle: npc._subtitle,
      campaign: npc._campaign,
      labels: npc._user_labels,
      tag: npc._tag,
      templates: npc.Templates.map(x => x.ID),
      items: npc._items.map(x => NpcItem.Serialize(x)),
      stats: NpcStats.Serialize(npc._stats),
      currentStats: NpcStats.Serialize(npc._current_stats),
      note: npc._note,
      side: npc.Side,
      cloudImage: npc._cloud_image,
      localImage: npc._local_image,
      statuses: npc._statuses,
      conditions: npc._conditions,
      resistances: npc._resistances,
      burn: npc._burn,
      destroyed: npc._destroyed,
      defeat: npc._defeat,
      actions: npc._actions,
      counter_data: npc.CounterSaveData,
      custom_counters: npc.CustomCounterData,
      cc_ver: npc.cc_ver,
    }
  }

  public static Deserialize(data: INpcData): Npc {
    const c = store.getters.referenceByID('NpcClasses', data.class)
    const npc = new Npc(c)
    npc.Active = data.active
    npc._id = data.id
    npc._tier = data.tier
    npc._name = data.name
    npc._subtitle = data.subtitle || ''
    npc._side = data.side as EncounterSide
    npc._campaign = data.campaign || ''
    npc._user_labels = data.labels || []
    npc._tag = data.tag
    npc._templates = data.templates.map(x => store.getters.referenceByID('NpcTemplates', x))
    npc._items = data.items.map(x => NpcItem.Deserialize(x))
    npc._stats = NpcStats.Deserialize(data.stats)
    npc.RecalcBonuses()
    npc._note = data.note
    npc._cloud_image = data.cloudImage
    npc._local_image = data.localImage
    npc._current_stats = data.currentStats
      ? NpcStats.Deserialize(data.currentStats)
      : NpcStats.FromMax(npc._stats)
    npc._statuses = data.statuses || []
    npc._conditions = data.conditions || []
    npc._resistances = data.resistances || []
    npc._burn = data.burn || 0
    npc._actions = data.actions || 1
    npc._destroyed = data.destroyed || false
    npc._defeat = data.defeat || ''
    npc._counterSaveData = data.counter_data || []
    npc._customCounters = (data.custom_counters as ICounterData[]) || []
    npc.cc_ver = data.cc_ver
    return npc
  }
}
