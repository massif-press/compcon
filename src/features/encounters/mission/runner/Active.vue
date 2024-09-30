<template>
  <v-container v-if="activeMission" fluid style="margin-top: 40px; overflow-y: hidden" class="pb-0">
    <div class="overline my-n2">
      <b>{{ mission.Name }}</b>
      //{{ activeMission.Step.toString().padStart(2, '0') }}:{{
        activeMission.Encounter.StepType === 'Encounter' ? activeMission.Encounter.Name : 'Rest'
      }}
    </div>
    <encounter-view
      v-if="activeMission.Encounter.StepType === 'Encounter'"
      :active-mission="activeMission"
      @finish="next()"
    />
    <rest-view
      v-else
      :active-mission="activeMission"
      :rest="activeMission.Encounter"
      @finish="next()"
    />
  </v-container>
  <v-container v-else-if="activeMissionCount > 0" fluid style="margin-top: 40px; overflow-y: hidden" class="pb-0">
    <div class="overline my-nw">
      Loading failed.  Please retry.
    </div>
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue'
import EncounterView from './views/EncounterView.vue'
import RestView from './views/RestView.vue'
import { getModule } from 'vuex-module-decorators'
import { MissionStore } from '@/store'

export default Vue.extend({
  name: 'active-mission-runner',
  components: { EncounterView, RestView },
  props: {
    id: {
      type: String,
      required: true,
    },
  },
  computed: {
    activeMission() {
      const store = getModule(MissionStore, this.$store)
      return store.ActiveMissions.find(x => x.ID === this.id)
    },
    activeMissionCount() {
      const store = getModule(MissionStore, this.$store)
      console.log(store.ActiveMissions.length)
      return store.ActiveMissions.length
    },
    mission() {
      return this.activeMission.Mission
    },
  },
  methods: {
    next() {
      this.activeMission.EndStep()
      if (this.activeMission.IsComplete) {
        this.$router.push({ name: 'mission-debriefing', params: { id: this.activeMission.ID } })
      }
    },
  },
})
</script>
