import * as Client from '@/user'
import { API, Auth } from 'aws-amplify'
import * as APIv2 from '../user/api'
import { createUserData, updateUserData } from '@/graphql/mutations'
import _ from 'lodash'

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

const GetUserData = async (): Promise<any> => {
  const authedUser = await Auth.currentAuthenticatedUser({
    bypassCache: true,
  })
  const id = authedUser.username

  const res = await APIv2.get(id)

  return res.data
}

const GetCloudProfile = async (uid?: string): Promise<Client.UserProfile> => {
  const localUserData = Client.getLocalProfile()
  const user_id = uid || localUserData.UserID

  const userData = await GetUserData()

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

const _updateUserData = async (user: Client.UserProfile, v2Update?: boolean): Promise<any> => {
  if (v2Update && !_.has(user.SyncFrequency, 'cloudSync_v2')) {
    user.SyncFrequency = { cloudSync_v2: false, remotes: false }
  }

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

const UpdateUserData = async (user: Client.UserProfile, v2Update?: boolean): Promise<any> => {
  if (v2Update) _updateUserData(user, true)
  else debounced(user, false)
}

const debounced = _.debounce(_updateUserData, 500, { maxWait: 3000, trailing: true })

export { PutNewUserData, GetUserData, GetCloudProfile, UpdateUserData }
