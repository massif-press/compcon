/* eslint-disable @typescript-eslint/explicit-function-return-type */
import _ from 'lodash'
import { saveData, saveDelta, loadData, deleteDataById } from '@/io/Data'
import { Module, VuexModule, Mutation, Action } from 'vuex-module-decorators'
import { Character, ICharacterData } from '@/classes//campaign/Character'
import { storeSaveDelta } from '@/util/storeUtils'
import { GetAll, RemoveItem, SetItem } from '@/io/Storage'

export const SAVE_DATA = 'SAVE_DATA'
export const ADD_CHARACTER = 'ADD_CHARACTER'
export const DELETE_CHARACTER = 'DELETE_CHARACTER'
export const CLONE_CHARACTER = 'CLONE_CHARACTER'
export const LOAD_CHARACTERS = 'LOAD_CHARACTERS'

async function saveCharacterData(characters: Character[]) {
  const dirty = characters.filter(x => x.SaveController.IsDirty)
  Promise.all(dirty.map(x => SetItem('characters', Character.Serialize(x))))
    .then(() => console.info('Character data saved'))
    .catch(err => console.error('Error while saving Character data', err))
}

async function delete_character(character: Character) {
  RemoveItem('characters', character.ID)
    .then(() => console.info('NPC permenently deleted'))
    .catch(err => console.error('Error while deleting NPC data', err))
}

@Module({
  name: 'character',
})
export class CharacterStore extends VuexModule {
  Characters: Character[] = []
  DeletedCharacters: Character[] = []
  public Dirty = false

  public get AllCharacters(): Character[] {
    return this.Characters.concat(this.DeletedCharacters)
  }

  @Mutation
  private [LOAD_CHARACTERS](payload: ICharacterData[]): void {
    const newCharacters: Character[] = [...payload.map(x => Character.Deserialize(x))]
    this.Characters.splice(0, this.Characters.length)
    const all = []
    newCharacters.forEach((Character: Character) => {
      all.push(Character)
    })
    this.Characters = all.filter(x => !x.SaveController.IsDeleted)
    this.DeletedCharacters = all.filter(x => x.SaveController.IsDeleted)

    //clean up deleted
    const del = []
    this.DeletedCharacters.forEach(dp => {
      if (new Date().getTime() > Date.parse(dp.SaveController.ExpireTime)) del.push(dp)
    })
    if (del.length) {
      console.info(`Cleaning up ${del.length} Characters marked for deletion`)
      del.forEach(p => {
        const dpIdx = this.DeletedCharacters.findIndex(x => x.ID === p.ID)
        if (dpIdx > -1) {
          this.DeletedCharacters.splice(dpIdx, 1)
        }
      })
      storeSaveDelta(this.Characters.concat(this.DeletedCharacters))
    }
  }

  @Mutation
  private [SAVE_DATA](): void {
    if (this.Dirty) {
      storeSaveDelta(this.Characters)
      this.Dirty = false
    }
  }

  @Mutation
  private [ADD_CHARACTER](payload: Character): void {
    payload.SaveController.IsDirty = true
    this.Characters.push(payload)
    this.Dirty = true
  }

  @Mutation
  private [CLONE_CHARACTER](payload: Character): void {
    this.Characters.push(payload.Clone())
    this.Dirty = true
  }

  @Mutation
  private [DELETE_CHARACTER](payload: Character): void {
    const idx = this.Characters.findIndex(x => x.ID === payload.ID)
    if (idx > -1) {
      this.Characters.splice(idx, 1)
    } else {
      throw console.error('CHARACTER not loaded!')
    }
    this.Dirty = true
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
    this.context.commit(ADD_CHARACTER, payload)
  }

  @Action
  public deleteCharacter(payload: Character): void {
    this.context.commit(DELETE_CHARACTER, payload)
  }

  @Action({ rawError: true })
  public async loadCharacters() {
    const characterData = await GetAll('characters')
    this.context.commit(LOAD_CHARACTERS, characterData)
  }

  get getCharacters(): Character[] {
    return this.Characters
  }

  get getCharacter() {
    return id => this.Characters.find(x => x.ID === id)
  }
}
