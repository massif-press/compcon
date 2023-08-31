import axios from 'axios';

const lcp_meta_key = process.env.VITE_LCP_META_KEY;

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

export { get, storageInfo, getPresignedLink, s3api, deleteStorage };
