/* TODO:
  - new username that is email - special chars
    -- only alphanumeric + dashses
  - find which cloud-savable data needs to be updated based on existance/latest update time
  - add all cloud-savable data in one batch
  - pull down new data
*/

import {
  store,
  UserStore,
  PilotManagementStore,
  NpcStore,
  EncounterStore,
  MissionStore,
} from '../store'
import * as Client from '@/user'
import { Auth, API, Storage } from 'aws-amplify'
import { createUserData, updateUserData } from '@/graphql/mutations'
import { syncUserData } from '@/graphql/queries'
// import { ActiveMission, Encounter, Mission, Pilot } from '@/class'
// import { PilotData } from '@/classes/pilot/Pilot'
// import { Npc } from '@/classes/npc/Npc'
import { getModule } from 'vuex-module-decorators'
import { ICloudSyncable } from '@/classes/components'
import { CloudController, CloudItemTypeMap } from '@/classes/components/cloud/CloudController'
import { Pilot } from '@/class'

const region = 'us-east-1'

const currentCognitoIdentity = async (): Promise<any> =>
  Auth.currentUserCredentials()
    .then(res => res.identityId)
    .catch(() => '')

let CognitoIdentity

async function getCognitoIdentity() {
  if (CognitoIdentity) return CognitoIdentity
  CognitoIdentity = await currentCognitoIdentity()
  return CognitoIdentity
}

const PutNewUserData = async (
  user_id: string,
  uid: string,
  data: Client.UserProfile
): Promise<any> => {
  console.info('Creating new cloud user')
  const newUser = Client.UserProfile.Serialize(data)
  newUser.user_id = user_id
  newUser.id = uid

  delete newUser.last_sync
  delete newUser.username

  await API.graphql({
    query: createUserData,
    variables: { input: newUser },
  })

  console.info('Cloud user data creation successful')

  return newUser
}

const GetUserData = async (user_id: string): Promise<any> => {
  const res: any = await API.graphql({
    query: syncUserData,
    variables: { filter: { user_id: { eq: user_id } } },
  })

  return res.data.syncUserData.items[0]
}

const GetCloudProfile = async (uid?: string): Promise<Client.UserProfile> => {
  const localUserData = Client.getLocalProfile()
  const user_id = uid || localUserData.UserID

  const userData = await GetUserData(user_id)

  if (userData) {
    try {
      const CloudUser = Client.UserProfile.Deserialize(userData)
      return CloudUser
    } catch (err) {
      throw new Error(
        `Unable to deserialize userdata, resorting to last locally saved data\n${err}`
      )
    }
  } else {
    // create new userdata
    const res = await PutNewUserData(user_id, uid, localUserData)
    console.info('new user data created')
    return Client.UserProfile.Deserialize(res)
  }
}

// const ContentPull = async (): Promise<any> => {
//   const url = await Storage.get('extra_content.json', { level: 'private' })

//   if (typeof url === 'object') throw new Error('Unsupported S3 return type')

//   const data = await fetch(url).then(res => {
//     return res.ok ? res.text() : null
//   })

//   if (data) {
//     try {
//       localStorage.setItem('extra_content.json', data)
//     } catch (err) {
//       throw new Error(`Malformed content data returned from S3`)
//     }
//   }
// }

// const PullRemoteData = async (): Promise<void> => {
//   const external: Pilot[] = store.getters.getPilots.filter((x: Pilot) => !x.IsLocallyOwned)

//   external.forEach(async p => {
//     const iid = p.CloudOwnerID.includes(region) ? p.CloudOwnerID : `${region}:${p.CloudOwnerID}`
//     const url = await Storage.get(p.ResourceURI, { level: 'protected', identityId: iid })
//     if (typeof url === 'object') {
//       console.error('Unsupported S3 return type')
//       return
//     }

//     const data: PilotData = await fetch(url)
//       .then(res => {
//         return res.json()
//       })
//       .catch(err => console.error(err))

//     if (!data) return
//     try {
//       console.info('Syncing remote pilot// ', p.Callsign)
//       data.isLocal = false
//       p.Update(data, true)
//       // p.SetRemoteResource()
//     } catch (err) {
//       throw new Error(`Malformed Pilot data returned from S3`)
//     }
//   })
// }

// async function Pull(
//   storageKey: string,
//   userProfile: Client.UserProfile,
//   ccid: string,
//   callback: any
// ): Promise<any> {
//   const typePrefix = storageKey.substring(storageKey.length - 1, 0).toLowerCase()

//   const cloudURIs = await Storage.list(typePrefix, { level: 'protected' })
//     .then(result => result.map(k => k.key))
//     .catch(err => console.error(err))

//   userProfile[storageKey] = cloudURIs

//   cloudURIs.forEach(async k => {
//     const url = await Storage.get(k, { level: 'protected' })

//     if (typeof url === 'object') {
//       console.error('Unsupported S3 return type')
//       return
//     }

//     const data = await fetch(url).then(res => res.json())

//     try {
//       const match = store.getters[`get${storageKey}`].find(x => x.ID === data.id || x.CloudID === data.cloudID || x.ID === data.cloudID)
//       if (match) {
//         // if the incoming data has a later sync time than our last recorded sync, update
//         if (new Date(data.lastSync) > new Date(match.LastSync)) {
//           match.Update(data)
//           match.MarkSync()
//         }
//       } else {
//         console.info(`Adding New ${typePrefix}`)
//         let dl = {} as ICloudSyncable
//         if (storageKey === 'Pilots') dl = Pilot.Deserialize(data)
//         else if (storageKey === 'Npcs') dl = Npc.Deserialize(data)
//         else if (storageKey === 'Encounters') dl = Encounter.Deserialize(data)
//         else if (storageKey === 'Missions' && data.id) dl = Mission.Deserialize(data)
//         else if (storageKey === 'ActiveMissions') dl = ActiveMission.Deserialize(data)
//         else return

//         console.info('new item is:', dl.IsLocallyOwned ? 'locally owned' : 'remote resource');
//         if (dl.IsLocallyOwned) dl.SetOwnedResource(ccid)
//         // else dl.SetRemoteResource()
//         dl.MarkSync()
//         callback(dl)
//       }
//     } catch (err) {
//       throw new Error(`Malformed data returned from S3`)
//     }
//   })
// }

// const CloudPull = async (userProfile: Client.UserProfile, callback: any): Promise<any> => {
//   const ccid = await currentCognitoIdentity()
//   await Pull('Pilots', userProfile, ccid, callback)
//   await Pull('Npcs', userProfile, ccid, callback)
//   await Pull('Encounters', userProfile, ccid, callback)
//   await Pull('Missions', userProfile, ccid, callback)
//   await Pull('ActiveMissions', userProfile, ccid, callback)
//   await PullRemoteData()
// }

// function UploadS3(filename: string, data: any): Promise<any> {
//   return Storage.put(filename, data, {
//     level: 'protected',
//     contentType: 'text/plain',
//   })
// }

// function DeleteS3(filename: string): Promise<any> {
//   return Storage.remove(filename, {
//     level: 'protected',
//   })
// }

// async function Push(
//   storageKey: string,
//   userProfile: Client.UserProfile,
//   ccid: string,
//   callback: any
// ): Promise<any> {
//   const typePrefix = storageKey.substring(storageKey.length - 1, 0).toLowerCase()

//   const cloudURIs = await Storage.list(`${typePrefix}/`, {
//     level: 'protected',
//   })
//     .then(result => {
//       return result.map(i => i.key)
//     })
//     .catch(err => console.error(err))

//   const storageURIs = []

//   cloudURIs.forEach(async uri => {
//     const match = store.getters[`get${storageKey}`].find(
//       (x: ICloudSyncable) => x.ResourceURI === uri
//     )
//     if (match && match.IsLocallyOwned) {
//       // we found a local version of the cloud ID, so upload them
//       match.SetOwnedResource(ccid)
//       let data = {} as any
//       if (storageKey === 'Pilots') data = Pilot.Serialize(match)
//       else if (storageKey === 'Npcs') data = Npc.Serialize(match)
//       else if (storageKey === 'Encounters') data = Encounter.Serialize(match)
//       else if (storageKey === 'Missions') data = Mission.Serialize(match)
//       else if (storageKey === 'ActiveMissions') data = ActiveMission.Serialize(match)

//       await UploadS3(match.ResourceURI, data)
//         .then(() => {
//           storageURIs.push(match.ResourceURI)
//           match.IsDirty = false
//         })
//         .catch(err => {
//           console.error(err)
//           if (callback) callback('error', `Unable to upload ${typePrefix} data`)
//         })
//     } else if (match && !match.IsLocallyOwned) {
//       console.info('this is an external match, not locally owned')
//     } else {
//       // there is no local match for this cloud pilot, delete them
//       await DeleteS3(uri)
//         .then(() => {
//           console.info(`Removed locally-deleted ${typePrefix}`)
//         })
//         .catch(err => {
//           console.error(err)
//           if (callback) callback('error', `Unable to delete ${typePrefix} data`)
//         })
//     }
//   })

//   // find new items
//   store.getters[`get${storageKey}`].forEach(async (p: any) => {
//     if (cloudURIs.includes(p.ResourceURI)) return
//     if (p.IsLocallyOwned) p.SetOwnedResource(ccid)
//     // else (p.SetRemoteResource())
//     // this is a resource that does not exist in the cloud

//     console.info('item that does not exist in the cloud found: ', p);

//     let data = {} as any
//     if (storageKey === 'Pilots') data = Pilot.Serialize(p)
//     else if (storageKey === 'Npcs') data = Npc.Serialize(p)
//     else if (storageKey === 'Encounters') data = Encounter.Serialize(p)
//     else if (storageKey === 'Missions') data = Mission.Serialize(p)
//     else if (storageKey === 'ActiveMissions') data = ActiveMission.Serialize(p)

//     await UploadS3(p.ResourceURI, data)
//       .then(() => {
//         storageURIs.push(p.ResourceURI)
//         p.MarkSync()
//       })
//       .catch(err => {
//         console.error(err)
//         if (callback) callback('error', `Unable to upload pilot data`)
//       })
//   })

//   userProfile[storageKey] = storageURIs
// }

// const UploadLcps = async (): Promise<any> => {
//   const lcps = localStorage.getItem('extra_content.json')
//   Storage.put(`extra_content.json`, lcps, {
//     level: 'private',
//     contentType: 'text/plain',
//   }).catch(err => console.error(err))
// }

// const CloudPush = async (user: Client.UserProfile, callback?: any): Promise<any> => {
//   const ccid = await currentCognitoIdentity()

//   Push('Pilots', user, ccid, callback)
//   Push('Npcs', user, ccid, callback)
//   Push('Encounters', user, ccid, callback)
//   Push('Missions', user, ccid, callback)
//   Push('ActiveMissions', user, ccid, callback)

//   // upload lcps
//   await UploadLcps()

//   await PullRemoteData()

//   const input = Client.UserProfile.Serialize(user)

//   //TODO: update the model to include these
//   delete input.last_sync
//   delete input.username

//   for (const key in input) {
//     if (Array.isArray(input[key]) && input[key].length === 0) input[key] = null
//   }

//   return API.graphql({
//     query: updateUserData,
//     variables: { input },
//   })
// }

// const AwsImport = async (code: string): Promise<any> => {
//   const arr = code.split('//')
//   const userID = 'us-east-1:' + arr[0]
//   const resource = 'pilot/' + arr[1]

//   const ccid = await currentCognitoIdentity()
//   if (userID === ccid) throw new Error('Entity belongs to current account.')

//   const url = await Storage.get(resource, {
//     level: 'protected',
//     identityId: userID,
//   })

//   if (typeof url === 'object') throw new Error('Unsupported S3 return type')

//   return fetch(url).then(res => {
//     if (!res.ok) throw new Error(`${res.status} ${res.statusText}`)
//     return res.json()
//   })
// }

const ListCloudItems = async (): Promise<any> => {
  return Storage.list('', { level: 'protected' })
    .then(result => result)
    .catch(err => console.error(err))
}

type CollectionItem = {
  key: string
  id: string
  itemType: CloudItemTypeMap
  name: string
  lastModifiedLocal: string
  lastModifiedCloud: string
  lastUploadCloud: string
  deleted: boolean
  latest: string
  selected: false
}

function determineLatest(cloudItem: CollectionItem, localItem: CollectionItem): string {
  if (cloudItem.lastModifiedCloud === localItem.lastModifiedLocal) return 'synced'
  if (Date.parse(cloudItem.lastModifiedCloud) > Date.parse(localItem.lastModifiedLocal)) {
    return 'cloud'
  } else {
    return 'local'
  }
}

const ProcessItemsList = (cloudList): CollectionItem[] => {
  console.log(cloudList)
  const localCollection = {
    activemission: getModule(MissionStore, store).ActiveMissions,
    mission: getModule(MissionStore, store).Missions,
    encounter: getModule(EncounterStore, store).Encounters,
    npc: getModule(NpcStore, store).Npcs,
    pilot: getModule(PilotManagementStore, store).AllPilots,
  }

  console.log(getModule(PilotManagementStore, store).DeletedPilots)

  const localMap = []
  Object.keys(localCollection).forEach((key: string) =>
    localCollection[key].forEach((x: ICloudSyncable) =>
      localMap.push({
        key: x.CloudController.s3Key,
        id: x.ID,
        itemType: CloudItemTypeMap[key],
        name: x.Name,
        lastModifiedLocal: x.CloudController.LastUpdateLocal,
        lastModifiedCloud: x.CloudController.LastUpdateCloud,
        deleted: x.SaveController.IsDeleted,
        delete_time: x.SaveController.DeleteTime,
      })
    )
  )

  const output = cloudList.map((x: any) => {
    {
      const folderArr = x.key.split('/')
      const nameArr = folderArr[1].split('--')
      const name = nameArr[0]
      const id = nameArr.length > 1 ? nameArr[1] : nameArr[0]
      const deleted = nameArr.length > 2 ? nameArr[2].toLowerCase() === 'deleted' : false

      return {
        id,
        key: x.key,
        itemType: CloudItemTypeMap[folderArr[0]],
        name,
        lastUploadCloud: x.lastModified.toString(),
        lastModifiedCloud: x.lastModified.toString(),
        lastModifiedLocal: '',
        latest: 'cloud',
        deleted,
      }
    }
  })

  console.log(output)

  // collect all items that are local-only
  localMap.forEach((localItem: CollectionItem) => {
    let matchIndex = -1
    const match = output.find((cloudItem: CollectionItem, index: number) => {
      if (localItem.id === cloudItem.id || localItem.id === cloudItem.name) {
        if (localItem.deleted) console.log('localitem deleted', localItem)
        matchIndex = index
        return cloudItem
      }
    })
    if (!match) {
      output.push(localItem)
    } else if (match && matchIndex > -1) {
      output[matchIndex].name = localItem.name
      output[matchIndex].lastModifiedLocal = localItem.lastModifiedLocal
      output[matchIndex].lastModifiedCloud = localItem.lastModifiedCloud
      const latest = determineLatest(output[matchIndex], localItem)
      if (latest === 'local') {
        output[matchIndex].deleted = localItem.deleted
        output[matchIndex].latest = 'local'
      }
    }
  })

  output.forEach((cloudItem: CollectionItem) => {
    const match = localMap.find(
      (localItem: CollectionItem) =>
        localItem.id === cloudItem.id || localItem.id === cloudItem.name
    )
    if (match) {
      cloudItem.lastModifiedLocal = match.lastModifiedLocal
    }
  })

  return output
}

function getLocalItem(item: CollectionItem): any {
  switch (item.itemType) {
    case CloudItemTypeMap.activemission:
      return getModule(MissionStore, store).ActiveMissions.find(x => x.ID === item.id)
    case CloudItemTypeMap.mission:
      return getModule(MissionStore, store).Missions.find(x => x.ID === item.id)
    case CloudItemTypeMap.encounter:
      return getModule(EncounterStore, store).Encounters.find(x => x.ID === item.id)
    case CloudItemTypeMap.npc:
      return getModule(NpcStore, store).Npcs.find(x => x.ID === item.id)
    case CloudItemTypeMap.pilot:
      return getModule(PilotManagementStore, store).Pilots.find(x => x.ID === item.id)
    default:
      break
  }
}

// syncs a single item based on latest update
const SyncItem = async (item: CollectionItem): Promise<any> => {
  const localItem = getLocalItem(item) as ICloudSyncable
  if (
    !localItem ||
    (localItem && !item.lastModifiedLocal && item.lastModifiedCloud) ||
    Date.parse(item.lastModifiedCloud) > Date.parse(item.lastModifiedLocal)
  ) {
    console.log('cloud has latest data')
    const data = await GetSingleByKey(item.key)
    // TODO: check brews and throw error. might need callback fn
    if (localItem) {
      // local copy exists, update local
      console.log('update local item')
      localItem.Update(data)
      localItem.CloudController.MarkSync()
    } else {
      // no local copy exists, create new
      switch (item.itemType) {
        case CloudItemTypeMap.activemission:
          console.log('is activemission')
          console.error('NYI')
          break
        case CloudItemTypeMap.mission:
          console.log('is mission')
          console.error('NYI')
          break
        case CloudItemTypeMap.encounter:
          console.log('is encounter')
          console.error('NYI')
          break
        case CloudItemTypeMap.npc:
          console.log('is npc')
          console.error('NYI')
          break
        case CloudItemTypeMap.pilot:
          Pilot.AddNew(data, true)
          break
        default:
          break
      }
    }

    // clean up old-style save
    if (!CloudController.ValidateName(item.key)) {
      console.log('saved under old path')
      // item is saved under the old path, remove it
      Storage.remove(item.key, {
        level: 'protected',
      })
    }
  } else {
    console.log('local has latest data')
    console.log(item.key)
    // local has the latest data, upload it to the cloud
    if (!CloudController.ValidateName(item.key)) {
      console.log('saved under old path')
      // item is saved under the old path, remove it
      Storage.remove(item.key, {
        level: 'protected',
      })
    }
    // upload the local file
    localItem.CloudController.MarkSync()
    PushSingle(localItem)

    // save local sync updates
    switch (item.itemType) {
      case CloudItemTypeMap.mission:
      case CloudItemTypeMap.activemission:
        store.dispatch('saveMissionData')
        break
      case CloudItemTypeMap.encounter:
        store.dispatch('saveEncounterData')
        break
      case CloudItemTypeMap.npc:
        store.dispatch('saveNpcData')
        break
      case CloudItemTypeMap.pilot:
        store.dispatch('savePilotData')
        break
      default:
        break
    }
  }
}

const PushSingle = async (item: ICloudSyncable): Promise<any> => {
  console.log(item.CloudController.s3Key)
  return Storage.put(item.CloudController.s3Key, item.Serialize(item), {
    level: 'protected',
    contentType: 'text/plain',
  })
}

const GetSingle = async (item: ICloudSyncable): Promise<any> => {
  const identityId = await getCognitoIdentity()
  Storage.get(item.CloudController.s3Key, {
    level: 'protected',
    identityId,
  }).then(url => {
    if (typeof url === 'string') {
      return fetch(url).then(res => res.json())
    } else {
      console.error('Malformed S3 Result from GetSingle')
    }
  })
}

const GetSingleByKey = async (key: string): Promise<any> => {
  const identityId = await getCognitoIdentity()
  const url = await Storage.get(key, {
    level: 'protected',
    identityId,
  })
  if (typeof url === 'string') {
    return await fetch(url).then(res => res.json())
  } else {
    console.error('Malformed S3 Result from GetSingleByKey')
  }
}

export {
  // GetSync, ContentPull, CloudPull, CloudPush, AwsImport, UploadLcps,
  ListCloudItems,
  ProcessItemsList,
  GetCloudProfile,
  SyncItem,
  GetSingle,
  GetSingleByKey,
}
