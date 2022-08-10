import { CompendiumItem } from '@/class'
import {
  ISaveData,
  ICloudData,
  IPortraitData,
  CloudController,
  CounterController,
  ICloudSyncable,
  ICounterContainer,
  ISaveable,
  SaveController,
  PortraitController,
} from '@/classes/components'
import { BrewController, BrewInfo, IBrewData } from '@/classes/components/brew/BrewController'
import { IBrewable } from '@/classes/components/brew/IBrewable'
import { FeatureController } from '@/classes/components/feature/FeatureController'
import { IFeatureController } from '@/classes/components/feature/IFeatureController'
import { IClockData } from '@/classes/components/narrative/elements/Clock'
import { IRollableTableData } from '@/classes/components/narrative/elements/RollableTable'
import { INarrativeElement } from '@/classes/components/narrative/INarrativeElement'
import {
  NarrativeController,
  NarrativeElementData,
} from '@/classes/components/narrative/NarrativeController'
import { EidolonLayer } from './EidolonLayer'
import uuid from 'uuid/v4'
import { ImageTag } from '@/io/ImageManagement'
import { EidolonStore } from '@/features/gm/store/eidolon_store'
import { store } from '@/store'
import { getModule } from 'vuex-module-decorators'

class EidolonData implements IPortraitData, IBrewData, NarrativeElementData {
  portrait: string
  cloud_portrait: string
  brews: BrewInfo[]
  textItems: { title: string; body: string }[]
  clocks: IClockData[]
  tables: IRollableTableData[]
  labels: string[]
  campaign: string
  id: string
  name: string
  subtitle: string
  tag: string
  active: boolean
  note: string
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

  save: ISaveData
  cloud: ICloudData
}

class Eidolon
  implements
    ICloudSyncable,
    ISaveable,
    IBrewable,
    ICounterContainer,
    IFeatureController,
    INarrativeElement
{
  public readonly ItemType: string = 'eidolon'
  public ImageTag: ImageTag.NPC
  public PortraitController: PortraitController
  public CloudController: CloudController
  public SaveController: SaveController
  public BrewController: BrewController
  public BrewableCollection: CompendiumItem[]
  public CounterController: CounterController
  public FeatureController: FeatureController
  public NarrativeController: NarrativeController

  public Layers: EidolonLayer[]
  public ActiveLayerIndex: 0

  private _active: boolean
  private _id: string
  private _name: string
  private _subtitle: string
  private _note: string

  private _destroyed: boolean
  private _defeat: string

  public constructor() {
    this._active = false
    this._id = uuid()
    this.SaveController = new SaveController(this)
    this.PortraitController = new PortraitController(this)
    this.CloudController = new CloudController(this)
    this.BrewController = new BrewController(this)
    this.CounterController = new CounterController(this)
    this.FeatureController = new FeatureController(this)
    this.NarrativeController = new NarrativeController(this)

    this.FeatureController.Register()

    this._name = `New Eidolon`
    this._subtitle = ''
    this._note = ''
    this._destroyed = false
    this._defeat = ''
  }

  public get ActiveLayer(): EidolonLayer {
    return this.Layers[this.ActiveLayerIndex]
  }

  public get Active(): boolean {
    return this._active
  }

  public set Active(val: boolean) {
    this._active = val
  }

  public get ID(): string {
    return this._id
  }

  public RenewID(): void {
    this._id = uuid()
  }

  public get EncounterName(): string {
    return this._name
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

  public get Note(): string {
    return this._note
  }

  public set Note(val: string) {
    this._note = val
    this.SaveController.save()
  }

  public get Portrait(): string {
    return this.PortraitController.Portrait
  }

  public static Serialize(e: Eidolon): EidolonData {
    let data = {
      active: e.Active,
      id: e.ID,
      name: e._name,
      subtitle: e._subtitle,
      note: e._note,
      destroyed: e._destroyed,
      defeat: e._defeat,
    }

    SaveController.Serialize(e, data)
    CloudController.Serialize(e, data)
    PortraitController.Serialize(e, data)
    BrewController.Serialize(e, data)
    CounterController.Serialize(e, data)
    NarrativeController.Serialize(e, data)

    return data as EidolonData
  }

  public Serialize(): EidolonData {
    return Eidolon.Serialize(this)
  }

  public static AddNew(data: EidolonData, sync?: boolean): Eidolon {
    const n = Eidolon.Deserialize(data)
    if (sync) n.CloudController.MarkSync()
    getModule(EidolonStore, store).addEidolon(n)
    return n
  }

  public Update(data: EidolonData): void {
    this._active = data.active
    this._id = data.id
    this._name = data.name
    this._subtitle = data.subtitle || ''
    this._note = data.note
    this._destroyed = data.destroyed || false
    this._defeat = data.defeat || ''
  }

  public static Deserialize(data: EidolonData): Eidolon {
    const e = new Eidolon()
    try {
      e.Update(data)
      SaveController.Deserialize(e, data)
      PortraitController.Deserialize(e, data)
      BrewController.Deserialize(e, data)
      CounterController.Deserialize(e, data)
      NarrativeController.Deserialize(e, data)
      e.SaveController.SetLoaded()
      return e
    } catch (err) {
      console.error(err)
    }
    return e
  }

  public Clone(): Eidolon {
    const itemData = Eidolon.Serialize(this)
    const newItem = Eidolon.Deserialize(itemData)
    newItem.RenewID()
    newItem.Name += ' (COPY)'
    return newItem
  }
}

export { Eidolon, EidolonData }
