<template>
  <v-container>
    <v-row dense class="stat-text text-center">
      <v-col>
        <div class="text-overline mb-n3 pb-1 text-subtle">CALLSIGN</div>
        <cc-short-string-editor @set="pilot.Callsign = $event">
          {{ pilot.Callsign }}
        </cc-short-string-editor>
      </v-col>
      <v-col>
        <div class="text-overline mb-n3 pb-1 text-subtle">NAME</div>
        <cc-short-string-editor @set="pilot.Name = $event">{{ pilot.Name }}</cc-short-string-editor>
      </v-col>
      <v-col>
        <div class="text-overline mb-n3 pb-1 text-subtle">BACKGROUND</div>
        <cc-short-string-editor class="d-inline" @set="pilot.Background = $event">
          {{ pilot.Background }}
        </cc-short-string-editor>
        <span>
          <cc-background-selector small @select="pilot.Background = $event" />
        </span>
      </v-col>
      <v-col>
        <div class="text-overline mb-n3 pb-1 text-subtle">PLAYER</div>
        <cc-short-string-editor @set="pilot.PlayerName = $event">
          {{ pilot.PlayerName || '---' }}
        </cc-short-string-editor>
      </v-col>
      <v-col>
        <div class="text-overline mb-n3 pb-1 text-subtle">STATUS</div>
        <span :class="`stat-text ${statusColor()}text-`">{{ pilot.Status }}</span>
        <cc-combo-select :items="pilotStatuses" @set="pilot.Status = $event" />
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { Pilot } from '@/class';

// import { Auth } from 'aws-amplify';

export default {
  name: 'ident-block',
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
    syncing: false,
    currentAuthedUser: null,
  }),
  async mounted() {
    // await Auth.currentAuthenticatedUser().then((res) => {
    //   this.currentAuthedUser = !!res.username;
    // });
  },
  methods: {
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
