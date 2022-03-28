import * as Client from '@/user'
import { API } from 'aws-amplify'
import { createUserData } from '@/graphql/mutations'
import { syncUserData } from '@/graphql/queries'

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

export { PutNewUserData, GetUserData, GetCloudProfile }
