import * as Client from '@/user'
import { API } from 'aws-amplify'
import { getUser } from '@/user/store/graphql'
import { createUserData, updateUserData } from '@/graphql/mutations'

interface ISyncReturn {
  cloudOverwrite: boolean
  localOverwrite: boolean
  earlierUser: Client.UserProfile | null
  latestUser: Client.UserProfile
}

const GetSync = async (uid?: string): Promise<ISyncReturn> => {
  const localUserData = await Client.getUser()
  const username = uid || localUserData.UserID

  const res: any = await API.graphql({
    query: getUser,
    variables: { uid: username },
  })

  const userData = res.data.listUserDatas.items[0]

  console.log('pulled from db:')
  console.log(userData)

  if (userData) {
    try {
      const CloudUser = Client.UserProfile.Deserialize(userData)
      const IsCloudNewer =
        !localUserData.updatedAt ||
        new Date(CloudUser.updatedAt) > new Date(localUserData.updatedAt)

      return {
        cloudOverwrite: !IsCloudNewer,
        localOverwrite: IsCloudNewer,
        earlierUser: IsCloudNewer ? localUserData : CloudUser,
        latestUser: IsCloudNewer ? CloudUser : localUserData,
      }
    } catch (error) {
      throw new Error(
        `Unable to deserialize userdata, resorting to last locally saved data\n${error}`
      )
    }
  } else {
    // create new userdata
    const newUser = Client.UserProfile.Serialize(localUserData)
    newUser.user_id = username

    await API.graphql({
      query: createUserData,
      variables: { input: newUser },
    })

    return {
      cloudOverwrite: false,
      localOverwrite: false,
      earlierUser: null,
      latestUser: localUserData,
    }
  }
}

const SyncCloud = async (user: Client.UserProfile): Promise<any> => {
  if (!user.id) throw new Error('Unable to sync, user has no cloud ID')

  return API.graphql({
    query: updateUserData,
    variables: { input: Client.UserProfile.Serialize(user) },
  })
}

export { GetSync, SyncCloud }
