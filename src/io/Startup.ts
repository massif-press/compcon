// import { SetTheme } from '@/classes/utility/ThemeManager';
// import { NpcData, PilotData } from '@/interface';
import { CompendiumStore, PilotStore, NpcStore, UserStore, NarrativeStore } from '@/stores';
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
  // const missing = { pilots: [] as PilotData[], npcs: [] as NpcData[] };
  await PilotStore().LoadPilots();
  console.log('pilots loaded');
  // missing.pilots = PilotStore().MissingPilots;
  await NpcStore().LoadNpcs();
  console.log('npcs loaded');
  // missing.npcs = NpcStore().MissingNpcs;
  // CompendiumStore().setMissingContent(missing);

  console.log(NarrativeStore());

  await NarrativeStore().LoadCollectionItems();

  console.info('loading complete');
}
