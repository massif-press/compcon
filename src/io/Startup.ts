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

import { Initialize, SetItem, GetItem, RemoveItem } from './Storage';
import { AchievementManager } from '@/user/achievements/AchievementManager';
import { AchievementEventSystem } from '@/user/achievements/AchievementEvent';

export default async function (skipSync = false): Promise<void> {
  UserStore().IsLoading = true;
  await Initialize();

  navigator.storage.estimate().then((res) => console.log(res));

  console.log('loading user');
  await UserStore().loadUser();

  console.log('refreshing extra content');
  await CompendiumStore().refreshExtraContent();
  console.log('extra content refreshed');

  await PilotStore().LoadPilots();
  console.log('pilots loaded');
  await NpcStore().LoadNpcs();
  console.log('npcs loaded');

  await NarrativeStore().LoadCollectionItems();
  console.log('narrative collection items loaded');

  await EncounterStore().LoadEncounters();
  console.log('encounters loaded');

  await CampaignStore().LoadCampaigns();
  console.log('campaigns loaded');

  console.log('removing old data');
  const results = await UserStore().removeOldItems();
  console.info(results);

  await NavStore().CreateIndex();

  if (UserStore().Cognito.userId) {
    UserStore().IsSyncing = true;
    try {
      await UserStore().AutoSync(undefined, true, skipSync);
      await UserStore().getRemoteCollectionMetadata(true);
      if (UserStore().UserMetadata.CollectionSubscriptionSettings.updateOn === 'startup') {
        console.info('Auto updating remote collections');
        UserStore().updateAllRemoteCollections();
        console.info('Auto update complete!');
      }
      console.info('Auto sync complete!');
    } catch (error: any) {
      console.error('Failed to sync');
      console.error(error);
      return;
    }

    console.info('checking auto backups');
    try {
      await UserStore().PruneBackups();
      await UserStore().AutoBackup();
    } catch (error: any) {
      console.error('Failed to backup');
      console.error(error);
      return;
    }

    try {
      const patreonStatus = await UserStore().refreshPatreonData();
      if (patreonStatus === 'success') {
        console.info('Patreon data refreshed');
      } else {
        console.error('Failed to refresh Patreon data');
      }
    } catch (error: any) {
      console.error('Failed to refresh Patreon data');
      console.error(error);
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
            console.error('Failed to download lcp:', lcp.name);
            UserStore().addCloudNotification(`Failed to download ${lcp.name}!`, 'error');
            console.error(error);
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
