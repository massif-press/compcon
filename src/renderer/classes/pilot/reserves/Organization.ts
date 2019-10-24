import { store } from '@/store'
import { OrgType } from '@/class'

class Organization {
  private _purpose: OrgType
  private _name: string
  private _description: string
  private _efficiency: number
  private _influence: number
  private _actions: string

  public constructor(
    name: string,
    purpose: OrgType,
    efficiency: number,
    influence: number,
    description: string,
    actions: string
  ) {
    this._name = name
    this._purpose = purpose
    this._efficiency = efficiency
    this._influence = influence
    this._description = description
    this._actions = actions
  }

  private save(): void {
    store.dispatch('saveData')
  }

  public get Type(): string {
    return 'Organization'
  }

  public get Purpose(): OrgType {
    return this._purpose
  }

  public get Name(): string {
    return this._name
  }

  public set Name(name: string) {
    this._name = name
    this.save()
  }

  public get Actions(): string {
    return this._actions
  }

  public set Actions(actions: string) {
    this._actions = actions
    this.save()
  }

  public get Description(): string {
    return this._description
  }

  public set Description(description: string) {
    this._description = description
    this.save()
  }

  public get Efficiency(): number {
    return this._efficiency
  }

  public set Efficiency(n: number) {
    this._efficiency = n
    if (this._efficiency > 6) this._efficiency = 6
    this.save()
  }

  public get Influence(): number {
    return this._influence
  }

  public set Influence(n: number) {
    this._influence = n
    if (this._influence > 6) this._influence = 6
    this.save()
  }

  public static Serialize(org: Organization): IOrganizationData {
    return {
      name: org.Name,
      purpose: org.Purpose,
      description: org.Description,
      efficiency: org.Efficiency,
      influence: org.Influence,
      actions: org.Actions,
    }
  }

  public static Deserialize(data: IOrganizationData): Organization {
    return new Organization(
      data.name,
      OrgType[data.purpose],
      data.efficiency,
      data.influence,
      data.description,
      data.actions
    )
  }
}

export default Organization
