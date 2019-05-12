import store from '@/store';
import { CompendiumItem } from './Item'

interface ITalentRank {
  name: string
  description: string
}

class Talent extends CompendiumItem {
  private ranks: ITalentRank[]

  constructor(id: string) {
    const talentData = store.getters.getItemById('Talents', id)
    super(talentData)
    this.ranks = talentData.ranks
  }

  public get Ranks(): ITalentRank[] {
    return this.ranks
  }

  public Rank(rank: number): ITalentRank {
    if (this.ranks[rank]) return this.ranks[rank]
    console.error(`Talent ${this.ID}/${this.Name} does not contain rank ${rank} data`)
    return {name: '', description: ''}
  }

}

export default Talent