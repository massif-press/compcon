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
  INpcClassData,
  INpcFeatureData,
  INpcTemplateData,
  ICompendiumItemData,
  IActionData,
  IBackgroundData,
  IReserveData,
  IEnvironmentData,
  ISitrepData,
  IStatusData,
} from '@/interface';

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

  const npcClasses = (await readZipJSON<INpcClassData[]>(zip, 'npc_classes.json')) || [];
  const npcFeatures = (await readZipJSON<INpcFeatureData[]>(zip, 'npc_features.json')) || [];
  const npcTemplates = (await readZipJSON<INpcTemplateData[]>(zip, 'npc_templates.json')) || [];

  const actions = (await readZipJSON<IActionData[]>(zip, 'actions.json')) || [];
  const statuses = (await readZipJSON<IStatusData[]>(zip, 'statuses.json')) || [];
  const environments = (await readZipJSON<IEnvironmentData[]>(zip, 'environments.json')) || [];
  const sitreps = (await readZipJSON<ISitrepData[]>(zip, 'sitreps.json')) || [];
  const tables = (await readZipJSON<any[]>(zip, 'tables.json')) || [];
  const bonds = (await readZipJSON<any[]>(zip, 'bonds.json')) || [];
  const reserves = (await readZipJSON<IReserveData[]>(zip, 'reserves.json')) || [];

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
    },
  };
};

export { parseContentPack };
