import { v4 as uuid } from 'uuid'
import {
  CloudController,
  IPortraitData,
  ISaveData,
  ISaveable,
  PortraitController,
  SaveController,
} from '../components'
import { ISitrepData, Sitrep, SitrepInstance } from './Sitrep'
import { EncounterMap, IMapData } from './EncounterMap'
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
import { Deployable, Pilot } from '@/class'
import { PilotData } from '@/interface'
import { ICombatant } from '../components/combat/ICombatant'
import {
  DeployableInstance,
  IDeployableInstanceData,
} from '../components/feature/deployable/DeployableInstance'
import { IPlaceholderData, Placeholder } from './Placeholder'

interface IEncounterData {
  itemType: 'Encounter'
  id: string
  name: string
  note?: string
  description?: string
  gmDescription?: string
  save: ISaveData
  folder: IFolderData
  img: IPortraitData
  narrative: NarrativeElementData
  sitrep?: ISitrepData
  environment?: IEnvironmentData
  map?: IMapData
  combatants?: CombatantSaveData[]
}

type CombatantData = {
  id: string
  index: number
  type: 'unit' | 'doodad' | 'eidolon' | 'pilot' | 'placeholder'
  actor: ICombatant
  number: number
  side: 'enemy' | 'ally' | 'neutral'
  deployables: DeployableInstance[]
  playerCount?: number
  reinforcement?: boolean
  reinforcementTurn?: number
}

type CombatantSaveData = {
  id?: string
  index: number
  type: 'unit' | 'doodad' | 'eidolon' | 'pilot' | 'placeholder'
  actor: UnitData | DoodadData | EidolonData | PilotData | IPlaceholderData
  side?: 'enemy' | 'ally' | 'neutral'
  playerCount?: number
  reinforcement?: boolean
  reinforcementTurn?: number
  deployables?: IDeployableInstanceData[]
}

class Encounter implements INarrativeElement, ISaveable, IFolderPlaceable {
  public readonly ItemType: string = 'Encounter'
  public readonly DataType: string = 'savedata'
  public readonly StorageType: string = 'encounters'

  private _id: string
  protected _name: string = 'New Encounter'

  private _note: string
  private _description: string
  private _gmDescription: string
  private _sitrep?: SitrepInstance
  private _environment?: EnvironmentInstance

  public _map?: EncounterMap

  public ImageTag: ImageTag = ImageTag.Map
  public SaveController: SaveController
  public CloudController: CloudController
  public PortraitController: PortraitController
  public NarrativeController: NarrativeController
  public FolderController: FolderController

  private _combatants: CombatantData[] = []

  public constructor(data?: IEncounterData) {
    this._id = data?.id || uuid()
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

    if (data?.map) {
      this._map = EncounterMap.Deserialize(data.map)
    }

    if (data?.combatants) {
      this._combatants = data.combatants.map(c => Encounter.DeserializeCombatant(c))

      const seen = [] as string[]

      this._combatants.forEach((c: any) => {
        seen.push(c.actor.Name)
        c.number = seen.filter(x => x === c.actor.Name).length
      })
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
    this._id = uuid()
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

  public get Map(): EncounterMap | undefined {
    return this._map
  }

  public set Map(val: EncounterMap | undefined) {
    this._map = val
    this.save()
  }

  public get Combatants(): CombatantData[] {
    return this._combatants
  }

  public set Combatants(val: CombatantData[]) {
    this._combatants = val
  }

  public AddCombatant(npc: Npc): void {
    const type = npc.ItemType.toLowerCase()
    let c
    let iData

    switch (type) {
      case 'unit':
        iData = (npc as unknown as Unit).CreateInstance()
        c = Unit.Deserialize(iData as UnitData)
        break
      case 'doodad':
        iData = (npc as unknown as Doodad).CreateInstance()
        c = Doodad.Deserialize(iData as DoodadData)
        break
      case 'eidolon':
        iData = (npc as unknown as Eidolon).CreateInstance()
        c = Eidolon.Deserialize(iData as EidolonData)
        break
      default:
        throw new Error('Invalid combatant type')
    }

    this.Combatants.push({
      id: c.ID,
      index: this.Combatants.length,
      type,
      actor: c,
      number: this.Combatants.filter((x: any) => x.actor.Name === c.Name).length + 1,
      side: 'enemy',
      playerCount: 0,
      reinforcement: false,
      reinforcementTurn: 0,
      deployables: [],
    })

    this.save()
  }

  public RemoveCombatant(index: number): void {
    this.Combatants.splice(index, 1)
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
      map: enc.Map ? EncounterMap.Serialize(enc.Map) : undefined,
      combatants: enc.Combatants.map(c => Encounter.SerializeCombatant(c)),
    } as IEncounterData

    SaveController.Serialize(enc, data)
    PortraitController.Serialize(enc, data)
    NarrativeController.Serialize(enc, data)
    FolderController.Serialize(enc, data)

    return data as IEncounterData
  }

  public static SerializeCombatant(combatant: CombatantData): CombatantSaveData {
    return {
      index: combatant.index,
      type: combatant.type,
      actor: (combatant.actor as any).Serialize(true),
      side: combatant.side,
      playerCount: combatant.playerCount,
      reinforcement: combatant.reinforcement,
      reinforcementTurn: Number(combatant.reinforcementTurn),
      deployables: combatant.deployables.map(d => DeployableInstance.Serialize(d)),
    }
  }

  public Serialize(): IEncounterData {
    return Encounter.Serialize(this)
  }

  public Clone(): Encounter {
    return Encounter.Deserialize(Encounter.Serialize(this))
  }

  public static Deserialize(data: IEncounterData): Encounter {
    const encounter = new Encounter(data)
    SaveController.Deserialize(encounter, data.save)
    PortraitController.Deserialize(encounter, data.img)
    NarrativeController.Deserialize(encounter, data.narrative)
    FolderController.Deserialize(encounter, data.folder)
    return encounter
  }

  public static DeserializeCombatant(data: CombatantSaveData): CombatantData {
    // TODO: remove after release, this is to ensure old v3 encounters are compatible
    if ((data as any).npc)
      data.actor = (data as any).npc as UnitData | DoodadData | EidolonData | PilotData
    let actor
    switch (data.type) {
      case 'unit':
        actor = Unit.Deserialize(data.actor as UnitData)
        break
      case 'doodad':
        actor = Doodad.Deserialize(data.actor as DoodadData)
        break
      case 'eidolon':
        actor = Eidolon.Deserialize(data.actor as EidolonData)
        break
      case 'pilot':
        actor = Pilot.Deserialize(data.actor as PilotData)
        break
      case 'placeholder':
        actor = Placeholder.Deserialize(data.actor as IPlaceholderData)
        break
      default:
        throw new Error('Invalid combatant type')
    }

    const item = {
      id: data.id || uuid(),
      index: data.index,
      type: data.type,
      number: 1,
      actor,
      side: data.side || 'enemy',
      playerCount: data.playerCount || 1,
      reinforcement: data.reinforcement || false,
      reinforcementTurn: Number(data.reinforcementTurn) || 0,
      deployables: [] as DeployableInstance[],
    }

    if (data.deployables)
      item.deployables = data.deployables.map(d => DeployableInstance.Deserialize(d, item))

    return item
  }
}

export { Encounter }
export type { IEncounterData, CombatantData, CombatantSaveData }
