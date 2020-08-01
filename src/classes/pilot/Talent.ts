import { store } from '@/store'
import { CompendiumItem, MechEquipment } from '@/class'
import { ICompendiumItemData, ISynergyItem, IAction } from '@/interface'

interface ITalentRank {
  name: string
  description: string
  synergies?: ISynergyItem[]
  actions?: IAction[]
  talent_item?: ITalentItemData
}

interface ITalentItemData {
  type: string
  id: string
  exclusive?: boolean
}

interface ITalentData extends ICompendiumItemData {
  ranks: ITalentRank[]
}

class Talent extends CompendiumItem {
  private _ranks: ITalentRank[]

  public constructor(talentData: any) {
    super(talentData)
    if (!talentData.ranks) console.log(talentData)
    this._ranks = talentData.ranks
  }

  public get Ranks(): ITalentRank[] {
    return this._ranks
  }

  public Rank(rank: number): ITalentRank {
    if (this._ranks[rank - 1]) return this._ranks[rank - 1]
    console.error(`Talent ${this.ID}/${this.Name} does not contain rank ${rank} data`)
    return { name: '', description: '' }
  }

  public static Deserialize(id: string): Talent {
    return store.getters.referenceByID('Talents', id)
  }
}

class TalentRank {
  public static Synergies(tr: ITalentRank) {
    return
  }

  public static Actions(tr: ITalentRank): IAction[] {
    if (!tr.actions) return
    return tr.actions
  }

  public static Item(tr: ITalentRank): MechEquipment {
    if (!tr.talent_item) return
    const t = tr.talent_item.type === 'weapon' ? 'MechWeapons' : 'MechSystems'
    return store.getters.referenceByID(t, tr.talent_item.id)
  }

  public static AllTalentItems(t: Talent, r: number): MechEquipment[] {
    const tiArr = []
    let tiExc = null

    for (let i = 0; i < r - 1; i++) {
      const tr = t.Ranks[i]
      if (tr.talent_item && !tr.talent_item.exclusive) tiArr.push(this.Item(tr))
      else if (tr.talent_item && !tr.talent_item.exclusive) tiExc = this.Item(tr)
    }

    if (tiExc) tiArr.push(tiExc)
    return tiArr
  }
}

export { Talent, TalentRank, ITalentData }
