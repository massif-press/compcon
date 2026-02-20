// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { ICloudSyncable } from '@/classes/components'
// import { SyncItem, getCognitoIdentity } from '@/cloud/item_sync'
import sleep from '@/util/sleep'
import { EXTRA_CONTENT_API_BASE_URL } from '@/config/api'

const lcp_meta_key = import.meta.env.VITE_LCP_META_KEY || ''

// Helper function to create fetch requests
const createFetchRequest = async (endpoint: string, options: RequestInit = {}) => {
  const url = `${EXTRA_CONTENT_API_BASE_URL}${endpoint}`

  const defaultHeaders = {
    'Access-Control-Allow-Origin': '*',
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

const processCloudItem = async (item: ICloudSyncable) => {
  const collectionItem = {
    id: item.ID,
    key: item.CloudController.s3Key,
    lastModifiedLocal: new Date().toString(),
    // itemType: CloudItemTypeMap.pilot,
  }
  // await SyncItem(collectionItem)
  // await sleep(6000)
  // const iid = await getCognitoIdentity()
  return { key: item.CloudController.s3Key, iid }
}

const generateCode = async (item: ICloudSyncable): Promise<any> => {
  const payload = await processCloudItem(item)
  return createFetchRequest('/share', {
    method: 'PUT',
    body: JSON.stringify(payload),
  })
}

const refreshItem = async (code: string) => {
  return createFetchRequest('/share', {
    method: 'POST',
    body: JSON.stringify(code),
  })
}

const getRecord = code => {
  const queryString = new URLSearchParams(code).toString()
  return createFetchRequest(`/share?${queryString}`)
}

export { generateCode, getRecord, refreshItem }
