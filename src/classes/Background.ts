import { Skill } from './pilot/components/skill/Skill'
import { ContentPack } from './ContentPack'
import { CompendiumStore } from '@/features/compendium/store'
import { ItemType } from './enums'
import { applyLcpTracking, type ILcpTracked } from './LcpItemMixin'
import type { ISerializableStatic } from './ISerializable'
import { localize } from '@/i18n/localize'

interface IBackgroundData {
  id: string
  name: string
  description: string
  skills?: string[]
}

class Background implements ILcpTracked {
  public readonly ID: string
  private _name: string
  private _description: string
  public readonly Skills: string[]
  public LcpName: string = ''
  public InLcp: boolean = false
  public readonly ItemType: ItemType = ItemType.Background

  public constructor(data: IBackgroundData, pack?: ContentPack) {
    this.ID = data.id
    this._name = data.name
    this._description = data.description
    this.Skills = data.skills ? data.skills : []
    applyLcpTracking(this, pack)
  }

  public get Name(): string { return localize(this.ID, 'name', this._name) }
  public get Description(): string { return localize(this.ID, 'description', this._description) }

  public static Serialize(bg: Background): IBackgroundData {
    return {
      id: bg.ID,
      name: bg._name,
      description: bg._description,
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

const _checkSerializable: ISerializableStatic<IBackgroundData, Background> = Background
void _checkSerializable

export { Background }
export type { IBackgroundData }
