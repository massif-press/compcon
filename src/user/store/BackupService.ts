import { PostCloudArchive } from '@/classes/components/cloud/CloudArchive'
import { cloudDelete } from '@/io/apis/account'
import { CloudDataStore } from './CloudDataStore'
import { UserMetadataStore } from './UserMetadataStore'
import { NotificationStore } from './NotificationStore'
import type { BackupStore as BackupStoreType } from './BackupStore'

export async function pruneBackups(
  backupStore: ReturnType<typeof BackupStoreType>
): Promise<void> {
  const toDelete = backupStore.PrunableBackups
  if (!toDelete.length) return

  const userID = UserMetadataStore().UserMetadata.UserID
  const promises = toDelete.map((b: any) => cloudDelete(userID, b.sortkey, b.uri))
  await Promise.all(promises)
  await CloudDataStore().setMetadataFromDynamo()
}

export async function autoBackup(
  backupStore: ReturnType<typeof BackupStoreType>,
  startup = false
): Promise<void> {
  if (backupStore.BackupSpaceExceeded) return
  if (backupStore.BackupLimitExceeded) return

  const syncSettings = UserMetadataStore().SyncSettings
  let shouldRun = false
  const backupFrequency = syncSettings?.autoBackupFrequency
  const lastBackup = syncSettings?.lastBackupTime

  switch (backupFrequency) {
    case 'appstart':
      shouldRun = startup
      break
    case 'daily':
      shouldRun = Date.now() - new Date(lastBackup).getTime() > 86400000
      break
    case 'weekly':
      shouldRun = Date.now() - new Date(lastBackup).getTime() > 604800000
      break
    case 'monthly':
      shouldRun = Date.now() - new Date(lastBackup).getTime() > 2592000000
      break
  }
  if (!shouldRun) return

  await PostCloudArchive('Automatic')
  NotificationStore().addCloudNotification('Uploaded new cloud backup.')

  UserMetadataStore().SyncSettings.lastBackupTime = Date.now()
  await UserMetadataStore().setUserMetadata()
}
