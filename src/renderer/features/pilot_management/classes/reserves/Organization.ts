import { OrgType } from '@/class'

class Organization {
  private purpose: OrgType
  private description: string
  private efficiency: number
  private influence: number

  constructor(purpose: OrgType, efficiency: number, influence: number, description: string) {
    this.purpose = purpose
    this.efficiency = efficiency
    this.influence = influence
    this.description = description
  }

  public get Purpose(): OrgType {
    return this.purpose
  }

  public get Description(): string {
    return this.description
  }

  public set Description(d: string) {
    this.description = d
  }

  public get Efficiency(): number {
    return this.efficiency
  }

  public set Efficiency(n: number) {
    this.efficiency = n
  }

  public get Influence(): number {
    return this.influence
  }

  public set Influence(n: number) {
    this.influence = n
  }

  public static Serialize(org: Organization): IOrganizationData {
    return {
      purpose: org.Purpose,
      description: org.Description,
      efficiency: org.Efficiency,
      influence: org.Influence,
    }
  }

  public static Deserialize(data: IOrganizationData): Organization {
    return new Organization(
      OrgType[data.purpose],
      data.efficiency,
      data.influence,
      data.description
    )
  }
}

export default Organization
