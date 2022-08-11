import uuid from 'uuid/v4'
import _ from 'lodash'
import { Npc } from '@/class'
import { ImageTag } from '@/io/ImageManagement'
import { ISaveable, ISaveData, SaveController } from '..'
import { PilotInstance } from './PilotInstance'
import { ActiveStatController, IActiveStatData } from './stats/ActiveStatController'
import { IStatData, StatController } from './stats/StatController'

class INpcInstanceData {
  id: string
  link_id: string
  name: string
  notes: string

  reactor_destroyed: boolean

  save: ISaveData
  stats: IStatData
  current_stats: IActiveStatData
}

class NpcInstance implements ISaveable {
  public readonly ItemType: string = 'Npc'

  public SaveController: SaveController
  public ImageTag = ImageTag.NPC
  public ActiveStatController: ActiveStatController
  public StatController: StatController

  public ID: string
  public LinkedID: string
  public Name: string

  public _notes: string

  private _reactor_destroyed: boolean
  private _meltdown_imminent: boolean
  private _core_active: boolean

  public constructor(npc: Npc) {
    this.ID = uuid()
    this.SaveController = new SaveController(this)
    this.StatController = new StatController(this, Npc)
    this.ActiveStatController = new ActiveStatController(this)

    this._notes = ''
    this._reactor_destroyed = false
    this._meltdown_imminent = false
    this._core_active = false

    if (Npc) {
      this.LinkedID = Npc.ID
      this.Name = Npc.Name
    }
  }

  // -- Info --------------------------------------------------------------------------------------
  public get Notes(): string {
    return this._notes
  }

  public set Notes(notes: string) {
    this._notes = notes
    this.SaveController.save()
  }

  // -- Stats -------------------------------------------------------------------------------------

  public get ReactorDestroyed(): boolean {
    return this._reactor_destroyed
  }

  public set ReactorDestroyed(destroyed: boolean) {
    this._meltdown_imminent = false
    this._reactor_destroyed = destroyed
    this.SaveController.save()
  }

  // -- I/O ---------------------------------------------------------------------------------------
  public static Serialize(m: NpcInstance): INpcInstanceData {
    const data = {
      id: m.ID,
      link_id: m.LinkedID,
      name: m.Name,
      notes: m.Notes,
      meltdown_imminent: m._meltdown_imminent,
      reactor_destroyed: m.ReactorDestroyed,
    }

    SaveController.Serialize(m, data)
    StatController.Serialize(m, data)
    ActiveStatController.Serialize(m, data)

    return data as INpcInstanceData
  }

  public static Deserialize(data: INpcInstanceData, p: PilotInstance): NpcInstance {
    const m = new NpcInstance(p)

    m.Update(data, p)

    SaveController.Deserialize(m, data.save)

    m.SaveController.SetLoaded()

    return m
  }

  Clone(): ISaveable {
    const itemData = NpcInstance.Serialize(this)
    const newItem = NpcInstance.Deserialize(itemData)
    newItem.ID = uuid()
    newItem.Name += ' (COPY)'
    return newItem
  }

  public Update(data: INpcInstanceData, parent: PilotInstance) {
    this.ID = data.id
    this.LinkedID = data.link_id
    this.Name = data.name
    this._notes = data.notes
    this._reactor_destroyed = data.reactor_destroyed || false

    StatController.Deserialize(this, data.stats)
    ActiveStatController.Deserialize(this, data.current_stats)
  }
}

export { NpcInstance, INpcInstanceData }
