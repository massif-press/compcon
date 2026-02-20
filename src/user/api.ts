import { USER_API_BASE_URL, CONTENT_API_BASE_URL } from '@/config/api'

let lcp_meta_key = process.env.VITE_LCP_META_KEY || ''
if (!lcp_meta_key) lcp_meta_key = import.meta.env.VITE_LCP_META_KEY || ''

const createFetchRequest = async (endpoint: string, options: RequestInit = {}) => {
  const url = endpoint.startsWith('http') ? endpoint : `${USER_API_BASE_URL}${endpoint}`

  const defaultHeaders = {
    'Content-Type': 'application/json',
    'x-api-key': lcp_meta_key,
  }

  const response = await fetch(url, {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  })

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`)
  }

  return response.json()
}

const buildQueryString = (params: Record<string, string>) => {
  const searchParams = new URLSearchParams(params)
  return searchParams.toString()
}

const get = (id: string) => {
  const queryString = buildQueryString({ id })
  return createFetchRequest(`/user?${queryString}`)
}

const storageInfo = (id: string) => {
  const queryString = buildQueryString({ id })
  return createFetchRequest(`/storage/info?${queryString}`)
}

const getPresignedLink = (id: string, itemType: string, itemTag: string, filename: string) => {
  const queryString = buildQueryString({ id, itemType, itemTag, filename })
  return createFetchRequest(`/storage/presign?${queryString}`)
}

const deleteStorage = (key: string) => {
  const queryString = buildQueryString({ key })
  return createFetchRequest(`/storage?${queryString}`, {
    method: 'DELETE',
  })
}

const getLcpPresigned = (packName: string) => {
  const queryString = buildQueryString({ packName })
  return createFetchRequest(`/lcp?${queryString}`)
}

const collectionDataQuery = async itemtype => {
  const collectionHeaders = {
    'Content-Type': 'application/json',
    'x-api-key': import.meta.env.VITE_LCP_META_KEY as string,
  }

  const result = await fetch(`${CONTENT_API_BASE_URL}/content`, {
    method: 'POST',
    headers: collectionHeaders,
    body: JSON.stringify({ itemtype }),
  })

  if (!result.ok) {
    throw new Error(`HTTP error! status: ${result.status}`)
  }
  const data = await result.json()
  return data
}

const getItemDownloadLink = async (itch_userid, game_id, item_uri) => {
  const collectionHeaders = {
    'Content-Type': 'application/json',
    'x-api-key': import.meta.env.VITE_LCP_META_KEY as string,
  }

  let url = `${CONTENT_API_BASE_URL}/content`
  url += `?itch_userid=${itch_userid}&game_id=${game_id}&item_uri=${item_uri}`

  const result = await fetch(url, {
    method: 'GET',
    headers: collectionHeaders,
  })

  if (!result.ok) {
    throw new Error(`HTTP error! status: ${result.status}`)
  }
  const data = await result.json()
  return data
}

export {
  get,
  storageInfo,
  getPresignedLink,
  deleteStorage,
  getLcpPresigned,
  collectionDataQuery,
  getItemDownloadLink,
}
