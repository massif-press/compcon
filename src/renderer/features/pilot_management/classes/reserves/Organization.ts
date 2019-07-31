import store from '@/store'
import { OrgType } from '@/class'

class Organization {
  private purpose: OrgType
  private name: string
  private description: string
  private efficiency: number
  private influence: number
  private actions: string

  constructor(
    name: string,
    purpose: OrgType,
    efficiency: number,
    influence: number,
    description: string,
    actions: string
  ) {
    this.name = name
    this.purpose = purpose
    this.efficiency = efficiency
    this.influence = influence
    this.description = description
    this.actions = actions
  }

  private save() {
    store.dispatch('saveData')
  }

  public get Purpose(): OrgType {
    return this.purpose
  }

  public get Name(): string {
    return this.name
  }

  public set Name(d: string) {
    this.name = d
    this.save()
  }

  public get Actions(): string {
    return this.actions
  }

  public set Actions(d: string) {
    this.actions = d
    this.save()
  }

  public get Description(): string {
    return this.description
  }

  public set Description(d: string) {
    this.description = d
    this.save()
  }

  public get Efficiency(): number {
    return this.efficiency
  }

  public set Efficiency(n: number) {
    this.efficiency = n
    if (this.efficiency > 6) this.efficiency = 6
    this.save()
  }

  public get Influence(): number {
    return this.influence
  }

  public set Influence(n: number) {
    this.influence = n
    if (this.influence > 6) this.influence = 6
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
