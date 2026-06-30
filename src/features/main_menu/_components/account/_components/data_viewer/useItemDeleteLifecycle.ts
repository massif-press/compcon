import { ref, computed } from 'vue'
import { notify as vueNotify } from '@kyvg/vue3-notification'
import { UserStore } from '@/stores'
import { CloudController } from '@/classes/components/cloud/CloudController'
import { getItemRegistration } from '@/classes/components/cloud/ItemRegistry'
import { cloudDelete } from '@/io/apis/account'
import logger from '@/user/logger'
import { i18n } from '@/i18n'

const t = i18n.global.t

export function useItemDeleteLifecycle(opts: { refresh: () => void }) {
  const bulkDeleteMode = ref(false)
  const bulkDeleteDialog = ref(false)
  const bulkDeleteScope = ref<'cloud' | 'both'>('cloud')
  const bulkDeleteLoading = ref(false)
  const selectedForDelete = ref<any[]>([])
  const deleteLoading = ref(false)
  const retryingCode = ref<string | null>(null)

  const skipDeleteWarning = computed({
    get: () => UserStore().User.View('skipDeleteWarning_item', false),
    set: (val: boolean) => UserStore().User.SetView('skipDeleteWarning_item', val),
  })
  const skipDeleteWarningPerm = computed({
    get: () => UserStore().User.View('skipDeleteWarningPerm_item', false),
    set: (val: boolean) => UserStore().User.SetView('skipDeleteWarningPerm_item', val),
  })
  const skipDeleteWarningLocal = computed({
    get: () => UserStore().User.View('skipDeleteWarningLocal_item', false),
    set: (val: boolean) => UserStore().User.SetView('skipDeleteWarningLocal_item', val),
  })

  function toggleBulkDelete() {
    bulkDeleteMode.value = !bulkDeleteMode.value
    if (!bulkDeleteMode.value) selectedForDelete.value = []
  }

  async function executeBulkDelete() {
    bulkDeleteLoading.value = true
    const failures: string[] = []
    try {
      for (const item of selectedForDelete.value) {
        try {
          if (item.CloudController?.Metadata?.ItemModified) {
            await CloudController.MarkCloudDeleted(item.CloudController.Metadata).catch((e) =>
              logger.warn(`Bulk delete: failed to mark ${item.Name} as deleted in cloud`, e)
            )
          }
          if (bulkDeleteScope.value === 'both') {
            item.SaveController?.Delete()
          }
        } catch (e) {
          logger.error(`Bulk delete: failed to delete ${item.Name}`, e)
          failures.push(item.Name)
        }
      }
      const succeeded = selectedForDelete.value.length - failures.length
      if (failures.length === 0) {
        vueNotify({
          title: t('notify.dataItem.bulkDeletedTitle', { n: succeeded }, succeeded),
          text: t('notify.dataItem.bulkDeletedText'),
          data: { icon: 'mdi-delete', color: 'success' },
        })
      } else {
        vueNotify({
          title: t('notify.dataItem.bulkPartialTitle', { n: succeeded, f: failures.length }),
          text: t('notify.dataItem.bulkPartialText', { items: failures.join(', ') }),
          data: { icon: 'mdi-alert', color: 'warning' },
        })
      }
      opts.refresh()
    } catch (e) {
      logger.error('Bulk delete failed:', e)
      vueNotify({ title: t('notify.dataItem.bulkFailedTitle'), text: `${e}`, data: { icon: 'mdi-alert', color: 'error' } })
    } finally {
      bulkDeleteLoading.value = false
      bulkDeleteDialog.value = false
      selectedForDelete.value = []
      bulkDeleteMode.value = false
    }
  }

  async function retryBrokenRemote(item: any) {
    const code = item.SaveController?.RemoteCode
    if (!code) return
    retryingCode.value = code
    const ok = await UserStore().retryBrokenRemote(code)
    retryingCode.value = null
    if (ok) {
      vueNotify({ title: t('notify.dataItem.connectionRestoredTitle'), text: t('notify.dataItem.connectionRestoredText', { name: item.Name }), data: { icon: 'mdi-link-variant', color: 'success' } })
      opts.refresh()
    } else {
      vueNotify({ title: t('notify.dataItem.retryFailedTitle'), text: t('notify.dataItem.retryFailedText', { name: item.Name }), data: { icon: 'mdi-alert', color: 'error' } })
    }
  }

  function convertToLocal(item: any) {
    const code = item.SaveController?.RemoteCode
    if (!code) return
    UserStore().convertBrokenRemoteToLocal(code)
    vueNotify({ title: t('notify.dataItem.convertedTitle'), text: t('notify.dataItem.convertedText', { name: item.Name }), data: { icon: 'mdi-content-save', color: 'success' } })
    opts.refresh()
  }

  async function deleteItem(item: any) {
    deleteLoading.value = true
    try {
      await CloudController.MarkCloudDeleted(item.CloudController.Metadata)
      opts.refresh()
      vueNotify({
        title: t('notify.dataItem.itemDeletedTitle'),
        text: t('notify.dataItem.markedDeletedText', { type: item.ItemType, name: item.Name }),
        data: { icon: 'mdi-delete', color: 'success' },
      })
      deleteLoading.value = false
      return true
    } catch (err) {
      logger.error(`Error deleting item: ${err}`, {}, err)
      vueNotify({
        title: t('notify.dataItem.deleteFailedTitle'),
        text: t('notify.dataItem.serverError', { err: String(err) }),
        data: { icon: 'mdi-alert', color: 'error' },
      })
    }
    deleteLoading.value = false
  }

  async function restoreItem(item: any) {
    deleteLoading.value = true
    try {
      await CloudController.Undelete(item.CloudController.Metadata)
      vueNotify({
        title: t('notify.dataItem.itemRestoredTitle'),
        text: t('notify.dataItem.restoredText', { type: item.ItemType, name: item.Name }),
        data: { icon: 'mdi-delete', color: 'success' },
      })
      deleteLoading.value = false
      return true
    } catch (err) {
      logger.error(`Error restoring item: ${err}`, {}, err)
      vueNotify({
        title: t('notify.dataItem.restoreFailedTitle'),
        text: t('notify.dataItem.serverError', { err: String(err) }),
        data: { icon: 'mdi-alert', color: 'error' },
      })
    }
    deleteLoading.value = false
  }

  async function deleteItemPermanent(item: any) {
    deleteLoading.value = true
    try {
      const { user_id, sortkey, uri } = item.CloudController.Metadata.Serialize()
      await cloudDelete(user_id, sortkey, uri)
      if (item.SaveController) {
        item.CloudController.Metadata = CloudController.GenerateMetadata(item.CloudController)
        item.CloudController.Metadata.ItemModified = 0
      }
      const store = UserStore()
      const cidx = store.CloudItems.findIndex((x: any) => x.sortkey === sortkey)
      if (cidx > -1) store.CloudItems.splice(cidx, 1)
      opts.refresh()
      vueNotify({
        title: t('notify.dataItem.deletedPermanentlyTitle'),
        text: t('notify.dataItem.removedText', { type: item.ItemType, name: item.Name }),
        data: { icon: 'mdi-delete', color: 'success' },
      })
      deleteLoading.value = false
      return true
    } catch (err) {
      logger.error(`Error deleting item: ${err}`, {}, err)
      vueNotify({
        title: t('notify.image.deleteFailedTitle'),
        text: t('notify.dataItem.serverError', { err: String(err) }),
        data: { icon: 'mdi-alert', color: 'error' },
      })
    }
    deleteLoading.value = false
  }

  function restoreLocalItem(item: any) {
    item.SaveController.Restore()
    vueNotify({
      title: t('notify.dataItem.itemRestoredTitle'),
      text: t('notify.dataItem.restoredText', { type: item.ItemType, name: item.Name }),
      data: { icon: 'mdi-restore', color: 'success' },
    })
  }

  async function deleteLocalItemPermanent(item: any, silent = false) {
    deleteLoading.value = true
    try {
      const reg = getItemRegistration(item.ItemType)
      if (!reg) throw new Error(`Unknown item type: ${item.ItemType}`)
      await reg.deleteLocal(item)
      if (!silent) {
        vueNotify({
          title: t('notify.dataItem.itemDeletedTitle'),
          text: t('notify.dataItem.removedText', { type: item.ItemType, name: item.Name }),
          data: { icon: 'mdi-delete', color: 'success' },
        })
      }
      deleteLoading.value = false
      return true
    } catch (err) {
      logger.error(`Error permanently deleting local item: ${err}`, {}, err)
      if (!silent) {
        vueNotify({
          title: t('notify.dataItem.deleteFailedTitle'),
          text: t('notify.dataItem.failedToDeleteText', { type: item.ItemType, name: item.Name, err: String(err) }),
          data: { icon: 'mdi-alert', color: 'error' },
        })
      }
      throw err
    }
  }

  return {
    bulkDeleteMode,
    bulkDeleteDialog,
    bulkDeleteScope,
    bulkDeleteLoading,
    selectedForDelete,
    deleteLoading,
    retryingCode,
    skipDeleteWarning,
    skipDeleteWarningPerm,
    skipDeleteWarningLocal,
    toggleBulkDelete,
    executeBulkDelete,
    retryBrokenRemote,
    convertToLocal,
    deleteItem,
    restoreItem,
    deleteItemPermanent,
    restoreLocalItem,
    deleteLocalItemPermanent,
  }
}
