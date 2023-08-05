import { defineStore } from 'pinia';
import _ from 'lodash';
import semver from 'semver';
import { saveData as saveUserData, loadData as loadUserData } from '@/io/Data';
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
  NpcClass,
  NpcTemplate,
  NpcFeature,
  ContentPack,
  PilotEquipment,
  Background,
  PlayerAction,
  Bond,
} from '@/class';
import {
  IContentPack,
  INpcClassData,
  INpcFeatureData,
  IPilotEquipmentData,
  ITagCompendiumData,
} from '@/interface';
import { FrameComparison } from '@/classes/mech/components/frame/Frame';
import { Status } from '@/classes/Status';

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

function sortByDependencies(packs: IContentPack[]): IContentPack[] {
  function dfs(node, visited, stack) {
    if (!visited[node.id]) {
      visited[node.id] = true;
      for (const dependencyId of node.manifest.dependencies) {
        const dependentNode = packs.find((obj) => obj.id === dependencyId);
        if (dependentNode) {
          dfs(dependentNode, visited, stack);
        }
      }
      stack.push(node);
    }
  }

  const sortedStack = [];
  const visited = {};

  for (const pack of packs) {
    dfs(pack, visited, sortedStack);
  }

  return sortedStack.reverse();
}

//iterate through the content packs and find the ones missing an installed dependency
function findMissingDependencies(packs: IContentPack[]): IContentPack[] {
  const missing = [] as IContentPack[];
  for (const pack of packs) {
    if (!pack.manifest.dependencies) continue;
    for (const dependency of pack.manifest.dependencies) {
      const dependentNode = packs.some((pack) => pack.manifest.name === dependency.name);
      if (!dependentNode) {
        missing.push(pack);
      }
    }
  }
  return missing;
}

export const CompendiumStore = defineStore('compendium', {
  state: () => ({
    LancerVersion: '',
    CCVersion: '',
    ContentPacks: [] as ContentPack[],
    MissingContent: { pilots: [], npcs: [] },
    nfErr: { err: 'ID not found' },
  }),
  getters: {
    NpcClasses: (state) => collect<NpcClass>(state, 'npc_classes', NpcClass),
    NpcTemplates: (state) => collect<NpcTemplate>(state, 'npc_templates', NpcTemplate),
    // NpcFeatures: (state) =>
    //   collect<INpcFeatureData>(state, 'npc_features').map((x) => NpcFeature.Factory(x)),
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
    Environments: (state) => collect<Environment>(state, 'environments'),
    Sitreps: (state) => collect<Sitrep>(state, 'sitreps'),
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
          const variants = this.Frames.filter((f) => !f.IsHidden && variantLicenseMatch(f, frame));
          return new License(frame, variants);
        });
    },

    packAlreadyInstalled(): any {
      return (packStr: string, version?: string) => {
        let candidates = this.ContentPacks.filter(
          (pack) => packStr === pack.Name || packStr === pack.ID
        );

        if (!version || version === '*') return candidates.length > 0;
        if (version.startsWith('='))
          return candidates.some((pack) => pack.Version === version.slice(1));

        return candidates.some((pack) => {
          return semver.gte(semver.coerce(pack.Version), semver.coerce(version));
        });
      };
    },

    instantiate(): any | { err: string } {
      return (itemType: string, id: string) => {
        if (this[itemType] && this[itemType] instanceof Array) {
          const i = this[itemType].find((x: any) => x.ID === id || x.id === id);
          if (i) return _.cloneDeep(i);
          const miID = `missing_${itemType.toLowerCase()}`;
          const missingItem = this[itemType].find((x: any) => x.ID === miID || x.id === miID);
          if (missingItem) return { ...missingItem };
          return this.nfErr;
        }
        return { err: 'Invalid Item Type' };
      };
    },

    referenceByID(): any | { err: string } {
      return (itemType: string, id: string) => {
        if (this[itemType] && this[itemType] instanceof Array) {
          const i = this[itemType].find((x: any) => x.ID === id || x.id === id);
          if (i) return i;
          const miID = `missing_${itemType.toLowerCase()}`;
          const missingItem = this[itemType].find((x: any) => x.ID === miID || x.id === miID);
          if (missingItem) return missingItem;
          return this.nfErr;
        }
        return { err: 'Invalid Item Type' };
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
  },
  actions: {
    setMissingContent(payload: any): void {
      this.MissingContent = payload;
    },
    async togglePackActive(payload: string): Promise<void> {
      const pack = this.ContentPacks.find((pack) => pack.ID === payload);
      if (pack) pack.SetActive(!pack.Active);

      await saveUserData(
        'extra_content.json',
        this.ContentPacks.map((pack) => pack.Serialize())
      );
    },
    async setPackActive(payload: { packID: string; active: boolean }): Promise<void> {
      const pack = this.ContentPacks.find((pack) => pack.ID === payload.packID);
      if (pack) pack.SetActive(payload.active);

      await saveUserData(
        'extra_content.json',
        this.ContentPacks.map((pack) => pack.Serialize())
      );
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
      await saveUserData(
        'extra_content.json',
        this.ContentPacks.map((pack) => pack.Serialize())
      );
      await this.refreshExtraContent();
    },
    async deleteContentPack(packID: string): Promise<void> {
      this.ContentPacks = this.ContentPacks.filter((pack) => pack.ID !== packID);
      await saveUserData(
        'extra_content.json',
        this.ContentPacks.map((pack) => pack.Serialize())
      );
      await this.refreshExtraContent();
    },
    async loadExtraContent(): Promise<void> {
      let content = (await loadUserData('extra_content.json')) as IContentPack[];
      content.forEach((pack) => {
        if (!pack.manifest.dependencies) pack.manifest.dependencies = [];
      });

      content = sortByDependencies(content);

      const packsMissingContent = findMissingDependencies(content);
      packsMissingContent.forEach((pack) => {
        pack.missing_content = true;
      });

      try {
        this.ContentPacks = [...this.ContentPacks, ...content.map((c) => new ContentPack(c))];
        FrameComparison.NormalizeReferenceSet(
          this.Frames.filter((x) => !x.ID.startsWith('missing_'))
        );
      } catch (err) {
        console.error(err);
      }
    },
    async refreshExtraContent(): Promise<void> {
      this.ContentPacks = [];
      await this.loadExtraContent();
    },
  },
});
