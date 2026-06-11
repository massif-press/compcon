import { v4 as uuid } from 'uuid'
import { i18n } from '@/i18n'
import { CloudController } from '@/classes/components/cloud/CloudController'
import { PortraitController } from '@/classes/components/portrait/PortraitController'
import { SaveController } from '@/classes/components/save/SaveController'
import { BrewController } from '@/classes/components/brew/BrewController'
import { NarrativeController } from '@/classes/narrative/NarrativeController'
import { Npc, NpcData } from '../Npc'
import { CompendiumStore } from '@/features/compendium/store'
import { NpcStore } from '@/features/gm/store/npc_store'
import { IStatData } from '@/classes/components/combat/stats/StatController'
import { EidolonLayerSaveData } from './EidolonLayerSaveData'
import { FolderController } from '@/classes/components/folder/FolderController'
import { IInstanceableData } from '@/classes/components/instance/IInstanceable'
import { IInstanceable } from '@/classes/components/instance/IInstanceable'
import { EidolonLayer, IEidolonLayerData } from './EidolonLayer'
import { ItemType } from '../../enums'
class EidolonData extends NpcData implements IInstanceableData {
  npcType: string = 'eidolon'
  instanceId: string = ''

  tier: number = 1
  activeLayer: number = 0
  layer_data: {
    id: string
    description: string
    data: IEidolonLayerData
    stats?: IStatData
    shard?: IStatData
  }[] = []
}

class Eidolon extends Npc implements IInstanceable {
  public InstanceID?: string
  public ActiveLayerIndex: number = 0

  public readonly ItemType: ItemType = ItemType.Eidolon
  private _tier: number

  private _layers: EidolonLayerSaveData[]

  public constructor(data?: EidolonData) {
    super(data)
    this._name = data?.name || i18n.global.t('classes.newEidolon')
    this.ActiveLayerIndex = data?.activeLayer || 0

    this.InstanceID = data?.instanceId

    this._tier = data?.tier || 1

    this._layers = []

    if (data) {
      try {
        if (data.layer_data?.length) {
          this._layers = data.layer_data.map(l => new EidolonLayerSaveData(l, this))
        }
      } catch (e) {
        Npc.LoadError(this, e, 'Eidolon Layer data')
      }
    }

    if (!data || this._layers.length === 0)
      this._layers.push(
        new EidolonLayerSaveData(
          { id: 'el_core', description: '', data: {} as IEidolonLayerData },
          this
        )
      )

    this.CloudController = new CloudController(this)
  }

  public CreateInstance<EidolonData>(): EidolonData {
    const data = this.Serialize() as EidolonData
    ;(data as any).instanceId = uuid()
    ;(data as any).is_instance = true

    return data
  }

  public get IsLinked(): boolean {
    return this.GetLinkedItem<Npc>() !== undefined
  }

  public GetLinkedItem<Npc>(): Npc {
    return NpcStore().getNpcByID(this.ID) as Npc
  }

  public get Tier(): number {
    return this._tier
  }

  public set Tier(newTier: number) {
    this._tier = newTier

    this._layers.forEach(l => {
      l.ResetStats()
    })

    this.save()
  }

  public get ActiveLayer() {
    if (this.ActiveLayerIndex < 0 || this.ActiveLayerIndex >= this._layers.length)
      this.ActiveLayerIndex = 0
    return this._layers[this.ActiveLayerIndex]
  }

  public get CombatController() {
    return this.ActiveLayer.CombatController
  }

  public get StatController() {
    return this.ActiveLayer.StatController
  }

  public SetStats() {
    this.Layers.forEach(l => l.SetStats())
  }

  public SetLayerHp(playerCount: number, reset: boolean = false) {
    this.Layers.forEach(l => l.ResetHp(playerCount, reset))
  }

  public get Class() {
    const l = this._layers.length - 1
    if (l < 3) return '0'
    if (l > 5) return '3+'
    return (l - 2).toString()
  }

  public get Layers(): EidolonLayerSaveData[] {
    return this._layers
  }

  public AddLayer(layer: EidolonLayer) {
    this._layers.push(
      new EidolonLayerSaveData({ id: layer.ID, data: layer.Data, description: '' }, this)
    )
    this.save()
  }

  public ClearLayers() {
    this._layers = []
    this.save()
  }

  public AddRandomLayer() {
    const availableLayers = CompendiumStore().EidolonLayers.filter(
      l => !this._layers.some(x => (x.Layer as EidolonLayer).ID === l.ID)
    )
    const l = availableLayers[Math.floor(Math.random() * availableLayers.length)]
    if (l)
      this._layers.push(new EidolonLayerSaveData({ id: l.ID, data: l.Data, description: '' }, this))
    this.save()
  }

  public RemoveLayer(index: number) {
    if (index > -1) {
      const removed = this._layers[index]
      this._layers.splice(index, 1)
      if (removed?.ID) {
        this.CloudController.stampTombstone(`layer_data.${removed.ID}`)
      }
    }
    this.save()
  }

  public MoveLayer(from: number, to: number) {
    this._layers.splice(to, 0, this._layers.splice(from, 1)[0])
    this.save()
  }

  public static Serialize(eidolon: Eidolon): EidolonData {
    const data = {
      npcType: 'eidolon',
      id: eidolon.ID,
      is_instance: eidolon.IsInstance,
      instanceId: eidolon.InstanceID,
      name: eidolon.Name,
      note: eidolon.Note,
      tier: eidolon.Tier,
      config: eidolon.LcpConfig,
      description: eidolon.Description,
      gmDescription: eidolon.GmDescription,
      layer_data: [] as any[],
    } as EidolonData

    data.layer_data = eidolon.Layers.map(l => EidolonLayerSaveData.Serialize(l))

    SaveController.Serialize(eidolon, data)
    CloudController.Serialize(eidolon, data)
    PortraitController.Serialize(eidolon, data)
    BrewController.Serialize(eidolon, data)
    NarrativeController.Serialize(eidolon, data)
    FolderController.Serialize(eidolon, data)

    return data as EidolonData
  }

  public Serialize<EidolonData>(): EidolonData {
    return Eidolon.Serialize(this) as EidolonData
  }

  public static Deserialize(data: EidolonData): Eidolon {
    const eidolon = new Eidolon(data)

    SaveController.Deserialize(eidolon, data.save)
    CloudController.Deserialize(eidolon, (data as any).cloud)
    BrewController.Deserialize(eidolon, data)
    PortraitController.Deserialize(eidolon, data.img)
    NarrativeController.Deserialize(eidolon, data.narrative)
    FolderController.Deserialize(eidolon, data.folder)
    return eidolon
  }

  public Clone<Eidolon>(setName = true): Eidolon {
    const itemData = JSON.parse(JSON.stringify(Eidolon.Serialize(this)))
    const newItem = Eidolon.Deserialize(itemData)
    newItem.RenewID()
    if (setName) newItem.Name += ' (COPY)'
    return newItem as Eidolon
  }

  public get Icon(): string {
    return 'cc:monist'
  }

  public get TagIcon(): string {
    return 'cc:monist'
  }
}

export { Eidolon, EidolonData }
