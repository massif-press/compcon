<template>
  <v-expansion-panel>
    <v-expansion-panel-title
      >{{ group.Name }}
      <span v-if="!noGroup">
        ({{ group.Pilots.length }} Pilot{{ group.Pilots.length > 1 ? 's' : '' }})</span
      ></v-expansion-panel-title
    >
    <v-expansion-panel-text>
      <div v-if="!noGroup">
        <v-row>
          <v-col>
            description
            <br />
            history
            <br />
          </v-col>
          <v-col cols="3"> image </v-col>
        </v-row>
      </div>

      <v-card-text class="pa-1">
        <component
          v-for="pilot in group.Pilots"
          :is="pilotCardType"
          :pilot="pilot"
          :small="rosterView === 'small-cards'"
          @goTo="toPilotSheet($event)"
        />
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn
          color="accent"
          prepend-icon="cc:accuracy"
          variant="tonal"
          class="mx-5"
          @click="$router.push('new')"
        >
          Create New Pilot
        </v-btn>

        <v-btn
          color="accent"
          prepend-icon="mdi-import"
          variant="tonal"
          class="mx-5"
          @click="($refs as any).import.show()"
        >
          Import Pilot
        </v-btn>
      </v-card-actions>
    </v-expansion-panel-text>
  </v-expansion-panel>
  <cc-solo-dialog ref="import" icon="cc:pilot" no-confirm large title="Import Pilot">
    <import-dialog />
  </cc-solo-dialog>
</template>

<script lang="ts">
import { UserStore } from '@/stores';
import PilotCard from './PilotCard.vue';
import PilotListItem from './PilotListItem.vue';
import { UserProfile } from '@/user';
import ImportDialog from './ImportDialog.vue';

export default {
  name: 'group-panel',
  props: {
    group: {
      type: Object,
      required: true,
    },
  },
  components: { PilotCard, PilotListItem, ImportDialog },
  computed: {
    noGroup(): boolean {
      return this.group.ID === 'no_group';
    },
    profile(): UserProfile {
      return UserStore().UserProfile as any;
    },
    rosterView(): string {
      if (!this.profile || !this.profile.View) return 'list';
      return this.profile.View('roster');
    },
    pilotCardType(): string {
      switch (this.rosterView) {
        case 'cards':
        case 'small-cards':
          return 'pilot-card';
        case 'list':
        default:
          return 'pilot-list-item';
      }
    },
  },
  methods: {
    toPilotSheet(pilotId: string) {
      this.$router.push({ name: 'pilot_sheet_redirect', params: { pilotID: pilotId } });
    },
  },
};
</script>
