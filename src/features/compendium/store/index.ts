import { defineStore } from 'pinia';
import _ from 'lodash';
import semver from 'semver';
import lancerData from '@massif/lancer-data';
import {
  License,
  CoreBonus,
  Skill,
  Frame,
  MechWeapon,
  WeaponMod,
  MechSystem,
  Tag,
  Talent,
  Reserve,
  Manufacturer,
  ContentPack,
  PilotEquipment,
  Background,
  PlayerAction,
  Bond,
  Environment,
  Sitrep,
  LicensedItem,
  CompendiumItem,
} from '@/class';
import { IContentPack, IPilotEquipmentData, ITagCompendiumData } from '@/interface';
import { FrameComparison } from '@/classes/mech/components/frame/Frame';
import { Status } from '@/classes/Status';
import { GetAll, RemoveItem, SetItem } from '@/io/Storage';
import { NpcFeature } from '@/classes/npc/feature/NpcFeature';
import { NpcClass, NpcComparison } from '@/classes/npc/class/NpcClass';
import { NpcTemplate } from '@/classes/npc/template/NpcTemplate';
import { EidolonLayer } from '@/classes/npc/eidolon/EidolonLayer';
import { IndexItem, UserStore } from '@/stores';
import { ContentCollection } from '@/classes/components/cloud/ContentCollection';

const hydratedKeys = {
  npc_classes: 'NpcClasses',
  npc_templates: 'NpcTemplates',
  npc_features: 'NpcFeatures',
  bonds: 'Bonds',
  backgrounds: 'Backgrounds',
  talents: 'Talents',
  core_bonuses: 'CoreBonuses',
  frames: 'Frames',
  manufacturers: 'Manufacturers',
  weapons: 'MechWeapons',
  mods: 'WeaponMods',
  systems: 'MechSystems',
  skills: 'Skills',
  actions: 'Actions',
  tags: 'Tags',
  reserves: 'Reserves',
  statuses: 'Statuses',
  environments: 'Environments',
  sitreps: 'Sitreps',
  pilot_gear: 'PilotGear',
  eidolon_layers: 'EidolonLayers',
};

const itemTypeMap = {
  npcclass: 'NpcClasses',
  npctemplate: 'NpcTemplates',
  npcfeature: 'NpcFeatures',
  npctrait: 'NpcFeatures',
  npcreaction: 'NpcFeatures',
  npcweapon: 'NpcFeatures',
  npcsystem: 'NpcFeatures',
  npctech: 'NpcFeatures',
  bond: 'Bonds',
  background: 'Backgrounds',
  talent: 'Talents',
  corebonus: 'CoreBonuses',
  frame: 'Frames',
  manufacturer: 'Manufacturers',
  weapon: 'MechWeapons',
  mechweapon: 'MechWeapons',
  mod: 'WeaponMods',
  weaponmod: 'WeaponMods',
  system: 'MechSystems',
  mechsystem: 'MechSystems',
  skill: 'Skills',
  action: 'Actions',
  tag: 'Tags',
  reserve: 'Reserves',
  statuse: 'Statuses',
  environment: 'Environments',
  sitrep: 'Sitreps',
  pilotarmor: 'PilotGear',
  pilotweapon: 'PilotGear',
  pilotgear: 'PilotGear',
  eidolonlayer: 'EidolonLayers',
};

function collect<T>(state, itemType: string, constructor?: { new (Y: any): T }): T[] {
  let lData = [];
  if (lancerData[itemType]) {
    lData = constructor
      ? lancerData[itemType].map((x) => new constructor(x))
      : lancerData[itemType];
  }

  return [
    ...lData,
    ...state.ContentPacks.filter((pack: ContentPack) => pack.Active).flatMap(
      (pack: ContentPack) => pack[hydratedKeys[itemType]] || []
    ),
  ];
}

// function sortByDependencies(packs: IContentPack[]): IContentPack[] {
//   function dfs(node, visited, stack) {
//     if (!visited[node.id]) {
//       visited[node.id] = true;
//       for (const dependencyId of node.manifest.dependencies) {
//         const dependentNode = packs.find((obj) => obj.id === dependencyId);
//         if (dependentNode) {
//           dfs(dependentNode, visited, stack);
//         }
//       }
//       stack.push(node);
//     }
//   }

//   const sortedStack = [];
//   const visited = {};

//   for (const pack of packs) {
//     dfs(pack, visited, sortedStack);
//   }

//   return sortedStack.reverse();
// }

// //iterate through the content packs and find the ones missing an installed dependency
// function findMissingDependencies(packs: IContentPack[]): IContentPack[] {
//   const missing = [] as IContentPack[];
//   for (const pack of packs) {
//     if (!pack.manifest.dependencies) continue;
//     for (const dependency of pack.manifest.dependencies) {
//       const dependentNode = packs.some((pack) => pack.manifest.name === dependency.name);
//       if (!dependentNode) {
//         missing.push(pack);
//       }
//     }
//   }
//   return missing;
// }

export const CompendiumStore = defineStore('compendium', {
  state: () => ({
    LancerVersion: '',
    CCVersion: '',
    ContentPacks: [] as ContentPack[],
    ContentCollections: [] as ContentCollection[],
    nfErr: { err: 'ID not found' },
    packData: [] as IContentPack[],
    loaded: false,
  }),
  getters: {
    hasNpcAccess(): boolean {
      if (!this.loaded) return false;
      return this.NpcClasses.length > 0;
    },
    hasBondsAccess(): boolean {
      if (!this.loaded) return false;
      return this.Bonds.length > 0;
    },
    hasEidolonAccess(): boolean {
      if (!this.loaded) return false;
      return this.EidolonLayers.length > 0;
    },
    NpcClasses: (state) => collect<NpcClass>(state, 'npc_classes', NpcClass),
    NpcTemplates: (state) => collect<NpcTemplate>(state, 'npc_templates', NpcTemplate),
    NpcFeatures: (state) => collect<NpcFeature>(state, 'npc_features'),
    EidolonLayers: (state) => collect<EidolonLayer>(state, 'eidolon_layers'),
    Bonds: (state) => collect<Bond>(state, 'bonds', Bond),
    Backgrounds: (state) => collect<Background>(state, 'backgrounds', Background),
    Talents: (state) => collect<Talent>(state, 'talents', Talent),
    CoreBonuses: (state) => collect<CoreBonus>(state, 'core_bonuses', CoreBonus),
    Frames: (state) => collect<Frame>(state, 'frames', Frame),
    Manufacturers: (state) => collect<Manufacturer>(state, 'manufacturers', Manufacturer),
    MechWeapons: (state) => collect<MechWeapon>(state, 'weapons', MechWeapon),
    WeaponMods: (state) => collect<WeaponMod>(state, 'mods', WeaponMod),
    MechSystems: (state) => collect<MechSystem>(state, 'systems', MechSystem),
    Skills: (state) => collect<Skill>(state, 'skills', Skill),
    Actions: (state) => collect<PlayerAction.Action>(state, 'actions', PlayerAction.Action),
    Tags: (state) => collect<Tag>(state, 'tags', Tag),
    TagData: (state) => collect<ITagCompendiumData>(state, 'tags'),
    Reserves: (state) => collect<Reserve>(state, 'reserves', Reserve),
    Statuses: (state) => collect<Status>(state, 'statuses', Status),
    Environments: (state) => collect<Environment>(state, 'environments', Environment),
    Sitreps: (state) => collect<Sitrep>(state, 'sitreps', Sitrep),
    PilotGear: (state) =>
      collect<IPilotEquipmentData>(state, 'pilot_gear').map((x) => PilotEquipment.Factory(x)),

    Tables: (state) => {
      const tables = lancerData.tables;
      state.ContentPacks.filter((pack) => pack.Active).forEach((pack) => {
        for (const t in pack.Tables) {
          if (tables[t] !== undefined) tables[t] = [...tables[t], ...pack.Tables[t]];
          else tables[t] = pack.Tables[t];
        }
      });
      return tables;
    },

    Licenses() {
      function variantLicenseMatch(variantFrame: Frame, licenseFrame: Frame): boolean {
        if (!!variantFrame.Variant && !!variantFrame.LicenseID) {
          return variantFrame.LicenseID === licenseFrame.ID;
        } else {
          return (
            variantFrame.Variant.toUpperCase() === licenseFrame.Name.toUpperCase() &&
            variantFrame.Source.toUpperCase() === licenseFrame.Source.toUpperCase()
          );
        }
      }

      return (this.Frames as any)
        .filter((x) => x.Source !== 'GMS' && !x.IsHidden)
        .map((frame) => {
          return new License(frame);
        });
    },

    instantiate(): any {
      return (itemType: string, id: string) => {
        if (this[itemType] && this[itemType] instanceof Array) {
          const i = this[itemType].find((x: any) => x.ID === id || x.id === id);
          if (i) return _.cloneDeep(i);
          throw new Error(`ID not found: ${id}`);
        }
        throw new Error(`Invalid item type: ${itemType}`);
      };
    },

    referenceByID(): any {
      return (itemType: string, id: string) => {
        if (this[itemType] && this[itemType] instanceof Array) {
          const i = this[itemType].find((x: any) => x.ID === id || x.id === id);
          if (i) return i;
          throw new Error(`ID not found: ${id}`);
        }
        throw new Error(`Invalid item type: ${itemType}`);
      };
    },

    // TODO: reference FROM ID maps the object-held ItemType to Compendium ItemType.
    // This should be changed so all types are equivalent across items and item arrays, but for now this is a workaround.
    referenceFromID(): any {
      return (itemType: string, id: string) => {
        const mappedType = itemTypeMap[itemType];

        if (this[mappedType] && this[mappedType] instanceof Array) {
          const i = this[mappedType].find((x: any) => x.ID === id || x.id === id);
          if (i) return i;
          throw new Error(`ID not found: ${id}`);
        }
        throw new Error(`Invalid item type: ${mappedType}`);
      };
    },

    getItemCollection(): any {
      return (itemType: string) => {
        return this[itemType].filter((x) => x && !x.IsHidden);
      };
    },

    lcpNames(): any {
      const frame_packs = this.Frames.map((x) => x.LcpName);
      const lcp_packs = this.ContentPacks.map((x) => x.Name);
      return _.unionWith(frame_packs, lcp_packs, _.isEqual);
    },

    itemsByLcp: (state): any => {
      return (key: string) => {
        if (!state[key]) throw new Error(`Invalid LCP key: ${key}`);
        return _.groupBy(state[key], 'LcpName');
      };
    },

    allEquipment(): LicensedItem[] {
      return (this.MechWeapons as LicensedItem[])
        .concat(this.WeaponMods as LicensedItem[])
        .concat(this.MechSystems as LicensedItem[])
        .concat(this.Frames as LicensedItem[])
        .filter((x) => !x.IsHidden);
    },

    referenceLink(): any {
      return (item: CompendiumItem, internal: boolean = false) => {
        const prepend = internal
          ? ''
          : import.meta.env.DEV
            ? 'localhost:5173'
            : 'https://compcon.app';
        return `${prepend}/link/${item.Brew?.LcpName || 'core'}/${item.ItemType.toLowerCase()}/${
          item.ID
        }`;
      };
    },

    itemIndexes(): IndexItem[] {
      const index: IndexItem[] = [];
      const keys = _.uniq(Object.values(itemTypeMap));

      keys.forEach((key) => {
        index.push(
          ...this[key]
            .filter((x) => x.ItemType)
            .map((item) => {
              return {
                id: item.ID,
                title: item.Name,
                type: item.ItemType,
                pack: item.Brew?.LcpName || 'core',
                path: this.referenceLink(item, true),
                icon: item.Icon,
              };
            })
        );
      });

      return index;
    },
  },
  actions: {
    async saveUserData(): Promise<void> {
      Promise.all([this.ContentPacks.map((y) => SetItem('content', y.Serialize()))])
        .then(() => console.info('LCP data saved'))
        .catch((err) => console.error('Error while saving LCP data', err));
    },
    async saveContentCollection(collection: ContentCollection): Promise<void> {
      const index = this.ContentCollections.findIndex((x) => x.ID === collection.ID);
      if (index === -1) {
        this.ContentCollections.push(collection);
      } else {
        this.ContentCollections[index] = collection;
      }
      await SetItem('content_collection', ContentCollection.Serialize(collection));
    },
    async installCollectionContent(collection: ContentCollection): Promise<void> {
      // TODO
    },
    async deleteContentCollection(collection: ContentCollection): Promise<void> {
      this.ContentCollections = this.ContentCollections.filter((x) => x.ID !== collection.ID);
      await RemoveItem('content_collection', collection.ID);
      await this.saveUserData();
    },
    async togglePackActive(payload: string): Promise<void> {
      const pack = this.ContentPacks.find((pack) => pack.ID === payload);
      if (pack) pack.SetActive(!pack.Active);

      await this.saveUserData();
    },
    async setPackActive(payload: { packID: string; active: boolean }): Promise<void> {
      const pack = this.ContentPacks.find((pack) => pack.ID === payload.packID);
      if (pack) pack.SetActive(payload.active);

      await this.saveUserData();
    },
    async installContentPack(packData: IContentPack): Promise<void> {
      if (this.packAlreadyInstalled(packData.id)) {
        console.info(
          `pack ${packData.manifest.name} [${packData.id}] already exists, deleting original...`
        );
        await this.deleteContentPack(packData.id);
      }
      const pack = new ContentPack(packData);
      this.ContentPacks = [...this.ContentPacks, pack];
      await this.saveUserData();
      await this.refreshExtraContent();
    },
    async deleteContentPack(packID: string): Promise<void> {
      this.ContentPacks = this.ContentPacks.filter((pack) => pack.ID !== packID);
      await RemoveItem('content', packID);
      await this.saveUserData();
      await this.refreshExtraContent();
    },
    async loadExtraContent(): Promise<void> {
      let content = await GetAll('content');

      // content.forEach((pack) => {
      //   if (!pack.manifest.dependencies) pack.manifest.dependencies = [];
      // });

      // content = sortByDependencies(content);

      // const packsMissingContent = findMissingDependencies(content);
      // packsMissingContent.forEach((pack) => {
      //   pack.missing_content = true;
      // });

      try {
        this.ContentPacks = [...this.ContentPacks, ...content.map((c) => new ContentPack(c))];

        // FrameComparison.NormalizeReferenceSet(
        //   this.Frames.filter((x) => !x.ID.startsWith('missing_'))
        // );
        // NpcComparison.NormalizeReferenceSet(this.NpcClasses);

        // this.NpcFeatures.forEach((feature) => {
        //   feature.SetOrigin();
        // });
      } catch (err) {
        console.error(err);
      }
    },
    async refreshExtraContent(): Promise<void> {
      this.loaded = false;
      this.ContentPacks = [];
      await this.loadExtraContent();
      await this.loadContentCollections();

      this.loaded = true;
    },
    async loadContentCollections(): Promise<void> {
      let content = await GetAll('content_collection');
      this.ContentCollections = content.map((x) => ContentCollection.Deserialize(x));
    },
    packAlreadyInstalled(packName: string, version?: string): boolean {
      console.log(packName, '---', version);
      console.log(this.ContentPacks.map((x) => x.Name.toLowerCase()));

      let candidate = this.ContentPacks.find(
        (pack) => pack.Name.toLowerCase() === packName.toLowerCase()
      );

      console.log(candidate);

      if (!candidate) return false;

      if (!version || version === '*') return !!candidate;

      if (version.startsWith('=')) return candidate.Version === version.slice(1);

      return semver.gte(semver.coerce(candidate.Version), semver.coerce(version));
    },
  },
});
