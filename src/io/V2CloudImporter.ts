import { fetchAuthSession } from 'aws-amplify/auth'
import { getHeaders } from '@/io/apis/account'
import { processFullBackup } from '@/io/FullImporter'
import { UserStore } from '@/stores'

const API_BASE = (import.meta as any).env.VITE_APP_INVOKE_URL as string

export type V2CloudDetectResult = {
  hasV2Data: boolean
  itemCount: number
  pilots: number
  npcs: number
  encounters: number
}

export type V2CloudMigrationResult = {
  status: 'complete' | 'error' | 'empty'
  pilotsImported?: number
  pilotsBackedUp?: number
  npcsImported?: number
  npcsBackedUp?: number
  encountersImported?: number
  encountersBackedUp?: number
  lcpsImported?: number
  errors?: string[]
}

export async function getCognitoIdentityId(): Promise<string> {
  const session = await fetchAuthSession()
  if (!session.identityId) throw new Error('Could not resolve Cognito Identity ID')
  return session.identityId
}

export async function checkV2CloudData(userId: string): Promise<V2CloudDetectResult> {
  const [headers, identityId] = await Promise.all([getHeaders(), getCognitoIdentityId()])
  const url = `${API_BASE}/v2migration?user_id=${encodeURIComponent(userId)}&identity_id=${encodeURIComponent(identityId)}`
  const res = await fetch(url, { headers })
  if (!res.ok) throw new Error(`V2 detection failed: ${res.status}`)
  const json = await res.json()
  return json as V2CloudDetectResult
}

export async function downloadV2CloudData(
  userId: string
): Promise<Array<{ filename: string; data: string | null }>> {
  const headers = await getHeaders()
  const res = await fetch(`${API_BASE}/v2migration?user_id=${encodeURIComponent(userId)}`, {
    method: 'POST',
    headers,
  })
  if (!res.ok) throw new Error(`V2 download failed: ${res.status}`)
  const { backup } = await res.json()
  return backup || []
}

export async function runV2CloudMigration(userId: string): Promise<V2CloudMigrationResult> {
  try {
    const backup = await downloadV2CloudData(userId)

    if (!backup || backup.length === 0) {
      return { status: 'empty' }
    }

    const result = await processFullBackup(backup)
    return { status: result.errors?.length ? 'error' : 'complete', ...result }
  } catch (err) {
    console.error('V2 cloud migration error:', err)
    return { status: 'error', errors: [String(err)] }
  }
}
