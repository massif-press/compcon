import localForage from 'localforage';
import logger from '@/user/logger';

const canPersistData = async function (): Promise<boolean> {
  const capable = await navigator.storage.persist();
  const q = await navigator.permissions.query({ name: 'persistent-storage' });
  const allowed = q.state === 'granted';

  return capable && allowed;
};

const writeFile = async function (name: string, data: any): Promise<void> {
  localForage.setItem(name, data);
};

const readFile = async function (name: string): Promise<string | null> {
  return localForage.getItem(name);
};

const exists = async function (name: string): Promise<boolean> {
  return Boolean(localForage.getItem(name));
};

const saveData = async function <T>(collection: string, data: T): Promise<void> {
  const p = await canPersistData();

  if (!p) {
    logger.error('Cannot persist data');
    return;
  }

  const isStringified = typeof data === 'string';

  return writeFile(collection, isStringified ? data : JSON.stringify(data));
};

const saveDelta = async function <T>(collection: string, data: T[]): Promise<void> {
  if (!data.length) return;
  const ls = await localForage.getItem(collection);
  const mem = ls ? JSON.parse(ls as string) : [];
  data.forEach((e: any) => {
    const idx = mem.findIndex((x: any) => x.id === e.id);
    if (idx > -1) mem[idx] = e;
    else mem.push(e);
  });
  writeFile(collection, JSON.stringify(mem));
};

const deleteDataById = async function (collection: string, ids: string[]): Promise<void> {
  if (!ids.length) return;
  const item = await localForage.getItem(collection);
  const mem = JSON.parse(item as string);
  ids.forEach((e: any) => {
    const idx = mem.findIndex((x: any) => x.id === e);
    if (idx > -1) mem.splice(idx, 1);
  });
  writeFile(collection, JSON.stringify(mem));
};

const loadData = async function <T>(collection: string): Promise<T[]> {
  const fileExists = await exists(collection);
  if (fileExists) {
    try {
      const dataText = await readFile(collection);
      if (!dataText) {
        throw new Error('No data found for collection: ' + collection);
      }
      return (JSON.parse(dataText) || []) as T[];
    } catch (err) {
      logger.error(err as string);
      return [];
    }
  } else {
    return [];
  }
};

const _importFile = async function <T>(file: File): Promise<T> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (event) => {
      try {
        const fileContent = event.target?.result as string;
        const jsonObject = JSON.parse(fileContent);
        resolve(jsonObject);
      } catch (error) {
        reject(error);
      }
    };

    reader.onerror = (event) => {
      reject(new Error('An error occurred while reading the file.' + event));
    };

    reader.readAsText(file);
  });
};

const ImportData = async function <T>(file: File): Promise<T> {
  const json = await _importFile(file);
  try {
    const item = json as { EXPORT_TYPE?: string; data: T };
    if (item.EXPORT_TYPE) return item.data as T;
    else return json as T;
  } catch (error) {
    logger.error('Error parsing imported data:', error);
    throw new Error('Invalid JSON');
  }
};

const saveFile = function (filename: string, data: Object, exportType: string) {
  const json = JSON.stringify({ EXPORT_TYPE: exportType, data });

  const blob = new Blob([json]);
  if ((window.navigator as any).msSaveOrOpenBlob) {
    (window.navigator as any).msSaveBlob(blob, filename);
  } else {
    const elem = window.document.createElement('a');
    elem.href = window.URL.createObjectURL(blob);
    elem.download = filename;
    document.body.appendChild(elem);
    elem.click();
    document.body.removeChild(elem);
  }
};

export {
  writeFile,
  readFile,
  saveData,
  saveDelta,
  deleteDataById,
  loadData,
  ImportData,
  exists,
  saveFile,
};
