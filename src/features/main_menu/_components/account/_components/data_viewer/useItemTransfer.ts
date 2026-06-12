import { notify as vueNotify } from '@kyvg/vue3-notification'
import { i18n } from '@/i18n'
const t = i18n.global.t
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
        title: t('notify.transfer.syncCompleteTitle'),
        text: t('notify.transfer.itemSynced', { type: item.ItemType, name: item.Name }),
        data: { icon: 'mdi-cloud-check-variant', color: 'success-darken-2' },
      })
    } catch (err) {
      logger.error(`Error syncing item: ${err}`, {}, err)
      vueNotify({
        title: t('notify.transfer.syncFailedTitle'),
        text: t('notify.transfer.itemSyncFailed', { type: item.ItemType, name: item.Name, err }),
        data: { icon: 'mdi-alert', color: 'error' },
      })
    }
  }

  async function forceSyncLocal(item: any) {
    try {
      await CloudController.ForceUpload(item)
      vueNotify({
        title: t('notify.transfer.uploadCompleteTitle'),
        text: t('notify.transfer.itemUploaded', { type: item.ItemType, name: item.Name }),
        data: { icon: 'mdi-cloud-check-variant', color: 'success-darken-2' },
      })
    } catch (err) {
      logger.error(`Error force-uploading: ${err}`, {}, err)
      vueNotify({
        title: t('notify.transfer.uploadFailedTitle'),
        text: t('notify.transfer.itemUploadFailed', { type: item.ItemType, name: item.Name, err }),
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
        title: t('notify.transfer.downloadCompleteTitle'),
        text: t('notify.transfer.itemDownloaded', { type: item.ItemType, name: item.Name }),
        data: { icon: 'mdi-cloud-check-variant', color: 'success-darken-2' },
      })
    } catch (err) {
      logger.error(`Error force-downloading: ${err}`, {}, err)
      vueNotify({
        title: t('notify.transfer.downloadFailedTitle'),
        text: t('notify.transfer.itemDownloadFailed', { type: item.ItemType, name: item.Name, err }),
        data: { icon: 'mdi-alert', color: 'error' },
      })
    }
  }

  return { sync, forceSyncLocal, forceSyncCloud }
}
