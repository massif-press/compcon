import {
  NavStore,
  CompendiumStore,
  ContentCollectionStore,
  PilotStore,
  NpcStore,
  UserStore,
  NarrativeStore,
  EncounterStore,
  CampaignStore,
} from '@/stores'
import { collectionDataQuery } from '@/user/api'
import { lt, coerce } from 'semver'

import { Initialize } from './Storage'
import { AchievementManager } from '@/user/achievements/AchievementManager'
import { UnauthorizedError } from '@/io/apis/account'
import logger from '@/user/logger'
import { migrateV2LocalStorage } from './FullImporter'

export default async function (skipSync = false): Promise<void> {
  UserStore().IsLoading = true
  await Initialize()

  navigator.storage
    .estimate()
    .then(res => logger.info(`Storage estimate: ${res.usage} / ${res.quota}`))

  logger.info('loading user')
  await UserStore().loadUser()

  let migrationResult: any = null
  await Promise.all([
    UserStore().IsLoggedIn
      ? UserStore()
          .getUserMetadata(true)
          .catch((error: any) => {
            if (error instanceof UnauthorizedError) {
              logger.warn('Authentication expired during metadata fetch, continuing offline')
            } else {
              logger.warn(`Failed to load cloud user metadata: ${error}`)
            }
          })
      : Promise.resolve(),
    migrateV2LocalStorage().then(r => {
      migrationResult = r
    }),
  ])

  if (migrationResult) {
    logger.info('v2 localStorage migration complete', migrationResult)
  }

  logger.info('refreshing extra content')
  await CompendiumStore().refreshExtraContent()
  logger.info('extra content refreshed')

  logger.info('loading user data...')
  await Promise.all([
    PilotStore().LoadPilots(),
    NpcStore().LoadNpcs(),
    NarrativeStore().LoadCollectionItems(),
    EncounterStore().LoadEncounters(),
    CampaignStore().LoadCampaigns(),
  ])
  logger.info('data loaded')

  await Promise.all([
    UserStore().removeOldItems(),
    NavStore().CreateIndex(),
    UserStore().refreshV2BackupIds(),
  ])

  if (UserStore().IsLoggedIn) {
    try {
      await UserStore().AutoSync(undefined, true, skipSync)
      await UserStore().getRemoteCollectionMetadata(true)
      if (UserStore().UserMetadata.CollectionSubscriptionSettings.updateOn === 'startup') {
        logger.info('Auto updating remote collections')
        UserStore().updateAllRemoteCollections()
        logger.info('Auto update complete!')
      }
      logger.info('Auto sync complete!')
    } catch (error: any) {
      if (error instanceof UnauthorizedError) {
        logger.warn('Authentication expired during startup sync, continuing offline')
      } else {
        logger.error(`Failed to sync: ${error}`, {}, error)
      }
    }

    if (UserStore().IsLoggedIn) {
      UserStore()
        .checkV2CloudMigration()
        .catch((e: any) => logger.warn('V2 migration check skipped:', e))

      UserStore()
        .PruneBackups()
        .then(() => UserStore().AutoBackup())
        .catch((error: any) => logger.error(`Failed to backup: ${error}`, {}, error))

      UserStore()
        .refreshPatreonData()
        .then(status => {
          if (status === 'success') logger.info('Patreon data refreshed')
        })
        .catch((error: any) => logger.error(`Failed to refresh Patreon data: ${error}`, {}, error))

      const subscribedLcps = UserStore().User.LcpSubscriptions
      if (subscribedLcps.length > 0) {
        try {
          const remoteLcps = await collectionDataQuery()
          for (const lcp of remoteLcps) {
            if (!subscribedLcps.includes(lcp.sortkey)) continue

            const installedPack = CompendiumStore().ContentPacks.find(
              p => p.Manifest.name === lcp.name || p.Manifest.name === lcp.title
            )
            if (!installedPack || lt(coerce(installedPack.Manifest.version), coerce(lcp.version))) {
              try {
                await UserStore().downloadLcp(lcp)
                UserStore().addCloudNotification(`Updated ${lcp.name} to ${lcp.version}.`)
              } catch (error: any) {
                logger.error('Failed to download lcp:', lcp.name, error)
                UserStore().addCloudNotification(`Failed to download ${lcp.name}!`, 'error')
                logger.error(`Error downloading LCP: ${error}`, {}, error)
              }
            }
          }
        } catch (error: any) {
          logger.error(`Failed to fetch LCP catalog: ${error}`, {}, error)
          UserStore().addCloudNotification(
            'Failed to check for LCP updates. Check your connection.',
            'warning'
          )
        }
      }

      ContentCollectionStore().loadContentCollections()
      UserStore().setSyncTimer()
      window.addEventListener('pagehide', () => UserStore().OnUnload())
    }
  }

  AchievementManager.Instantiate()

  UserStore().IsLoading = false
}
