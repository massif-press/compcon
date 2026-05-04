<template>
  <v-container class="pb-12"
    :class="mobile && 'mt-2'">
    <v-row align="center">
      <v-col cols="12"
        md="auto">
        <div>
          <div class="heading h1"
            style="line-height: 0">Pilot Roster <span v-if="rosterSearch"
              class="text-caption text-italic text-disabled">
              <br v-if="mobile" />
              {{ hiddenPilotCount }} pilot{{ hiddenPilotCount === 1 ? '' : 's' }} hidden
            </span></div>
        </div>

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
      <sortable
        :list="pilotGroups"
        item-key="ID"
        :options="{
          animation: 250,
          easing: 'cubic-bezier(1, 0, 0, 1)',
          handle: '.group-drag-handle',
          scroll: true,
          scrollSpeed: 300,
        }"
        @end="onGroupReorder"
      >
        <template #item="{ element }">
          <group-panel
            :group="element"
            :roster-search="rosterSearch"
            :transfer-key="rosterTransferKey"
            @pilot-transferred="rosterTransferKey++"
          />
        </template>
      </sortable>
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

      <cc-text-field v-if="!mobile"
        v-model="rosterSearch"
        density="compact"
        variant="outlined"
        color="primary"
        bg-color="background"
        hide-details
        clearable
        icon="mdi-magnify"
        style="min-width: 300px; max-width: 350px; " />

      <v-menu v-else
        :close-on-content-click="false"
        location="top">
        <template #activator="{ props }">
          <v-btn icon
            size="small"
            v-bind="props">
            <v-icon>mdi-magnify</v-icon>
          </v-btn>
        </template>
        <v-card min-width="260px">
          <v-card-text class="pa-2">
            <v-text-field v-model="rosterSearch"
              density="compact"
              variant="outlined"
              hide-details
              clearable
              autofocus
              prepend-inner-icon="mdi-magnify"
              placeholder="Name or callsign..." />
          </v-card-text>
        </v-card>
      </v-menu>
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
import { Sortable } from 'sortablejs-vue3';
import Organizer from './components/Organizer.vue';
import GroupPanel from './components/GroupPanel.vue';
import GroupMenu from './components/GroupMenu.vue';

import { UserStore, PilotStore } from '@/stores';
import { useMobile } from '@/mixins/useMobile';
import GroupFileImport from './components/add_panels/GroupFileImport.vue';
import GroupShareDialog from './components/GroupShareDialog.vue';


export default {
  name: 'RosterView',
  components: { Sortable, Organizer, GroupPanel, GroupMenu, GroupFileImport, GroupShareDialog },
  mixins: [useMobile],
  data: () => ({
    sortParams: null,
    newGroupMenu: false,
    newGroupName: '',
    rosterView: 'list',
    rosterSearch: '',
    rosterTransferKey: 0,
  }),
  computed: {
    pilotGroups() {
      return PilotStore().getPilotGroups();
    },
    profile() {
      return UserStore().User;
    },
    hiddenPilotCount() {
      if (!this.rosterSearch) return 0;
      const s = this.rosterSearch.toLowerCase();
      const all = PilotStore().Pilots.filter((p: any) => !p.SaveController.IsDeleted);
      const matching = all.filter((p: any) =>
        p.Name.toLowerCase().includes(s) || p.Callsign.toLowerCase().includes(s)
      );
      return all.length - matching.length;
    },
  },
  created() {
    this.rosterView = this.profile.View('roster', 'list');
  },
  methods: {
    onGroupReorder(event: any) {
      if (event.oldIndex === event.newIndex) return;
      const group = this.pilotGroups[event.oldIndex] as any;
      PilotStore().ReorderGroupByIndex(group, event.newIndex);
    },
  },
};
</script>
