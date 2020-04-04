<template>
  <div>
    <cc-title large color="pilot">Hangar&emsp;</cc-title>
    <v-btn-toggle id="viewtoggle" v-model="profile.HangarView" mandatory>
      <v-btn small icon value="cards">
        <v-icon color="accent">mdi-view-grid</v-icon>
      </v-btn>
      <v-btn small icon value="list">
        <v-icon color="accent">mdi-view-list</v-icon>
      </v-btn>
      <v-btn small icon value="table">
        <v-icon color="accent">mdi-format-align-justify</v-icon>
      </v-btn>
    </v-btn-toggle>
    <v-container v-if="profile.HangarView === 'cards'" fluid>
      <v-row justify="center">
        <mech-card
          v-for="m in pilot.Mechs"
          :key="`${m.ID}_mc`"
          :mech="m"
          @set-active="pilot.ActiveMech = $event"
          @delete="pilot.RemoveMech($event)"
          @copy="pilot.CloneMech($event)"
          @go="toMechSheet($event)"
        />
      </v-row>
    </v-container>
    <v-container v-else-if="profile.HangarView === 'list'" class="mt-2" fluid>
      <mech-list-item
        v-for="m in pilot.Mechs"
        :key="`${m.ID}_mc`"
        :mech="m"
        @set-active="pilot.ActiveMech = $event"
        @delete="pilot.RemoveMech($event)"
        @copy="pilot.CloneMech($event)"
        @go="toMechSheet($event)"
      />
    </v-container>
    <v-container v-else>
      <mech-table :mechs="pilot.Mechs" @go="toMechSheet($event)" />
    </v-container>
    <v-row justify="center">
      <v-col cols="auto">
        <cc-btn x-large class="ml-auto mr-auto" @click="$refs.dialog.show()">
          <v-icon left large>cci-accuracy</v-icon>
          &emsp;Add New Mech
        </cc-btn>
      </v-col>
    </v-row>
    <cc-solo-dialog ref="dialog" icon="cci-frame" no-confirm title="Add New Mech" fullscreen>
      <new-mech-menu :pilot="pilot" @close="$refs.dialog.hide()" />
    </cc-solo-dialog>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import MechCard from './components/MechCard.vue'
import MechListItem from './components/MechListItem.vue'
import MechTable from './components/MechTable.vue'
import NewMechMenu from './components/NewMechMenu.vue'
import { getModule } from 'vuex-module-decorators'
import { CompendiumStore, PilotManagementStore } from '@/store'
import { Pilot } from '@/class'
import { UserProfile } from '@/io/User'

export default Vue.extend({
  name: 'mech-hangar-view',
  components: { MechCard, MechListItem, MechTable, NewMechMenu },
  props: {
    pilot: {
      type: Pilot,
      required: true,
    },
  },
  computed: {
    profile(): UserProfile {
      const store = getModule(CompendiumStore, this.$store)
      return store.UserProfile
    },
  },
  methods: {
    toMechSheet(mech) {
      const store = getModule(PilotManagementStore, this.$store)
      store.setLoadedMech(mech.ID)
      this.$router.push(`../mech/${mech.ID}`)
    },
  },
})
</script>

<style scoped>
#viewtoggle {
  position: absolute;
  left: calc(100vw - 400px);
  top: 190px;
  z-index: 4;
}
</style>
