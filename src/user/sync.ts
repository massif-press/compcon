import { store, UserStore } from '@/store'
import * as Client from '@/user'
import { Auth, API, Storage } from 'aws-amplify'
import { createUserData, updateUserData } from '@/graphql/mutations'
import { syncUserData } from '@/graphql/queries'
import { ActiveMission, Encounter, Mission, Pilot } from '@/class'
import { IPilotData } from '@/classes/pilot/Pilot'
import { Npc } from '@/classes/npc/Npc'
import { getModule } from 'vuex-module-decorators'
import Startup from '@/io/Startup'
import Vue from 'vue'

const region = 'us-east-1'

const currentCognitoIdentity = async (): Promise<any> =>
  Auth.currentUserCredentials()
    .then(res => res.identityId)
    .catch(() => '')

const PutNewUserData = async (
  username: string,
  uid: string,
  data: Client.UserProfile
): Promise<any> => {
  console.info('Creating new cloud user')
  const newUser = Client.UserProfile.Serialize(data)
  newUser.user_id = username
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

const GetUserData = async (username: string): Promise<any> => {
  const res: any = await API.graphql({
    query: syncUserData,
    variables: { filter: { user_id: { eq: username } } },
  })

  return res.data.syncUserData.items[0]
}

const GetSync = async (uid?: string): Promise<Client.UserProfile> => {
  const localUserData = await Client.getUser()
  const username = uid || localUserData.UserID

  const userData = await GetUserData(username)

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
    const res = await PutNewUserData(username, uid, localUserData)
    console.info('new user data created')
    return Client.UserProfile.Deserialize(res)
  }
}

const ContentPull = async (): Promise<any> => {
  const url = await Storage.get('extra_content.json', { level: 'private' })

  if (typeof url === 'object') throw new Error('Unsupported S3 return type')

  const data = await fetch(url).then(res => {
    return res.ok ? res.text() : null
  })

  if (data) {
    try {
      localStorage.setItem('extra_content.json', data)
    } catch (err) {
      throw new Error(`Malformed content data returned from S3`)
    }
  }
}

const PullRemoteData = async (): Promise<void> => {
  const external: Pilot[] = store.getters.getPilots.filter((x: Pilot) => !x.IsLocallyOwned)

  external.forEach(async p => {
    const iid = p.CloudOwnerID.includes(region) ? p.CloudOwnerID : `${region}:${p.CloudOwnerID}`
    const url = await Storage.get(p.ResourceURI, { level: 'protected', identityId: iid })
    if (typeof url === 'object') {
      console.error('Unsupported S3 return type')
      return
    }

    const data: IPilotData = await fetch(url)
      .then(res => {
        return res.json()
      })
      .catch(err => console.error(err))


    if (!data) return
    try {
      console.info('Syncing remote pilot// ', p.Callsign)
      data.isLocal = false
      p.Update(data, true)
      // p.SetRemoteResource()
    } catch (err) {
      throw new Error(`Malformed Pilot data returned from S3`)
    }
  })
}

async function Pull(
  storageKey: string,
  userProfile: Client.UserProfile,
  ccid: string,
  callback: any
): Promise<any> {
  const typePrefix = storageKey.substring(storageKey.length - 1, 0).toLowerCase()

  const cloudURIs = await Storage.list(typePrefix, { level: 'protected' })
    .then(result => result.map(k => k.key))
    .catch(err => console.error(err))

  userProfile[storageKey] = cloudURIs

  cloudURIs.forEach(async k => {
    const url = await Storage.get(k, { level: 'protected' })

    if (typeof url === 'object') {
      console.error('Unsupported S3 return type')
      return
    }

    const data = await fetch(url).then(res => res.json())

    try {
      const match = store.getters[`get${storageKey}`].find(x => x.ID === data.id || x.CloudID === data.cloudID || x.ID === data.cloudID)
      if (match) {
        // if the incoming data has a later sync time than our last recorded sync, update
        if (new Date(data.lastSync) > new Date(match.LastSync)) {
          match.Update(data)
          match.MarkSync()
        }
      } else {
        console.info(`Adding New ${typePrefix}`)
        let dl = {} as ICloudSyncable
        if (storageKey === 'Pilots') dl = Pilot.Deserialize(data)
        else if (storageKey === 'Npcs') dl = Npc.Deserialize(data)
        else if (storageKey === 'Encounters') dl = Encounter.Deserialize(data)
        else if (storageKey === 'Missions' && data.id) dl = Mission.Deserialize(data)
        else if (storageKey === 'ActiveMissions') dl = ActiveMission.Deserialize(data)
        else return

        console.info('new item is:', dl.IsLocallyOwned ? 'locally owned' : 'remote resource');
        if (dl.IsLocallyOwned) dl.SetOwnedResource(ccid)
        // else dl.SetRemoteResource()
        dl.MarkSync()
        callback(dl)
      }
    } catch (err) {
      throw new Error(`Malformed data returned from S3`)
    }
  })
}

const CloudPull = async (userProfile: Client.UserProfile, callback: any): Promise<any> => {
  const ccid = await currentCognitoIdentity()
  await Pull('Pilots', userProfile, ccid, callback)
  await Pull('Npcs', userProfile, ccid, callback)
  await Pull('Encounters', userProfile, ccid, callback)
  await Pull('Missions', userProfile, ccid, callback)
  await Pull('ActiveMissions', userProfile, ccid, callback)
  await PullRemoteData()
}

function UploadS3(filename: string, data: any): Promise<any> {
  return Storage.put(filename, data, {
    level: 'protected',
    contentType: 'text/plain',
  })
}

function DeleteS3(filename: string): Promise<any> {
  return Storage.remove(filename, {
    level: 'protected',
  })
}

async function Push(
  storageKey: string,
  userProfile: Client.UserProfile,
  ccid: string,
  callback: any
): Promise<any> {
  const typePrefix = storageKey.substring(storageKey.length - 1, 0).toLowerCase()

  const cloudURIs = await Storage.list(`${typePrefix}/`, {
    level: 'protected',
  })
    .then(result => {
      return result.map(i => i.key)
    })
    .catch(err => console.error(err))

  const storageURIs = []

  cloudURIs.forEach(async uri => {
    const match = store.getters[`get${storageKey}`].find(
      (x: ICloudSyncable) => x.ResourceURI === uri
    )
    if (match && match.IsLocallyOwned) {
      // we found a local version of the cloud ID, so upload them
      match.SetOwnedResource(ccid)
      let data = {} as any
      if (storageKey === 'Pilots') data = Pilot.Serialize(match)
      else if (storageKey === 'Npcs') data = Npc.Serialize(match)
      else if (storageKey === 'Encounters') data = Encounter.Serialize(match)
      else if (storageKey === 'Missions') data = Mission.Serialize(match)
      else if (storageKey === 'ActiveMissions') data = ActiveMission.Serialize(match)

      await UploadS3(match.ResourceURI, data)
        .then(() => {
          storageURIs.push(match.ResourceURI)
          match.IsDirty = false
        })
        .catch(err => {
          console.error(err)
          if (callback) callback('error', `Unable to upload ${typePrefix} data`)
        })
    } else if (match && !match.IsLocallyOwned) {
      console.info('this is an external match, not locally owned')
    } else {
      // there is no local match for this cloud pilot, delete them
      await DeleteS3(uri)
        .then(() => {
          console.info(`Removed locally-deleted ${typePrefix}`)
        })
        .catch(err => {
          console.error(err)
          if (callback) callback('error', `Unable to delete ${typePrefix} data`)
        })
    }
  })

  // find new items
  store.getters[`get${storageKey}`].forEach(async (p: any) => {
    if (cloudURIs.includes(p.ResourceURI)) return
    if (p.IsLocallyOwned) p.SetOwnedResource(ccid)
    // else (p.SetRemoteResource())
    // this is a resource that does not exist in the cloud

    console.info('item that does not exist in the cloud found: ', p);

    let data = {} as any
    if (storageKey === 'Pilots') data = Pilot.Serialize(p)
    else if (storageKey === 'Npcs') data = Npc.Serialize(p)
    else if (storageKey === 'Encounters') data = Encounter.Serialize(p)
    else if (storageKey === 'Missions') data = Mission.Serialize(p)
    else if (storageKey === 'ActiveMissions') data = ActiveMission.Serialize(p)

    await UploadS3(p.ResourceURI, data)
      .then(() => {
        storageURIs.push(p.ResourceURI)
        p.MarkSync()
      })
      .catch(err => {
        console.error(err)
        if (callback) callback('error', `Unable to upload pilot data`)
      })
  })

  userProfile[storageKey] = storageURIs
}

const UploadLcps = async (): Promise<any> => {
  const lcps = localStorage.getItem('extra_content.json')
  Storage.put(`extra_content.json`, lcps, {
    level: 'private',
    contentType: 'text/plain',
  }).catch(err => console.error(err))
}

const CloudPush = async (user: Client.UserProfile, callback?: any): Promise<any> => {
  const ccid = await currentCognitoIdentity()

  Push('Pilots', user, ccid, callback)
  Push('Npcs', user, ccid, callback)
  Push('Encounters', user, ccid, callback)
  Push('Missions', user, ccid, callback)
  Push('ActiveMissions', user, ccid, callback)

  // upload lcps
  await UploadLcps()

  await PullRemoteData()

  const input = Client.UserProfile.Serialize(user)

  //TODO: update the model to include these
  delete input.last_sync
  delete input.username

  for (const key in input) {
    if (Array.isArray(input[key]) && input[key].length === 0) input[key] = null
  }

  return API.graphql({
    query: updateUserData,
    variables: { input },
  })
}

const AwsImport = async (code: string): Promise<any> => {
  const arr = code.split('//')
  const userID = 'us-east-1:' + arr[0]
  const resource = 'pilot/' + arr[1]

  const ccid = await currentCognitoIdentity()
  if (userID === ccid) throw new Error('Entity belongs to current account.')

  const url = await Storage.get(resource, {
    level: 'protected',
    identityId: userID,
  })

  if (typeof url === 'object') throw new Error('Unsupported S3 return type')

  return fetch(url).then(res => {
    if (!res.ok) throw new Error(`${res.status} ${res.statusText}`)
    return res.json()
  })
}

export { GetSync, ContentPull, CloudPull, CloudPush, AwsImport, UploadLcps }
