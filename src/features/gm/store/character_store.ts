/* eslint-disable @typescript-eslint/explicit-function-return-type */
import _ from 'lodash'
import { Module, VuexModule, Mutation, Action } from 'vuex-module-decorators'
import { ItemsMissingLcp, ItemsWithLcp } from '@/io/ContentEvaluator'
import { deletePermanent, storeSaveDelta } from '@/util/storeUtils'
import { SetItem, RemoveItem, GetAll } from '@/io/Storage'
import { Character, ICharacterData } from '@/classes/campaign/Character'

export const SAVE_DATA = 'SAVE_DATA'
export const SET_DIRTY = 'SET_DIRTY'
export const ADD_CHARACTER = 'ADD_CHARACTER'
export const DELETE_CHARACTER = 'DELETE_CHARACTER'
export const RESTORE_CHARACTER = 'RESTORE_CHARACTER'
export const CLONE_CHARACTER = 'CLONE_CHARACTER'
export const LOAD_CHARACTERS = 'LOAD_CHARACTERS'
export const SORT_CHARACTER = 'SORT_CHARACTER'
export const DELETE_CHARACTER_PERMANENT = 'DELETE_CHARACTER_PERMANENT'
export const SET_MISSING_CONTENT = 'SET_MISSING_CONTENT'
export const DELETE_MISSING_CHARACTER = 'DELETE_MISSING_CHARACTER'

async function saveCharacterData(characters: Character[]) {
  const dirty = characters.filter(x => x.SaveController.IsDirty)
  Promise.all(dirty.map(x => SetItem('characters', Character.Serialize(x))))
    .then(() => console.info('CHARACTER data saved'))
    .catch(err => console.error('Error while saving CHARACTER data', err))
}

async function delete_character(character: Character) {
  RemoveItem('characters', character.ID)
    .then(() => console.info('CHARACTER permenently deleted'))
    .catch(err => console.error('Error while deleting CHARACTER data', err))
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
    newCharacters.forEach((character: Character) => {
      all.push(character)
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
    saveCharacterData(this.Characters.concat(this.DeletedCharacters))
  }

  @Mutation
  private [SET_DIRTY](): void {
    if (this.Characters.length) this.Dirty = true
  }

  @Mutation
  private [ADD_CHARACTER](payload: Character): void {
    payload.SaveController.IsDirty = true
    this.Characters.push(payload)
    this.Dirty = true
    saveCharacterData(this.Characters)
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
      this.DeletedCharacters.push(payload)
    } else {
      throw console.error('CHARACTER not loaded!')
    }
    this.Dirty = true
  }

  @Mutation
  private [DELETE_CHARACTER_PERMANENT](payload: Character): void {
    const dpIdx = this.DeletedCharacters.findIndex(x => x.ID === payload.ID)
    if (dpIdx > -1) {
      this.DeletedCharacters.splice(dpIdx, 1)
      deletePermanent(payload)
    }
    this.Dirty = true
  }

  @Mutation
  private [RESTORE_CHARACTER](payload: Character): void {
    const CharacterIndex = this.DeletedCharacters.findIndex(x => x.ID === payload.ID)
    if (CharacterIndex > -1) {
      this.DeletedCharacters.splice(CharacterIndex, 1)
      this.Characters.push(payload)
    } else {
      throw console.error('CHARACTER not loaded!')
    }
    this.Dirty = true
  }

  get getCharacters(): Character[] {
    return this.Characters
  }

  get getCharacter(): any {
    return (id: string) => {
      return this.Characters.find(x => x.ID === id)
    }
  }

  @Action
  public setCharacterOrder(payload: Character[]): void {
    this.context.commit(SORT_CHARACTER, payload)
  }

  @Action
  public set_character_dirty(): void {
    this.context.commit(SET_DIRTY)
  }

  @Action
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
    this.context.commit(SAVE_DATA)
  }

  @Action
  public delete_character(payload: Character): void {
    this.context.commit(DELETE_CHARACTER, payload)
    this.context.commit(SAVE_DATA)
  }

  @Action
  public deleteMissingCharacter(payload: any): void {
    this.context.commit(DELETE_MISSING_CHARACTER, payload)
  }

  @Action
  public restore_character(payload: Character): void {
    this.context.commit(RESTORE_CHARACTER, payload)
  }

  @Action
  public deleteCharacterPermanent(payload: Character): void {
    if (!payload.SaveController.IsDeleted) this.context.commit(DELETE_CHARACTER)
    this.context.commit(DELETE_CHARACTER_PERMANENT, payload)
  }

  @Action({ rawError: true })
  public async loadCharacters() {
    const characterData = await GetAll('characters')
    this.context.commit(LOAD_CHARACTERS, ItemsWithLcp(characterData))
    this.context.commit(SET_MISSING_CONTENT, ItemsMissingLcp(characterData))
  }
}
