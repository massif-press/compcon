import {
  License,
  CoreBonus,
  Skill,
  Frame,
  MechWeapon,
  WeaponMod,
  MechSystem,
  Tag,
  PilotWeapon,
  PilotArmor,
  PilotGear,
  Talent,
  Reserve,
  Manufacturer,
  NpcClass,
  NpcTemplate,
  NpcFeature,
  ContentPack,
  PilotEquipment,
} from '@/class';
import { IContentPack } from '@/interface';
import * as PlayerAction from '@/classes/Action';
import { Background } from '@/classes/Background';
import { Bond } from '@/classes/pilot/components/bond/Bond';
import { SetItem, GetAll } from '@/io/Storage';

async function SaveContent(packs: any[]) {
  const promises = packs.map((pack: ContentPack) =>
    SetItem('content', pack.Serialize())
  );
  Promise.all(promises).then(() => console.info('Content updated'));
}

function getActiveItems<T>(items: T[]): T[] {
  return items.filter((item: any) => item.Active);
}

function getActiveItemsByProp<T>(state: any, prop: string): T[] {
  return getActiveItems(
    state.ContentPacks.flatMap(
      (pack: ContentPack) => pack[prop as keyof ContentPack]
    )
  );
}

export default {
  state: () => ({
    LancerVersion: '',
    CCVersion: '',
    ContentPacks: [] as ContentPack[],
    MissingContent: { pilots: [], npcs: [] },
    nfErr: { err: 'ID not found' },
  }),
  getters: {
    NpcClasses: (state: any) =>
      getActiveItemsByProp<NpcClass>(state, 'NpcClass'),
    NpcTemplates: (state: any) =>
      getActiveItemsByProp<NpcTemplate>(state, 'NpcTemplate'),
    NpcFeatures: (state: any) =>
      getActiveItemsByProp<NpcFeature>(state, 'NpcFeature'),
    Bonds: (state: any) => getActiveItemsByProp<Bond>(state, 'Bond'),
    Talents: (state: any) => getActiveItemsByProp<Talent>(state, 'Talent'),
    CoreBonuses: (state: any) =>
      getActiveItemsByProp<CoreBonus>(state, 'CoreBonus'),
    Frames: (state: any) => getActiveItemsByProp<Frame>(state, 'Frame'),
    Manufacturers: (state: any) =>
      getActiveItemsByProp<Manufacturer>(state, 'Manufacturer'),
    MechWeapons: (state: any) =>
      getActiveItemsByProp<MechWeapon>(state, 'MechWeapon'),
    WeaponMods: (state: any) =>
      getActiveItemsByProp<WeaponMod>(state, 'WeaponMod'),
    MechSystems: (state: any) =>
      getActiveItemsByProp<MechSystem>(state, 'MechSystem'),
    Tags: (state: any) => getActiveItemsByProp<Tag>(state, 'Tag'),
    PilotWeapons: (state: any) =>
      getActiveItemsByProp<PilotWeapon>(state, 'PilotWeapon'),
    PilotArmor: (state: any) =>
      getActiveItemsByProp<PilotArmor>(state, 'PilotArmor'),
    PilotGear: (state: any) =>
      getActiveItemsByProp<PilotGear>(state, 'PilotGear'),
    PilotEquipment: (state: any) =>
      getActiveItemsByProp<PilotEquipment>(state, 'PilotEquipment'),
    Reserves: (state: any) => getActiveItemsByProp<Reserve>(state, 'Reserve'),
    Backgrounds: (state: any) =>
      getActiveItemsByProp<Background>(state, 'Background'),
    Skills: (state: any) => getActiveItemsByProp<Skill>(state, 'Skill'),
    Actions: (state: any) =>
      getActiveItemsByProp<PlayerAction.Action>(state, 'Action'),
    Statuses: (state: any) => getActiveItemsByProp<Status>(state, 'Status'),
    Environments: (state: any) =>
      getActiveItemsByProp<Environment>(state, 'Environment'),
    Sitreps: (state: any) => getActiveItemsByProp<Sitrep>(state, 'Sitrep'),
    Tables: (state: any) => getActiveItemsByProp<any>(state, 'Tables'),
    Licenses: (state: any) => {
      function variantLicenseMatch(
        variantFrame: Frame,
        licenseFrame: Frame
      ): boolean {
        if (!!variantFrame.Variant && !!variantFrame.LicenseID) {
          return variantFrame.LicenseID === licenseFrame.ID;
        } else {
          return (
            variantFrame.Variant.toUpperCase() ===
              licenseFrame.Name.toUpperCase() &&
            variantFrame.Source.toUpperCase() ===
              licenseFrame.Source.toUpperCase()
          );
        }
      }
      return state.Frames.filter(
        (x: Frame) => x.Source !== 'GMS' && !x.IsHidden
      ).map((frame: Frame) => {
        const variants = state.Frames.filter(
          (f: Frame) => !f.IsHidden && variantLicenseMatch(f, frame)
        );
        return new License(frame, variants);
      });
    },
    AllowBonds(state: any): boolean {
      return state.Bonds.length > 0;
    },
    AllowEidolons(state: any): boolean {
      // TODO: check for eidolon data
      return true;
    },
    packAlreadyInstalled(state: any): any {
      return (packID: string) =>
        state.ContentPacks.map((p: any) => p.ID).includes(packID);
    },
    instantiate(state: any): any | { err: string } {
      return (itemType: string, id: string) => {
        if (state[itemType] && state[itemType] instanceof Array) {
          const i = state[itemType].find(
            (x: any) => x.ID === id || x.id === id
          );
          if (i) return { ...i };
          const miID = `missing_${itemType.toLowerCase()}`;
          const missingItem = state[itemType].find(
            (x: any) => x.ID === miID || x.id === miID
          );
          if (missingItem) return { ...missingItem };
          return state.nfErr;
        }
        return { err: 'Invalid Item Type' };
      };
    },
    referenceByID(state: any): any | { err: string } {
      return (itemType: string, id: string) => {
        if (state[itemType] && state[itemType] instanceof Array) {
          const i = state[itemType].find(
            (x: any) => x.ID === id || x.id === id
          );
          if (i) return i;
          const miID = `missing_${itemType.toLowerCase()}`;
          const missingItem = state[itemType].find(
            (x: any) => x.ID === miID || x.id === miID
          );
          if (missingItem) return missingItem;
          return state.nfErr;
        }
        return { err: 'Invalid Item Type' };
      };
    },
    getItemCollection(state: any): any {
      return (itemType: string) => {
        return state[itemType].filter((x: any) => x && !x.IsHidden);
      };
    },
    getVersion(state: any): string {
      return state.CCVersion;
    },
  },
  mutations: {
    // TODO: just set as part of the data loader
    SET_VERSIONS(state: any, payload: { lancer: string; cc: string }): void {
      state.LancerVersion = payload.lancer;
      state.CCVersion = payload.cc;
    },

    SET_MISSING_CONTENT(state: any, payload: any): void {
      state.MissingContent = payload;
    },

    CLEAR_PACKS(state: any): void {
      state.ContentPacks.splice(0, state.ContentPacks.length);
    },

    LOAD_PACK(state: any, packData: IContentPack): void {
      const pack = new ContentPack(packData);
      state.ContentPacks = [...state.ContentPacks, pack];
      SaveContent(state.ContentPacks);
    },

    DELETE_PACK(state: any, packID: string): void {
      state.ContentPacks = state.ContentPacks.filter(
        (pack: ContentPack) => pack.ID !== packID
      );
      SaveContent(state.ContentPacks);
    },
    SET_PACK_ACTIVE(
      state: any,
      payload: {
        packID: string;
        active: boolean;
      }
    ): void {
      const { packID, active } = payload;
      state.ContentPacks.find(
        (pack: ContentPack) => pack.ID === packID
      ).SetActive(active);
      state.ContentPacks = [...state.ContentPacks];
      SaveContent(state.ContentPacks);
    },
  },
  actions: {
    async setPackActive(
      { state, commit }: any,
      payload: {
        packID: string;
        active: boolean;
      }
    ): Promise<void> {
      commit('SET_PACK_ACTIVE', payload);
      SaveContent(state.ContentPacks);
    },
    async installContentPack(
      { state, commit, dispatch }: any,
      pack: IContentPack
    ): Promise<void> {
      const alreadyInstalled = await dispatch.packAlreadyInstalled(pack.id);
      if (alreadyInstalled) {
        console.info(
          `pack ${pack.manifest.name} [${pack.id}] already exists, deleting original...`
        );
        await dispatch.deleteContentPack(pack.id);
      }
      commit('LOAD_PACK', pack);
    },
    async deleteContentPack(
      { state, commit }: any,
      packID: string
    ): Promise<void> {
      commit('DELETE_PACK', packID);
      SaveContent(state.ContentPacks);
    },
    async loadExtraContent({ state, commit }: any): Promise<void> {
      const content = await GetAll('content');
      try {
        content.forEach((c) => commit('LOAD_PACK', c));
      } catch (err) {
        console.error(err);
      }
    },
    async refreshExtraContent({ commit }: any): Promise<void> {
      await commit('CLEAR_PACKS');
      const content = await GetAll('content');
      try {
        content.forEach((c) => commit('LOAD_PACK', c));
      } catch (err) {
        console.error(err);
      }
    },
    setVersions(
      { commit }: any,
      payload: { lancerVer: string; ccVer: string }
    ): void {
      commit('SET_VERSIONS', payload);
    },
    setMissingContent({ commit }: any, payload: any): void {
      commit('SET_MISSING_CONTENT', payload);
    },
  },
};
