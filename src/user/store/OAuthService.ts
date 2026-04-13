import { getPatronProfile, authItch } from '@/user/oauth'
import logger from '@/user/logger'

export interface OAuthContext {
  UserMetadata: {
    PatreonData: any
    ItchData: any
  }
  setUserMetadata: () => Promise<void>
}

export class NoPatreonTierError extends Error {
  constructor() {
    super('Patreon account linked but no active subscription tier found')
    this.name = 'NoPatreonTierError'
  }
}

const PATREON_REFRESH_INTERVAL_MS = 24 * 60 * 60 * 1000 // 24 hours

export async function setPatreonData(ctx: OAuthContext, data: any): Promise<void> {
  const profile = await getPatronProfile(data.access_token)
  if (!profile.tierData) {
    ctx.UserMetadata.PatreonData = { hasPatreon: false }
    ctx.setUserMetadata()
    throw new NoPatreonTierError()
  }
  ctx.UserMetadata.PatreonData.token = data
  ctx.UserMetadata.PatreonData.profile = profile
  ctx.UserMetadata.PatreonData.hasPatreon = true
  ctx.UserMetadata.PatreonData.lastUpdate = Date.now()
  ctx.setUserMetadata()
}

export async function refreshPatreonData(ctx: OAuthContext): Promise<string> {
  if (!ctx.UserMetadata.PatreonData.token) return ''
  const lastUpdate = ctx.UserMetadata.PatreonData.lastUpdate
  if (lastUpdate && Date.now() - lastUpdate < PATREON_REFRESH_INTERVAL_MS) return 'skipped'
  try {
    await setPatreonData(ctx, ctx.UserMetadata.PatreonData.token)
    return 'success'
  } catch (err) {
    logger.error('OAuthService: Error refreshing Patreon data:', err)
    ctx.UserMetadata.PatreonData = { hasPatreon: false }
    ctx.setUserMetadata()
    return 'error'
  }
}

export function setItchData(ctx: OAuthContext, accessToken: string, data: any): void {
  if (!data || !accessToken) {
    ctx.UserMetadata.ItchData = { hasItch: false, user: { id: 1 }, gamedata: [] }
    ctx.setUserMetadata()
    return
  }
  ctx.UserMetadata.ItchData = data
  ctx.UserMetadata.ItchData.hasItch = true
  ctx.UserMetadata.ItchData.token = accessToken
  ctx.UserMetadata.ItchData.lastUpdate = Date.now()
  ctx.setUserMetadata()
}

export async function refreshItchData(ctx: OAuthContext): Promise<string> {
  try {
    if (!ctx.UserMetadata.ItchData.token) throw new Error('No itch.io token found')
    const data = await authItch(ctx.UserMetadata.ItchData.token)
    setItchData(ctx, ctx.UserMetadata.ItchData.token, data)
    return 'success'
  } catch (err) {
    logger.error('OAuthService: Error refreshing Itch data:', err)
    ctx.UserMetadata.ItchData = { hasItch: false, user: { id: 1 }, gamedata: [] }
    ctx.setUserMetadata()
    return 'error'
  }
}
