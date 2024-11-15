<template>
  <v-row dense class="stat-text text-center">
    <v-col>
      <div class="text-overline mb-n3 pb-1 text-disabled">CALLSIGN</div>
      <cc-short-string-editor
        :readonly="pilot.IsRemote"
        :placeholder="pilot.Callsign"
        @set="pilot.Callsign = $event">
        {{ pilot.Callsign }}
      </cc-short-string-editor>
    </v-col>
    <v-col>
      <div class="text-overline mb-n3 pb-1 text-disabled">NAME</div>
      <cc-short-string-editor
        :readonly="pilot.IsRemote"
        :placeholder="pilot.Name"
        @set="pilot.Name = $event">
        {{ pilot.Name }}
      </cc-short-string-editor>
    </v-col>
    <v-col>
      <div class="text-overline mb-n3 pb-1 text-disabled">
        BACKGROUND
        <background-selector v-if="!pilot.IsRemote" small @select="pilot.Background = $event" />
      </div>
      <cc-short-string-editor
        :readonly="pilot.IsRemote"
        :placeholder="pilot.Background"
        @set="pilot.Background = $event">
        {{ pilot.Background }}
      </cc-short-string-editor>
    </v-col>
    <v-col>
      <div class="text-overline mb-n3 pb-1 text-disabled">PLAYER</div>
      <cc-short-string-editor
        :readonly="pilot.IsRemote"
        :placeholder="pilot.PlayerName"
        @set="pilot.PlayerName = $event">
        {{ pilot.PlayerName || '---' }}
      </cc-short-string-editor>
    </v-col>
    <v-col>
      <div class="text-overline mb-n3 pb-1 text-disabled">STATUS</div>
      <v-menu offset-y :close-on-content-click="false" width="300">
        <template #activator="{ props }">
          <v-chip
            v-bind="!pilot.IsRemote ? props : ''"
            label
            :color="statusColor"
            class="stat-text"
            v-text="pilot.Status" />
        </template>
        <template v-slot:default="{ isActive }">
          <v-card outlined>
            <v-card-text>
              <v-select
                v-model="pilot.Status"
                autofocus
                density="compact"
                variant="outlined"
                hide-details
                :items="pilotStatuses"
                item-value="value"
                @update:modelValue="isActive.value = false" />
            </v-card-text>
          </v-card>
        </template>
      </v-menu>
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
