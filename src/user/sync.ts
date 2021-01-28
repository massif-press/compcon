import { store } from '@/store'
import * as Client from '@/user'
import { Auth, API, Storage } from 'aws-amplify'
import { createUserData, updateUserData } from '@/graphql/mutations'
import { syncUserData } from '@/graphql/queries'
import { Pilot } from '@/class'
import { IPilotData } from '@/classes/pilot/Pilot'

const GetSync = async (uid?: string): Promise<Client.UserProfile> => {
  const localUserData = await Client.getUser()
  const username = uid || localUserData.UserID
  console.log(uid, localUserData.UserID)

  const res: any = await API.graphql({
    query: syncUserData,
    variables: { filter: { user_id: { eq: username } } },
  })

  const userData = res.data.syncUserData.items[0]

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
    console.info('Creating new cloud user')
    const newUser = Client.UserProfile.Serialize(localUserData)
    newUser.user_id = username
    newUser.id = uid

    delete newUser.last_sync
    delete newUser.username

    await API.graphql({
      query: createUserData,
      variables: { input: newUser },
    })

    console.log('created new userdata')

    return Client.UserProfile.Deserialize(newUser)
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

const SyncRemoteData = async (): Promise<void> => {
  const currentCognitoUser = await Auth.currentUserCredentials()
    .then(res => res.identityId)
    .catch(() => '')

  const external: Pilot[] = store.getters.getPilots.filter(
    (x: Pilot) => x.CloudOwnerID && x.CloudOwnerID !== currentCognitoUser
  )

  external.forEach(async p => {
    console.log('syncing remote pilot ', p.Callsign)
    const key = p.CloudKey
    const url = await Storage.get(key, { level: 'protected', identityId: p.CloudOwnerID })
    if (typeof url === 'object') {
      console.error('Unsupported S3 return type')
      return
    }

    const data: IPilotData = await fetch(url).then(res => res.json())

    try {
      const match: Pilot = store.getters.getPilots.find((x: Pilot) => x.ID === data.id)
      if (match) {
        // update existing pilot
        match.setPilotData(data)
      } else {
        console.error('Could not find remote pilot data')
      }
    } catch (err) {
      throw new Error(`Malformed Pilot data returned from S3`)
    }
  })
}

const CloudPull = async (userProfile: Client.UserProfile, addPilotCallback: any): Promise<any> => {
  const currentCognitoUser = await Auth.currentUserCredentials()
    .then(res => res.identityId)
    .catch(() => '')

  const cloudPilotKeys = await Storage.list('pilot', { level: 'protected' })
    .then(result => {
      return result.map(k => k.key)
    })
    .catch(err => console.log(err))

  userProfile.Pilots = cloudPilotKeys

  cloudPilotKeys.forEach(async k => {
    const url = await Storage.get(k, { level: 'protected' })

    if (typeof url === 'object') {
      console.error('Unsupported S3 return type')
      return
    }

    // let path = new URL(url).pathname
    // path = path.substring(0, path.length - 5)

    const data: IPilotData = await fetch(url).then(res => res.json())

    try {
      const match: Pilot = store.getters.getPilots.find((x: Pilot) => x.ID === data.id)
      if (match) {
        // update existing pilot
        match.setPilotData(data)
        if (!match.CloudOwnerID) match.CloudOwnerID = currentCognitoUser
        match.dirty = false
      } else {
        console.info('Adding New Pilot')
        const dlPilot = Pilot.Deserialize(data)
        dlPilot.CloudOwnerID = currentCognitoUser
        dlPilot.dirty = false
        addPilotCallback(dlPilot)
      }
    } catch (err) {
      throw new Error(`Malformed Pilot data returned from S3`)
    }
  })

  await SyncRemoteData()
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
  // const currentCognitoUser = await Auth.currentUserCredentials()
  //   .then(res => res.identityId)
  //   .catch(() => '')

  // collect current cloud pilots
  const cloudPilotIds = await Storage.list('pilot', { level: 'protected' })
    .then(result => {
      return result.map(i => i.key)
    })
    .catch(err => console.log(err))

  console.log(cloudPilotIds)

  const storageIds = []

  // compare against local pilots
  cloudPilotIds.forEach(async pid => {
    const match = store.getters.getPilots.find((x: Pilot) => x.CloudKey === pid)
    if (match) {
      // we found a local version of the cloud ID, so upload them
      await UploadS3(match.CloudKey, Pilot.Serialize(match))
        .then(() => {
          // callback('success', `${match.Callsign}//UPDATE SUCCESSFUL`)
          storageIds.push(match.CloudKey)
          match.dirty = false
        })
        .catch(err => {
          console.error(err)
          if (callback) callback('error', `Unable to upload pilot data`)
        })
    } else {
      // there is no local match for this cloud pilot, delete them
      await DeleteS3(pid)
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
    if (cloudPilotIds.includes(p.CloudKey)) return
    // pilot does not exist in the cloud
    console.log('new pilot found')
    await UploadS3(p.CloudKey, Pilot.Serialize(p))
      .then(() => {
        // if (callback) callback('success', `${p.Callsign}//ADDED TO VAULT`)
        storageIds.push(p.CloudKey)
        p.dirty = false
      })
      .catch(err => {
        console.error(err)
        if (callback) callback('error', `Unable to upload pilot data`)
      })
  })

  user.Pilots = storageIds

  // upload lcps
  const lcps = localStorage.getItem('extra_content.json')
  if (lcps) {
    await Storage.put(`extra_content.json`, lcps, {
      level: 'private',
      contentType: 'text/plain',
    }).catch(err => console.error(err))
  }

  await SyncRemoteData()

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

const AwsImport = async (importUrl: string): Promise<any> => {
  const url = await Storage.get(importUrl)

  if (typeof url === 'object') throw new Error('Unsupported S3 return type')

  return fetch(url).then(res => res.json())
}

// const SinglePilotSync = async(p: Pilot): Promise<void> => {

// }

export { GetSync, ContentPull, CloudPull, CloudPush, AwsImport }
