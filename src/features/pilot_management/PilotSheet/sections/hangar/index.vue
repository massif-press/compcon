<template>
  <div>
    <div class="heading h1">Mech Hangar</div>
    <v-btn-toggle
      id="viewToggle"
      :value="view"
      mandatory
      style="height: 20px"
      flat
      tile
      class="mb-4">
      <v-btn size="small" icon value="cards" @click="profile.SetView('hangar', 'cards')">
        <v-icon color="accent">mdi-view-grid</v-icon>
      </v-btn>
      <v-btn size="small" icon value="list" @click="profile.SetView('hangar', 'list')">
        <v-icon color="accent">mdi-view-list</v-icon>
      </v-btn>
    </v-btn-toggle>
    <mech-sort />
    <v-container class="mt-2">
      <v-row v-if="view === 'cards'" justify="center">
        <mech-card
          v-for="m in sortedMechs"
          :mech="m"
          @delete="pilot.RemoveMech($event)"
          @copy="pilot.CloneMech($event)"
          @go="toMechSheet($event)" />
      </v-row>
      <mech-list-item-mobile
        v-else-if="view === 'list' && mobile"
        v-for="m in sortedMechs"
        :mech="m"
        @delete="pilot.RemoveMech($event)"
        @copy="pilot.CloneMech($event)"
        @go="toMechSheet($event)" />
      <mech-list-item
        v-else-if="view === 'list'"
        v-for="m in sortedMechs"
        :mech="m"
        @delete="pilot.RemoveMech($event)"
        @copy="pilot.CloneMech($event)"
        @go="toMechSheet($event)" />
    </v-container>
    <cc-modal v-if="!pilot.IsRemote" icon="cc:frame" title="Add New Mech" clip>
      <template #activator="{ open }">
        <cc-button
          color="primary"
          class="mx-6"
          block
          prepend-icon="cc:frame"
          append-icon="mdi-plus"
          @click="open">
          Add New Mech
        </cc-button>
      </template>
      <template #default="{ close }">
        <new-mech-menu :pilot="pilot" @close="close" />
      </template>
    </cc-modal>
  </div>
</template>

<script lang="ts">
import MechCard from './components/MechCard.vue';
import MechListItem from './components/MechListItem.vue';
import MechListItemMobile from './components/MechListItemMobile.vue';
import NewMechMenu from './components/NewMechMenu.vue';
import MechSort from './components/MechSort.vue';
import { UserStore } from '@/stores';
import { Pilot } from '@/class';

export default {
  name: 'mech-hangar-view',
  components: { MechCard, MechListItem, MechListItemMobile, NewMechMenu, MechSort },
  props: {
    pilot: {
      type: Pilot,
      required: true,
    },
  },
  computed: {
    mobile() {
      return this.$vuetify.display.smAndDown;
    },
    profile() {
      return UserStore().User;
    },
    view() {
      return this.profile.View('hangar', 'cards');
    },
    sortedMechs() {
      const sort = this.profile.View('hangarSort', 'Created');
      const asc = this.profile.View('hangarAsc', false);

      let mechs = [...this.pilot.Mechs];
      if (sort === 'Name') {
        mechs.sort((a, b) => a.Name.localeCompare(b.Name));
      } else if (sort === 'Source') {
        mechs.sort((a, b) => a.Frame.Source.localeCompare(b.Frame.Source));
      } else if (sort === 'Created') {
        mechs.sort((a, b) => a.Created - b.Created);
      }
      return asc ? mechs : mechs.reverse();
    },
  },
  methods: {
    toMechSheet(mech) {
      this.$router.push({ name: `mech-sheet`, params: { mechID: mech.ID } });
    },
  },
};
</script>

<style scoped>
#viewToggle {
  z-index: 4;
}
</style>
