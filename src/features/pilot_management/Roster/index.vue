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
      <v-col cols="auto" class="ml-auto" align-self="center">
        <v-btn x-small color="primary" @click="($refs as any).organize.show()">Organize</v-btn>
        <cc-solo-dialog ref="organize" icon="mdi-cog-outline" no-confirm large title="Organize">
          <organize-panel />
        </cc-solo-dialog>
      </v-col>
    </v-row>
    <v-expansion-panels class="my-3">
      <group-panel v-for="group in pilotGroups" :group="group" />
    </v-expansion-panels>
    <v-divider />
    <div class="pa-4">
      <v-btn block variant="outlined" color="accent" @click="($refs as any).newGroupMenu = true">
        Create New Group
      </v-btn>
    </div>
  </v-container>
</template>

<script lang="ts">
import OrganizePanel from './components/OrganizePanel.vue';
import GroupPanel from './components/GroupPanel.vue';

import { UserStore, PilotStore } from '@/stores';
import { UserProfile } from '@/user';

export default {
  name: 'roster-view',
  components: { OrganizePanel, GroupPanel },
  data: () => ({
    sortParams: null,
    newGroupMenu: false,
    newGroupName: '',
    rosterView: 'list',
    groups: [],
  }),
  computed: {
    pilotStore() {
      return PilotStore();
    },
    pilotGroups() {
      return this.pilotStore.PilotGroups;
    },
    profile(): UserProfile {
      return UserStore().UserProfile as any;
    },
  },
};
</script>
