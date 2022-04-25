import uuid from 'uuid/v4'
import { NpcStore, store } from '@/store'
import { ImageTag } from '@/io/ImageManagement'
import { NpcStats, NpcClass, NpcItem } from './'
import { INpcStats, INpcItemSaveData } from './interfaces'
import { EncounterSide } from '@/class'
import {
  CloudController,
  ICloudData,
  ICloudSyncable,
  IPortraitData,
  ISaveable,
  ISaveData,
  PortraitController,
  SaveController,
  CounterController,
  ICounterContainer,
} from '../components'
import { IFeatureController } from '../components/feature/IFeatureController'
import { FeatureController } from '../components/feature/FeatureController'
import { getModule } from 'vuex-module-decorators'
import { BrewController, BrewInfo, IBrewData } from '../components/brew/BrewController'
import { IBrewable } from '../components/brew/IBrewable'
import { CompendiumItem } from '../CompendiumItem'
import { CombatController } from '../components/combat/CombatController'
import { INpcClassSaveData, NpcClassController } from './components/npcClass/NpcClassController'
import {
  INpcFeatureSaveData,
  NpcFeatureController,
} from './components/npcFeature/NpcFeatureController'
import { NpcTemplateController } from './components/npcTemplate/NpcTemplateController'
import { ISectionData } from '../campaign/campaign_elements/Section'
import { IRollableTableData } from '../components/narrative/elements/RollableTable'
import {
  NarrativeElementController,
  NarrativeElementData,
} from '../components/narrative/NarrativeElementController'
import { INarrativeElement } from '../components/narrative/INarrativeElement'
import { IClockData } from '../components/narrative/elements/Clock'

class INpcData
  implements
    ISaveData,
    ICloudData,
    IPortraitData,
    IBrewData,
    INpcClassSaveData,
    NarrativeElementData,
    INpcFeatureSaveData
{
  textItems: { title: string; body: string }[]
  remoteIID: string
  remoteKey: string
  shareCodeExpiry: string
  shareCode: string
  isRemoteResource: boolean
  deleteTime: string
  brews: BrewInfo[]
  isDeleted: boolean
  expireTime: string
  lastUpdate_cloud: string
  resourceUri: string
  portrait: string
  cloud_portrait: string
  active: boolean
  id: string
  lastSync: string
  lastModified: string
  class: string
  tier: number
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
  overshield: number
  destroyed: boolean
  defeat: string
  actions: number
  counter_data: ICounterSaveData[]
  custom_counters: object[]
  sections: ISectionData[]
  clocks: IClockData[]
  tables: IRollableTableData[]
}

class Npc
  implements
    ICloudSyncable,
    ISaveable,
    IBrewable,
    ICounterContainer,
    IFeatureController,
    INarrativeElement
{
  public readonly ItemType: string = 'npc'
  public ImageTag: ImageTag.NPC
  public CloudController: CloudController
  public SaveController: SaveController
  public PortraitController: PortraitController
  public BrewController: BrewController
  public CounterController: CounterController
  public FeatureController: FeatureController
  public NpcFeatureController: NpcFeatureController
  public NpcTemplateController: NpcTemplateController
  public NpcClassController: NpcClassController
  public CombatController: CombatController
  public NarrativeElementController: NarrativeElementController

  public Stats: NpcStats

  private _active: boolean
  private _id: string
  private _name: string
  private _subtitle: string
  private _campaign: string
  private _note: string
  private _user_labels: string[]
  private _tag: string

  private _side: EncounterSide
  private _current_stats: NpcStats
  private _statuses: string[]
  private _conditions: string[]
  private _resistances: string[]
  private _burn: number
  private _overshield: number
  private _turn_actions: number
  private _destroyed: boolean
  private _defeat: string

  public constructor(npcClass?: NpcClass, tier?: number) {
    const t = tier || 1
    this._active = false
    this._id = uuid()
    this.SaveController = new SaveController(this)
    this.PortraitController = new PortraitController(this)
    this.CloudController = new CloudController(this)
    this.BrewController = new BrewController(this)
    this.CounterController = new CounterController(this)
    this.FeatureController = new FeatureController(this)
    this.NpcClassController = new NpcClassController(this)
    this.NpcFeatureController = new NpcFeatureController(this)
    this.NpcTemplateController = new NpcTemplateController(this)
    this.CombatController = new CombatController(this)
    this.NarrativeElementController = new NarrativeElementController(this)

    this.FeatureController.Register()

    this._name = `New NPC`
    this._subtitle = ''
    this._user_labels = []
    this._side = EncounterSide.Enemy
    this._note = ''
    this._campaign = ''
    this._burn = 0
    this._overshield = 0
    this._turn_actions = 2
    this._destroyed = false
    this._defeat = ''
    this._statuses = []
    this._conditions = []
    this._resistances = []
    this._tag = 'Mech'
    if (npcClass) this.NpcClassController.SetClass(npcClass, t)
  }

  // -- Passthroughs ------------------------------------------------------------------------------

  public get Items(): NpcItem[] {
    return this.NpcFeatureController.Items
  }

  public get BrewableCollection(): CompendiumItem[] {
    // TODO / NB: temporary casting to CI prior to GM changes where they will become fully featured
    return [
      this.NpcClassController.Class as unknown as CompendiumItem,
      ...(this.NpcFeatureController.Features as unknown[] as CompendiumItem[]),
    ]
  }

  public get Active(): boolean {
    return this._active
  }

  public set Active(val: boolean) {
    this._active = val
    this._current_stats.Active = val
  }

  public get ID(): string {
    return this._id
  }

  public RenewID(): void {
    this._id = uuid()
  }

  public get CurrentStats(): NpcStats {
    return this._current_stats
  }

  public ResetStats(): void {
    this._current_stats = NpcStats.FromMax(this.Stats)
  }

  public get EncounterName(): string {
    return this._name
  }

  public get Icon(): string {
    if (!this.NpcClassController.Class) return ''
    return this.NpcClassController.Class.RoleIcon
  }

  public get Name(): string {
    return this._name
  }

  public set Name(val: string) {
    this._name = val
    this.SaveController.save()
  }

  public get Subtitle(): string {
    return this._subtitle
  }

  public set Subtitle(val: string) {
    this._subtitle = val
    this.SaveController.save()
  }

  public get Side(): EncounterSide {
    return this._side
  }

  public set Side(val: EncounterSide) {
    this._side = val
    this.SaveController.save()
  }

  public get Campaign(): string {
    return this._campaign
  }

  public set Campaign(val: string) {
    this._campaign = val
    this.SaveController.save()
  }

  public get Note(): string {
    return this._note
  }

  public set Note(val: string) {
    this._note = val
    this.SaveController.save()
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
    this.SaveController.save()
  }

  public get LabelString(): string {
    return this._user_labels.join(', ')
  }

  setStatBonuses(): void {
    // TODO
    console.error('Not yet implemented')
    // this.Stats.ClearBonuses()
    // this.Items.forEach(item => {
    //   if (item.Feature.Override) {
    //     for (const key in item.Feature.Override) {
    //       const o = Array.isArray(item.Feature.Override[key])
    //         ? item.Feature.Override[key][item.Tier - 1]
    //         : item.Feature.Override[key]
    //       this.Stats.Overrides[key] = o
    //     }
    //   } else {
    //     if (item.Feature.Bonus) {
    //       for (const key in item.Feature.Bonus) {
    //         const b = Array.isArray(item.Feature.Bonus[key])
    //           ? item.Feature.Bonus[key][item.Tier - 1]
    //           : item.Feature.Bonus[key]
    //         this.Stats.Bonuses[key] += parseInt(b)
    //       }
    //     }
    //   }
    // })
  }

  public RecalcBonuses(save = true): void {
    this.setStatBonuses()
    this.ResetStats()
    if (save) this.SaveController.save()
  }

  // -- Encounter Management ----------------------------------------------------------------------

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

  public get Evasion(): number {
    return this.Stats.Evade
  }

  public get EDefense(): number {
    return this.Stats.EDefense
  }

  public get SizeIcon(): string {
    return `cci-size-${this.Stats.Size === 0.5 ? 'half' : this.Stats.Size}`
  }

  // -- Cloud -------------------------------------------------------------------------------------

  public get Portrait(): string {
    return this.PortraitController.Portrait
  }

  public static Serialize(npc: Npc): INpcData {
    let data = {
      active: npc.Active,
      id: npc.ID,
      name: npc._name,
      subtitle: npc._subtitle,
      campaign: npc._campaign,
      labels: npc._user_labels,
      tag: npc._tag,
      stats: NpcStats.Serialize(npc.Stats),
      currentStats: NpcStats.Serialize(npc._current_stats),
      note: npc._note,
      side: npc.Side,
      statuses: npc._statuses,
      conditions: npc._conditions,
      resistances: npc._resistances,
      burn: npc._burn,
      overshield: npc._overshield,
      destroyed: npc._destroyed,
      defeat: npc._defeat,
      actions: npc._turn_actions,
    }

    SaveController.Serialize(npc, data)
    CloudController.Serialize(npc, data)
    PortraitController.Serialize(npc, data)
    BrewController.Serialize(npc, data)
    NpcClassController.Serialize(npc, data)
    NpcTemplateController.Serialize(npc, data)
    NpcFeatureController.Serialize(npc, data)
    CounterController.Serialize(npc, data)
    NarrativeElementController.Serialize(npc, data)

    return data as INpcData
  }

  public Serialize(): INpcData {
    return Npc.Serialize(this)
  }

  public static AddNew(data: INpcData, sync?: boolean): Npc {
    const n = Npc.Deserialize(data)
    if (sync) n.CloudController.MarkSync()
    getModule(NpcStore, store).addNpc(n)
    return n
  }

  public Update(data: INpcData): void {
    this._active = data.active
    this._id = data.id
    this._name = data.name
    this._subtitle = data.subtitle || ''
    this._side = data.side as EncounterSide
    this._campaign = data.campaign || ''
    this._user_labels = data.labels || []
    this._tag = data.tag
    this.Stats = NpcStats.Deserialize(data.stats)
    this.RecalcBonuses(false)
    this._note = data.note
    this._current_stats = data.currentStats
      ? NpcStats.Deserialize(data.currentStats)
      : NpcStats.FromMax(this.Stats)
    this._statuses = data.statuses || []
    this._conditions = data.conditions || []
    this._resistances = data.resistances || []
    this._burn = data.burn || 0
    this._overshield = data.overshield || 0
    this._turn_actions = data.actions || 1
    this._destroyed = data.destroyed || false
    this._defeat = data.defeat || ''
  }

  public static Deserialize(data: INpcData): Npc {
    const npc = new Npc()
    try {
      npc.Update(data)
      SaveController.Deserialize(npc, data)
      PortraitController.Deserialize(npc, data)
      BrewController.Deserialize(npc, data)
      NpcClassController.Deserialize(npc, data)
      NpcTemplateController.Deserialize(npc, data)
      NpcFeatureController.Deserialize(npc, data)
      CounterController.Deserialize(npc, data)
      NarrativeElementController.Deserialize(npc, data)
      npc.SaveController.SetLoaded()
      return npc
    } catch (err) {
      console.error(err)
    }
    return npc
  }
}

export { INpcData, Npc }
