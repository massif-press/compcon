import { downloadFromS3, updateItem, uploadToS3 } from '@/io/apis/account'
import { dbItemMeta } from './CloudController'
import {
  CampaignStore,
  EncounterStore,
  NarrativeStore,
  NavStore,
  NpcStore,
  PilotStore,
  UserStore,
} from '@/stores'
import { exportAll, importAll } from '@/io/BulkData'

const generateCloudArchive = async (
  source: 'Automatic' | 'Manual'
): Promise<{ meta: dbItemMeta; archiveBody: string }> => {
  const sortkey = `archive_${Date.now()}`
  const user_id = UserStore().Cognito.userId
  const meta = {
    user_id,
    sortkey,
    source,
    author: UserStore().Cognito.username,
    name: `COMP/CON Backup - ${new Date().toLocaleString()}`,
    item_modified: Date.now(),
    uri: `${user_id}/archives/${sortkey}.json`,
    preserve: false,
  } as dbItemMeta
  const archive = await exportAll()
  const archiveBody = JSON.stringify(archive)
  meta.size = archiveBody.length

  return { meta, archiveBody }
}

export const PostCloudArchive = async (source: 'Automatic' | 'Manual') => {
  const { meta, archiveBody } = await generateCloudArchive(source)

  const res = await updateItem(meta)
  if (res.presign?.upload) {
    const uploadResult = await uploadToS3(archiveBody, res.presign.upload)
    UserStore().addCloudNotification(`Archive ${new Date().toLocaleString()} uploaded to cloud.`)
    return uploadResult
  } else {
    throw new Error('No presign returned.')
  }
}

export const DownloadCloudArchive = async (uri: string) => {
  const data = await downloadFromS3(uri)
  if (!data) throw new Error(`Failed to download archive: ${uri}`)
  return data
}

export const SetCloudArchive = async (data: any, overwriteCloud: boolean) => {
  await importAll(data.data)

  await PilotStore().LoadPilots()
  await NpcStore().LoadNpcs()
  await NarrativeStore().LoadCollectionItems()
  await EncounterStore().LoadEncounters()
  await CampaignStore().LoadCampaigns()
  await NavStore().CreateIndex()

  if (overwriteCloud) {
    UserStore().AutoSync('local')
  }
}
