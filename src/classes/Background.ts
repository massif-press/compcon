import { Skill } from '@/class'

interface IBackgroundData {
  id: string
  name: string
  description: string
  skills?: String[] // these are skill IDs
}

class Background {
  public readonly ID: string
  public readonly Name: string
  public readonly Description: string
  public readonly LcpName: string
  public readonly InLcp: boolean
  public readonly Skills: String[] // these are skill IDs

  public constructor(data: IBackgroundData, packName?: string) {
    this.ID = data.id
    this.Name = data.name
    this.Description = data.description
    this.LcpName = packName || 'LANCER Core Book'
    this.InLcp = packName ? true : false
    data.skills ? (this.Skills = data.skills) : (this.Skills = [])
  }
}

export { Background, IBackgroundData }
