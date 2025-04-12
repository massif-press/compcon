import {
  NavStore,
  CompendiumStore,
  PilotStore,
  NpcStore,
  UserStore,
  NarrativeStore,
  EncounterStore,
  CampaignStore,
} from '@/stores';
import { collectionDataQuery, getLcpPresigned } from '@/user/api';

import { Initialize } from './Storage';
import { AchievementManager } from '@/user/achievements/AchievementManager';
import logger from '@/user/logger';

export default async function (skipSync = false): Promise<void> {
  UserStore().IsLoading = true;
  await Initialize();

  navigator.storage
    .estimate()
    .then((res) => logger.info(`Storage estimate: ${res.usage} / ${res.quota}`));

  logger.info('loading user');
  await UserStore().loadUser();

  logger.info('refreshing extra content');
  await CompendiumStore().refreshExtraContent();
  logger.info('extra content refreshed');

  await PilotStore().LoadPilots();
  logger.info('pilots loaded');
  await NpcStore().LoadNpcs();
  logger.info('npcs loaded');

  await NarrativeStore().LoadCollectionItems();
  logger.info('narrative collection items loaded');

  await EncounterStore().LoadEncounters();
  logger.info('encounters loaded');

  await CampaignStore().LoadCampaigns();
  logger.info('campaigns loaded');

  logger.info('removing old data');
  const results = await UserStore().removeOldItems();

  await NavStore().CreateIndex();

  if (UserStore().Cognito.userId) {
    UserStore().IsSyncing = true;
    try {
      await UserStore().AutoSync(undefined, true, skipSync);
      await UserStore().getRemoteCollectionMetadata(true);
      if (UserStore().UserMetadata.CollectionSubscriptionSettings.updateOn === 'startup') {
        logger.info('Auto updating remote collections');
        UserStore().updateAllRemoteCollections();
        logger.info('Auto update complete!');
      }
      logger.info('Auto sync complete!');
    } catch (error: any) {
      logger.error(`Failed to sync: ${error}`);
      return;
    }

    logger.info('checking auto backups');
    try {
      await UserStore().PruneBackups();
      await UserStore().AutoBackup();
    } catch (error: any) {
      logger.error(`Failed to backup: ${error}`);
      return;
    }

    try {
      const patreonStatus = await UserStore().refreshPatreonData();
      if (patreonStatus === 'success') {
        logger.info('Patreon data refreshed');
      } else {
        logger.error('Failed to refresh Patreon data');
      }
    } catch (error: any) {
      logger.error(`Failed to refresh Patreon data: ${error}`);
    }

    const subscribedLcps = UserStore().User.LcpSubscriptions;
    if (subscribedLcps.length > 0) {
      const remoteLcps = await collectionDataQuery('lcp');
      for (const lcp of remoteLcps) {
        if (!subscribedLcps.includes(lcp.sortkey)) continue;
        const installedPack = CompendiumStore().ContentPacks.find(
          (p) => p.Manifest.name === lcp.name || p.Manifest.name === lcp.title
        );
        if (!installedPack || installedPack.Manifest.version < lcp.version) {
          try {
            await UserStore().downloadLcp(lcp);
            UserStore().addCloudNotification(`Updated ${lcp.name} to ${lcp.version}.`);
          } catch (error: any) {
            logger.error('Failed to download lcp:', lcp.name);
            UserStore().addCloudNotification(`Failed to download ${lcp.name}!`, 'error');
            logger.error(`Error downloading LCP: ${error}`);
          }
        }
      }
    }

    CompendiumStore().loadContentCollections();
    UserStore().setSyncTimer();
    UserStore().IsSyncing = false;
  }

  AchievementManager.Instantiate();

  UserStore().IsLoading = false;
}
