import { notify as vueNotify } from '@kyvg/vue3-notification'
import { CloudController } from '@/classes/components/cloud/CloudController'
import logger from '@/user/logger'

export function useItemTransfer(opts: { refresh: () => void }) {
  async function sync(item: any) {
    try {
      if (item._isRemote) {
        await CloudController.UpdateRemote(item)
      } else if (item.IsCloudOnly) {
        await CloudController.ForceDownload(item)
      } else if (item.CloudController.Metadata?.Updated) {
        await item.CloudController.syncFromCloud()
      } else {
        await CloudController.ForceUpload(item)
      }
      vueNotify({
        title: `Sync Complete`,
        text: `${item.ItemType} ${item.Name} synced.`,
        data: { icon: 'mdi-cloud-check-variant', color: 'success-darken-2' },
      })
    } catch (err) {
      logger.error(`Error syncing item: ${err}`, {}, err)
      vueNotify({
        title: `Sync Failed`,
        text: `Failed to sync ${item.ItemType} ${item.Name}. ${err}`,
        data: { icon: 'mdi-alert', color: 'error' },
      })
    }
  }

  async function forceSyncLocal(item: any) {
    try {
      await CloudController.ForceUpload(item)
      vueNotify({
        title: `Upload Complete`,
        text: `${item.ItemType} ${item.Name} uploaded.`,
        data: { icon: 'mdi-cloud-check-variant', color: 'success-darken-2' },
      })
    } catch (err) {
      logger.error(`Error force-uploading: ${err}`, {}, err)
      vueNotify({
        title: `Upload Failed`,
        text: `Failed to upload ${item.ItemType} ${item.Name}. ${err}`,
        data: { icon: 'mdi-alert', color: 'error' },
      })
    }
  }

  async function forceSyncCloud(item: any) {
    try {
      if (item.IsCloudOnly) {
        await CloudController.ForceDownload(item)
      } else {
        await item.CloudController.syncFromCloud()
      }
      opts.refresh()
      vueNotify({
        title: `Download Complete`,
        text: `${item.ItemType} ${item.Name} merged from cloud.`,
        data: { icon: 'mdi-cloud-check-variant', color: 'success-darken-2' },
      })
    } catch (err) {
      logger.error(`Error force-downloading: ${err}`, {}, err)
      vueNotify({
        title: `Download Failed`,
        text: `Failed to download ${item.ItemType} ${item.Name}. ${err}`,
        data: { icon: 'mdi-alert', color: 'error' },
      })
    }
  }

  return { sync, forceSyncLocal, forceSyncCloud }
}
