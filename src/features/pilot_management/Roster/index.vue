<template>
  <v-container class="pb-12" :class="mobile && 'mt-2'">
    <v-row align="center">
      <v-col cols="12" md="auto">
        <div class="heading h1" style="line-height: 0">Pilot Roster</div>
      </v-col>
      <v-spacer />
      <v-col cols="auto">
        <v-btn-toggle v-model="rosterView" mandatory tile>
          <v-btn icon class="pa-0" value="list" @click="profile.SetView('roster', 'list')">
            <v-icon color="accent">mdi-view-list</v-icon>
          </v-btn>
          <v-btn icon class="pa-0" value="cards" @click="profile.SetView('roster', 'cards')">
            <v-icon color="accent">mdi-view-grid</v-icon>
          </v-btn>
          <v-btn
            icon
            class="pa-0"
            value="small-cards"
            @click="profile.SetView('roster', 'small-cards')">
            <v-icon color="accent">mdi-grid</v-icon>
          </v-btn>
        </v-btn-toggle>
      </v-col>
    </v-row>
    <div class="my-3">
      <group-panel v-for="group in pilotGroups" :group="group" />
    </div>
    <v-divider />
    <v-footer app density="compact" class="border-t">
      <cc-modal title="Organize" icon="mdi-queue-first-in-last-out">
        <template #activator="{ open }">
          <cc-button size="small" color="primary" @click="open">
            <v-icon start icon="mdi-queue-first-in-last-out" />
            Organize
          </cc-button>
        </template>
        <organizer type="pilot" />
      </cc-modal>
      <v-spacer />
      <cc-modal title="Create Pilot Group" icon="mdi-account-group">
        <template #activator="{ open }">
          <cc-button size="small" color="primary" @click="open">
            <v-icon start icon="mdi-plus" />
            Add Group
          </cc-button>
        </template>
        <group-menu />
      </cc-modal>
    </v-footer>
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
  created() {
    this.rosterView = this.profile.View('roster', 'list');
  },
  computed: {
    mobile() {
      return this.$vuetify.display.smAndDown;
    },
    pilotGroups() {
      return PilotStore().getPilotGroups();
    },
    profile() {
      return UserStore().User;
    },
  },
};
</script>
