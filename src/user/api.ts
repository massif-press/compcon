// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import axios from 'axios'

const lcp_meta_key = process.env.VUE_APP_LCP_META_KEY

const headers = {
  headers: {
    'Content-Type': 'application/json',
    'x-api-key': lcp_meta_key,
  },
}

const api = axios.create({
  baseURL: 'https://ai5fg19zme.execute-api.us-east-1.amazonaws.com/prod',
  ...headers,
})

const get = (id: string) => {
  console.log('lcp meta key: ', lcp_meta_key)
  return api.get('/user', { params: { id } })
}

export { get }
