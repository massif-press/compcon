import { getModule } from 'vuex-module-decorators'
import { PilotManagementStore } from '@/store'

export default {
  computed: {
    pilot() {
      return getModule(PilotManagementStore, this.$store).Pilots.find(
        p => p.ID === this.$route.params.pilotID
      )
    },
  },
}
