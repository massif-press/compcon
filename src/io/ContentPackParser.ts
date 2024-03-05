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
  IEnvironmentData,
  ISitrepData,
  IStatusData,
} from '@/interface';
import { INpcClassData } from '@/classes/npc/class/NpcClass';
import { INpcFeatureData } from '@/classes/npc/feature/NpcFeature';
import { INpcTemplateData } from '@/classes/npc/template/NpcTemplate';
import CoreLayerData from '@/classes/npc/eidolon/core_layer.json';

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
  const coreBonuses = generateIDs(await getZipData<ICoreBonusData>(zip, 'core_bonuses.json'), 'cb');
  const frames = generateIDs(await getZipData<IFrameData>(zip, 'frames.json'), 'mf');
  const weapons = generateIDs(await getZipData<IMechWeaponData>(zip, 'weapons.json'), 'mw');
  const systems = generateIDs(await getZipData<IMechSystemData>(zip, 'systems.json'), 'ms');
  const mods = generateIDs(await getZipData<IWeaponModData>(zip, 'mods.json'), 'wm');
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

  const npcClasses = (await readZipJSON<INpcClassData[]>(zip, 'npc_classes.json')) || [];
  const npcTemplates = (await readZipJSON<INpcTemplateData[]>(zip, 'npc_templates.json')) || [];

  const npcFeaturePromises: Promise<INpcFeatureData[]>[] = files
    .filter((x) => x.startsWith('npc_') && !x.includes('classes') && !x.includes('templates'))
    .map(async (x) => (await readZipJSON<INpcFeatureData[]>(zip, x)) || []);

  const npcFeatures = (await Promise.all(npcFeaturePromises)).flat();

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
