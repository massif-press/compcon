import { downloadFromS3, updateItem, uploadToS3 } from '@/io/apis/account';
import { dbItemMeta } from './CloudController';
import {
  CampaignStore,
  EncounterStore,
  NarrativeStore,
  NavStore,
  NpcStore,
  PilotStore,
  UserStore,
} from '@/stores';
import { exportAll, importAll } from '@/io/BulkData';

const generateCloudArchive = async (
  source: 'Automatic' | 'Manual'
): Promise<{ meta: dbItemMeta; archive: any }> => {
  const sortkey = `archive_${Date.now()}`;
  const user_id = UserStore().Cognito.userId;
  const meta = {
    user_id,
    sortkey,
    source,
    author: UserStore().Cognito.username,
    name: `COMP/CON Backup - ${new Date().toLocaleString()}`,
    item_modified: Date.now(),
    uri: `${user_id}/archives/${sortkey}.json`,
    preserve: false,
  } as dbItemMeta;
  const archive = await exportAll();

  meta.size = JSON.stringify(archive).length;

  return { meta, archive };
};

export const PostCloudArchive = async (source: 'Automatic' | 'Manual') => {
  const { meta, archive } = await generateCloudArchive(source);

  const res = await updateItem(meta);
  if (res.presign?.upload) {
    const uploadResult = await uploadToS3(archive, res.presign.upload);
    return uploadResult;
  } else {
    throw new Error('No presign returned.');
  }
};

export const DownloadCloudArchive = async (uri: string) => {
  return await downloadFromS3(uri);
};

export const SetCloudArchive = async (data: any, overwriteCloud: boolean) => {
  await importAll(data);

  await PilotStore().LoadPilots();
  await NpcStore().LoadNpcs();
  await NarrativeStore().LoadCollectionItems();
  await EncounterStore().LoadEncounters();
  await CampaignStore().LoadCampaigns();
  await NavStore().CreateIndex();

  if (overwriteCloud) {
    UserStore().AutoSync('local');
  }
};
