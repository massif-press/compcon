import { PostCloudArchive } from '@/classes/components/cloud/CloudArchive'
import { cloudDelete } from '@/io/apis/account'

export interface BackupContext {
  BackupSpaceExceeded: boolean
  BackupLimitExceeded: boolean
  PrunableBackups: any[]
  SyncSettings: any
  UserMetadata: { UserID: string }
  CloudStorageFull: boolean
  addCloudNotification: (text: string, type?: string) => void
  setMetadataFromDynamo: () => Promise<void>
  setUserMetadata: () => Promise<void>
}

export async function pruneBackups(ctx: BackupContext): Promise<void> {
  const toDelete = ctx.PrunableBackups
  if (!toDelete.length) return

  const promises: Promise<any>[] = []
  toDelete.forEach(b => {
    promises.push(cloudDelete(ctx.UserMetadata.UserID, b.sortkey, b.uri))
    ctx.addCloudNotification(`Pruned cloud backup "${b.name}".`)
  })

  await Promise.all(promises)
  await ctx.setMetadataFromDynamo()
}

export async function autoBackup(ctx: BackupContext, startup = false): Promise<void> {
  if (ctx.BackupSpaceExceeded) return
  if (ctx.BackupLimitExceeded) return

  let shouldRun = false
  const backupFrequency = ctx.SyncSettings?.autoBackupFrequency
  const lastBackup = ctx.SyncSettings?.lastBackupTime

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
  ctx.addCloudNotification('Uploaded new cloud backup.')

  ctx.SyncSettings.lastBackupTime = Date.now()
  await ctx.setUserMetadata()
}
