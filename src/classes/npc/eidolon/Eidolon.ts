import { i18n } from '@/i18n'
import { CloudController } from '@/classes/components/cloud/CloudController'
import { PortraitController } from '@/classes/components/portrait/PortraitController'
import { SaveController } from '@/classes/components/save/SaveController'
import { BrewController } from '@/classes/components/brew/BrewController'
import { NarrativeController } from '@/classes/narrative/NarrativeController'
import { Npc, NpcData } from '../Npc'
import { CompendiumStore } from '@/features/compendium/store'
import { StatKey } from '@/classes/components/combat/stats/Stats'
import { CombatController } from '@/classes/components/combat/CombatController'
import { DeployableInstance } from '@/classes/components/feature/deployable/DeployableInstance'
import { EidolonLayerInstance, IEidolonLayerInstanceData } from './EidolonLayerInstance'
import { FolderController } from '@/classes/components/folder/FolderController'
import { IInstanceableData } from '@/classes/components/instance/IInstanceable'
import { IInstanceable } from '@/classes/components/instance/IInstanceable'
import type { CombatantData } from '@/classes/encounter/Encounter'
import type { ICombatant } from '@/classes/components/combat/ICombatant'
import { EidolonLayer, IEidolonLayerData, CORE_LAYER_ID } from './EidolonLayer'
import { SHARD_TYPE } from './EidolonShard'
import { statEdits, restoreEdits, type TierEdits } from '../tierChange'
import { ItemType } from '../../enums'

const MAX_ACTIVATIONS = 4
const HOSTILES_PER_ACTIVATION = 2

function isShard(d: DeployableInstance): boolean {
  return d.Base.Type.toLowerCase() === SHARD_TYPE
}

function endAllEffects(cc: CombatController): void {
  cc.StatusController.ResetForEncounter()
  cc.TimedEffectController.ResetForEncounter()
}

function destroyShards(holder: CombatantData): void {
  holder.deployables = holder.deployables.filter(d => !isShard(d))
}

class EidolonData extends NpcData implements IInstanceableData {
  npcType: string = 'eidolon'
  override instanceId: string = ''

  tier: number = 1
  activeLayer?: number
  manifesting?: boolean
  layer_data: IEidolonLayerInstanceData[] = []
}

class Eidolon extends Npc implements ICombatant, IInstanceable {
  public readonly IsEncounterInstance: boolean = false
  public InstanceID?: string
  public OriginId: string
  public ActiveLayerIndex: number
  public Manifesting: boolean

  public override readonly ItemType: ItemType = ItemType.Eidolon
  private _tier: number

  private _layers: EidolonLayerInstance[]

  public constructor(data?: EidolonData) {
    super(data)
    this._name = data?.name || i18n.global.t('classes.newEidolon')
    this.InstanceID = data?.instanceId
    this.OriginId = data?.originId || ''
    this.Manifesting = !!data?.manifesting

    this._tier = data?.tier || 1

    this._layers = []

    if (data) {
      try {
        if (data.layer_data?.length) {
          this._layers = data.layer_data.map(l => new EidolonLayerInstance(l, this))
        }
      } catch (e) {
        Npc.LoadError(this, e, 'Eidolon Layer data')
      }
    }

    if (this._layers.length === 0) this._layers.push(this.newLayer(CORE_LAYER_ID))

    this.ActiveLayerIndex = data?.activeLayer ?? this.OutermostLayerIndex

    this.CloudController = new CloudController(this)
  }

  private newLayer(id: string, data = {} as IEidolonLayerData): EidolonLayerInstance {
    return new EidolonLayerInstance({ id, data, description: '' }, this)
  }

  public CreateInstance<EidolonData>(): EidolonData {
    const data = this.Serialize() as EidolonData
    ;(data as any).instanceId = crypto.randomUUID()
    ;(data as any).originId = this.ID
    ;(data as any).id = (data as any).instanceId
    ;(data as any).is_instance = true

    return data
  }

  public get Tier(): number {
    return this._tier
  }

  public set Tier(newTier: number) {
    this.ChangeTier(newTier)
  }

  public ChangeTier(tier: number, keep: TierEdits = 'reset'): void {
    const edits = this._layers.map(l => statEdits(l.StatController, l.StatTable))
    this._tier = tier
    this._layers.forEach((l, i) => {
      l.SetStats()
      restoreEdits(l.StatController, edits[i], keep)
    })
    this.save()
  }

  public get Layers(): EidolonLayerInstance[] {
    return this._layers
  }

  public get OutermostLayerIndex(): number {
    return this._layers.length - 1
  }

  public get ActiveLayer(): EidolonLayerInstance {
    if (!this._layers[this.ActiveLayerIndex]) this.ActiveLayerIndex = this.OutermostLayerIndex
    return this._layers[this.ActiveLayerIndex]
  }

  public get CombatController() {
    return this.ActiveLayer.CombatController
  }

  public get StatController() {
    return this.ActiveLayer.StatController
  }

  public get IsDefeated(): boolean {
    return this._layers[0].CombatController.IsDestroyed
  }

  public get Scan(): string {
    return this.ActiveLayer.Layer.Hints
  }

  public get HasEditedStats(): boolean {
    return this._layers.some(l => l.HasEditedStats)
  }

  public SetStats() {
    this._layers.forEach(l => l.SetStats())
  }

  public get EidolonClass() {
    const l = this._layers.length - 1
    if (l < 3) return '0'
    if (l > 5) return '3+'
    return (l - 2).toString()
  }

  public static ActivationsFor(hostileCount: number): number {
    const turns = Math.floor(hostileCount / HOSTILES_PER_ACTIVATION)
    return Math.max(1, Math.min(MAX_ACTIVATIONS, turns))
  }

  public PrepareForEncounter(playerCount: number, hostileCount: number, encounter?: unknown): void {
    const activations = Eidolon.ActivationsFor(hostileCount)
    this._layers.forEach(l => l.PrepareForEncounter(playerCount, activations, encounter))
  }

  public ScaleToEncounter(playerCount: number, hostileCount: number): void {
    const activations = Eidolon.ActivationsFor(hostileCount)
    this._layers.forEach(l => l.ScaleToEncounter(playerCount, activations))
  }

  public SetActiveLayer(index: number): void {
    const from = this.CombatController
    this.ActiveLayerIndex = index
    const to = this.CombatController
    this.Manifesting = false
    if (to === from) return

    to.Round = from.Round
    to.Turn = from.Turn
    to.StatController.setCurrentStat(
      StatKey.ACTIVATIONS,
      from.StatController.getCurrent(StatKey.ACTIVATIONS)
    )
  }

  public DestroyActiveLayer(holder: CombatantData): void {
    const destroyed = this.ActiveLayer
    destroyed.CombatController.SetDestroyed(true)
    endAllEffects(destroyed.CombatController)

    if (destroyed.Layer.Shards?.DestroyedWithLayer) destroyShards(holder)
    holder.deployables.filter(isShard).forEach(s => endAllEffects(s.CombatController))

    if (this.ActiveLayerIndex === 0) return
    this.SetActiveLayer(this.ActiveLayerIndex - 1)
    this.Manifesting = true
  }

  public Manifest(holder: CombatantData, hostileCount: number): void {
    this.Manifesting = false
    if (this.ActiveLayer.Layer.IsCore) destroyShards(holder)
    else this.CreateShards(holder, hostileCount)
  }

  public ShardCount(hostileCount: number): number {
    return this.ActiveLayer.Layer.Shards?.CountFor(this.Tier, hostileCount) ?? 0
  }

  public CreateShards(holder: CombatantData, hostileCount: number): void {
    const layer = this.ActiveLayer
    const count = this.ShardCount(hostileCount)
    for (let i = 0; i < count; i++)
      holder.deployables.push(layer.Layer.Shards!.Create(holder, layer.Name, this.Tier))
  }

  private layersChanged(): void {
    this.ActiveLayerIndex = this.OutermostLayerIndex
    this.save()
  }

  public AddLayer(layer: EidolonLayer) {
    this._layers.push(this.newLayer(layer.ID, layer.Data))
    this.layersChanged()
  }

  public AddRandomLayer() {
    const layers = CompendiumStore().EidolonLayers
    if (layers.length) this.AddLayer(layers[Math.floor(Math.random() * layers.length)])
  }

  public RemoveLayer(index: number) {
    const removed = this._layers[index]
    if (!removed || index === 0) return

    const copies = this._layers.filter(l => l.ID === removed.ID).length
    this._layers.splice(index, 1)
    this.CloudController.stampTombstone(
      `layer_data.${copies > 1 ? `${removed.ID}#${copies - 1}` : removed.ID}`
    )
    this.layersChanged()
  }

  public MoveLayer(from: number, to: number) {
    this._layers.splice(to, 0, this._layers.splice(from, 1)[0])
    this.layersChanged()
  }

  public CopyLayersFrom(source: Eidolon) {
    this._layers = source.Layers.map(l => new EidolonLayerInstance(l.Serialize(), this))
    this.layersChanged()
  }

  public static Serialize(eidolon: Eidolon): EidolonData {
    const data = {
      npcType: 'eidolon',
      id: eidolon.ID,
      is_instance: eidolon.IsInstance,
      instanceId: eidolon.InstanceID,
      originId: eidolon.OriginId,
      name: eidolon.Name,
      note: eidolon.Note,
      tier: eidolon.Tier,
      config: eidolon.LcpConfig,
      description: eidolon.Description,
      gmDescription: eidolon.GmDescription,
      activeLayer: eidolon.ActiveLayerIndex,
      manifesting: eidolon.Manifesting || undefined,
      layer_data: eidolon.Layers.map(l => l.Serialize()),
    } as EidolonData

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
