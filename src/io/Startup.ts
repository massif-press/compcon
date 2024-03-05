// import { SetTheme } from '@/classes/utility/ThemeManager';
// import { NpcData, PilotData } from '@/interface';
import { CompendiumStore, PilotStore, NpcStore, UserStore, NarrativeStore } from '@/stores';
// import { Auth } from '@aws-amplify/auth';
import { getLcpPresigned } from '@/user/api';

import { Initialize, SetItem, GetItem, RemoveItem } from './Storage';

// TODO: remove when finished exhibiting npcs
import { parseContentPack } from '@/io/ContentPackParser';

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

  // TODO: remove when finished exhibiting npcs
  // sideload start
  if (CompendiumStore().ContentPacks.some((x) => x.Name === 'Lancer CORE NPCs')) {
    console.log('core NPCs loaded already');
  } else {
    const npcExhibitionData = await getLcpPresigned('lancer-npc-data.lcp');
    const npcData = npcExhibitionData.data.data;
    const uint8Array = new Uint8Array(npcData);

    let binaryString = '';
    uint8Array.forEach((byte) => {
      binaryString += String.fromCharCode(byte);
    });

    const contentPack = await parseContentPack(binaryString as string);
    contentPack.active = true;
    await CompendiumStore().installContentPack(contentPack);

    console.info('core NPCs loaded');
  }

  if (CompendiumStore().ContentPacks.some((x) => x.Name === 'No Room for a Wallflower NPCs')) {
    console.log('eidolon test loaded already');
  } else {
    const npcExhibitionData = await getLcpPresigned('eidolon_test.lcp');
    const npcData = npcExhibitionData.data.data;
    const uint8Array = new Uint8Array(npcData);

    let binaryString = '';
    uint8Array.forEach((byte) => {
      binaryString += String.fromCharCode(byte);
    });

    const contentPack = await parseContentPack(binaryString as string);
    contentPack.active = true;
    await CompendiumStore().installContentPack(contentPack);

    console.info('Eidolon test loaded');
  }
  // sideload end

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
