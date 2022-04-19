/* eslint-disable @typescript-eslint/explicit-function-return-type */
import _ from 'lodash'
import { loadData, saveData } from '@/io/Data'
import { Module, VuexModule, Mutation, Action } from 'vuex-module-decorators'
import { Character, ICharacterData } from '@/classes/campaign/Character'
import { store } from '@/store'

export const SAVE_DATA = 'SAVE_DATA'
export const ADD_CHARACTER = 'ADD_CHARACTER'
export const DELETE_CHARACTER = 'DELETE_CHARACTER'
export const CLONE_CHARACTER = 'CLONE_CHARACTER'
export const LOAD_CHARACTERS = 'LOAD_CHARACTERS'

async function saveCharacterData(characters: Character[]) {
  const serialized = characters.map(x => Character.Serialize(x))
  await saveData('characters.json', serialized)
}

@Module({
  name: 'character',
})
export class CharacterStore extends VuexModule {
  Characters: Character[] = []

  @Mutation
  private [LOAD_CHARACTERS](payload: ICharacterData[]): void {
    this.Characters = [...payload.map(x => Character.Deserialize(x))]
    saveCharacterData(this.Characters)
  }

  @Mutation
  private [SAVE_DATA](): void {
    console.log('saving character data')
    if (this.Characters.length) _.debounce(saveCharacterData, 1000)(this.Characters)
  }

  @Mutation
  private [ADD_CHARACTER](payload: Character): void {
    console.log('adding character to store')
    this.Characters.push(payload)
    saveCharacterData(this.Characters)
  }

  @Mutation
  private [CLONE_CHARACTER](payload: Character): void {
    const characterData = Character.Serialize(payload)
    const newCharacter = Character.Deserialize(characterData)
    newCharacter.RenewID()
    newCharacter.Name += ' (COPY)'
    this.Characters.push(newCharacter)
    saveCharacterData(this.Characters)
  }

  @Mutation
  private [DELETE_CHARACTER](payload: Character): void {
    const idx = this.Characters.findIndex(x => x.ID === payload.ID)
    if (idx > -1) {
      this.Characters.splice(idx, 1)
    } else {
      throw console.error('CHARACTER not loaded!')
    }
    saveCharacterData(this.Characters)
  }

  @Action({ rawError: true })
  public saveCharacterData(): void {
    this.context.commit(SAVE_DATA)
  }

  @Action
  public cloneCharacter(payload: Character): void {
    this.context.commit(CLONE_CHARACTER, payload)
  }

  @Action
  public addCharacter(payload: Character): void {
    console.log('add new store')
    this.context.commit(ADD_CHARACTER, payload)
  }

  @Action
  public deleteCharacter(payload: Character): void {
    this.context.commit(DELETE_CHARACTER, payload)
  }

  @Action({ rawError: true })
  public async loadCharacters() {
    const characterData = await loadData<ICharacterData>('characters.json')
    this.context.commit(LOAD_CHARACTERS, characterData)
  }

  get getCharacters(): Character[] {
    return this.Characters
  }

  get getCharacter() {
    return id => this.Characters.find(x => x.ID === id)
  }
}
