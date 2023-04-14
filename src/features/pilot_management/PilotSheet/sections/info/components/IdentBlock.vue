<template>
  <v-container fluid class="pt-0">
    <v-row density="compact" class="stat-text pt-0 pb-0 mt-n2">
      <v-col cols="6" md="4" xl="3">
        <div class="text-overline mb-n3 text-subtle">CALLSIGN</div>
        <cc-short-string-editor @set="pilot.Callsign = $event">
          {{ pilot.Callsign }}
        </cc-short-string-editor>
      </v-col>
      <v-col cols="6" md="4" xl="3">
        <div class="text-overline mb-n3 text-subtle">NAME</div>
        <cc-short-string-editor @set="pilot.Name = $event">{{
          pilot.Name
        }}</cc-short-string-editor>
      </v-col>
      <v-col cols="6" md="4" xl="3">
        <div class="text-overline mb-n3 text-subtle">BACKGROUND</div>
        <cc-short-string-editor
          class="d-inline"
          @set="pilot.Background = $event"
        >
          {{ pilot.Background }}
        </cc-short-string-editor>
        <span>
          <cc-background-selector
            :pilot="pilot"
            small
            class="d-inline fade-select ml-n1"
            @select="pilot.Background = $event"
          />
        </span>
      </v-col>
      <v-col cols="6" md="4" xl="3">
        <div class="text-overline mb-n3 text-subtle">PLAYER</div>
        <cc-short-string-editor @set="pilot.PlayerName = $event">
          {{ pilot.PlayerName || '---' }}
        </cc-short-string-editor>
      </v-col>
      <v-col cols="6" md="4" xl="3">
        <div class="text-overline mb-n3 text-subtle">STATUS</div>
        <span :class="`stat-text ${statusColor()}text-`">{{
          pilot.Status
        }}</span>
        <cc-combo-select :items="pilotStatuses" @set="pilot.Status = $event" />
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
// import { Auth } from 'aws-amplify';

export default {
  name: 'ident-block',
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
    await Auth.currentAuthenticatedUser().then((res) => {
      this.currentAuthedUser = !!res.username;
    });
  },
  methods: {
    statusColor(): string {
      switch (this.pilot.Status.toLowerCase()) {
        case 'active':
          return 'success';
          break;
        case 'mia':
        case 'kia':
          return 'error';
        default:
          return 'text';
          break;
      }
    },
  },
};
</script>
