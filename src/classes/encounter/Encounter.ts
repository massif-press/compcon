import { i18n } from '@/i18n'
import {
  CloudController,
  ICloudData,
  IPortraitData,
  ISaveData,
  ISaveable,
  PortraitController,
  SaveController,
} from '../components'
import { ISitrepData, Sitrep, SitrepInstance } from './Sitrep'
import { FolderController, IFolderData } from '../components/folder/FolderController'
import { NarrativeController, NarrativeElementData } from '../narrative/NarrativeController'
import { IFolderPlaceable } from '../components/folder/IFolderPlaceable'
import { INarrativeElement } from '../narrative/INarrativeElement'
import { ImageTag } from '@/io/ImageManagement'
import { Environment, EnvironmentInstance, IEnvironmentData } from '../Environment'
import { Npc } from '../npc/Npc'
import { Unit, UnitData } from '../npc/unit/Unit'
import { Doodad, DoodadData } from '../npc/doodad/Doodad'
import { Eidolon, EidolonData } from '../npc/eidolon/Eidolon'
import { ItemType, PilotStatus, NpcStatus, MechStatus } from '../enums'
import { Pilot, PilotData } from '../pilot/Pilot'
import { ICombatant } from '../components/combat/ICombatant'
import {
  DeployableInstance,
  IDeployableInstanceData,
} from '../components/feature/deployable/DeployableInstance'
import { IPlaceholderData, Placeholder } from './Placeholder'

type CombatantType = 'unit' | 'doodad' | 'eidolon' | 'pilot' | 'placeholder'
type CombatantSide = 'enemy' | 'ally' | 'neutral'
type ActorData = UnitData | DoodadData | EidolonData | PilotData | IPlaceholderData

interface IEncounterData {
  itemType: 'Encounter'
  id: string
  name: string
  note?: string
  description?: string
  gmDescription?: string
  save: ISaveData
  cloud?: ICloudData
  folder: IFolderData
  img: IPortraitData
  narrative: NarrativeElementData
  sitrep?: ISitrepData
  environment?: IEnvironmentData
  combatants?: CombatantSaveData[]
}

export type CombatantData = {
  id: string
  index: number
  type: CombatantType
  actor: ICombatant
  number: number
  side: CombatantSide
  deployables: DeployableInstance[]
  playerCount?: number
  reinforcement?: boolean
  reinforcementTurn?: number
  status?: NpcStatus
  pilotStatus?: PilotStatus
  mechStatus?: MechStatus
}

type CombatantSaveData = {
  id?: string
  index: number
  type: CombatantType
  actor: ActorData
  npc?: ActorData
  side?: CombatantSide
  playerCount?: number
  reinforcement?: boolean
  reinforcementTurn?: number
  deployables?: IDeployableInstanceData[]
  number?: number
  status?: NpcStatus
  pilotStatus?: PilotStatus
  mechStatus?: MechStatus
}

const DESERIALIZE_ACTOR: Record<CombatantType, (d: any) => any> = {
  unit: d => Unit.Deserialize(d),
  doodad: d => Doodad.Deserialize(d),
  eidolon: d => Eidolon.Deserialize(d),
  pilot: d => Pilot.Deserialize(d),
  placeholder: d => Placeholder.Deserialize(d),
}

function makeCombatant(
  actor: ICombatant,
  type: CombatantType,
  over: Partial<CombatantData> = {}
): CombatantData {
  return {
    id: actor.ID,
    index: 0,
    type,
    number: 1,
    actor,
    side: 'enemy',
    playerCount: 0,
    reinforcement: false,
    reinforcementTurn: 0,
    deployables: [],
    status: NpcStatus.Operational,
    pilotStatus: PilotStatus.Active,
    mechStatus: MechStatus.Operational,
    ...over,
  }
}

class Encounter implements INarrativeElement, ISaveable, IFolderPlaceable {
  public readonly ItemType: ItemType = ItemType.Encounter
  public readonly DataType: string = 'savedata'
  public readonly StorageType: string = 'encounters'

  private _id: string
  protected _name: string = i18n.global.t('classes.newEncounter')

  private _note: string
  private _description: string
  private _gmDescription: string
  private _sitrep?: SitrepInstance
  private _environment?: EnvironmentInstance

  public ImageTag: ImageTag = ImageTag.Map
  public SaveController: SaveController
  public CloudController: CloudController
  public PortraitController: PortraitController
  public NarrativeController: NarrativeController
  public FolderController: FolderController

  private _combatants: CombatantData[] = []

  public constructor(data?: IEncounterData) {
    this._id = data?.id || crypto.randomUUID()
    this._name = data?.name || ''
    this._note = data?.note || ''
    this._description = data?.description || ''
    this._gmDescription = data?.gmDescription || ''

    if (data?.sitrep) {
      this._sitrep = new SitrepInstance(this, new Sitrep(data.sitrep))
    }

    if (data?.environment) {
      this._environment = new EnvironmentInstance(this, new Environment(data.environment))
    }

    if (data?.combatants) {
      this._combatants = data.combatants.map(c => Encounter.DeserializeCombatant(c))
      this.renumber()
    }

    this.SaveController = new SaveController(this)
    this.CloudController = new CloudController(this)

    this.PortraitController = new PortraitController(this)
    this.NarrativeController = new NarrativeController(this)
    this.FolderController = new FolderController(this)
  }

  public save(): void {
    this.SaveController.save()
  }

  public get Created(): number {
    return this.SaveController.Created
  }

  public get Updated(): number {
    return this.SaveController.LastModified
  }

  public get Portrait(): string {
    return this.PortraitController.Portrait
  }

  public get ID(): string {
    return this._id
  }

  public RenewID(): void {
    this._id = crypto.randomUUID()
    this.save()
  }

  public get Name(): string {
    if (!this._name) {
      return this.DefaultName
    }
    return this._name
  }

  public get DefaultName(): string {
    return `${this.Environment.Name} - ${this.Sitrep.Name}`
  }

  public set Name(val: string) {
    this._name = val
    this.save()
  }

  public get Note(): string {
    return this._note
  }

  public set Note(val: string) {
    this._note = val
    this.save()
  }

  public get Description(): string {
    return this._description
  }

  public set Description(val: string) {
    this._description = val
    this.save()
  }

  public get GmDescription(): string {
    return this._gmDescription
  }

  public set GmDescription(val: string) {
    this._gmDescription = val
    this.save()
  }

  public get Sitrep(): SitrepInstance {
    if (!this._sitrep) {
      this._sitrep = new SitrepInstance(this)
    }
    return this._sitrep
  }

  public set Sitrep(val: SitrepInstance) {
    this._sitrep = val
    this.save()
  }

  public get Environment(): EnvironmentInstance {
    if (!this._environment) {
      this._environment = new EnvironmentInstance(this)
    }

    return this._environment
  }

  public set Environment(val: EnvironmentInstance) {
    this._environment = val
    this.save()
  }

  public get Combatants(): CombatantData[] {
    return this._combatants
  }

  public set Combatants(val: CombatantData[]) {
    this._combatants = val
  }

  public AddCombatant(npc: Npc): void {
    const type = npc.ItemType.toLowerCase() as CombatantType
    if (type !== 'unit' && type !== 'doodad' && type !== 'eidolon') {
      throw new Error('Invalid combatant type')
    }

    const actor = DESERIALIZE_ACTOR[type](npc.CreateInstance())
    this._combatants.push(makeCombatant(actor, type, { index: this._combatants.length }))
    this.renumber()
    this.save()
  }

  private renumber(): void {
    const counts: Record<string, number> = {}
    this._combatants.forEach(c => {
      counts[c.actor.Name] = (counts[c.actor.Name] || 0) + 1
      c.number = counts[c.actor.Name]
    })
  }

  public RemoveCombatant(index: number): void {
    const removed = this.Combatants[index]
    this.Combatants.splice(index, 1)
    if (removed?.id) {
      this.CloudController.stampTombstone(`combatants.${removed.id}`)
    }
    this.save()
  }

  public ReorderCombatant(fromAbsolute: number, toAbsolute: number): void {
    const item = this._combatants.splice(fromAbsolute, 1)[0]
    this._combatants.splice(toAbsolute, 0, item)
    this.save()
  }

  public static Serialize(enc: Encounter): IEncounterData {
    const data = {
      itemType: 'Encounter',
      id: enc.ID,
      name: enc.Name,
      note: enc.Note,
      description: enc.Description,
      gmDescription: enc.GmDescription,
      sitrep: SitrepInstance.Serialize(enc.Sitrep),
      environment: EnvironmentInstance.Serialize(enc.Environment),
      combatants: enc.Combatants.map(c => Encounter.SerializeCombatant(c)),
    } as IEncounterData

    SaveController.Serialize(enc, data)
    CloudController.Serialize(enc, data)
    PortraitController.Serialize(enc, data)
    NarrativeController.Serialize(enc, data)
    FolderController.Serialize(enc, data)

    return data as IEncounterData
  }

  public static SerializeCombatant(combatant: CombatantData): CombatantSaveData {
    return {
      id: combatant.id,
      index: combatant.index,
      type: combatant.type,
      actor: combatant.actor.Serialize!(true),
      side: combatant.side,
      playerCount: combatant.playerCount,
      reinforcement: combatant.reinforcement,
      reinforcementTurn: combatant.reinforcementTurn,
      deployables: combatant.deployables.map(d => DeployableInstance.Serialize(d)),
      number: combatant.number,
      status: combatant.status || NpcStatus.Operational,
      pilotStatus: combatant.pilotStatus || PilotStatus.Active,
      mechStatus: combatant.mechStatus || MechStatus.Operational,
    }
  }

  public Serialize(): IEncounterData {
    return Encounter.Serialize(this)
  }

  public Clone(): Encounter {
    const clone = Encounter.Deserialize(structuredClone(Encounter.Serialize(this)))
    clone.RenewID()
    return clone
  }

  public static Deserialize(data: IEncounterData): Encounter {
    const encounter = new Encounter(data)
    SaveController.Deserialize(encounter, data.save)
    CloudController.Deserialize(encounter, data.cloud)
    PortraitController.Deserialize(encounter, data.img)
    NarrativeController.Deserialize(encounter, data.narrative)
    FolderController.Deserialize(encounter, data.folder)

    return encounter
  }

  public static DeserializeCombatant(data: CombatantSaveData): CombatantData {
    const deserialize = DESERIALIZE_ACTOR[data.type]
    if (!deserialize) throw new Error('Invalid combatant type')

    const item = makeCombatant(deserialize(data.npc ?? data.actor), data.type, {
      id: data.id || crypto.randomUUID(),
      index: data.index,
      number: data.number || 1,
      side: (data.side?.toLowerCase() as CombatantSide) || 'enemy',
      playerCount: data.playerCount || 1,
      reinforcement: data.reinforcement || false,
      reinforcementTurn: Number(data.reinforcementTurn) || 0,
      status: data.status || NpcStatus.Operational,
      pilotStatus: data.pilotStatus || PilotStatus.Active,
      mechStatus: data.mechStatus || MechStatus.Operational,
    })

    if (data.deployables)
      item.deployables = data.deployables.map(d => DeployableInstance.Deserialize(d, item))

    return item
  }
}

export { Encounter }
export type { IEncounterData, CombatantSaveData }
