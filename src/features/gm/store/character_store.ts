import { ItemsMissingLcp, ItemsWithLcp } from '@/io/ContentEvaluator';
import { deletePermanent, storeSaveDelta } from '@/util/storeUtils';
import { SetItem, RemoveItem, GetAll } from '@/io/Storage';
import { Character, ICharacterData } from '@/classes/campaign/Character';

async function saveCharacterData(characters: Character[]) {
  const dirty = characters.filter((x) => x.SaveController.IsDirty);
  Promise.all(dirty.map((x) => SetItem('characters', Character.Serialize(x))))
    .then(() => console.info('CHARACTER data saved'))
    .catch((err) => console.error('Error while saving CHARACTER data', err));
}

async function delete_character(character: Character) {
  RemoveItem('characters', character.ID)
    .then(() => console.info('CHARACTER permanently deleted'))
    .catch((err) => console.error('Error while deleting CHARACTER data', err));
}

export default {
  state: () => ({
    Characters: [] as Character[],
    DeletedCharacters: [] as Character[],
    Dirty: false,
  }),
  getters: {
    AllCharacters: (state: any) =>
      state.Characters.concat(state.DeletedCharacters),
    getCharacters: (state: any) => state.Characters,
    getCharacter: (state: any) => (id: string) => {
      return state.Characters.find((x: Character) => x.ID === id);
    },
    unsavedCloudCharacters: (state: any) =>
      state.Characters.filter((p: Character) => p.SaveController.IsDirty),
  },
  mutations: {
    LOAD_CHARACTERS(state: any, payload: ICharacterData[]): void {
      const newCharacters: Character[] = [
        ...payload.map((x) => Character.Deserialize(x)),
      ];
      state.Characters.splice(0, state.Characters.length);
      const all = [] as Character[];
      newCharacters.forEach((character: Character) => {
        all.push(character);
      });
      state.Characters = all.filter((x) => !x.SaveController.IsDeleted);
      state.DeletedCharacters = all.filter((x) => x.SaveController.IsDeleted);

      //clean up deleted
      const del = [] as Character[];
      state.DeletedCharacters.forEach((dp: Character) => {
        if (new Date().getTime() > Date.parse(dp.SaveController.ExpireTime))
          del.push(dp);
      });
      if (del.length) {
        console.info(
          `Cleaning up ${del.length} Characters marked for deletion`
        );
        del.forEach((p) => {
          const dpIdx = state.DeletedCharacters.findIndex(
            (x: Character) => x.ID === p.ID
          );
          if (dpIdx > -1) {
            state.DeletedCharacters.splice(dpIdx, 1);
          }
        });
        storeSaveDelta(state.Characters.concat(state.DeletedCharacters));
      }
    },

    SAVE_DATA(state: any): void {
      saveCharacterData(state.Characters.concat(state.DeletedCharacters));
    },

    SET_DIRTY(state: any): void {
      if (state.Characters.length) state.Dirty = true;
    },

    ADD_CHARACTER(state: any, payload: Character): void {
      payload.SaveController.IsDirty = true;
      state.Characters.push(payload);
      state.Dirty = true;
      saveCharacterData(state.Characters);
    },

    CLONE_CHARACTER(state: any, payload: Character): void {
      state.Characters.push(payload.Clone());
      state.Dirty = true;
    },

    DELETE_CHARACTER(state: any, payload: Character): void {
      const idx = state.Characters.findIndex(
        (x: Character) => x.ID === payload.ID
      );
      if (idx > -1) {
        state.Characters.splice(idx, 1);
        state.DeletedCharacters.push(payload);
      } else {
        throw console.error('CHARACTER not loaded!');
      }
      state.Dirty = true;
    },

    DELETE_CHARACTER_PERMANENT(state: any, payload: Character): void {
      const dpIdx = state.DeletedCharacters.findIndex(
        (x: Character) => x.ID === payload.ID
      );
      if (dpIdx > -1) {
        state.DeletedCharacters.splice(dpIdx, 1);
        deletePermanent(payload);
      }
      state.Dirty = true;
    },

    RESTORE_CHARACTER(state: any, payload: Character): void {
      const CharacterIndex = state.DeletedCharacters.findIndex(
        (x: Character) => x.ID === payload.ID
      );
      if (CharacterIndex > -1) {
        state.DeletedCharacters.splice(CharacterIndex, 1);
        state.Characters.push(payload);
      } else {
        throw console.error('CHARACTER not loaded!');
      }
      state.Dirty = true;
    },
  },
  actions: {
    setCharacterOrder({ commit }: any, payload: Character[]): void {
      commit('SORT_CHARACTER', payload);
    },

    set_character_dirty({ commit }: any): void {
      commit('SET_DIRTY');
    },

    saveCharacterData({ commit }: any): void {
      commit('SAVE_DATA');
    },

    cloneCharacter({ commit }: any, payload: Character): void {
      commit('CLONE_CHARACTER', payload);
    },

    addCharacter({ commit }: any, payload: Character): void {
      commit('ADD_CHARACTER', payload);
      commit('SAVE_DATA');
    },

    delete_character({ commit }: any, payload: Character): void {
      commit('DELETE_CHARACTER', payload);
      commit('SAVE_DATA');
    },

    deleteMissingCharacter({ commit }: any, payload: any): void {
      commit('DELETE_MISSING_CHARACTER', payload);
    },

    restore_character({ commit }: any, payload: Character): void {
      commit('RESTORE_CHARACTER', payload);
    },

    deleteCharacterPermanent({ commit }: any, payload: Character): void {
      if (!payload.SaveController.IsDeleted) commit('DELETE_CHARACTER');
      commit('DELETE_CHARACTER_PERMANENT', payload);
    },
    async loadCharacters({ commit }: any) {
      const characterData = await GetAll('characters');
      commit('LOAD_CHARACTERS', ItemsWithLcp(characterData));
      commit('SET_MISSING_CONTENT', ItemsMissingLcp(characterData));
    },
  },
};
