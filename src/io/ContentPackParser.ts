import JSZip, { JSZipObject } from 'jszip';
import {
  IMechWeaponData,
  IManufacturerData,
  ICoreBonusData,
  IFrameData,
  IMechSystemData,
  IWeaponModData,
  ITalentData,
  IPilotEquipmentData,
  IContentPackManifest,
  ITagCompendiumData,
  IContentPack,
  ICompendiumItemData,
  IActionData,
  IBackgroundData,
  IReserveData,
  ISitrepData,
  IStatusData,
  ISkillData,
} from '@/interface';
import { INpcClassData } from '@/classes/npc/class/NpcClass';
import { INpcFeatureData } from '@/classes/npc/feature/NpcFeature';
import { INpcTemplateData } from '@/classes/npc/template/NpcTemplate';
import CoreLayerData from '@/classes/npc/eidolon/core_layer.json';
import { IEnvironmentData } from '@/classes/Environment';

const isValidManifest = function (obj: any): obj is IContentPackManifest {
  return (
    'name' in obj &&
    typeof obj.name === 'string' &&
    'author' in obj &&
    typeof obj.author === 'string' &&
    'version' in obj &&
    typeof obj.version === 'string'
  );
};

const readZipJSON = async function <T>(zip: JSZip, filename: string): Promise<T | null> {
  const file: JSZipObject | null = zip.file(filename);
  if (!file) return null;
  const text = await file.async('text');
  return JSON.parse(text);
};

const getPackID = async function (manifest: IContentPackManifest): Promise<string> {
  const enc = new TextEncoder();
  const signature = `${manifest.author}/${manifest.name}`;
  const hash = await crypto.subtle.digest('SHA-1', enc.encode(signature));
  return btoa(String.fromCharCode.apply(null, new Uint8Array(hash) as any));
};

async function getZipFiles(zip: JSZip): Promise<string[]> {
  let out = [] as string[];
  zip.forEach(function (relativePath) {
    out.push(relativePath);
  });
  return out;
}

async function getZipData<T>(zip: JSZip, filename: string): Promise<T[]> {
  let readResult;
  try {
    readResult = await readZipJSON<T[]>(zip, filename);
  } catch (e) {
    console.error(`Error reading file ${filename} from package, skipping. Error follows:`);
    console.trace(e);
    readResult = null;
  }
  return readResult || [];
}

const parseContentPack = async function (binString: string): Promise<IContentPack> {
  const zip = await JSZip.loadAsync(binString);

  const manifest = await readZipJSON<IContentPackManifest>(zip, 'lcp_manifest.json');
  if (!manifest) throw new Error('Content pack has no manifest');
  if (!isValidManifest(manifest)) throw new Error('Content manifest is invalid');

  const generateItemID = (type: string, name: string): string => {
    const sanitizedName = name
      .replace(/[ \/-]/g, '_')
      .replace(/[^A-Za-z0-9_]/g, '')
      .toLowerCase();
    return `${manifest.item_prefix}__${type}_${sanitizedName}`;
  };

  function generateIDs<T extends ICompendiumItemData>(data: T[], dataPrefix: string): T[] {
    return data.map((x) => ({ ...x, id: x.id || generateItemID(dataPrefix, x.name) }));
  }

  const files = await getZipFiles(zip);

  const manufacturers = await getZipData<IManufacturerData>(zip, 'manufacturers.json');
  const backgrounds = await getZipData<IBackgroundData>(zip, 'backgrounds.json');
  const skills = await getZipData<ISkillData>(zip, 'skills.json');
  const coreBonuses = generateIDs(await getZipData<ICoreBonusData>(zip, 'core_bonuses.json'), 'cb');
  const pilotGear = generateIDs(
    await getZipData<IPilotEquipmentData>(zip, 'pilot_gear.json'),
    'pg'
  );
  const talents = generateIDs(await getZipData<ITalentData>(zip, 'talents.json'), 't');
  const tags = generateIDs(await getZipData<ITagCompendiumData>(zip, 'tags.json'), 'tg');

  const actions = (await readZipJSON<IActionData[]>(zip, 'actions.json')) || [];
  const statuses = (await readZipJSON<IStatusData[]>(zip, 'statuses.json')) || [];
  const environments = (await readZipJSON<IEnvironmentData[]>(zip, 'environments.json')) || [];
  const sitreps = (await readZipJSON<ISitrepData[]>(zip, 'sitreps.json')) || [];
  const tables = (await readZipJSON<any[]>(zip, 'tables.json')) || [];
  const bonds = (await readZipJSON<any[]>(zip, 'bonds.json')) || [];
  const reserves = (await readZipJSON<IReserveData[]>(zip, 'reserves.json')) || [];

  // library style data for PCs
  const frames = generateIDs(await getZipData<IFrameData>(zip, 'frames.json'), 'mf');
  const weapons = generateIDs(await getZipData<IMechWeaponData>(zip, 'weapons.json'), 'mw');
  const systems = generateIDs(await getZipData<IMechSystemData>(zip, 'systems.json'), 'ms');
  const mods = generateIDs(await getZipData<IWeaponModData>(zip, 'mods.json'), 'wm');

  // collection style data for PCs
  if (files.some((x) => x.toLowerCase().startsWith('license_'))) {
    const licenseDataPromises = files
      .filter((x) => x.startsWith('license_'))
      .map(async (x) => (await readZipJSON<any[]>(zip, x)) || []);

    const licenseDataCollections = await Promise.all(licenseDataPromises);

    licenseDataCollections.forEach((x) => {
      const addFrame = x.find((y) => y.mechtype);
      if (addFrame) {
        frames.push(addFrame);
        x.filter((x) => x.id !== addFrame.id).forEach((e) => {
          e.license_id = addFrame.id;
          e.source = addFrame.source;
          e.license = addFrame.name;
          e.origin = addFrame.id;
          if (e.data_type === 'weapon' || e.mount || e.type) weapons.push(e);
          else if (e.data_type === 'mod' || e.allowed_types) mods.push(e);
          else systems.push(e);
        });
      }
    });
  }

  // library style data for NPCs
  const npcClasses = (await readZipJSON<INpcClassData[]>(zip, 'npc_classes.json')) || [];
  const npcTemplates = (await readZipJSON<INpcTemplateData[]>(zip, 'npc_templates.json')) || [];

  const npcFeaturePromises: Promise<INpcFeatureData[]>[] = files
    .filter((x) => x.startsWith('npc_') && !x.includes('classes') && !x.includes('templates'))
    .map(async (x) => (await readZipJSON<INpcFeatureData[]>(zip, x)) || []);

  let npcFeatures = (await Promise.all(npcFeaturePromises)).flat();

  // collection style data for NPCs
  if (files.some((x) => x.toLowerCase().startsWith('npcc_'))) {
    const npcClassDataPromises = files
      .filter((x) => x.startsWith('npcc_'))
      .map(async (x) => (await readZipJSON<any[]>(zip, x)) || []);

    const npcClassCollections = await Promise.all(npcClassDataPromises);

    npcClassCollections.forEach((x) => {
      const addClass = x.find((y) => y.role);
      if (addClass) {
        npcClasses.push(addClass);
        x.filter((x) => x.id !== addClass.id).forEach((e) => {
          e.origin = addClass.id;
          npcFeatures.push(e);
        });
      }
    });
  }

  if (files.some((x) => x.toLowerCase().startsWith('npct_'))) {
    const npcTemplateDataPromises = files
      .filter((x) => x.startsWith('npct_'))
      .map(async (x) => (await readZipJSON<any[]>(zip, x)) || []);

    const npcTemplateCollections = await Promise.all(npcTemplateDataPromises);

    npcTemplateCollections.forEach((x) => {
      const addTemplate = x.find((y) => y.template);
      if (addTemplate) {
        npcTemplates.push(addTemplate);
        x.filter((x) => x.id !== addTemplate.id).forEach((e) => {
          e.origin = addTemplate.id;
          npcFeatures.push(e);
        });
      }
    });
  }

  const failedFeatures = [] as any[];
  // assign library and v2 features to classes and template origins
  // v2 style data will not contain origins, and so must be assigned backwards from the class/template
  npcFeatures
    .filter((x) => !x.origin || typeof x.origin !== 'string')
    .forEach((item: any) => {
      // attempt to add via origin object
      if (item.origin?.type.toLowerCase() === 'template') {
        const template = npcTemplates.find(
          (x) => x.name.toLowerCase() === item.origin.name.toLowerCase()
        );
        if (template) {
          item.origin = template.id;
          return;
        }
      } else if (item.origin?.type.toLowerCase() === 'class') {
        const npcClass = npcClasses.find(
          (x) => x.name.toLowerCase() === item.origin.name.toLowerCase()
        );
        if (npcClass) {
          item.origin = npcClass.id;
          return;
        }
      }
      // attempt to assign from v2 style library data
      const template = npcTemplates.find(
        (x: any) => x.optional_features.includes(item.id) || x.base_features.includes(item.id)
      );
      if (template) {
        item.origin = template.id;
        return;
      }
      const npcClass = npcClasses.find(
        (x: any) => x.optional_features.includes(item.id) || x.base_features.includes(item.id)
      );
      if (npcClass) {
        item.origin = npcClass.id;
        return;
      }

      console.error(`Failed to assign origin to item`, item);
      failedFeatures.push(item);
    });

  if (failedFeatures.length) {
    console.error(`Failed to assign origin to ${failedFeatures.length} items`, failedFeatures);
    npcFeatures = npcFeatures.filter((x) => !failedFeatures.includes(x));
  }

  const eidolonLayers = (await readZipJSON<any[]>(zip, 'eidolon_layers.json')) || [];
  if (eidolonLayers.length) {
    eidolonLayers.push(CoreLayerData);
  }

  const id = await getPackID(manifest);

  return {
    id,
    active: false,
    manifest,
    data: {
      manufacturers,
      backgrounds,
      skills,
      coreBonuses,
      frames,
      weapons,
      systems,
      mods,
      pilotGear,
      talents,
      tags,
      npcClasses,
      npcFeatures,
      npcTemplates,
      actions,
      statuses,
      environments,
      sitreps,
      tables,
      bonds,
      reserves,
      eidolonLayers,
    },
  };
};

export { parseContentPack };
