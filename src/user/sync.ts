import { store } from '@/store'
import * as Client from '@/user'
import { Auth, API, Storage } from 'aws-amplify'
import { createUserData, updateUserData } from '@/graphql/mutations'
import { syncUserData } from '@/graphql/queries'
import { Pilot } from '@/class'
import { IPilotData } from '@/classes/pilot/Pilot'

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

  console.log('Cloud user data creation successful')

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
    PutNewUserData(username, uid, localUserData).then(res => Client.UserProfile.Deserialize(res))
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
    const url = await Storage.get(p.ResourceURI, { level: 'protected', identityId: p.CloudOwnerID })
    if (typeof url === 'object') {
      console.error('Unsupported S3 return type')
      return
    }

    const data: IPilotData = await fetch(url).then(res => res.json())

    try {
      console.info('Syncing remote pilot// ', p.Callsign)
      p.Update(data, true)
    } catch (err) {
      throw new Error(`Malformed Pilot data returned from S3`)
    }
  })
}

const CloudPull = async (userProfile: Client.UserProfile, addPilotCallback: any): Promise<any> => {
  const ccId = await currentCognitoIdentity()

  const cloudPilotURIs = await Storage.list('pilot', { level: 'protected' })
    .then(result => result.map(k => k.key))
    .catch(err => console.log(err))

  userProfile.Pilots = cloudPilotURIs

  cloudPilotURIs.forEach(async k => {
    const url = await Storage.get(k, { level: 'protected' })

    if (typeof url === 'object') {
      console.error('Unsupported S3 return type')
      return
    }

    const data: IPilotData = await fetch(url).then(res => res.json())

    try {
      const match: Pilot = store.getters.getPilots.find((x: Pilot) => x.ID === data.id)
      if (match) {
        // if the incoming data has a later sync time than our last recorded sync, update
        if (new Date(data.lastSync) > new Date(match.LastSync)) {
          match.Update(data)
          match.MarkSync()
        }
      } else {
        console.info('Adding New Pilot')
        const dlPilot = Pilot.Deserialize(data)
        dlPilot.SetOwnedResource(ccId)
        dlPilot.MarkSync()
        addPilotCallback(dlPilot)
      }
    } catch (err) {
      throw new Error(`Malformed Pilot data returned from S3`)
    }
  })

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

const CloudPush = async (user: Client.UserProfile, callback?: any): Promise<any> => {
  const ccId = await currentCognitoIdentity()

  // collect current cloud pilots
  const cloudPilotURIs = await Storage.list('pilot/', { level: 'protected' })
    .then(result => {
      return result.map(i => i.key)
    })
    .catch(err => console.log(err))

  const storageURIs = []

  // compare against local pilots
  cloudPilotURIs.forEach(async uri => {
    const match = store.getters.getPilots.find((x: Pilot) => x.ResourceURI === uri)
    if (match) {
      // we found a local version of the cloud ID, so upload them
      match.SetOwnedResource(ccId)
      await UploadS3(match.ResourceURI, Pilot.Serialize(match))
        .then(() => {
          storageURIs.push(match.ResourceURI)
          match.IsDirty = false
        })
        .catch(err => {
          console.error(err)
          if (callback) callback('error', `Unable to upload pilot data`)
        })
    } else {
      // there is no local match for this cloud pilot, delete them
      await DeleteS3(uri)
        .then(() => {
          console.info('Removed locally-deleted Pilot')
        })
        .catch(err => {
          console.error(err)
          if (callback) callback('error', `Unable to delete pilot data`)
        })
    }
  })

  // find new pilots
  store.getters.getPilots.forEach(async (p: Pilot) => {
    if (cloudPilotURIs.includes(p.ResourceURI)) return
    if (!p.IsLocallyOwned) return
    // pilot is a local resource that does not exist in the cloud
    console.log('new pilot found', p.IsLocallyOwned)
    p.SetOwnedResource(ccId)
    await UploadS3(p.ResourceURI, Pilot.Serialize(p))
      .then(() => {
        storageURIs.push(p.ResourceURI)
        p.MarkSync()
      })
      .catch(err => {
        console.error(err)
        if (callback) callback('error', `Unable to upload pilot data`)
      })
  })

  user.Pilots = storageURIs

  // upload lcps
  const lcps = localStorage.getItem('extra_content.json')
  if (lcps) {
    await Storage.put(`extra_content.json`, lcps, {
      level: 'private',
      contentType: 'text/plain',
    }).catch(err => console.error(err))
  }

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
  const arr = JSON.parse(code)
  const userID = arr[0]
  const resource = arr[1]

  const url = await Storage.get(resource, {
    level: 'protected',
    identityId: userID,
  })

  if (typeof url === 'object') throw new Error('Unsupported S3 return type')

  return fetch(url).then(res => res.json())
}

export { GetSync, ContentPull, CloudPull, CloudPush, AwsImport }
