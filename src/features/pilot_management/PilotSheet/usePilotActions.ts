import { saveFile } from '@/io/Data'
import { Pilot } from '@/classes/pilot/Pilot'
import { UserStore } from '@/stores'
import { CloudController } from '@/classes/components/cloud/CloudController'
import logger from '@/user/logger'
import { notify } from '@kyvg/vue3-notification'

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
        title: 'Export Success',
        text: `Pilot data saved as "${props.pilot.Callsign.toUpperCase().replace(/\W/g, '')}.json"`,
        data: { type: 'success', icon: 'mdi-check' },
      })
    } catch (error) {
      logger.error(`Pilot export failed: ${error}`, props.pilot, error)
      notify({
        title: 'Export Error',
        text: 'COMP/CON was unable to export pilot data',
        data: { type: 'error', icon: 'mdi-alert' },
      })
    }
  }

  async function remoteUpdate() {
    try {
      await CloudController.UpdateRemote(props.pilot)
      await UserStore().refreshDbData()
      notify({
        title: 'Sync Complete',
        text: `Pilot ${props.pilot.Callsign} // ${props.pilot.Name} synced.`,
        data: { icon: 'mdi-cloud-check-variant', color: 'success-darken-2' },
      })
    } catch (err) {
      logger.error(`Error syncing pilot: ${err}`, props.pilot, err)
      notify({
        title: 'Sync Failed',
        text: `Failed to sync Pilot ${props.pilot.Callsign} // ${props.pilot.Name}. ${err}`,
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
