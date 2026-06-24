import { v4 as uuid } from 'uuid'
import { i18n } from '@/i18n'
import { localize } from '@/i18n/localize'
import { Encounter } from './encounter/Encounter'
import { ContentPack } from './ContentPack'
import { ItemType } from './enums'
import { applyLcpTracking, DEFAULT_LCP_NAME, type ILcpTracked } from './LcpItemMixin'

interface IEnvironmentData {
  id?: string
  modified: boolean
  name: string
  description: string
}

class Environment implements ILcpTracked {
  public readonly ID: string
  private _name: string
  private _description: string
  public LcpName: string = ''
  public InLcp: boolean = false
  public readonly ItemType: ItemType = ItemType.Environment
  public readonly Icon: string = 'mdi-map'

  public constructor(data: IEnvironmentData, pack?: ContentPack) {
    this.ID = data.id
      ? data.id
      : `${pack?.Name || DEFAULT_LCP_NAME}_${data.name}`.replace(/ /g, '_')
    this._name = data.name
    this._description = data.description
    applyLcpTracking(this, pack)
  }

  public get Name(): string { return localize(this.ID, 'name', this._name) }
  public get Description(): string { return localize(this.ID, 'description', this._description) }
}

class EnvironmentInstance {
  public readonly Parent: Encounter
  public readonly Environment: Environment
  public readonly InstanceID: string

  public _name: string = i18n.global.t('classes.newEnvironment')
  public _description: string = i18n.global.t('classes.newEnvironmentDescription')
  public modified: boolean = false

  public constructor(parent: Encounter, environment?: Environment) {
    this.Parent = parent
    this.InstanceID = uuid()
    if (environment) {
      this.Environment = environment
    } else {
      this.Environment = new Environment({
        name: 'No Environmental Effects',
        modified: false,
        description: 'A standard environment with no special combat conditions',
      })
    }

    this.setInstanceData()
  }

  private setInstanceData() {
    this._name = this.Environment.Name
    this._description = this.Environment.Description
  }

  public get Name(): string {
    return this._name
  }

  public set Name(val: string) {
    this._name = val
    this.modified = true
    this.Parent.save()
  }

  public get Description(): string {
    return this._description
  }

  public set Description(val: string) {
    this._description = val
    this.modified = true
    this.Parent.save()
  }

  public Reset(): void {
    this.setInstanceData()
    this.modified = true
    this.Parent.save()
  }

  public static Serialize(env: EnvironmentInstance): IEnvironmentData {
    return {
      name: env.Name,
      modified: env.modified,
      description: env.Description,
    }
  }

  public static Deserialize(data: IEnvironmentData, parent: Encounter): EnvironmentInstance {
    return new EnvironmentInstance(parent, new Environment(data))
  }
}

export { Environment, EnvironmentInstance }
export type { IEnvironmentData }
