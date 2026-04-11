<template>
  <v-container class="pb-12"
    :class="mobile && 'mt-2'">
    <v-row align="center">
      <v-col cols="12"
        md="auto">
        <div class="heading h1"
          style="line-height: 0">Pilot Roster</div>
      </v-col>
      <v-spacer />
      <v-col cols="auto">
        <v-btn-toggle v-model="rosterView"
          mandatory
          tile>
          <v-btn icon
            class="pa-0"
            value="list"
            @click="profile.SetView('roster', 'list')">
            <v-icon color="accent">mdi-view-list</v-icon>
          </v-btn>
          <v-btn icon
            class="pa-0"
            value="cards"
            @click="profile.SetView('roster', 'cards')">
            <v-icon color="accent">mdi-view-grid</v-icon>
          </v-btn>
        </v-btn-toggle>
      </v-col>
    </v-row>
    <div class="my-3">
      <group-panel v-for="group in pilotGroups"
        :key="group.ID"
        :group="group" />
    </div>
    <v-divider />
    <v-footer app
      density="compact"
      class="border-t">
      <cc-modal title="Organize"
        icon="mdi-queue-first-in-last-out">
        <template #activator="{ open }">
          <cc-button size="small"
            color="primary"
            @click="open">
            <v-icon start
              icon="mdi-queue-first-in-last-out" />
            Organize
          </cc-button>
        </template>
        <organizer type="pilot" />
      </cc-modal>
      <v-spacer />

      <v-menu offset-y>
        <template #activator="{ props }">
          <cc-button color="primary"
            size="small"
            prepend-icon="mdi-plus"
            @click="props.onClick($event)">
            Add Group
          </cc-button>
        </template>
        <v-card tile
          border>
          <v-card-text>
            <cc-modal title="Create Pilot Group"
              icon="mdi-account-group">
              <template #activator="{ open }">
                <cc-button color="primary"
                  size="small"
                  block
                  prepend-icon="mdi-plus"
                  @click="open">
                  Add New
                </cc-button>
              </template>
              <template #default="{ close }">
                <group-menu @close="close" />
              </template>
            </cc-modal>
            <cc-modal title="Import"
              icon="mdi-import"
              max-width="900">
              <template #activator="{ open }">
                <cc-button color="primary"
                  size="small"
                  block
                  prepend-icon="mdi-import"
                  @click="open">
                  File Import
                </cc-button>
              </template>
              <template #default="{ close }">
                <group-file-import @done="close" />
              </template>
            </cc-modal>

            <group-share-dialog block-btn />

          </v-card-text>
        </v-card>
      </v-menu>

    </v-footer>
  </v-container>
</template>

<script lang="ts">
import Organizer from './components/Organizer.vue';
import GroupPanel from './components/GroupPanel.vue';
import GroupMenu from './components/GroupMenu.vue';

import { UserStore, PilotStore } from '@/stores';
import { useMobile } from '@/mixins/useMobile';
import GroupFileImport from './components/add_panels/GroupFileImport.vue';
import GroupShareDialog from './components/GroupShareDialog.vue';


export default {
  name: 'RosterView',
  components: { Organizer, GroupPanel, GroupMenu, GroupFileImport, GroupShareDialog },
  mixins: [useMobile],
  data: () => ({
    sortParams: null,
    newGroupMenu: false,
    newGroupName: '',
    rosterView: 'list',
  }),
  computed: {
    pilotGroups() {
      return PilotStore().getPilotGroups();
    },
    profile() {
      return UserStore().User;
    },
  },
  created() {
    this.rosterView = this.profile.View('roster', 'list');
  },
};
</script>
