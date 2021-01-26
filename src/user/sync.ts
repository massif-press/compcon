import { store } from '@/store'
import * as Client from '@/user'
import { API, Storage } from 'aws-amplify'
import { createUserData, updateUserData } from '@/graphql/mutations'
import { syncUserData } from '@/graphql/queries'
import { Pilot } from '@/class'
import { IPilotData } from '@/classes/pilot/Pilot'

interface ISyncReturn {
  cloudOverwrite: boolean
  localOverwrite: boolean
  earlierUser: Client.UserProfile | null
  latestUser: Client.UserProfile
}

const GetSync = async (uid?: string): Promise<Client.UserProfile> => {
  const localUserData = await Client.getUser()
  const username = uid || localUserData.UserID

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
        `Unable to deserialize userdata, resorting to last locally saved data\n${JSON.parse(err)}`
      )
    }
  } else {
    // create new userdata
    console.info('Creating new cloud user')
    const newUser = Client.UserProfile.Serialize(localUserData)
    newUser.user_id = username

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

  const data = await fetch(url).then(res => res.text())

  try {
    localStorage.setItem('extra_content.json', data)
  } catch (err) {
    throw new Error(`Malformed content data returned from S3`)
  }
}

const CloudPull = async (addPilotCallback: any): Promise<any> => {
  const cloudPilotKeys = await Storage.list('pilot', { level: 'protected' })
    .then(result => {
      return result.map(k => k.key)
    })
    .catch(err => console.log(err))

  cloudPilotKeys.forEach(async k => {
    const url = await Storage.get(k, { level: 'protected' })

    if (typeof url === 'object') throw new Error('Unsupported S3 return type')

    const data: IPilotData = await fetch(url).then(res => res.json())

    try {
      const match: Pilot = store.getters.getPilots.find((x: Pilot) => x.ID === data.id)
      if (match) {
        // update existing pilot
        match.setPilotData(data)
      } else {
        console.info('Adding New Pilot')
        addPilotCallback(Pilot.Deserialize(data))
      }
    } catch (err) {
      throw new Error(`Malformed Pilot data returned from S3`)
    }
  })
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

const CloudPush = async (user: Client.UserProfile, callback: any): Promise<any> => {
  // collect current cloud pilots
  const cloudPilotIds = await Storage.list('pilot', { level: 'protected' })
    .then(result => {
      return result.map(i => i.key)
    })
    .catch(err => console.log(err))

  const storageIds = []

  // compare against local pilots
  cloudPilotIds.forEach(async pid => {
    const lId = pid.replace('pilot_', '').replace('.json', '')
    const match = store.getters.getPilots.find((x: Pilot) => x.ID === lId)
    if (match) {
      // we found a local version of the cloud ID, so upload them
      const filename = `pilot_${match.ID}.json`
      await UploadS3(filename, Pilot.Serialize(match))
        .then(() => {
          callback('success', `${match.Callsign}//UPDATE SUCCESSFUL`)
          storageIds.push(filename)
        })
        .catch(err => {
          console.error(err)
          callback('error', `Unable to upload pilot data`)
        })
    } else {
      // there is no local match for this cloud pilot, delete them
      await DeleteS3(pid)
        .then(() => {
          console.info('Removed locally-deleted Pilot')
        })
        .catch(err => {
          console.error(err)
          callback('error', `Unable to delete pilot data`)
        })
    }
  })

  // find new pilots
  store.getters.getPilots.forEach(async (p: Pilot) => {
    const filename = `pilot_${p.ID}.json`
    if (cloudPilotIds.includes(filename)) return
    // pilot does not exist in the cloud
    console.log('new pilot found')
    await UploadS3(filename, Pilot.Serialize(p))
      .then(() => {
        callback('success', `${p.Callsign}//ADDED TO VAULT`)
        storageIds.push(filename)
      })
      .catch(err => {
        console.error(err)
        callback('error', `Unable to upload pilot data`)
      })
  })

  user.Pilots = storageIds

  // upload lcps
  const lcps = localStorage.getItem('extra_content.json')
  if (lcps) {
    Storage.put(`extra_content.json`, lcps, {
      level: 'private',
      contentType: 'text/plain',
    }).catch(err => console.error(err))
  }

  const input = Client.UserProfile.Serialize(user)
  delete input.last_sync

  for (const key in input) {
    if (Array.isArray(input[key]) && input[key].length === 0) input[key] = null
  }

  return API.graphql({
    query: updateUserData,
    variables: { input },
  })
}

export { GetSync, ContentPull, CloudPull, CloudPush }
