import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'

vi.hoisted(() => {
  vi.stubEnv('VITE_APP_INVOKE_URL', 'https://api.test')
  vi.stubEnv('VITE_APP_USERDATA_DISTRIBUTOR', 'https://data.test')
})

vi.mock('aws-amplify/auth', () => ({ fetchAuthSession: vi.fn() }))

import { fetchAuthSession } from 'aws-amplify/auth'
import { AuthStore } from '@/user/store/AuthStore'
import {
  getHeaders,
  getUser,
  getUserData,
  getUserDataChanged,
  updateItem,
  getUploadPresigns,
  batchUpsert,
  patchItem,
  updateUser,
  uploadToS3,
  invalidateETagCache,
  downloadFromS3,
  getFromPresignDirect,
  cloudDelete,
  bulkDelete,
  DownloadViaCode,
  GetFromCode,
  redeemKeycode,
  GetAchievement,
  PresignExpiredError,
  UnauthorizedError,
  NotFoundError,
  BadRequestError,
} from './account'

const fetchMock = vi.fn()

function json(body: unknown, status = 200, headers: Record<string, string> = {}) {
  return new Response(JSON.stringify(body), { status, headers })
}

const call = (i = 0) => {
  const [input, init] = fetchMock.mock.calls[i]
  return { url: new URL(String(input)), init: init ?? {} }
}

async function settle<T>(promise: Promise<T>): Promise<T> {
  await vi.runAllTimersAsync()
  return promise
}

beforeEach(() => {
  vi.useFakeTimers()
  fetchMock.mockReset()
  vi.stubGlobal('fetch', fetchMock)
  vi.mocked(fetchAuthSession).mockResolvedValue({
    tokens: { idToken: { toString: () => 'TEST_TOKEN' } },
  } as any)
  AuthStore().Cognito = { userId: 'user-1', username: 'tester' }
})

afterEach(() => {
  vi.useRealTimers()
})

describe('getHeaders', () => {
  it('adds the id token when signed in', async () => {
    expect((await getHeaders()).Authorization).toBe('TEST_TOKEN')
  })

  it('sends only the base headers without a session', async () => {
    vi.mocked(fetchAuthSession).mockRejectedValue(new Error('TEST'))
    expect((await getHeaders()).Authorization).toBeUndefined()
  })
})

describe('request retries', () => {
  it('retries a server error, then succeeds', async () => {
    fetchMock.mockResolvedValueOnce(json({}, 500)).mockResolvedValueOnce(json({ ok: 1 }))
    expect(await settle(batchUpsert([]))).toEqual({ ok: 1 })
    expect(fetchMock).toHaveBeenCalledTimes(2)
  })

  it('waits out a rate limit, then succeeds', async () => {
    fetchMock
      .mockResolvedValueOnce(json({}, 429, { 'Retry-After': '2' }))
      .mockResolvedValueOnce(json({ ok: 1 }))
    expect(await settle(batchUpsert([]))).toEqual({ ok: 1 })
  })

  it('gives up on a persistent rate limit', async () => {
    fetchMock.mockImplementation(async () => json({ error: 'RateLimitExceeded' }, 429))
    const result = expect(batchUpsert([])).rejects.toMatchObject({ isDaily: true })
    await vi.runAllTimersAsync()
    await result
    expect(fetchMock).toHaveBeenCalledTimes(3)
  })

  it('does not retry a bad request or a missing resource', async () => {
    fetchMock.mockResolvedValueOnce(json({ message: 'TEST' }, 400))
    await expect(batchUpsert([])).rejects.toBeInstanceOf(BadRequestError)
    fetchMock.mockResolvedValueOnce(json({ message: 'TEST' }, 404))
    await expect(batchUpsert([])).rejects.toBeInstanceOf(NotFoundError)
    expect(fetchMock).toHaveBeenCalledTimes(2)
  })

  it('refreshes the token once on 401', async () => {
    fetchMock.mockResolvedValueOnce(json({}, 401)).mockResolvedValueOnce(json({ ok: 1 }))
    expect(await batchUpsert([])).toEqual({ ok: 1 })
    expect(fetchAuthSession).toHaveBeenLastCalledWith({ forceRefresh: true })
  })

  it('fails on a second 401', async () => {
    fetchMock.mockImplementation(async () => json({ message: 'TEST' }, 401))
    await expect(batchUpsert([])).rejects.toBeInstanceOf(UnauthorizedError)
    expect(fetchMock).toHaveBeenCalledTimes(2)
  })

  it('aborts a request that hangs', async () => {
    fetchMock.mockImplementation(
      (_url: string, init: RequestInit) =>
        new Promise((_, reject) =>
          init.signal!.addEventListener('abort', () =>
            reject(Object.assign(new Error('aborted'), { name: 'AbortError' }))
          )
        )
    )
    const result = expect(batchUpsert([])).rejects.toThrow('timed out after 30000ms')
    await vi.runAllTimersAsync()
    await result
  })

  it('treats a rate limit without a JSON body as short-term', async () => {
    fetchMock.mockImplementation(async () => new Response('busy', { status: 429 }))
    const result = expect(batchUpsert([])).rejects.toMatchObject({ isDaily: false })
    await vi.runAllTimersAsync()
    await result
  })

  it('retries network errors and reports the last one', async () => {
    fetchMock.mockRejectedValue(Object.assign(new Error('TEST'), { name: 'AbortError' }))
    const result = expect(batchUpsert([])).rejects.toThrow('timed out')
    await vi.runAllTimersAsync()
    await result
    expect(fetchMock).toHaveBeenCalledTimes(3)
  })

  it('fails after retrying another client error', async () => {
    fetchMock.mockImplementation(async () => json({}, 403))
    const result = expect(batchUpsert([])).rejects.toThrow('status: 403')
    await vi.runAllTimersAsync()
    await result
  })
})

describe('user endpoints', () => {
  it('posts item metadata under the signed-in user', async () => {
    fetchMock.mockResolvedValue(json({ data: { updated: 1 } }))
    expect(await updateItem({ sortkey: 'TEST1' }, 'campaign')).toEqual({ data: { updated: 1 } })
    const { url, init } = call()
    expect(url.searchParams.get('user_id')).toBe('user-1')
    expect(url.searchParams.get('scope')).toBe('campaign')
    expect(init.body).toBe('{"sortkey":"TEST1"}')
    expect((init.headers as any).Authorization).toBe('TEST_TOKEN')
  })

  it('passes pre-serialized metadata through', async () => {
    fetchMock.mockResolvedValue(json({}))
    await updateItem('{"sortkey":"TEST1"}')
    expect(call().init.body).toBe('{"sortkey":"TEST1"}')
  })

  it('returns presigns and rejects an error body', async () => {
    fetchMock.mockResolvedValueOnce(json({ presigns: { u: 'p' } }))
    expect(await getUploadPresigns(['u'])).toEqual({ u: 'p' })
    expect(JSON.parse(call().init.body as string)).toEqual({ uris: ['u'] })

    fetchMock.mockResolvedValueOnce(json({}))
    expect(await getUploadPresigns(['u'])).toEqual({})

    fetchMock.mockResolvedValueOnce(json({ error: 'Forbidden' }))
    await expect(getUploadPresigns(['u'])).rejects.toThrow('Forbidden')
  })

  it('asks for changes since a time', async () => {
    fetchMock.mockResolvedValue(json({ items: [], serverTime: 5 }))
    expect(await getUserDataChanged('user-1', 100)).toEqual({ items: [], serverTime: 5 })
    expect(call().url.searchParams.get('since')).toBe('100')
    expect(call().url.searchParams.get('scope')).toBe('changed')
  })

  it('reads user metadata and rejects an unauthorized body', async () => {
    fetchMock.mockResolvedValueOnce(json({ user_id: 'user-1' }))
    expect(await getUser('user-1')).toEqual({ user_id: 'user-1' })
    fetchMock.mockResolvedValueOnce(json({ error: 'Unauthorized', message: 'TEST' }))
    await expect(getUser('user-1')).rejects.toBeInstanceOf(UnauthorizedError)
  })

  it('reads all user data', async () => {
    fetchMock.mockResolvedValue(json([{ sortkey: 'TEST1' }]))
    expect(await getUserData('user-1')).toEqual([{ sortkey: 'TEST1' }])
    expect(call().url.searchParams.get('scope')).toBe('all')
  })

  it('patches fields on one item', async () => {
    fetchMock.mockResolvedValue(json({ ok: 1 }))
    await patchItem('TEST1', { name: 'Test' })
    expect(JSON.parse(call().init.body as string)).toEqual({ sortkey: 'TEST1', name: 'Test' })
  })

  it('posts user metadata', async () => {
    fetchMock.mockResolvedValue(json({}))
    expect((await updateUser('user-1', { a: 1 })).ok).toBe(true)
    expect(call().init.method).toBe('POST')
  })

  it('deletes one item, with its file when given', async () => {
    fetchMock.mockImplementation(async () => json({}))
    await cloudDelete('user-1', 'TEST1', 'user-1/a.json')
    await cloudDelete('user-1', 'TEST2')
    expect(call(0).url.searchParams.get('uri')).toBe('user-1/a.json')
    expect(call(1).url.searchParams.has('uri')).toBe(false)
  })

  it('bulk deletes, sending files only when given', async () => {
    fetchMock.mockImplementation(async () => json({ unprocessed: 0 }))
    await bulkDelete('user-1', ['TEST1'], ['u'])
    await bulkDelete('user-1', ['TEST2'], [])
    expect(JSON.parse(call(0).init.body as string)).toEqual({ sortkeys: ['TEST1'], uris: ['u'] })
    expect(JSON.parse(call(1).init.body as string)).toEqual({ sortkeys: ['TEST2'] })
  })

  it('redeems a keycode and fetches an achievement', async () => {
    fetchMock.mockImplementation(async () => json({ granted: ['TEST'] }))
    expect(await redeemKeycode('user-1', 'KEY')).toEqual({ granted: ['TEST'] })
    expect(await GetAchievement('TEST')).toEqual({ granted: ['TEST'] })
  })
})

describe('share codes', () => {
  it('looks codes up without the auth token', async () => {
    fetchMock.mockImplementation(async () => json([]))
    await GetFromCode(['TEST1', 'TEST2'])
    await GetFromCode('TEST1')
    expect(call(0).url.searchParams.get('scope')).toBe('items')
    expect(call(1).url.searchParams.get('codes')).toBe('["TEST1"]')
    expect((call(0).init.headers as any).Authorization).toBeUndefined()
  })

  it('downloads a shared item and strips its share fields', async () => {
    fetchMock
      .mockResolvedValueOnce(json({ uri: 'author-1/a.json' }))
      .mockResolvedValueOnce(json({ id: 'TEST1', save: { remote_code: 'X', lastModified: 1 } }))
    expect(await DownloadViaCode('TEST1')).toEqual({ id: 'TEST1', save: { lastModified: 1 } })
    expect((call(0).init.headers as any).Authorization).toBeUndefined()
    expect(String(fetchMock.mock.calls[1][0])).toBe('https://data.test/author-1/a.json')
  })

  it('sends the auth token for a shared item when signed in', async () => {
    AuthStore().IsLoggedIn = true
    fetchMock
      .mockResolvedValueOnce(json({ uri: 'author-1/a.json' }))
      .mockResolvedValueOnce(json({ id: 'TEST1' }))
    await DownloadViaCode('TEST1')
    expect((call(0).init.headers as any).Authorization).toBe('TEST_TOKEN')
  })
})

describe('uploadToS3', () => {
  it('puts the item as JSON without inline cloud data', async () => {
    fetchMock.mockResolvedValue(new Response(null, { status: 200 }))
    const data = { id: 'TEST1', cloud: { cloud_data: 'x', _ts: {} } }
    expect(await uploadToS3(data, 'https://s3.test/put')).toBe(true)
    expect(call().init.body).toBe('{"id":"TEST1","cloud":{"_ts":{}}}')
  })

  it('sends a pre-serialized body as is', async () => {
    fetchMock.mockResolvedValue(new Response(null, { status: 200 }))
    await uploadToS3('{"a":1}', 'https://s3.test/put')
    expect(call().init.body).toBe('{"a":1}')
  })

  it('reports an expired presign', async () => {
    fetchMock.mockResolvedValue(new Response(null, { status: 403 }))
    await expect(uploadToS3({}, 'https://s3.test/put')).rejects.toBeInstanceOf(PresignExpiredError)
  })

  it('returns false on another failure', async () => {
    fetchMock.mockResolvedValue(new Response(null, { status: 500 }))
    expect(await uploadToS3({}, 'https://s3.test/put')).toBe(false)
  })

  it('wraps a network error', async () => {
    fetchMock.mockRejectedValue(new Error('TEST'))
    await expect(uploadToS3({}, 'https://s3.test/put')).rejects.toThrow('HTTP error')
  })
})

describe('downloadFromS3', () => {
  beforeEach(() => {
    for (let i = 0; i < 120; i++) invalidateETagCache(`user-1/${i}.json`)
    invalidateETagCache('user-1/a.json')
  })

  it('requires a url', async () => {
    await expect(downloadFromS3('')).rejects.toThrow('missing url')
  })

  it('serves a 304 from the ETag cache', async () => {
    fetchMock
      .mockResolvedValueOnce(json({ v: 1 }, 200, { ETag: '"e1"' }))
      .mockResolvedValueOnce(new Response(null, { status: 304 }))
    expect(await downloadFromS3('user-1/a.json')).toEqual({ v: 1 })
    expect(await downloadFromS3('user-1/a.json')).toEqual({ v: 1 })
    expect((call(1).init.headers as any)['If-None-Match']).toBe('"e1"')
  })

  it('drops the cached copy when invalidated', async () => {
    fetchMock.mockImplementation(async () => json({ v: 1 }, 200, { ETag: '"e1"' }))
    await downloadFromS3('user-1/a.json')
    invalidateETagCache('user-1/a.json')
    await downloadFromS3('user-1/a.json')
    expect((call(1).init.headers as any)['If-None-Match']).toBeUndefined()
  })

  it('evicts the oldest entry past the cache limit', async () => {
    fetchMock.mockImplementation(async () => json({ v: 1 }, 200, { ETag: '"e"' }))
    for (let i = 0; i <= 100; i++) await downloadFromS3(`user-1/${i}.json`)
    fetchMock.mockClear()
    await downloadFromS3('user-1/0.json')
    await downloadFromS3('user-1/100.json')
    expect((call(0).init.headers as any)['If-None-Match']).toBeUndefined()
    expect((call(1).init.headers as any)['If-None-Match']).toBe('"e"')
  })

  it('throws on a failed download', async () => {
    fetchMock.mockResolvedValue(new Response(null, { status: 404 }))
    await expect(downloadFromS3('user-1/a.json')).rejects.toThrow('Download failed: 404')
  })
})

describe('getFromPresignDirect', () => {
  it('returns the file as a blob', async () => {
    fetchMock.mockResolvedValue(new Response('x'))
    expect(await (await getFromPresignDirect('https://s3.test/get')).text()).toBe('x')
  })

  it('throws on a failed download', async () => {
    fetchMock.mockResolvedValue(new Response(null, { status: 500 }))
    await expect(getFromPresignDirect('https://s3.test/get')).rejects.toThrow('Download failed')
  })
})
