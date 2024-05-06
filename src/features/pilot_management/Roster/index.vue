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
      <v-col cols="auto" align-self="center">
        <v-btn variant="tonal" color="accent" class="mx-4" @click="($refs as any).organize.show()">
          <v-icon start icon="mdi-queue-first-in-last-out" />
          Organize
        </v-btn>
        <cc-solo-dialog
          ref="organize"
          icon="mdi-queue-first-in-last-out"
          no-confirm
          large
          title="Organize">
          <organizer type="encounter" />
        </cc-solo-dialog>
      </v-col>
    </v-row>
    <div class="my-3">
      <group-panel v-for="group in pilotGroups" :group="group" />
    </div>
    <v-divider />
    <div class="pa-4">
      <v-btn
        block
        variant="tonal"
        color="accent"
        size="large"
        @click="($refs as any).newGroup.show()">
        Create New Group
      </v-btn>
      <cc-solo-dialog
        ref="newGroup"
        icon="mdi-account-multiple"
        no-confirm
        large
        title="Add Pilot Group">
        <group-menu @close="($refs as any).newGroup.hide()" />
      </cc-solo-dialog>
    </div>
  </v-container>
</template>

<script lang="ts">
import Organizer from './components/Organizer.vue';
import GroupPanel from './components/GroupPanel.vue';
import GroupMenu from './components/GroupMenu.vue';

import { UserStore, PilotStore } from '@/stores';

export default {
  name: 'roster-view',
  components: { Organizer, GroupPanel, GroupMenu },
  data: () => ({
    sortParams: null,
    newGroupMenu: false,
    newGroupName: '',
    rosterView: 'list',
  }),
  mounted() {
    this.rosterView = this.profile.View('roster', 'list');
  },
  computed: {
    pilotGroups() {
      return PilotStore().getPilotGroups();
    },
    profile() {
      return UserStore().User;
    },
  },
};
</script>
