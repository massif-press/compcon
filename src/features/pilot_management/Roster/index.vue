<template>
  <v-container fluid class="px-3" style="margin-top: 40px">
    <v-row density="compact" align="end" class="mt-2">
      <v-col cols="12" md="auto">
        <div class="heading h1 mb-n3">Pilot Roster</div>
      </v-col>
      <v-col cols="auto">
        <v-btn-toggle :value="getRosterView" mandatory density="compact" class="mt-n4">
          <v-btn small icon value="list" @click="profile.SetView('roster', 'list')">
            <v-icon color="accent">mdi-view-list</v-icon>
          </v-btn>
          <v-btn small icon value="cards" @click="profile.SetView('roster', 'cards')">
            <v-icon color="accent">mdi-view-grid</v-icon>
          </v-btn>
          <v-btn small icon value="small-cards" @click="profile.SetView('roster', 'small-cards')">
            <v-icon color="accent">mdi-grid</v-icon>
          </v-btn>
        </v-btn-toggle>
      </v-col>
      <v-col cols="auto" class="ml-auto">
        <v-btn-toggle class="mr-2">
          <v-btn text small @click="showAll">
            <v-icon icon="mdi-chevron-down" />
            <span v-if="$vuetify.display.mdAndUp">Expand All</span>
          </v-btn>
          <v-btn text small @click="hideAll">
            <v-icon icon="mdi-chevron-up" />
            <span v-if="$vuetify.display.mdAndUp">Collapse All</span>
          </v-btn>
        </v-btn-toggle>
      </v-col>
      <v-col v-if="isTouch" cols="auto">
        <v-switch
          v-model="preventDnd"
          density="compact"
          inset
          hide-details
          color="accent"
          class="mr-3"
        >
          <cc-tooltip
            slot="label"
            simple
            inline
            :content="preventDnd ? 'Pilot Reordering: OFF' : 'Pilot Reordering: ON'"
          >
            <v-icon
              class="ml-n2"
              :color="preventDnd ? 'primary' : 'accent'"
              v-html="preventDnd ? 'mdi-lock' : 'mdi-cursor-move'"
            />
          </cc-tooltip>
        </v-switch>
      </v-col>
    </v-row>
    <v-slide-x-transition mode="out-in">
      <v-container fluid :class="$vuetify.display.mdAndUp ? 'mx-1' : 'mx-n4 pa-0'">
        <draggable
          :list="groups"
          :disabled="preventDnd"
          v-bind="dragOptions"
          @change="pilotStore.moveGroup(groups)"
        >
          <div v-for="(g, i) in groups">
            <v-row no-gutters class="pl-10 ml-n12 heading h3 text-white primary sliced">
              <v-col cols="auto">
                <v-btn small dark icon class="mt-n1" @click="toggleHidden(g)">
                  <v-icon v-html="!g.hidden ? 'mdi-chevron-down' : 'mdi-chevron-up'" />
                </v-btn>
                {{ g.name ? g.name : 'Ungrouped' }}
                <span class="overline">({{ g.pilotIDs.length }})</span>
              </v-col>
              <v-col v-if="g.name" cols="auto" class="ml-auto mr-8">
                <v-menu offset-x left :close-on-content-click="false">
                  <template #activator="{ props }">
                    <v-btn dark small icon class="fade-select" v-bind="props">
                      <v-icon icon="mdi-circle-edit-outline" />
                    </v-btn>
                  </template>
                  <v-card>
                    <v-card-text>
                      <v-text-field
                        :value="g.name"
                        autofocus
                        variant="outlined"
                        hide-details
                        label="Group Name"
                        @change="setGroupName(g, $event)"
                      />
                    </v-card-text>
                  </v-card>
                </v-menu>
                <v-btn dark small icon class="fade-select" @click="deleteGroup(g)">
                  <v-icon icon="mdi-delete" />
                </v-btn>
              </v-col>
            </v-row>
            <div
              v-if="!g.hidden"
              :style="getRosterView !== 'list' ? 'margin-left: -8px; width: 100vw;' : ''"
            >
              <v-expand-transition>
                <draggable
                  :list="g.pilotIDs"
                  :group="{ name: 'group' }"
                  :disabled="preventDnd"
                  v-bind="dragOptions"
                  @start="drag = true"
                  @end="dragOff()"
                  @change="movePilot(g.name, $event)"
                >
                  <component
                    :is="pilotCardType"
                    v-for="(id, j) in g.pilotIDs"
                    :pilot="getPilotFromId(id)"
                    :small="getRosterView === 'small-cards'"
                    :dragging="drag"
                  />
                </draggable>
              </v-expand-transition>
            </div>
          </div>
        </draggable>
      </v-container>
    </v-slide-x-transition>
    <v-row density="compact" justify="end">
      <v-col cols="auto">
        <v-btn x-small color="primary" @click="$refs.delete.show()">Delete Multiple</v-btn>
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
        <v-btn size="x-large" tile color="accent" @click="$refs.import.show()">
          <v-icon large left class="pr-2">mdi-import</v-icon>
          Import Pilot
        </v-btn>
      </v-col>
    </v-row>
    <v-row density="compact" justify="center">
      <v-col cols="auto">
        <v-menu v-model="newGroupMenu" top :close-on-content-click="false">
          <template #activator="{ props }">
            <v-btn variant="outlined" color="accent" class="mt-1" v-bind="props">
              <v-icon start>mdi-folder</v-icon>
              Add Group
            </v-btn>
          </template>
          <v-card tile flat>
            <v-card-text>
              <v-row density="compact" justify="center">
                <v-col cols="auto">
                  <cc-tooltip simple content="Generate Random Name">
                    <v-icon large color="secondary" @click="randomName()">mdi-dice-multiple</v-icon>
                  </cc-tooltip>
                </v-col>
                <v-col>
                  <v-text-field
                    v-model="newGroupName"
                    variant="outlined"
                    density="compact"
                    label="Group Name"
                    hide-details
                  />
                </v-col>
              </v-row>
              <v-btn small variant="outlined" block :disabled="!newGroupName" @click="addNewGroup">
                Add New Group
              </v-btn>
            </v-card-text>
          </v-card>
        </v-menu>
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
import draggable from 'vuedraggable';
import { teamName } from '@/io/Generators';
import { PilotGroup } from '../store';

export default {
  name: 'roster-view',
  components: { ImportDialog, PilotListItem, PilotCard, draggable },
  data: () => ({
    sortParams: null,
    drag: false,
    newGroupMenu: false,
    newGroupName: '',
    preventDnd: true,
    groups: [],
  }),
  watch: {
    plength() {
      this.buildGroups();
    },
  },
  computed: {
    pilotStore() {
      const mod = PilotStore();
      return mod;
    },
    pilotCardType(): string {
      switch (this.getRosterView) {
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
      return store.UserProfile;
    },
    pilots() {
      return this.pilotStore.Pilots;
    },
    plength() {
      return this.pilots.length;
    },
    pilotGroups() {
      return this.pilotStore.pilotGroups;
    },
    dragOptions() {
      return {
        animation: 200,
        disabled: false,
        ghostClass: 'ghost',
        scrollSensitivity: 200,
        forceFallback: true,
        fallbackTolerance: 3,
      };
    },
    dragClick() {
      return this.drag ? 'click' : null;
    },
    isTouch() {
      if ('ontouchstart' in document.documentElement) {
        return true;
      } else {
        return false;
      }
    },
    getRosterView() {
      if (!this.profile || !this.profile.GetView) return 'list';
      return this.profile.GetView('roster');
    },
  },
  created() {
    this.preventDnd = this.isTouch;
  },
  mounted() {
    this.buildGroups();
  },
  methods: {
    buildGroups() {
      let groups = [
        ...this.pilotStore.PilotGroups.filter(
          (x) => x.name && x.name !== '' && x.name.toLowerCase() !== 'ungrouped'
        ),
      ];
      groups.forEach((g) => {
        g.pilotIDs = this.pilots
          .filter((p) => p.GroupController.Group === g.name)
          .sort((p1, p2) => p1.GroupController.SortIndex - p2.GroupController.SortIndex)
          .map((p) => p.ID);
      });
      groups.push({
        name: '',
        pilotIDs: this.pilots
          .sort((p1, p2) => p1.GroupController.SortIndex - p2.GroupController.SortIndex)
          .map((p) => p.ID)
          .filter((id) => !groups.flatMap((g) => g.pilotIDs).includes(id)),
        hidden: false,
      });
      this.groups = groups;
    },

    toggleHidden(g: PilotGroup) {
      g.hidden = !g.hidden;
    },
    showAll() {
      this.groups.forEach((g) => (g.hidden = false));
    },
    hideAll() {
      this.groups.forEach((g) => (g.hidden = true));
    },
    onSort(sortParams: any[]) {
      this.sortParams = sortParams;
    },
    dragOff() {
      setTimeout(() => {
        this.drag = false;
      }, 50);
    },
    addNewGroup() {
      this.groups.push({
        name: this.newGroupName,
        pilotIDs: [],
        hidden: false,
      });
      this.newGroupName = '';
      this.newGroupMenu = false;
    },
    getPilotFromId(id: string): Pilot {
      return this.pilots.find((p) => p.ID === id);
    },
    movePilot(groupName, event) {
      if (event.added || event.moved) {
        const pilotId = event.added ? event.added.element : event.moved.element;
        const pilot = this.getPilotFromId(pilotId);
        pilot.GroupController.Group = groupName;

        this.groups.forEach((g) => {
          g.pilotIDs.forEach((id, i) => {
            const p = this.getPilotFromId(id);
            p.GroupController.SortIndex = i;
          });
        });
      }
      this.pilotStore.moveGroup(this.groups);
    },
    deleteGroup(g) {
      this.pilotStore.deleteGroup(g);
      this.buildGroups();
    },
    setGroupName(g, newName) {
      this.pilotStore.setGroupName({ g: g, newName: newName });
    },
    randomName() {
      this.newGroupName = teamName();
    },
  },
};
</script>
