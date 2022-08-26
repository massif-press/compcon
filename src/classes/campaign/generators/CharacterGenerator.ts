import _ from 'lodash'
import uuid from 'uuid/v4'
import { Character, ICharacterData } from '../Character'

const exTitles = [
  {
    group: 'Laborer',
    content: [
      'Shipyard Custodian',
      'Printer Technician',
      'Asteroid Miner',
      'Starship Galley Cook',
      'Personal Trainer',
      'Firefighter',
      'Mech Mechanic',
    ],
    names: [
      ['Diasporan', 20],
      ['Cosmopolitan', 5],
      ['NHP', 0],
    ],
    aliases: [
      ['Nicknames', 5],
      ['Handles', 2],
      ['None', 20],
    ],
  },
  {
    group: 'Corporate Executive',
    content: [
      'Chief Executive Officer',
      'Chief Financial Officer',
      'Chairman',
      'Senior Executive Vice President',
      'Lead Administrator',
      'Torishimariyaku',
      'Buhoejang',
    ],
    names: [
      ['Diasporan', 20],
      ['NHP', 2],
    ],
    aliases: [
      ['Nicknames', 1],
      ['None', 20],
    ],
  },
]

const exNames = [
  {
    group: 'Diasporan',
    content: ['Bob', 'Alice'],
  },
  {
    group: 'Cosmopolitan',
    content: ['Jimmy Space', 'Annie Starfarer'],
  },
  {
    group: 'NHP',
    content: ['NHP GUY', 'NHP GIRL'],
  },
]

const exAlias = [
  {
    group: 'Nicknames',
    content: ['Buddy', 'Pal', 'Dumb Baby Bitch'],
  },
  {
    group: 'Handles',
    content: ['Beef', 'Sweetwater'],
  },
  {
    group: 'None',
    content: [],
  },
]

const exTemplate = {
  Name: 'Cosmopolitan',
  Titles: [
    { group: 'Laborer', weight: 9 },
    { group: 'Corporate Executive', weight: 1 },
  ],
}

type GeneratorContentCollection = {
  group: string
  content: string[]
}

type WeightedPool = {
  group: string
  weight: number
}

class GeneratorTemplate {
  public Name: string
  public Titles: WeightedPool[]
}

class CharacterGenerator {
  public static Generate(preset: GeneratorTemplate): string {
    // first get a title. templates have pools of titles (applicable jobs)
    // title determines alias and name pool
    // title can overrwite name/alias (no alias/unknown name, etc)
    console.log(preset)

    const titleGroup = preset.Titles[this.weightedSelection(preset.Titles)]
    const titleSelections = exTitles.find(x => x.group === titleGroup.group)

    console.log(titleSelections)

    const title = _.sample(titleSelections.content)

    return title

    // const data = {
    //   id: uuid(),
    //   name: this.pull(preset, 'Name'),
    //   alias: this.pull(preset, 'Alias'),
    //   title: this.pull(preset, 'Title'),
    // } as ICharacterData

    // return new Character().Update(data)
  }

  private static weightedSelection(collection: WeightedPool[]) {
    const arr = []
    const totalWeight = collection.reduce((n, { weight }) => n + weight, 0)
    for (let i in collection) {
      for (let j = 0; j < collection[i].weight * totalWeight; j++) {
        arr.push(i)
      }
    }
    return arr[Math.floor(Math.random() * arr.length)]
  }

  private static pull(preset: GeneratorTemplate, group: string) {
    return ''
    // return this.weightedSelection(preset.Pools.filter(x => x.group === group))
  }
}

class exampleCharGen {
  public Generate(): string {
    return CharacterGenerator.Generate(exTemplate)
  }
}

export { exampleCharGen }
