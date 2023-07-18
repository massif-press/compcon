<template>
  <v-container>
    <v-row align="end">
      <v-col cols="12" md="auto">
        <div class="heading h1 mb-n3">Pilot Roster</div>
      </v-col>
      <v-col cols="auto">
        <v-btn-toggle v-model="rosterView" mandatory class="mt-n4">
          <v-btn icon value="list" @click="profile.SetView('roster', 'list')">
            <v-icon color="accent">mdi-view-list</v-icon>
          </v-btn>
          <v-btn icon value="cards" @click="profile.SetView('roster', 'cards')">
            <v-icon color="accent">mdi-view-grid</v-icon>
          </v-btn>
          <v-btn icon value="small-cards" @click="profile.SetView('roster', 'small-cards')">
            <v-icon color="accent">mdi-grid</v-icon>
          </v-btn>
        </v-btn-toggle>
      </v-col>
    </v-row>
    <v-slide-x-transition mode="out-in">
      <v-container>
        <div v-for="pilot in pilots">
          <component
            :is="pilotCardType"
            :pilot="pilot"
            :small="rosterView === 'small-cards'"
            @goTo="toPilotSheet($event)"
          />
        </div>
      </v-container>
    </v-slide-x-transition>
    <v-row density="compact" justify="end">
      <v-col cols="auto">
        <v-btn x-small color="primary" @click="($refs as any).delete.show()">Delete Multiple</v-btn>
        <cc-solo-dialog ref="delete" icon="mdi-delete" no-confirm large title="Delete Multiple">
          <cc-mass-delete :items="pilots" />
        </cc-solo-dialog>
      </v-col>
    </v-row>
    <v-divider class="my-3" />
    <v-row density="compact" justify="center">
      <v-col cols="auto" class="mx-4">
        <v-btn size="x-large" tile color="accent" @click="$router.push('new')">
          <v-icon start large>cc:accuracy</v-icon>
          Create New Pilot
        </v-btn>
      </v-col>
      <v-col cols="auto" class="mx-4">
        <v-btn size="x-large" tile color="accent" @click="($refs as any).import.show()">
          <v-icon large left class="pr-2">mdi-import</v-icon>
          Import Pilot
        </v-btn>
      </v-col>
    </v-row>
    <cc-solo-dialog ref="import" icon="cc:pilot" no-confirm large title="Import Pilot">
      <import-dialog />
    </cc-solo-dialog>
  </v-container>
</template>

<script lang="ts">
import PilotCard from './components/PilotCard.vue';
import PilotListItem from './components/PilotListItem.vue';
import ImportDialog from './components/ImportDialog.vue';

import { UserStore, PilotStore } from '@/stores';
import { Pilot } from '@/class';
import { UserProfile } from '@/user';

export default {
  name: 'roster-view',
  components: { ImportDialog, PilotListItem, PilotCard },
  data: () => ({
    sortParams: null,
    newGroupMenu: false,
    newGroupName: '',
    rosterView: 'list',
    groups: [],
  }),
  computed: {
    pilotStore() {
      const mod = PilotStore();
      return mod;
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
    profile(): UserProfile {
      const store = UserStore();
      return store.UserProfile as any;
    },
    pilots() {
      return this.pilotStore.Pilots;
    },
    getRosterView(): string {
      return 'list';
      if (!this.profile || !this.profile.GetView) return 'list';
      return this.profile.GetView('roster');
    },
  },
  mounted() {
    this.rosterView = this.getRosterView;
  },
  methods: {
    toPilotSheet(pilotId: string) {
      this.$router.push({ name: 'pilot_sheet_redirect', params: { pilotID: pilotId } });
    },
  },
};
</script>
