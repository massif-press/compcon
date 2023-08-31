import localforage from 'localforage';

const dbName = 'COMPCON Persistent';

const storeRegistry = {
  pilots: localforage.createInstance({
    name: dbName,
    storeName: 'pilots',
    description: 'Stores Pilot data',
  }),
  content: localforage.createInstance({
    name: dbName,
    storeName: 'content',
    description: 'Stores LCP data',
  }),
  campaigns: localforage.createInstance({
    name: dbName,
    storeName: 'campaigns',
    description: 'Stores Campaign data',
  }),
  encounters: localforage.createInstance({
    name: dbName,
    storeName: 'encounters',
    description: 'Stores Encounter data',
  }),
  npcs: localforage.createInstance({
    name: dbName,
    storeName: 'npcs',
    description: 'Stores NPC data',
  }),
  characters: localforage.createInstance({
    name: dbName,
    storeName: 'character',
    description: 'Stores Character data',
  }),
  locations: localforage.createInstance({
    name: dbName,
    storeName: 'location',
    description: 'Stores Location data',
  }),
  factions: localforage.createInstance({
    name: dbName,
    storeName: 'faction',
    description: 'Stores Faction data',
  }),
  images: localforage.createInstance({
    name: dbName,
    storeName: 'images',
    description: 'Stores user images',
  }),
};

const Initialize = async function () {
  localforage.config({
    name: dbName,
  });
  await convertLocalstorage();
};

const SetItem = async function (collection: string, item: any) {
  const id = item.ID ? item.ID : item.id;

  storeRegistry[collection.toLowerCase()].setItem(id, JSON.stringify(item));
};

const GetItem = async function (collection: string, id: string) {
  const item = await storeRegistry[collection.toLowerCase()].getItem(id);
  return JSON.parse(item);
};

const RemoveItem = async function (collection: string, id: string) {
  return await storeRegistry[collection.toLowerCase()].removeItem(id);
};

const GetAll = async function (collection: string) {
  const output = [] as any[];
  await storeRegistry[collection.toLowerCase()]
    .iterate(function (value: any) {
      output.push(JSON.parse(value));
    })
    .catch(function (err) {
      console.error('Error getting collection data', err);
    });
  return output;
};

const GetLength = async function (collection: string) {
  const db = await storeRegistry[collection.toLowerCase()];

  if (db && db._dbInfo) return await db.length();
};

const convertLocalstorage = async function (): Promise<void> {
  // TODO
  const pv2 = localStorage.getItem('pilots_v2.json');
  // console.log(pv2)
  if (pv2 && pv2.length) {
    const pilots = JSON.parse(pv2);
    await Promise.all(pilots.map((x) => SetItem('pilots', x)));
    localStorage.removeItem('pilots_v2.json');
  }
};

export { Initialize, SetItem, GetItem, RemoveItem, GetAll, GetLength };
