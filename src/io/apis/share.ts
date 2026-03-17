import { ICloudSyncable } from '@/classes/components'

// Helper function to create fetch requests
const createFetchRequest = async (endpoint: string, options: RequestInit = {}) => {
  const url = `${import.meta.env.VITE_APP_INVOKE_URL}${endpoint}`

  const defaultHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'application/json',
    'x-api-key': import.meta.env.VITE_APP_API_KEY,
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
