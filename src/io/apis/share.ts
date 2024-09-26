// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { ICloudSyncable } from '@/classes/components';
// import { SyncItem, getCognitoIdentity } from '@/cloud/item_sync'
import sleep from '@/util/sleep';
import axios from 'axios';

const lcp_meta_key = import.meta.env.VITE_LCP_META_KEY;

const headers = {
  headers: {
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'application/json',
    'x-api-key': lcp_meta_key,
  },
};

const api = axios.create({
  baseURL: 'https://ujgatmvzlg.execute-api.us-east-1.amazonaws.com/prod',
  ...headers,
});

const processCloudItem = async (item: ICloudSyncable) => {
  const collectionItem = {
    id: item.ID,
    key: item.CloudController.s3Key,
    lastModifiedLocal: new Date().toString(),
    // itemType: CloudItemTypeMap.pilot,
  };
  // await SyncItem(collectionItem)
  // await sleep(6000)
  // const iid = await getCognitoIdentity()
  return { key: item.CloudController.s3Key, iid };
};

const generateCode = async (item: ICloudSyncable): Promise<any> => {
  const payload = await processCloudItem(item);
  return api.put('/share', payload).then((res) => res.data);
};

const refreshItem = async (code: string) => {
  return api.post('/share', code);
};

const getRecord = (code) => {
  return api.get('/share', { params: code });
};

export { generateCode, getRecord, refreshItem };
