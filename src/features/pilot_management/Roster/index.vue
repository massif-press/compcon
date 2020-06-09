<template>
  <v-container fluid class="px-3 mt-3">
    <v-row dense align="end" class="mt-2">
      <v-col cols="auto">
        <h1 class="heading">Pilot Roster</h1>
      </v-col>
      <v-col cols="auto">
        <v-btn-toggle v-model="profile.RosterView" mandatory dense class="mt-n4">
          <v-btn small icon value="list">
            <v-icon color="accent">mdi-view-list</v-icon>
          </v-btn>
          <v-btn small icon value="cards">
            <v-icon color="accent">mdi-view-grid</v-icon>
          </v-btn>
          <v-btn small icon value="small-cards">
            <v-icon color="accent">mdi-grid</v-icon>
          </v-btn>
        </v-btn-toggle>
      </v-col>
      <v-col cols="auto" class="ml-auto">
        <v-btn-toggle>
          <v-btn text small @click="showAll">
            <v-icon>mdi-chevron-down</v-icon>
            Expand All
          </v-btn>
          <v-btn text small @click="hideAll">
            <v-icon>mdi-chevron-up</v-icon>
            Collapse All
          </v-btn>
        </v-btn-toggle>
      </v-col>
      <!-- <v-col cols="auto">
        <roster-sort :pilots="pilots" @sort="onSort" />
      </v-col> -->
    </v-row>

    <v-slide-x-transition mode="out-in">
      <v-container fluid class="mx-3">
        <div v-for="g in Object.keys(groups)" :key="`pg_${g}`">
          <v-row no-gutters class="pl-10 ml-n12 heading h3 white--text primary sliced">
            <v-col cols="auto">
              <v-btn small dark icon class="mt-n1" @click="toggleShown(g)">
                <v-icon v-html="shown.includes(g) ? 'mdi-chevron-down' : 'mdi-chevron-up'" />
              </v-btn>
              {{ g ? g : 'Ungrouped' }}
              <span class="overline">({{ groups[g].length }})</span>
            </v-col>
            <v-col v-if="g" cols="auto" class="ml-auto mr-8">
              <v-btn dark small icon class="fadeSelect" @click="deleteGroup(g)">
                <v-icon>mdi-delete</v-icon>
              </v-btn>
            </v-col>
          </v-row>
          <div v-if="shown.includes(g)">
            <v-expand-transition>
              <draggable
                :list="groups[g]"
                group="pilots"
                v-bind="dragOptions"
                @start="drag = true"
                @end="drag = false"
                @change="moved($event, g)"
              >
                <!-- <v-row v-if="!groups[g].length" slot="header" dense justify="center">
                  <v-col cols="auto" class="h3 subtle--text">EMPTY</v-col>
                </v-row> -->
                <component
                  :is="pilotCardType"
                  v-for="(p, i) in groups[g]"
                  :key="`${pilotCardType}_${i}`"
                  :pilot="p"
                  :small="profile.RosterView === 'small-cards'"
                />
              </draggable>
            </v-expand-transition>
            <!-- <div v-if="profile.RosterView === 'list'"> -->
            <!-- </div> -->
            <!-- <v-row v-else-if="profile.RosterView === 'cards'">
                  <pilot-card v-for="p in pilots" :key="p.ID" :pilot="p" />
                </v-row>
                <v-row v-else-if="profile.RosterView === 'small-cards'">
                  <pilot-card v-for="p in pilots" :key="p.ID" :pilot="p" small />
                </v-row> -->
          </div>
        </div>
      </v-container>
    </v-slide-x-transition>
    <v-divider class="my-3" />
    <v-row dense justify="center">
      <v-col cols="3">
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
import _ from 'lodash'
import Vue from 'vue'
import RosterSort from './components/RosterSort.vue'
import PilotCard from './components/PilotCard.vue'
import PilotListItem from './components/PilotListItem.vue'
import AddPilot from './components/AddPilot.vue'
import { getModule } from 'vuex-module-decorators'
import { CompendiumStore, PilotManagementStore } from '@/store'
import { Pilot } from '@/class'
import { UserProfile } from '@/io/User'
import draggable from 'vuedraggable'
import { teamName } from '@/io/Generators'

export default Vue.extend({
  name: 'roster-view',
  components: { RosterSort, AddPilot, PilotListItem, PilotCard, draggable },
  data: () => ({
    sortParams: null,
    drag: false,
    newGroupMenu: false,
    groups: [],
    shown: [],
    newGroupName: '',
  }),
  computed: {
    pilotCardType(): string {
      switch (this.profile.RosterView) {
        case 'cards':
        case 'small-cards':
          return 'pilot-card'
        case 'list':
        default:
          return 'pilot-list-item'
      }
    },
    profile(): UserProfile {
      const store = getModule(CompendiumStore, this.$store)
      return store.UserProfile
    },
    pilotsUnsorted() {
      const store = getModule(PilotManagementStore, this.$store)
      return store.Pilots
    },
    pilotGroups() {
      const store = getModule(PilotManagementStore, this.$store)
      return store.PilotGroups
    },
    pilots() {
      const store = getModule(PilotManagementStore, this.$store)
      return store.Pilots
    },
    pilotsByGroup() {
      const grouped = _.groupBy(this.pilots, 'Group')
      return grouped
    },
    dragOptions() {
      return {
        animation: 200,
        disabled: false,
        ghostClass: 'ghost',
      }
    },
  },
  watch: {
    pilots() {
      this.reset()
    },
  },
  created() {
    this.reset()
    this.shown = Object.keys(this.groups)
  },
  methods: {
    reset() {
      const store = getModule(PilotManagementStore, this.$store)
      this.groups = _.groupBy(this.pilots, 'Group')
      for (const g in this.groups) {
        if (this.groups.hasOwnProperty(g)) {
          this.groups[g] = _.sortBy(this.groups[g], 'SortIndex')
        }
      }
      store.PilotGroups.forEach(pg => {
        if (!Object.keys(this.groups).includes(pg)) Vue.set(this.groups, pg, [])
      })
    },
    toggleShown(group: string) {
      const idx = this.shown.indexOf(group)
      if (idx === -1) this.shown.push(group)
      else this.shown.splice(idx, 1)
    },
    showAll() {
      Vue.set(this, 'shown', Object.keys(this.groups))
    },
    hideAll() {
      Vue.set(this, 'shown', [])
    },
    onSort(sortParams: any[]) {
      this.sortParams = sortParams
    },
    addNewGroup() {
      const store = getModule(PilotManagementStore, this.$store)
      store.addGroup(this.newGroupName)
      this.shown.push(this.newGroupName)
      Vue.set(this.groups, this.newGroupName, [])
      this.newGroupName = ''
      this.newGroupMenu = false
    },
    moved(e, g) {
      if (e.moved && e.moved.element) {
        const p = e.moved.element as Pilot
        p.SortIndex = e.moved.newIndex
      }
      if (e.added && e.added.element) {
        const p = e.added.element as Pilot
        p.SortIndex = e.added.newIndex
        p.Group = g
      }
    },
    deleteGroup(g) {
      const store = getModule(PilotManagementStore, this.$store)
      this.groups[g].forEach((p: Pilot) => {
        Vue.set(p, 'Group', '')
      })
      if (!this.groups[g]) return
      Vue.delete(this.groups, g)
      store.deleteGroup(g)
      this.reset()
    },
    randomName() {
      this.newGroupName = teamName()
    },
  },
})
</script>
