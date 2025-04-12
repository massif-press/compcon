import { readFile, writeFile } from './Data';
import PromisifyFileReader from 'promisify-file-reader';
import Startup from './Startup';
import _ from 'lodash';
import localForage from 'localforage';
import { GetAll, storeRegistry, ClearAll, SetAll } from './Storage';
import logger from '@/user/logger';

type exportArchive = {
  data: [
    {
      collection: string;
      items: any[];
    },
  ];
};

const exportAll = async function (): Promise<exportArchive> {
  let data = { data: [] as { collection: string; items: any[] }[] };
  const promises = [] as Promise<any>[];

  Object.keys(storeRegistry).forEach((store) => {
    promises.push(GetAll(store).then((items) => data.data.push({ collection: store, items })));
  });

  data = await Promise.all(promises).then(() => data);

  return data as exportArchive;
};

const importAll = async function (data: any): Promise<void> {
  const items = data.data;
  items.forEach((e) => {
    const collection = e.collection;
    if (!storeRegistry[collection.toLowerCase()]) return;
    ClearAll(collection);
    if (e.items?.length) SetAll(collection, e.items);
  });

  logger.info('Import data loaded! Running startup...');
  await Startup(true);
};

const clearAllData = async function (): Promise<void> {
  await localForage.clear();
};

export { exportAll, importAll, clearAllData };
