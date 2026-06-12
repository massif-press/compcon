import { saveFile } from '@/io/Data'
import { Pilot } from '@/classes/pilot/Pilot'
import { UserStore } from '@/stores'
import { CloudController } from '@/classes/components/cloud/CloudController'
import logger from '@/user/logger'
import { notify } from '@kyvg/vue3-notification'
import { i18n } from '@/i18n'

const t = i18n.global.t

function usePilotActions(props: { pilot: any }) {
  function exportPilot(v2 = false) {
    try {
      saveFile(
        props.pilot.Callsign.toUpperCase().replace(/\W/g, '') + '.json',
        Pilot.Serialize(props.pilot as Pilot),
        'Save Pilot',
        v2
      )
      notify({
        title: t('pm.export.exportSuccessTitle'),
        text: t('pm.export.exportSuccessText', {
          callsign: props.pilot.Callsign.toUpperCase().replace(/\W/g, ''),
        }),
        data: { type: 'success', icon: 'mdi-check' },
      })
    } catch (error) {
      logger.error(`Pilot export failed: ${error}`, props.pilot, error)
      notify({
        title: t('pm.export.exportErrorTitle'),
        text: t('pm.export.exportErrorText'),
        data: { type: 'error', icon: 'mdi-alert' },
      })
    }
  }

  async function remoteUpdate() {
    try {
      await CloudController.UpdateRemote(props.pilot)
      await UserStore().refreshDbData()
      notify({
        title: t('notify.share.syncCompleteTitle'),
        text: t('notify.pilot.syncedText', {
          callsign: props.pilot.Callsign,
          name: props.pilot.Name,
        }),
        data: { icon: 'mdi-cloud-check-variant', color: 'success-darken-2' },
      })
    } catch (err) {
      logger.error(`Error syncing pilot: ${err}`, props.pilot, err)
      notify({
        title: t('notify.share.syncFailedTitle'),
        text: t('notify.pilot.syncFailedText', {
          callsign: props.pilot.Callsign,
          name: props.pilot.Name,
          err: String(err),
        }),
        data: { icon: 'mdi-alert', color: 'error' },
      })
    }
  }

  async function convert(emit?: (event: string) => void, loadingRef?: { value: boolean }) {
    if (loadingRef) loadingRef.value = true
    UserStore().deleteRemoteItem(props.pilot.SaveController.RemoteCode)
    props.pilot.CloudController.GenerateMetadata()
    props.pilot.SaveController.ClearRemote()
    await UserStore().refreshDbData()
    if (loadingRef) loadingRef.value = false
    if (emit) emit('close')
  }

  return { exportPilot, remoteUpdate, convert }
}

export { usePilotActions }
