<template>
  <v-container fluid style="margin-top: 40px; overflow-y: hidden" class="pb-0">
    <div class="overline">
      <b>{{ mission.Name }}</b>
      //{{ activeMission.Step.toString().padStart(2, '0') }}:{{
        encounter.Type === 'Encounter' ? encounter.Name : 'Rest'
      }}
    </div>
    <encounter-view
      v-if="encounter.Type === 'Encounter'"
      :active-mission="activeMission"
      :encounter="encounter"
      @finish="next()"
    />
    <rest-view v-else :active-mission="activeMission" :rest="encounter" @finish="next()" />
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
    mission() {
      return this.activeMission.Mission
    },
    encounter() {
      return this.activeMission.Mission.Steps[this.activeMission.Step]
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
