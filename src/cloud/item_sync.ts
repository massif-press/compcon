// import { PilotStore, NpcStore } from '../stores';
// import { Auth, Storage } from 'aws-amplify';

// import { ICloudSyncable } from '@/classes/components';
// import {
//   CloudController,
//   CloudItemTypeMap,
// } from '@/classes/components/cloud/CloudController';
// import { Npc, Pilot } from '@/class';
// import { MissingItemIds } from '@/io/ContentEvaluator';
// import { SaveAllLocalUpdates } from '@/io/BulkData';

// const currentCognitoIdentity = async (): Promise<any> =>
//   Auth.currentUserCredentials()
//     .then((res) => res.identityId)
//     .catch(() => '');

// let CognitoIdentity;

// async function getCognitoIdentity() {
//   if (CognitoIdentity) return CognitoIdentity;
//   CognitoIdentity = await currentCognitoIdentity();
//   return CognitoIdentity;
// }

// const ListCloudItems = async (): Promise<any> => {
//   const id = await currentCognitoIdentity();
//   console.info(id);
//   return Storage.list('', { level: 'protected' })
//     .then((result) => {
//       console.log(result);
//       return result.filter((x) => !x.key.includes('s3-remove-flag'));
//     })
//     .catch((err) => console.error(err));
// };

// type CloudCollectionItem = {
//   key: string;
//   id: string;
//   itemType: CloudItemTypeMap;
//   name: string;
//   lastModifiedLocal: string;
//   lastModifiedCloud: string;
//   lastUploadCloud: string;
//   deleted: boolean;
//   delete_time: string;
//   latest: string;
//   selected: false;
//   missingContent: false;
//   remote: false;
// };

// function determineLatest(
//   cloudItem: CloudCollectionItem,
//   localItem: CloudCollectionItem
// ): string {
//   if (cloudItem.lastModifiedCloud === localItem.lastModifiedLocal)
//     return 'synced';
//   if (
//     Date.parse(cloudItem.lastModifiedCloud) >
//     Date.parse(localItem.lastModifiedLocal)
//   ) {
//     return 'cloud';
//   } else {
//     return 'local';
//   }
// }

// const ProcessItemsList = (cloudList): CloudCollectionItem[] => {
//   const localCollection = {
//     // npc: getModule(NpcStore, store).AllNpcs,
//     // pilot: getModule(PilotStore, store).AllPilots,
//   };

//   const missingIds = MissingItemIds();

//   const localMap = [];
//   Object.keys(localCollection).forEach((key: string) =>
//     localCollection[key].forEach((x: ICloudSyncable) =>
//       localMap.push({
//         key: x.CloudController.s3Key,
//         id: x.ID,
//         itemType: CloudItemTypeMap[key],
//         name: x.Name,
//         lastModifiedLocal: x.CloudController.LastUpdateLocal,
//         lastModifiedCloud: x.CloudController.LastUpdateCloud,
//         deleted: x.SaveController.IsDeleted,
//         delete_time: x.SaveController.ExpireTime,
//         missingContent: missingIds.includes(x.ID),
//         remote: x.CloudController.IsRemoteResource,
//       })
//     )
//   );

//   const output = cloudList.map((x: any) => {
//     {
//       const folderArr = x.key.split('/');
//       const nameArr = folderArr[1].split('--');
//       const name = nameArr[0];
//       const id = nameArr.length > 1 ? nameArr[1] : nameArr[0];
//       const deleted =
//         nameArr.length > 2 ? nameArr[2].toLowerCase() === 'deleted' : false;

//       return {
//         id,
//         key: x.key,
//         itemType: CloudItemTypeMap[folderArr[0]],
//         name,
//         lastUploadCloud: x.lastModified.toString(),
//         lastModifiedCloud: x.lastModified.toString(),
//         lastModifiedLocal: '',
//         latest: 'cloud',
//         deleted,
//         delete_time: '',
//         missingContent: missingIds.includes(id),
//         remote: false,
//       };
//     }
//   });

//   localMap.forEach((localItem: CloudCollectionItem) => {
//     let matchIndex = -1;
//     const match = output.find(
//       (cloudItem: CloudCollectionItem, index: number) => {
//         if (localItem.id === cloudItem.id || localItem.id === cloudItem.name) {
//           matchIndex = index;
//           return cloudItem;
//         }
//       }
//     );
//     if (!match || localItem.remote) {
//       output.push(localItem);
//     } else if (match && matchIndex > -1) {
//       output[matchIndex].name = localItem.name;
//       output[matchIndex].lastModifiedLocal = localItem.lastModifiedLocal;
//       // output[matchIndex].lastModifiedCloud = localItem.lastModifiedCloud
//       output[matchIndex].delete_time = localItem.delete_time;
//       // output[matchIndex].missingContent = localItem.missingContent
//       const latest = determineLatest(output[matchIndex], localItem);
//       if (latest === 'local') {
//         output[matchIndex].deleted = localItem.deleted;
//         output[matchIndex].delete_time = localItem.delete_time;
//         output[matchIndex].latest = 'local';
//       }
//     }
//   });

//   output.forEach((cloudItem: CloudCollectionItem) => {
//     const match = localMap.find(
//       (localItem: CloudCollectionItem) =>
//         localItem.id === cloudItem.id || localItem.id === cloudItem.name
//     );
//     if (match) {
//       cloudItem.lastModifiedLocal = match.lastModifiedLocal;
//     }
//   });

//   return output;
// };

// function GetLocalItem(item: CloudCollectionItem): any {
//   switch (item.itemType) {
//     case CloudItemTypeMap.npc:
//     // return getModule(NpcStore, store).Npcs.find((x) => x.ID === item.id);
//     case CloudItemTypeMap.pilot:
//     // return getModule(PilotStore, store).AllPilots.find(
//     //   (x) => x.ID === item.id
//     // );
//     default:
//       break;
//   }
// }

// function PermanentlyDeleteLocalItem(item: CloudCollectionItem): any {
//   switch (item.itemType) {
//     case CloudItemTypeMap.npc:
//       // const ns = getModule(NpcStore, store);
//       // ns.deleteNpcPermanent(ns.AllNpcs.find((x) => x.ID === item.id));
//       break;
//     case CloudItemTypeMap.pilot:
//       // const ps = getModule(PilotStore, store);
//       // ps.deletePilotPermanent(ps.AllPilots.find((x) => x.ID === item.id));
//       break;
//     default:
//       break;
//   }
// }

// // syncs a single item based on latest update
// const SyncItem = async (
//   item: CloudCollectionItem,
//   skipSave?: boolean
// ): Promise<any> => {
//   if (item.remote) return;
//   const localItem = GetLocalItem(item) as ICloudSyncable;
//   if (
//     !localItem ||
//     (localItem && !item.lastModifiedLocal && item.lastModifiedCloud) ||
//     Date.parse(item.lastModifiedCloud) > Date.parse(item.lastModifiedLocal)
//   ) {
//     await UpdateLocalFromCloud(item, localItem, skipSave);
//   } else {
//     await UpdateCloudFromLocal(item, localItem, skipSave);
//   }
// };

// const UpdateLocalFromCloud = async (
//   item: CloudCollectionItem,
//   localItem?: ICloudSyncable,
//   skipSave?: boolean
// ) => {
//   if (item.remote) return;
//   const data = await GetSingleByKey(item.key);
//   let instance;
//   if (localItem) {
//     // local copy exists, update local
//     localItem.Update(data);
//     localItem.CloudController.MarkSync();
//     instance = localItem;
//   } else {
//     // no local copy exists, create new
//     switch (item.itemType) {
//       case CloudItemTypeMap.npc:
//         instance = Npc.AddNew(data, true);
//         break;
//       case CloudItemTypeMap.pilot:
//         instance = Pilot.AddNew(data, true);
//         break;
//       default:
//         break;
//     }
//   }

//   // clean up old-style save
//   if (!CloudController.ValidateName(item.key)) {
//     // item is saved under the old path, remove it
//     Storage.remove(item.key, {
//       level: 'protected',
//     }).then(() => {
//       PushSingle(instance);
//     });
//   }

//   // save local sync updates
//   if (!skipSave) SaveLocalUpdates(item);
// };

// const UpdateCloudFromLocal = (
//   item: CloudCollectionItem,
//   localItem: ICloudSyncable,
//   skipSave?: boolean
// ) => {
//   if (item.remote) return;
//   // local has the latest data, upload it to the cloud
//   if (!CloudController.ValidateName(item.key)) {
//     // item is saved under the old path, remove it
//     Storage.remove(item.key, {
//       level: 'protected',
//     });
//   }
//   if (!CloudController.IsKeyChange(item.key, localItem)) {
//     // item being marked for deletion or includes name change, remove old record
//     Storage.remove(item.key, {
//       level: 'protected',
//     });
//   }
//   // upload the local file
//   localItem.CloudController.MarkSync();
//   PushSingle(localItem);

//   // save local sync updates
//   if (!skipSave) SaveLocalUpdates(item);
// };

// const SaveLocalUpdates = (item: CloudCollectionItem) => {
//   switch (item.itemType) {
//     case CloudItemTypeMap.npc:
//       store.dispatch('saveNpcData');
//       break;
//     case CloudItemTypeMap.pilot:
//       store.dispatch('savePilotData');
//       break;
//     default:
//       break;
//   }
// };

// // overwrite local data with cloud data
// const Overwrite = async (
//   item: CloudCollectionItem,
//   source: 'cloud' | 'local',
//   dest: 'cloud' | 'local',
//   skipSave?: boolean
// ): Promise<any> => {
//   const localItem = GetLocalItem(item) as ICloudSyncable;
//   if (source === 'cloud' && dest === 'local') {
//     UpdateLocalFromCloud(item, localItem, skipSave);
//   } else if (source === 'local' && dest === 'cloud') {
//     UpdateCloudFromLocal(item, localItem, skipSave);
//   } else {
//     throw new Error('Invalid parameters passed to Sync/Overwrite');
//   }
// };

// const PushSingle = async (item: ICloudSyncable): Promise<any> => {
//   if (item.CloudController.IsRemoteResource) return;
//   return Storage.put(item.CloudController.s3Key, item.Serialize(item), {
//     level: 'protected',
//     contentType: 'text/plain',
//   });
// };

// const GetSingle = async (item: ICloudSyncable): Promise<any> => {
//   const identityId = await getCognitoIdentity();
//   Storage.get(item.CloudController.s3Key, {
//     level: 'protected',
//     identityId,
//   }).then((url) => {
//     if (typeof url === 'string') {
//       return fetch(url).then((res) => res.json());
//     } else {
//       console.error('Malformed S3 Result from GetSingle');
//     }
//   });
// };

// const GetSingleByKey = async (key: string): Promise<any> => {
//   const identityId = await getCognitoIdentity();
//   const url = await Storage.get(key, {
//     level: 'protected',
//     identityId,
//   });
//   if (typeof url === 'string') {
//     return await fetch(url).then((res) => res.json());
//   } else {
//     console.error('Malformed S3 Result from GetSingleByKey');
//   }
// };

// const GetSingleRemote = async (key: string, iid: string): Promise<any> => {
//   const url = await Storage.get(key, {
//     level: 'protected',
//     identityId: iid,
//   });
//   if (typeof url === 'string') {
//     return await fetch(url).then((res) => res.json());
//   } else {
//     console.error('Malformed S3 Result from GetSingleByKey');
//   }
// };

// const DeleteForever = async (
//   item: CloudCollectionItem,
//   skipSave?: boolean
// ): Promise<any> => {
//   PermanentlyDeleteLocalItem(item);
//   if (item.key.includes('active')) {
//     Rename(item.key, item.key.replace('active', 's3-remove-flag'));
//   }
//   if (item.key.includes('deleted')) {
//     Rename(item.key, item.key.replace('deleted', 's3-remove-flag'));
//   }
//   await new Promise((s) => setTimeout(s, 600));
//   if (!skipSave) SaveLocalUpdates(item);
// };

// const DeleteAll = async (): Promise<any> => {
//   const items = await ListCloudItems();
//   const promises = items.map((i) => DeleteForever(i, true));
//   Promise.all(promises);
//   await new Promise((s) => setTimeout(s, 600));
// };

// const FlagCloudDelete = async (item: any): Promise<any> => {
//   if (item.key.includes('active')) {
//     Rename(item.key, item.key.replace('active', 'deleted'));
//     await new Promise((s) => setTimeout(s, 600));
//   } else console.error('Item key does not contain "active"');
// };

// const FlagCloudRestore = async (item: any): Promise<any> => {
//   if (item.key.includes('deleted')) {
//     Rename(item.key, item.key.replace('deleted', 'active'));
//     await new Promise((s) => setTimeout(s, 600));
//   } else console.error('Item key does not contain "deleted"');
// };

// const Rename = async (start: string, dest: string): Promise<any> => {
//   await Storage.copy(
//     { key: start, level: 'protected' },
//     { key: dest, level: 'protected' }
//   ).catch((err) => console.error(err));
//   await Storage.remove(start, {
//     level: 'protected',
//   }).catch((err) => console.error(err));
//   await new Promise((s) => setTimeout(s, 600));
// };

// const AutoSyncAll = async (): Promise<any> => {
//   const cloud = await ListCloudItems();
//   const items = ProcessItemsList(cloud).filter(
//     (i) => !i.missingContent && !i.remote
//   );
//   Promise.all(items.map((item) => SyncItem(item, true))).then(() =>
//     SaveAllLocalUpdates()
//   );
// };

// const RemoteSyncItem = async (localItem: ICloudSyncable): Promise<any> => {
//   if (!localItem || !localItem.CloudController.IsRemoteResource) return;

//   const key = localItem.CloudController.RemoteKey;
//   const iid = localItem.CloudController.RemoteIID;
//   GetSingleRemote(key, iid)
//     .then((res) => {
//       localItem.Update(res);
//       localItem.CloudController.SetRemoteResource(iid, key);
//       localItem.SaveController.SetLoaded();
//     })
//     .catch((err) => console.error(err));
// };

// const AutoSyncRemotes = async (): Promise<any> => {
//   const items = ProcessItemsList([]);
//   Promise.all(
//     items.map((item) => RemoteSyncItem(GetLocalItem(item) as ICloudSyncable))
//   ).then(() => SaveAllLocalUpdates());
// };

// export {
//   getCognitoIdentity,
//   ListCloudItems,
//   ProcessItemsList,
//   SyncItem,
//   GetSingle,
//   GetSingleByKey,
//   DeleteForever,
//   GetLocalItem,
//   Overwrite,
//   DeleteAll,
//   FlagCloudDelete,
//   FlagCloudRestore,
//   SaveAllLocalUpdates,
//   AutoSyncAll,
//   GetSingleRemote,
//   RemoteSyncItem,
//   AutoSyncRemotes,
// };
