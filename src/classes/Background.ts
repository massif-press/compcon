import { Skill } from '@/class'
import { ContentPack } from './ContentPack'
import { CompendiumStore } from '@/stores'
import { ItemType } from './enums'
import { applyLcpTracking, type ILcpTracked } from './LcpItemMixin'
import type { ISerializableStatic } from './ISerializable'

interface IBackgroundData {
  id: string
  name: string
  description: string
  skills?: string[]
}

class Background implements ILcpTracked {
  public readonly ID: string
  public readonly Name: string
  public readonly Description: string
  public readonly Skills: string[]
  public LcpName: string = ''
  public InLcp: boolean = false
  public readonly ItemType: ItemType = ItemType.Background

  public constructor(data: IBackgroundData, pack?: ContentPack) {
    this.ID = data.id
    this.Name = data.name
    this.Description = data.description
    this.Skills = data.skills ? data.skills : []
    applyLcpTracking(this, pack)
  }

  public static Serialize(bg: Background): IBackgroundData {
    return {
      id: bg.ID,
      name: bg.Name,
      description: bg.Description,
      skills: bg.Skills as string[],
    }
  }

  public static Deserialize(data: IBackgroundData, pack?: ContentPack): Background {
    return new Background(data, pack)
  }

  public get Icon(): string {
    return 'cc:orbit'
  }

  public get Terse(): string {
    return this.Description.split('<i>')[0]
  }

  public get SuggestedSkills(): Skill[] {
    let arr = [] as Skill[]
    if (this.Skills)
      arr = this.Skills.map(id => {
        const item = CompendiumStore().Skills.find(s => s.ID === id)
        if (item) return item as Skill
      }) as Skill[]
    return arr.filter(s => s !== undefined) as Skill[]
  }
}

// Compile-time check: Background satisfies ISerializableStatic
const _checkSerializable: ISerializableStatic<IBackgroundData, Background> = Background
void _checkSerializable

export { Background }
export type { IBackgroundData }
