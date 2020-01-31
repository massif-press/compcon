import Vue from 'vue';

import { getModule } from 'vuex-module-decorators'
import { PilotManagementStore } from '@/store'

export default Vue.extend({
  computed: {
    pilot() {
      return getModule(PilotManagementStore, this.$store).Pilots.find(
        p => p.ID === this.$route.params.pilotID
      )
    },
  },
}
)