import { UserStore } from '@/stores'
import { fetchAuthSession } from 'aws-amplify/auth'
import logger from '@/user/logger'

const invoke = `${(import.meta as any).env.VITE_APP_INVOKE_URL || ''}`

const baseHeaders: Record<string, string> = {
  'Content-Type': 'application/json',
  'x-api-key': (import.meta as any).env.VITE_APP_API_KEY || '',
  'Access-Control-Request-Headers': 'Content-Type,x-api-key',
}

async function getHeaders(): Promise<Record<string, string>> {
  try {
    const session = await fetchAuthSession()
    const idToken = session.tokens?.idToken?.toString()
    if (idToken) {
      return { ...baseHeaders, Authorization: idToken }
    }
  } catch (e) {
    logger.warn('Unable to get auth session for request headers:', e)
  }
  return { ...baseHeaders }
}

const MAX_RETRIES = 3
const INITIAL_BACKOFF_MS = 1000
const REQUEST_TIMEOUT_MS = 30000

async function fetchWithRetry(
  input: RequestInfo | URL,
  init?: RequestInit,
  retries = MAX_RETRIES
): Promise<Response> {
  let lastError: Error | undefined

  for (let attempt = 0; attempt < retries; attempt++) {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS)

    try {
      const response = await fetch(input, { ...init, signal: controller.signal })
      clearTimeout(timeoutId)

      if (response.ok) return response

      if (response.status === 429) {
        const retryAfter = response.headers.get('Retry-After')
        const waitMs = retryAfter
          ? parseInt(retryAfter, 10) * 1000 || INITIAL_BACKOFF_MS
          : INITIAL_BACKOFF_MS * Math.pow(2, attempt)
        logger.info(
          `Rate limited (429). Retrying in ${waitMs}ms (attempt ${attempt + 1}/${retries})`
        )
        await new Promise(r => setTimeout(r, waitMs))
        continue
      }

      // Don't retry 409 Conflict — surface it for optimistic concurrency handling
      if (response.status === 409) {
        return response
      }

      if (response.status >= 500 && attempt < retries - 1) {
        const waitMs = INITIAL_BACKOFF_MS * Math.pow(2, attempt)
        logger.info(
          `Server error (${response.status}). Retrying in ${waitMs}ms (attempt ${attempt + 1}/${retries})`
        )
        await new Promise(r => setTimeout(r, waitMs))
        continue
      }

      throw new Error(`HTTP error! status: ${response.status}`)
    } catch (error: any) {
      clearTimeout(timeoutId)
      lastError = error
      if (error.name === 'AbortError') {
        lastError = new Error(`Request timed out after ${REQUEST_TIMEOUT_MS}ms`)
      }
      if (attempt < retries - 1) {
        const waitMs = INITIAL_BACKOFF_MS * Math.pow(2, attempt)
        logger.info(
          `Request failed: ${lastError?.message ?? 'Unknown error'}. Retrying in ${waitMs}ms (attempt ${attempt + 1}/${retries})`
        )
        await new Promise(r => setTimeout(r, waitMs))
      }
    }
  }

  throw lastError || new Error('Request failed after retries')
}

export const getUser = async (id: string): Promise<any> => {
  const url = new URL(`${invoke}/user`)
  url.searchParams.append('user_id', id)
  url.searchParams.append('scope', 'meta')

  const response = await fetchWithRetry(url.toString(), {
    method: 'GET',
    headers: await getHeaders(),
  })

  const data = await response.json()

  if (data?.error === 'Unauthorized') {
    throw new UnauthorizedError(data.message)
  }

  return data
}

export const getUserData = async (id: string): Promise<any> => {
  const url = new URL(`${invoke}/user`)
  url.searchParams.append('user_id', id)
  url.searchParams.append('scope', 'all')

  const response = await fetchWithRetry(url.toString(), {
    method: 'GET',
    headers: await getHeaders(),
  })

  const data = await response.json()

  return data
}

export async function getUserDataChanged(
  id: string,
  since: number
): Promise<{ items: any[]; serverTime: number }> {
  const url = new URL(`${invoke}/user`)
  url.searchParams.append('user_id', id)
  url.searchParams.append('scope', 'changed')
  url.searchParams.append('since', String(since))

  const response = await fetchWithRetry(url.toString(), {
    method: 'GET',
    headers: await getHeaders(),
  })

  const data = await response.json()

  // When since=0, backend returns flat array (scope=all behavior)
  if (Array.isArray(data)) {
    return { items: data, serverTime: Date.now() }
  }
  return data
}

export async function updateItem(metadata: any, scope = 'item'): Promise<any> {
  logger.info('Updating item with metadata:', metadata)
  const url = new URL(`${invoke}/user`)
  url.searchParams.append('user_id', UserStore().Cognito.userId)
  url.searchParams.append('scope', scope)

  const body = typeof metadata === 'string' ? metadata : JSON.stringify(metadata)

  const response = await fetchWithRetry(url.toString(), {
    method: 'POST',
    headers: await getHeaders(),
    body,
  })

  // Handle 409 Conflict for optimistic concurrency
  if (response.status === 409) {
    const conflict = await response.json()
    throw new VersionConflictError(conflict.currentItem, conflict.message)
  }

  const data = await response.json()

  return data
}

export async function batchUpsert(items: any[]): Promise<any> {
  const url = new URL(`${invoke}/user`)
  url.searchParams.append('user_id', UserStore().Cognito.userId)
  url.searchParams.append('scope', 'batch')

  const response = await fetchWithRetry(url.toString(), {
    method: 'POST',
    headers: await getHeaders(),
    body: JSON.stringify({ items }),
  })

  const data = await response.json()
  return data
}

export async function patchItem(sortkey: string, fields: Record<string, any>): Promise<any> {
  const url = new URL(`${invoke}/user`)
  url.searchParams.append('user_id', UserStore().Cognito.userId)
  url.searchParams.append('scope', 'patch')

  const response = await fetchWithRetry(url.toString(), {
    method: 'POST',
    headers: await getHeaders(),
    body: JSON.stringify({ sortkey, ...fields }),
  })

  if (response.status === 409) {
    const conflict = await response.json()
    throw new VersionConflictError(conflict.currentItem, conflict.message)
  }

  const data = await response.json()
  return data
}

export async function updateUser(id: string, payload: any): Promise<any> {
  const url = new URL(`${invoke}/user`)
  url.searchParams.append('user_id', id)
  url.searchParams.append('scope', 'meta')

  const response = await fetchWithRetry(url.toString(), {
    method: 'POST',
    headers: await getHeaders(),
    body: JSON.stringify(payload),
  })

  return response
}

export class PresignExpiredError extends Error {
  constructor() {
    super('Presigned URL expired (403)')
    this.name = 'PresignExpiredError'
  }
}

export class UnauthorizedError extends Error {
  constructor(message?: string) {
    super(message || 'Valid authentication token required')
    this.name = 'UnauthorizedError'
  }
}

export class VersionConflictError extends Error {
  public readonly currentItem: any
  constructor(currentItem: any, message?: string) {
    super(message || 'Item was modified by another client')
    this.name = 'VersionConflictError'
    this.currentItem = currentItem
  }
}

export async function uploadToS3(data, presignedUrl, type = 'application/json') {
  logger.info('Uploading data to S3:', data)

  if (data.cloud?.cloud_data) delete data.cloud.cloud_data

  const body = type === 'application/json' ? JSON.stringify(data) : data

  try {
    const response = await fetch(presignedUrl, {
      method: 'PUT',
      body,
      headers: {
        'Content-Type': type,
      },
    })
    logger.info(`Response from S3 upload: ${response.status}`)

    if (response.ok) {
      logger.info(`Upload successful: ${response.status}`)
      return true
    } else if (response.status === 403) {
      throw new PresignExpiredError()
    } else {
      logger.error('Upload failed:', response.statusText)
      return false
    }
  } catch (error) {
    if (error instanceof PresignExpiredError) throw error
    throw new Error(`HTTP error! status: ${error}`, { cause: error })
  }
}

// In-memory ETag cache: uri → { etag, data }
const _etagCache = new Map<string, { etag: string; data: any }>()

export async function downloadFromS3(s3Url) {
  const url = `${import.meta.env.VITE_APP_USERDATA_DISTRIBUTOR || ''}/${s3Url}`

  try {
    const fetchHeaders: Record<string, string> = {}
    const cached = _etagCache.get(s3Url)
    if (cached?.etag) {
      fetchHeaders['If-None-Match'] = cached.etag
    }

    const response = await fetch(url, { headers: fetchHeaders })

    if (response.status === 304 && cached) {
      return cached.data
    }

    if (response.ok) {
      const jsonData = await response.json()
      const etag = response.headers.get('ETag')
      if (etag) {
        _etagCache.set(s3Url, { etag, data: jsonData })
      }
      return jsonData
    } else {
      logger.error('Download failed:', response.statusText)
    }
  } catch (error) {
    logger.error('Error downloading JSON:', {}, error)
  }
}

export async function getFromPresignDirect(url) {
  try {
    const response = await fetch(url)
    if (response.ok) {
      const rawData = await response.blob()
      return rawData
    } else {
      logger.error('Download failed:', response.statusText)
    }
  } catch (error) {
    logger.error('Error downloading JSON:', {}, error)
  }
}

export async function cloudDelete(user_id: string, sortkey: string, uri?: string) {
  const url = new URL(`${invoke}/user`)
  url.searchParams.append('user_id', user_id)
  url.searchParams.append('sortkey', sortkey)
  if (uri) url.searchParams.append('uri', uri)

  const response = await fetchWithRetry(url.toString(), {
    method: 'DELETE',
    headers: await getHeaders(),
  })

  return response
}

export async function bulkDelete(
  user_id: string,
  sortkeys: string[],
  uris?: string[]
): Promise<any> {
  const url = new URL(`${invoke}/user`)
  url.searchParams.append('user_id', user_id)
  url.searchParams.append('scope', 'bulk')

  const body: any = { sortkeys }
  if (uris && uris.length > 0) body.uris = uris

  const response = await fetchWithRetry(url.toString(), {
    method: 'DELETE',
    headers: await getHeaders(),
    body: JSON.stringify(body),
  })

  const data = await response.json()
  return data
}

export async function GetFromCode(codes: string | string[]) {
  const url = new URL(`${invoke}/code`)
  const isArray = Array.isArray(codes)
  url.searchParams.append('scope', isArray ? 'items' : 'item')
  url.searchParams.append('codes', JSON.stringify(isArray ? codes : [codes]))

  const response = await fetchWithRetry(url.toString(), {
    method: 'GET',
    headers: await getHeaders(),
  })

  const data = await response.json()

  return data
}

export async function GetAchievement(code: string) {
  const url = new URL(`${invoke}/achievement`)
  url.searchParams.append('code', code)

  const response = await fetchWithRetry(url.toString(), {
    method: 'GET',
    headers: await getHeaders(),
  })

  const data = await response.json()

  return data
}
