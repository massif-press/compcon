import { getPatronProfile, authItch } from '@/user/oauth'
import logger from '@/user/logger'

export interface OAuthContext {
  UserMetadata: {
    PatreonData: any
    ItchData: any
  }
  setUserMetadata: () => Promise<void>
}

export async function setPatreonData(ctx: OAuthContext, data: any): Promise<void> {
  ctx.UserMetadata.PatreonData.token = data
  const profile = await getPatronProfile(data.access_token)
  ctx.UserMetadata.PatreonData.profile = profile
  ctx.UserMetadata.PatreonData.hasPatreon = true
  ctx.setUserMetadata()
}

export async function refreshPatreonData(ctx: OAuthContext): Promise<string> {
  if (!ctx.UserMetadata.PatreonData.token) return ''
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
