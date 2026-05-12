import { v4 as uuid } from 'uuid'
import { SaveController, CloudController, PortraitController } from '@/classes/components'
import { BrewController } from '@/classes/components/brew/BrewController'
import { NarrativeController } from '@/classes/narrative/NarrativeController'
import { NpcData, Npc } from '../Npc'
import { INpcClassSaveData, NpcClassController } from '../class/NpcClassController'
import { INpcFeatureSaveData, NpcFeatureController } from '../feature/NpcFeatureController'
import { INpcTemplateSaveData, NpcTemplateController } from '../template/NpcTemplateController'
import { IStatContainer } from '@/classes/components/combat/stats/IStatContainer'
import { FolderController } from '@/classes/components/folder/FolderController'
import { IInstanceable } from '@/classes/components/instance/IInstanceable'
import { Rules } from '@/classes/utility/Rules'
import { CompendiumStore, NpcStore } from '@/stores'
import { INpcFeatureData } from '../feature/NpcFeature'
import { INpcTemplateData } from '../template/NpcTemplate'
import { INpcClassData } from '../class/NpcClass'
import { CombatController, CombatData } from '@/classes/components/combat/CombatController'
import { ICombatant } from '@/classes/components/combat/ICombatant'
import { StatController } from '@/classes/components/combat/stats/StatController'
import { IFeatureController } from '@/classes/components/feature/IFeatureController'
import { ItemType } from '@/class'

class UnitData
  extends NpcData
  implements INpcClassSaveData, INpcFeatureSaveData, INpcTemplateSaveData
{
  npcType: string = 'unit'

  combat_data: CombatData = {} as CombatData
  class!: { id: string; data: INpcClassData }
  tier!: number
  templates: { id: string; data: INpcTemplateData }[] = []

  subtitle: string = ''
  tag: string = 'Mech'
  features: { id: string; data: INpcFeatureData }[] = []
}

class Unit extends Npc implements ICombatant, IInstanceable {
  public IsInstance: boolean
  public InstanceID: string
  public OriginId: string

  public ItemType: ItemType = ItemType.Unit
  private _tag: string = 'Mech'

  public NpcFeatureController: NpcFeatureController
  public NpcTemplateController: NpcTemplateController
  public NpcClassController: NpcClassController
  public CombatController: CombatController

  public IsEncounterInstance = false

  public constructor(data?: UnitData) {
    super(data)
    this._name = data?.name || ''
    this._tag = data?.tag || 'Mech'

    this.IsInstance = !!(data?.instance && data?.instanceId)
    this.InstanceID = data?.instanceId || ''
    this.OriginId = data?.originId || ''

    this.CombatController = new CombatController(this)
    this.NpcClassController = new NpcClassController(this)
    this.NpcFeatureController = new NpcFeatureController(this)
    this.NpcTemplateController = new NpcTemplateController(this)

    this.FeatureController.Register(this.NpcFeatureController)
    this.CloudController = new CloudController(this)
  }

  public get Name(): string {
    if (this._name) return this._name
    return this.DefaultName
  }

  public set Name(val: string) {
    this._name = val
    this.save()
  }

  public get Tier(): number {
    return this.NpcClassController.Tier || 1
  }

  public get DefaultName(): string {
    return `T${this.NpcClassController.Tier} ${this.NpcTemplateController.Templates.map(x => x.Name).join(' ')} ${this.NpcClassController.Class?.Name || 'NPC'} ${this.Tag}`
  }

  public get IsNameless(): boolean {
    return !this._name
  }

  public get IsBiological(): boolean {
    return this._tag.toLowerCase() === 'biological'
  }

  public get Tag(): string {
    return this._tag
  }

  public set Tag(val: string) {
    this._tag = val
    this.save()
  }

  public get TagIcon(): string {
    return this.IsBiological ? 'cc:biological' : `cc:${this.Tag.toLowerCase()}`
  }

  public get StatController(): StatController {
    return this.CombatController.StatController
  }

  public getExpressionContext(): Record<string, number> {
    const sc = this.CombatController.StatController
    return {
      tier: this.Tier,
      hull: sc.getMax('hull') ?? 0,
      agi: sc.getMax('agi') ?? 0,
      sys: sc.getMax('sys') ?? 0,
      eng: sc.getMax('eng') ?? 0,
      size: sc.getMax('size') ?? 0,
      hp: sc.getMax('hp') ?? 0,
      speed: sc.getMax('speed') ?? 0,
      evasion: sc.getMax('evasion') ?? 0,
      edef: sc.getMax('edef') ?? 0,
      heatcap: sc.getMax('heatcap') ?? 0,
      sensors: sc.getMax('sensorRange') ?? 0,
      save: sc.getMax('saveTarget') ?? 0,
    }
  }

  public getEntityRef(name: string): IFeatureController | null {
    return name.toLowerCase() === 'self' ? this : null
  }

  public SetStats(): void {
    this.CombatController.setStats(this.NpcClassController.getClassStats())
  }

  public CreateInstance<UnitData>(): UnitData {
    const data = this.Serialize() as any
    ;(data as any).instanceId = uuid()
    data.originId = this.ID
    data.id = data.instanceId
    data.instance = true

    return data as UnitData
  }

  public get IsLinked(): boolean {
    return (
      this.GetLinkedItem<Npc>() !== undefined && !this.GetLinkedItem<Npc>().BrewController.HasError
    )
  }

  public GetLinkedItem<Npc>(): Npc {
    return NpcStore().getNpcByID(this.OriginId)
  }

  public static Serialize(unit: Unit, asInstance: boolean): UnitData {
    const data = {
      npcType: 'unit',
      id: unit.ID,
      instance: unit.IsInstance || !!asInstance,
      instanceId: unit.InstanceID,
      originId: unit.OriginId,
      name: unit._name,
      tag: unit.Tag,
      note: unit.Note,
      description: unit.Description,
      gmDescription: unit.GmDescription,
      combat_data: {} as CombatData,
      config: unit.LcpConfig,
    } as UnitData

    SaveController.Serialize(unit, data)
    CloudController.Serialize(unit, data)
    PortraitController.Serialize(unit, data)
    NpcTemplateController.Serialize(unit, data)
    NpcFeatureController.Serialize(unit, data)
    NpcClassController.Serialize(unit, data)
    NarrativeController.Serialize(unit, data)
    CombatController.Serialize(unit.CombatController, data.combat_data)
    FolderController.Serialize(unit, data)
    BrewController.Serialize(unit, data)

    return data as UnitData
  }

  public Serialize(asInstance: boolean = false): UnitData {
    return Unit.Serialize(this, asInstance)
  }

  public static Deserialize(data: UnitData): Unit {
    const unit = new Unit(data)

    SaveController.Deserialize(unit, data.save)
    BrewController.Deserialize(unit, data)
    PortraitController.Deserialize(unit, data.img)
    if (!CompendiumStore().hasNpcAccess) unit.BrewController.MissingContent = true
    try {
      NpcClassController.Deserialize(unit, data as any)
    } catch (e) {
      Npc.LoadError(unit as unknown as Npc, e, 'Npc Class Controller')
    }
    try {
      NpcTemplateController.Deserialize(unit, data as any)
    } catch (e) {
      Npc.LoadError(unit as unknown as Npc, e, 'Npc Template Controller')
    }
    try {
      NpcFeatureController.Deserialize(unit, data as any)
    } catch (e) {
      Npc.LoadError(unit as unknown as Npc, e, 'Npc Feature Controller')
    }
    NarrativeController.Deserialize(unit, data.narrative)
    CombatController.Deserialize(unit.CombatController, data.combat_data)
    FolderController.Deserialize(unit, data.folder)
    return unit
  }

  public Clone<Unit>(): Unit {
    const itemData = JSON.parse(JSON.stringify(Unit.Serialize(this, false)))
    const newItem = Unit.Deserialize(itemData)
    newItem.RenewID()
    if (newItem._name) newItem._name += ' (COPY)'
    return newItem as Unit
  }

  public get Icon(): string {
    if (this.NpcClassController.HasClass) return this.NpcClassController.Class!.Icon
    return 'cc:encounter'
  }

  public get TierIcon(): string {
    return `cc:npc_tier_${this.NpcClassController.Tier || 1}`
  }

  public get SizeIcon(): string {
    const size = this.StatController.getMax('size')
    if (!size) return 'cc:size_1'
    return Rules.SizeIcon(size)
  }
}

export { UnitData, Unit }
