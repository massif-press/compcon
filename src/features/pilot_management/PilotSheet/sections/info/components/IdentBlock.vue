<template>
  <v-row dense class="stat-text text-center">
    <v-col>
      <div class="text-overline mb-n3 pb-1 text-disabled">CALLSIGN</div>
      <cc-short-string-editor :placeholder="pilot.Callsign" @set="pilot.Callsign = $event">
        {{ pilot.Callsign }}
      </cc-short-string-editor>
    </v-col>
    <v-col>
      <div class="text-overline mb-n3 pb-1 text-disabled">NAME</div>
      <cc-short-string-editor :placeholder="pilot.Name" @set="pilot.Name = $event">
        {{ pilot.Name }}
      </cc-short-string-editor>
    </v-col>
    <v-col>
      <div class="text-overline mb-n3 pb-1 text-disabled">
        BACKGROUND
        <background-selector small @select="pilot.Background = $event" />
      </div>
      <cc-short-string-editor :placeholder="pilot.Background" @set="pilot.Background = $event">
        {{ pilot.Background }}
      </cc-short-string-editor>
    </v-col>
    <v-col>
      <div class="text-overline mb-n3 pb-1 text-disabled">PLAYER</div>
      <cc-short-string-editor :placeholder="pilot.PlayerName" @set="pilot.PlayerName = $event">
        {{ pilot.PlayerName || '---' }}
      </cc-short-string-editor>
    </v-col>
    <v-col>
      <div class="text-overline mb-n3 pb-1 text-disabled">STATUS</div>
      <span :class="`stat-text ${statusColor()}text-`" class="pr-2">{{ pilot.Status }}</span>
      <cc-combo-select :items="pilotStatuses" @set="pilot.Status = $event" />
    </v-col>
  </v-row>
</template>

<script lang="ts">
import { Pilot } from '@/class';
import BackgroundSelector from '../../../../_components/selectors/BackgroundSelector.vue';

// import { Auth } from 'aws-amplify';

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
