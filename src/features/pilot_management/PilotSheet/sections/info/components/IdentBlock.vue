<template>
  <v-row dense class="stat-text text-center" justify="space-between" align="center">
    <v-col cols="auto" md="">
      <cc-text-label v-model="pilot.Callsign" :readonly="pilot.IsRemote" label="Callsign" />
    </v-col>
    <v-col cols="auto" md="">
      <cc-text-label v-model="pilot.Name" :readonly="pilot.IsRemote" label="Name" />
    </v-col>
    <v-col cols="auto" md="">
      <cc-text-label v-model="pilot.Background" :readonly="pilot.IsRemote" label="Background">
        <template #append>
          <background-selector v-if="!pilot.IsRemote" small @select="pilot.Background = $event" />
        </template>
      </cc-text-label>
    </v-col>
    <v-col cols="auto" md="">
      <cc-text-label v-model="pilot.PlayerName" :readonly="pilot.IsRemote" label="Player" />
    </v-col>
  </v-row>
</template>

<script lang="ts">
import { Pilot } from '@/class';
import BackgroundSelector from '../../../../_components/selectors/BackgroundSelector.vue';

export default {
  name: 'ident-block',
  components: { BackgroundSelector },
  props: {
    pilot: {
      type: Pilot,
      required: true,
    },
  },
  data: () => ({
    pilotStatuses: [
      { title: 'Active', value: 'ACTIVE' },
      { title: 'Inactive', value: 'INACTIVE' },
      { title: 'Retired', value: 'RET' },
      { title: 'Missing In Action', value: 'MIA' },
      { title: 'Killed In Action', value: 'KIA' },
      { title: 'Unknown', value: 'UNKNOWN' },
    ],
    noteColor: '',
    notification: '',
  }),
  computed: {
    mobile() {
      return this.$vuetify.display.smAndDown;
    },
    statusColor(): string {
      switch (this.pilot.Status.toLowerCase()) {
        case 'active':
          return 'success';
        case 'mia':
        case 'kia':
          return 'error';
        default:
          return 'text';
      }
    },
  },
};
</script>
