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
import { getLcpPresigned } from '@/user/api';

import { Initialize, SetItem, GetItem, RemoveItem } from './Storage';

// TODO: remove when finished exhibiting npcs
import { parseContentPack } from '@/io/ContentPackParser';

export default async function (skipSync = false): Promise<void> {
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

    CompendiumStore().loadContentCollections();
    UserStore().User.setLcpSubscriptionData();
    UserStore().setSyncTimer();
    UserStore().IsSyncing = false;
  }

  console.info('loading complete');
}
