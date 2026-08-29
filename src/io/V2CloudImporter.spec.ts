import { describe, it, expect, beforeEach, vi } from 'vitest'

vi.mock('aws-amplify/auth', () => ({
  fetchAuthSession: vi.fn(async () => ({ identityId: 'identity-1' })),
}))

vi.mock('@/io/apis/account', () => ({
  getHeaders: vi.fn(async () => ({ Authorization: 'token' })),
}))

vi.mock('@/io/FullImporter', () => ({
  processFullBackup: vi.fn(async () => ({
    pilotsImported: 2,
    pilotsBackedUp: 0,
    npcsImported: 0,
    npcsBackedUp: 0,
    encountersImported: 0,
    encountersBackedUp: 0,
    lcpsImported: 0,
    errors: [],
  })),
}))

import {
  getCognitoIdentityId,
  checkV2CloudData,
  downloadV2CloudData,
  runV2CloudMigration,
} from './V2CloudImporter'
import { fetchAuthSession } from 'aws-amplify/auth'
import { processFullBackup } from './FullImporter'

const okResponse = (body: unknown) => ({ ok: true, status: 200, json: async () => body })
const failResponse = (status: number) => ({ ok: false, status, json: async () => ({}) })

beforeEach(() => {
  vi.mocked(fetchAuthSession).mockResolvedValue({ identityId: 'identity-1' } as never)
  vi.mocked(processFullBackup).mockClear()
})

describe('getCognitoIdentityId', () => {
  it('returns the identity id from the session', async () => {
    expect(await getCognitoIdentityId()).toBe('identity-1')
  })

  it('throws when the session has no identity', async () => {
    vi.mocked(fetchAuthSession).mockResolvedValue({} as never)
    await expect(getCognitoIdentityId()).rejects.toThrow('Could not resolve Cognito Identity ID')
  })
})

describe('checkV2CloudData', () => {
  it('sends both ids and returns the detection payload', async () => {
    const fetchMock = vi.fn(async () => okResponse({ hasV2Data: true, itemCount: 3 }))
    vi.stubGlobal('fetch', fetchMock)

    expect(await checkV2CloudData('user 1')).toEqual({ hasV2Data: true, itemCount: 3 })

    const [url, init] = fetchMock.mock.calls[0] as unknown as [string, RequestInit]
    expect(url).toContain('user_id=user%201')
    expect(url).toContain('identity_id=identity-1')
    expect(init.headers).toEqual({ Authorization: 'token' })
  })

  it('throws on a failed response', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => failResponse(403))
    )
    await expect(checkV2CloudData('user-1')).rejects.toThrow('V2 detection failed: 403')
  })
})

describe('downloadV2CloudData', () => {
  it('posts and unwraps the backup', async () => {
    const fetchMock = vi.fn(async () => okResponse({ backup: [{ filename: 'pilots_v2.json' }] }))
    vi.stubGlobal('fetch', fetchMock)

    expect(await downloadV2CloudData('user-1')).toEqual([{ filename: 'pilots_v2.json' }])
    const [, init] = fetchMock.mock.calls[0] as unknown as [string, RequestInit]
    expect(init.method).toBe('POST')
  })

  it('is an empty list when the response carries no backup', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => okResponse({}))
    )
    expect(await downloadV2CloudData('user-1')).toEqual([])
  })

  it('throws on a failed response', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => failResponse(500))
    )
    await expect(downloadV2CloudData('user-1')).rejects.toThrow('V2 download failed: 500')
  })
})

describe('runV2CloudMigration', () => {
  it('reports empty without running an import', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => okResponse({ backup: [] }))
    )

    expect(await runV2CloudMigration('user-1')).toEqual({ status: 'empty' })
    expect(processFullBackup).not.toHaveBeenCalled()
  })

  it('reports complete and passes the counts through', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => okResponse({ backup: [{ filename: 'x' }] }))
    )

    const result = await runV2CloudMigration('user-1')
    expect(result.status).toBe('complete')
    expect(result.pilotsImported).toBe(2)
  })

  it('reports error when the import collected errors', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => okResponse({ backup: [{ filename: 'x' }] }))
    )
    vi.mocked(processFullBackup).mockResolvedValueOnce({
      pilotsImported: 0,
      pilotsBackedUp: 0,
      npcsImported: 0,
      npcsBackedUp: 0,
      encountersImported: 0,
      encountersBackedUp: 0,
      lcpsImported: 0,
      errors: ['Pilot X failed'],
    })

    const result = await runV2CloudMigration('user-1')
    expect(result.status).toBe('error')
    expect(result.errors).toEqual(['Pilot X failed'])
  })

  it('turns a network failure into an error result rather than throwing', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => failResponse(500))
    )

    const result = await runV2CloudMigration('user-1')
    expect(result.status).toBe('error')
    expect(result.errors?.[0]).toContain('V2 download failed: 500')
  })
})
