<template>
  <cc-tabs ref="tabs" fixed color="pilot">
    <template #tabs>
      <v-tab value="narrative">narrative</v-tab>
      <v-tab value="downtime">downtime</v-tab>
      <v-tab value="encounter">encounter</v-tab>
    </template>
    <v-window-item value="narrative" :key="0">
      <pilot-narrative-runner />
    </v-window-item>
    <v-window-item value="downtime" :key="1">
      <pilot-downtime-runner />
    </v-window-item>
    <v-window-item value="encounter" :key="2">
      <pilot-encounter-runner />
    </v-window-item>
  </cc-tabs>
</template>

<script>
import PilotDowntimeRunner from './runners/PilotDowntimeRunner.vue';
import PilotEncounterRunner from './runners/PilotEncounterRunner.vue';
import PilotNarrativeRunner from './runners/PilotNarrativeRunner.vue';

export default {
  name: 'pilot-runner',
  components: {
    PilotDowntimeRunner,
    PilotEncounterRunner,
    PilotNarrativeRunner,
  },
};
</script>
