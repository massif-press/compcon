import localforage from 'localforage';

const dbName = 'COMPCON Persistent';

const storeRegistry = {
  pilot_groups: localforage.createInstance({
    name: dbName,
    storeName: 'pilot_groups',
    description: 'Stores Pilot Group data',
  }),
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
  narrative: localforage.createInstance({
    name: dbName,
    storeName: 'narrative',
    description: 'Stores Narrative data',
  }),
  images: localforage.createInstance({
    name: dbName,
    storeName: 'images',
    description: 'Stores user images',
  }),
  remote_images: localforage.createInstance({
    name: dbName,
    storeName: 'remote_images',
    description: 'Stores remotely hosted image urls',
  }),
};

const Initialize = async function () {
  localforage.config({
    name: dbName,
  });
  // await convertLocalstorage();
};

const SetItem = async function (collection: string, item: any) {
  if (typeof item === 'string') {
    const sr = await storeRegistry[collection.toLowerCase()];
    sr.setItem(item, item);
    return;
  }

  let save = true;
  const id = item.ID ? item.ID : item.id;

  if (item.SaveController) {
    save = item.SaveController.IsDirty;
  }

  if (!save) return;
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
  if (!storeRegistry[collection.toLowerCase()]) return output;

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

  if (db) return await db.length();
  return 0;
};

const GetKeys = async function (collection: string) {
  const db = await storeRegistry[collection.toLowerCase()];

  if (db) return await db.keys();
  return [];
};

const AddBlob = async function (collection: string, key: string, blob: Blob) {
  const db = await storeRegistry[collection.toLowerCase()];
  return await db.setItem(key, blob);
};

const GetBlob = async function (collection: string, key: string) {
  const db = await storeRegistry[collection.toLowerCase()];
  return await db.getItem(key);
};

// const convertLocalstorage = async function (): Promise<void> {
//   // TODO
//   const pv2 = localStorage.getItem('pilots_v2.json');
//   // console.log(pv2)
//   if (pv2 && pv2.length) {
//     const pilots = JSON.parse(pv2);
//     await Promise.all(pilots.map((x) => SetItem('pilots', x)));
//     localStorage.removeItem('pilots_v2.json');
//   }
// };

export { Initialize, SetItem, GetItem, RemoveItem, GetAll, GetLength, GetKeys, AddBlob, GetBlob };
