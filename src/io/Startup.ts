import { SetTheme } from '@/classes/utility/ThemeManager';
import { INpcData, PilotData } from '@/interface';
import {
  CompendiumStore,
  PilotStore,
  NpcStore,
  UserStore,
  // NarrativeStore,
  // NarrativeStore,
  // NarrativeStore,
} from '@/stores';
// import { Auth } from '@aws-amplify/auth';

import { Initialize, SetItem, GetItem, RemoveItem } from './Storage';

export default async function (): Promise<void> {
  await Initialize();

  navigator.storage.estimate().then((res) => console.log(res));

  // Auth.currentAuthenticatedUser()
  //   .then((cognitoUser) => {
  //     userstore.setAws({ cognitoUser }).then(() => {
  //       if (vuetify) SetTheme(userstore.UserProfile.Theme, vuetify.framework);
  //     });
  //   })
  //   .catch(() => {
  //     userstore.loadUser().then(() => {
  //       if (vuetify) SetTheme(userstore.UserProfile.Theme, vuetify.framework);
  //     });
  //   });

  await UserStore().loadUser();

  await CompendiumStore().refreshExtraContent();
  const missing = { pilots: [] as PilotData[], npcs: [] as INpcData[] };
  await PilotStore().LoadPilots();
  console.log('pilots loaded');
  // missing.pilots = PilotStore().MissingPilots;
  await NpcStore().LoadNpcs();
  // missing.npcs = NpcStore().MissingNpcs;
  CompendiumStore().setMissingContent(missing);

  // await NarrativeStore.loadCharacters();
  // await NarrativeStore.loadLocations();
  // await NarrativeStore.loadFactions();

  console.info('loading complete');
}
