<template>
  <div class="nav-body elevation-10">
    <div id="cap" />
    <div v-if="$vuetify.breakpoint.mdAndUp" class="d-inline">
      <cc-nav-item :selected="selected === '0'" to="../sheet/0">
        <cc-tooltip inline delayed content="Pilot IDENT, Status, and Biographical Information">
          DOSSIER
        </cc-tooltip>
      </cc-nav-item>
      <cc-nav-item :selected="selected === '1'" to="../sheet/1">
        <cc-tooltip inline delayed content="Pilot Skill Triggers, Reserves, and Pilot Gear Loadout">
          NARRATIVE PROFILE
        </cc-tooltip>
      </cc-nav-item>
      <cc-nav-item :selected="selected === '2'" to="../sheet/2">
        <cc-tooltip inline delayed content="Pilot Licenses, Mech Skills, CORE Bonuses, and Talents">
          TACTICAL PROFILE
        </cc-tooltip>
      </cc-nav-item>
      <cc-nav-item :selected="selected === '3'" to="../sheet/3">
        <cc-tooltip inline delayed content="Create and Modify Mechs and their Loadouts">
          MECH HANGAR
        </cc-tooltip>
      </cc-nav-item>
    </div>
    <v-menu v-else open-on-hover>
      <template v-slot:activator="{ on }">
        <v-btn light icon color="white" style="z-index: 9" class="unskew pl-1 pr-0" v-on="on">
          <v-icon large>mdi-book-open-page-variant</v-icon>
          <v-icon>arrow_drop_up</v-icon>
        </v-btn>
      </template>
      <v-list dense class="heading h3">
        <v-list-item to="../sheet/0">
          DOSSIER
        </v-list-item>
        <v-list-item to="../sheet/1">
          NARRATIVE PROFILE
        </v-list-item>
        <v-list-item to="../sheet/2">
          TACTICAL PROFILE
        </v-list-item>
        <v-list-item to="../sheet/3">
          MECH HANGAR
        </v-list-item>
      </v-list>
    </v-menu>

    <v-btn icon fab x-small outlined :disabled="!lastLoaded" class="mx-4 unskew" @click="toMech()">
      <cc-tooltip inline delayed content="Active Mech Sheet">
        <v-icon large color="white">cci-frame</v-icon>
      </cc-tooltip>
    </v-btn>
    <v-btn icon fab x-small outlined class="mr-4 unskew" dark :to="`/active/${pilot.ID}`">
      <cc-tooltip inline delayed content="Active Mode">
        <v-icon large color="white">cci-activate</v-icon>
      </cc-tooltip>
    </v-btn>
    <v-divider vertical class="mx-2" />
    <div id="divider" />
    <cc-tooltip inline delayed content="Pilot Options">
      <edit-menu :pilot="pilot" class="unskew" style="display: inline-block" />
    </cc-tooltip>
    <v-menu offset-y top right absolute>
      <template v-slot:activator="{ on: menu }">
        <cc-tooltip inline delayed content="Pilot Sheet Layout Options">
          <v-btn class="unskew ml-2" icon dark v-on="menu">
            <v-icon>mdi-view-grid-plus</v-icon>
          </v-btn>
        </cc-tooltip>
      </template>
      <v-list subheader>
        <v-subheader class="heading h2 white--text primary py-0 px-4">Layout Options</v-subheader>
        <v-list-item-group>
          <v-list-item @click="$emit('set', 'tabbed')">
            <v-list-item-icon class="ma-0 mr-2 mt-3">
              <v-icon>mdi-view-array</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>Tabbed View</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-list-item @click="$emit('set', 'classic')">
            <v-list-item-icon class="ma-0 mr-2 mt-3">
              <v-icon>mdi-view-sequential</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>Sheet View (Classic View)</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list-item-group>
      </v-list>
    </v-menu>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import EditMenu from './PilotEditMenu.vue'
import { getModule } from 'vuex-module-decorators'
import { PilotManagementStore } from '@/store'

export default Vue.extend({
  name: 'pilot-nav',
  components: {
    EditMenu,
  },
  props: {
    pilot: {
      type: Object,
      required: true,
    },
    selected: {
      type: String,
      required: true,
    },
  },
  computed: {
    lastLoaded() {
      const store = getModule(PilotManagementStore, this.$store)
      return this.pilot.Mechs.some(x => x.ID === store.LoadedMechID)
        ? store.LoadedMechID
        : this.pilot.ActiveMech
          ? this.pilot.ActiveMech.ID
          : null
    },
  },
  methods: {
    toMech() {
      this.$router.push(`../mech/${this.lastLoaded}`)
    },
    deletePilot() {
      this.$router.push('/pilot_management')
      const store = getModule(PilotManagementStore, this.$store)
      store.deletePilot({ pilot: this.pilot, update: true })
    },
  },
})
</script>

<style scoped>
.nav-body {
  position: fixed;
  bottom: 20px;
  left: 16px;
  min-height: 40px;
  padding: 5px 20px 5px 20px;
  transform: skew(-0.65rad);
  background-color: var(--v-primary-base);
  color: white;
  z-index: 10;
}

#cap {
  background-color: var(--v-primary-base);
  position: absolute;
  width: 70px;
  height: 45px;
  left: -50px;
  top: 0;
  z-index: 9;
}

#divider {
  width: 2px;
  min-width: 2px;
  height: 47px;
  right: 115px;
  top: 0;
  z-index: 11;
  background-color: white;
  position: absolute;
}

.unskew {
  transform: skew(0.65rad);
}
</style>
