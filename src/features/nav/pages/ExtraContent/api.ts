// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import axios from 'axios';

const lcp_meta_key = import.meta.env.VITE_LCP_META_KEY;

const headers = {
  headers: {
    'Content-Type': 'application/json',
    'x-api-key': lcp_meta_key,
  },
};

const api = axios.create({
  baseURL: 'https://ujgatmvzlg.execute-api.us-east-1.amazonaws.com/prod',
  ...headers,
});

const scan = () => {
  return api.get('/scan');
};

export { scan };
