import { saveFile } from '@/io/Data'
import { Pilot } from '@/classes/pilot/Pilot'
import { UserStore } from '@/stores'
import { CloudController } from '@/classes/components/cloud/CloudController'
import logger from '@/user/logger'

export const pilotActionsMixin = {
  methods: {
    exportPilot(v2 = false) {
      try {
        saveFile(
          this.pilot.Callsign.toUpperCase().replace(/\W/g, '') + '.json',
          Pilot.Serialize(this.pilot as Pilot),
          'Save Pilot',
          v2
        )
        this.$notify({
          title: 'Export Success',
          text: `Pilot data saved as "${this.pilot.Callsign.toUpperCase().replace(
            /\W/g,
            ''
          )}.json"`,
          data: { type: 'success', icon: 'mdi-check' },
        })
      } catch (error) {
        logger.error(`Pilot export failed: ${error}`, this, error)
        this.$notify({
          title: 'Export Error',
          text: 'COMP/CON was unable to export pilot data',
          data: { type: 'error', icon: 'mdi-alert' },
        })
      }
    },
    async remoteUpdate() {
      try {
        await CloudController.UpdateRemote(this.pilot)
        await UserStore().refreshDbData()
        this.$notify({
          title: `Sync Complete`,
          text: `Pilot ${this.pilot.Callsign} // ${this.pilot.Name} synced.`,
          data: { icon: 'mdi-cloud-check-variant', color: 'success-darken-2' },
        })
      } catch (err) {
        logger.error(`Error syncing pilot: ${err}`, this, err)
        this.$notify({
          title: `Sync Failed`,
          text: `Failed to sync Pilot ${this.pilot.Callsign} // ${this.pilot.Name}. ${err}`,
          data: { icon: 'mdi-alert', color: 'error' },
        })
      }
    },
    async convert() {
      this.loading = true
      UserStore().deleteRemoteItem(this.pilot.SaveController.RemoteCode)
      this.pilot.CloudController.GenerateMetadata()
      this.pilot.SaveController.ClearRemote()
      await UserStore().refreshDbData()
      this.loading = false
      this.$emit('close')
    },
  },
}
