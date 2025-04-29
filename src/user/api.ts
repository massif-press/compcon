import axios from 'axios';

let lcp_meta_key = process.env.VITE_LCP_META_KEY || '';
if (!lcp_meta_key) lcp_meta_key = import.meta.env.VITE_LCP_META_KEY || '';

const headers = {
  headers: {
    'Content-Type': 'application/json',
    'x-api-key': lcp_meta_key,
  },
};

const api = axios.create({
  baseURL: 'https://ai5fg19zme.execute-api.us-east-1.amazonaws.com/prod',
  ...headers,
});

const s3api = axios.create({
  headers: {
    'Content-Type': 'image/*',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, GET, PUT, DELETE, HEAD, OPTIONS',
    'Access-Control-Allow-Headers': '*',
    'Access-Control-Allow-Credentials': true,
    'x-api-key': lcp_meta_key,
  },
});

const get = (id: string) => {
  return api.get('/user', { params: { id } });
};

const storageInfo = (id: string) => {
  return api.get('/storage/info', { params: { id } });
};

const getPresignedLink = (id: string, itemType: string, itemTag: string, filename: string) => {
  return api.get('/storage/presign', { params: { id, itemType, itemTag, filename } });
};

const deleteStorage = (key: string) => {
  return api.delete('/storage', { params: { key } });
};

const getLcpPresigned = (packName: string) => {
  return api.get('/lcp', { params: { packName } });
};

const collectionDataQuery = async (itemtype) => {
  const collectionHeaders = {
    'Content-Type': 'application/json',
    'x-api-key': import.meta.env.VITE_LCP_META_KEY as string,
  };

  const result = await fetch(
    'https://jefxcgrkd0.execute-api.us-east-1.amazonaws.com/prod/content',
    {
      method: 'POST',
      headers: collectionHeaders,
      body: JSON.stringify({ itemtype }),
    }
  );

  if (!result.ok) {
    throw new Error(`HTTP error! status: ${result.status}`);
  }
  const data = await result.json();
  return data;
};

const getItemDownloadLink = async (itch_userid, game_id, item_uri) => {
  const collectionHeaders = {
    'Content-Type': 'application/json',
    'x-api-key': import.meta.env.VITE_LCP_META_KEY as string,
  };

  let url = 'https://jefxcgrkd0.execute-api.us-east-1.amazonaws.com/prod/content';
  url += `?itch_userid=${itch_userid}&game_id=${game_id}&item_uri=${item_uri}`;

  const result = await fetch(url, {
    method: 'GET',
    headers: collectionHeaders,
  });

  if (!result.ok) {
    throw new Error(`HTTP error! status: ${result.status}`);
  }
  const data = await result.json();
  return data;
};

export {
  get,
  storageInfo,
  getPresignedLink,
  s3api,
  deleteStorage,
  getLcpPresigned,
  collectionDataQuery,
  getItemDownloadLink,
};
