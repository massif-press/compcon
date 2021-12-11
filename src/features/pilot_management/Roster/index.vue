<template>
  <v-container fluid class="px-3 mt-4">
    <v-row dense align="end" class="mt-2">
      <v-col cols="12" md="auto">
        <div class="heading h1 mb-n3">Pilot Roster</div>
      </v-col>
      <v-col cols="auto">
        <v-btn-toggle :value="profile.GetView('roster')" mandatory dense class="mt-n4">
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
            <v-icon>mdi-chevron-down</v-icon>
            <span v-if="$vuetify.breakpoint.mdAndUp">Expand All</span>
          </v-btn>
          <v-btn text small @click="hideAll">
            <v-icon>mdi-chevron-up</v-icon>
            <span v-if="$vuetify.breakpoint.mdAndUp">Collapse All</span>
          </v-btn>
        </v-btn-toggle>
      </v-col>
      <v-col v-if="isTouch" cols="auto">
        <v-switch v-model="preventDnd" dense inset hide-details color="accent" class="mr-3">
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
      <v-container fluid :class="$vuetify.breakpoint.mdAndUp ? 'mx-1' : 'mx-n4 pa-0'">
        <draggable
          :list="groups"
          :disabled="preventDnd"
          v-bind="dragOptions"
          @change="pilotStore.moveGroup"
        >
          <div
            v-for="(g, i) in groups"
            :key="`pg_${g.name}_${i}`"
          >
            <v-row no-gutters class="pl-10 ml-n12 heading h3 white--text primary sliced">
              <v-col cols="auto">
                <v-btn small dark icon class="mt-n1" @click="toggleHidden(g)">
                  <v-icon v-html="!g.hidden ? 'mdi-chevron-down' : 'mdi-chevron-up'" />
                </v-btn>
                {{ g.name ? g.name : 'Ungrouped' }}
                <span class="overline">({{ g.pilotIDs.length }})</span>
              </v-col>
              <v-col v-if="g.name" cols="auto" class="ml-auto mr-8">
                <v-menu offset-x left :close-on-content-click="false">
                  <template v-slot:activator="{ on }">
                    <v-btn dark small icon class="fadeSelect" v-on="on">
                      <v-icon>mdi-circle-edit-outline</v-icon>
                    </v-btn>
                  </template>
                  <v-card>
                    <v-card-text>
                      <v-text-field
                        :value="g.name"
                        autofocus
                        outlined
                        hide-details
                        label="Group Name"
                        @change="setGroupName(g, $event)"
                      />
                    </v-card-text>
                  </v-card>
                </v-menu>
                <v-btn dark small icon class="fadeSelect" @click="deleteGroup(g)">
                  <v-icon>mdi-delete</v-icon>
                </v-btn>
              </v-col>
            </v-row>
            <div
              v-if="!g.hidden"
              :style="profile.GetView('roster') !== 'list' ? 'margin-left: -8px; width: 100vw;' : ''"
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
                    :key="`${pilotCardType}_${j}`"
                    :pilot="getPilotFromId(id)"
                    :small="profile.GetView('roster') === 'small-cards'"
                    :dragging="drag"
                  />
                </draggable>
              </v-expand-transition>
            </div>
          </div>
        </draggable>
      </v-container>
    </v-slide-x-transition>
    <v-divider class="my-3" />
    <v-row dense justify="center">
      <v-col cols="12" md="6" lg="3">
        <add-pilot />
        <v-menu v-model="newGroupMenu" top :close-on-content-click="false">
          <template v-slot:activator="{ on }">
            <v-btn small block outlined color="accent" class="mt-1" v-on="on">
              <v-icon left>mdi-folder</v-icon>
              Add Group
            </v-btn>
          </template>
          <v-card tile flat>
            <v-card-text>
              <v-row dense justify="center">
                <v-col cols="auto">
                  <cc-tooltip simple content="Generate Random Name">
                    <v-icon large color="secondary" @click="randomName()">mdi-dice-multiple</v-icon>
                  </cc-tooltip>
                </v-col>
                <v-col>
                  <v-text-field
                    v-model="newGroupName"
                    outlined
                    dense
                    label="Group Name"
                    hide-details
                  />
                </v-col>
              </v-row>
              <v-btn small outlined block :disabled="!newGroupName" @click="addNewGroup">
                Add New Group
              </v-btn>
            </v-card-text>
          </v-card>
        </v-menu>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue'
import PilotCard from './components/PilotCard.vue'
import PilotListItem from './components/PilotListItem.vue'
import AddPilot from './components/AddPilot.vue'
import { getModule } from 'vuex-module-decorators'
import { UserStore, PilotManagementStore } from '@/store'
import { Pilot } from '@/class'
import { UserProfile } from '@/user'
import draggable from 'vuedraggable'
import { teamName } from '@/io/Generators'
import { PilotGroup } from '../store'

export default Vue.extend({
  name: 'roster-view',
  components: { AddPilot, PilotListItem, PilotCard, draggable },
  data: () => ({
    sortParams: null,
    drag: false,
    newGroupMenu: false,
    newGroupName: '',
    preventDnd: true,
  }),
  computed: {
    pilotStore() {
      const mod = getModule(PilotManagementStore, this.$store)
      return mod
    },
    pilotCardType(): string {
      switch (this.profile.GetView('roster')) {
        case 'cards':
        case 'small-cards':
          return 'pilot-card'
        case 'list':
        default:
          return 'pilot-list-item'
      }
    },
    profile(): UserProfile {
      const store = getModule(UserStore, this.$store)
      return store.UserProfile
    },
    groups() {
      return this.pilotStore.PilotGroups
    },
    pilots() {
      return this.pilotStore.Pilots
    },
    dragOptions() {
      return {
        animation: 200,
        disabled: false,
        ghostClass: 'ghost',
        scrollSensitivity: 200,
        forceFallback: true,
        fallbackTolerance: 3,
      }
    },
    dragClick() {
      return this.drag ? 'click' : null;
    },
    isTouch() {
      if ('ontouchstart' in document.documentElement) {
        return true
      } else {
        return false
      }
    },
  },
  created() {
    this.preventDnd = this.isTouch
  },
  methods: {
    toggleHidden(g: PilotGroup) {
      g.hidden = !g.hidden
    },
    showAll() {
      this.groups.forEach(g => g.hidden = false)
    },
    hideAll() {
      this.groups.forEach(g => g.hidden = true)
    },
    onSort(sortParams: any[]) {
      this.sortParams = sortParams
    },
    dragOff() {
      setTimeout(() => {this.drag = false}, 50)
    },
    addNewGroup() {
      this.pilotStore.addGroup(this.newGroupName)
      this.newGroupName = ''
      this.newGroupMenu = false
    },
    getPilotFromId(id: string): Pilot {
      return this.pilots.find(p => p.ID === id)
    },
    movePilot(groupName, event) {
      if (event.added) {
        const pilotId = event.added.element
        const p = this.getPilotFromId(pilotId)
        p.Group = groupName
      }
      this.pilotStore.movePilot()
    },
    deleteGroup(g) {
      this.pilotStore.deleteGroup(g)
    },
    setGroupName(g, newName) {
      this.pilotStore.setGroupName({g: g, newName: newName})
    },
    randomName() {
      this.newGroupName = teamName()
    },
  },
})
</script>