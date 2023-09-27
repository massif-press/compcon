<template>
  <div>
    <cc-title large color="pilot" class="pr-8 mb-2">Hangar</cc-title>
    <v-btn-toggle id="viewToggle" :value="getView" mandatory>
      <v-btn small icon value="cards" @click="profile.SetView('hangar', 'cards')">
        <v-icon color="accent">mdi-view-grid</v-icon>
      </v-btn>
      <v-btn small icon value="list" @click="profile.SetView('hangar', 'list')">
        <v-icon color="accent">mdi-view-list</v-icon>
      </v-btn>
      <v-btn small icon value="table" @click="profile.SetView('hangar', 'table')">
        <v-icon color="accent">mdi-format-align-justify</v-icon>
      </v-btn>
    </v-btn-toggle>
    <v-container class="mt-2">
      <v-row v-if="getView === 'cards'" justify="center">
        <mech-card
          v-for="m in pilot.Mechs"
          :mech="m"
          @delete="pilot.RemoveMech($event)"
          @copy="pilot.CloneMech($event)"
          @go="toMechSheet($event)"
        />
      </v-row>
      <mech-list-item
        v-else-if="getView === 'list'"
        v-for="m in pilot.Mechs"
        :mech="m"
        @delete="pilot.RemoveMech($event)"
        @copy="pilot.CloneMech($event)"
        @go="toMechSheet($event)"
      />
      <mech-table v-else :mechs="pilot.Mechs" @go="toMechSheet($event)" />
    </v-container>
    <v-row justify="center">
      <v-col cols="auto">
        <v-btn
          color="accent"
          prepend-icon="mdi-plus"
          class="px-10"
          @click="($refs as any).dialog.show()"
        >
          Add New Mech
        </v-btn>
      </v-col>
    </v-row>
    <cc-solo-dialog ref="dialog" icon="cc:frame" no-confirm title="Add New Mech" fullscreen>
      <new-mech-menu :pilot="pilot" @close="($refs as any).dialog.hide()" />
    </cc-solo-dialog>
  </div>
</template>

<script lang="ts">
import MechCard from './components/MechCard.vue';
import MechListItem from './components/MechListItem.vue';
import MechTable from './components/MechTable.vue';
import NewMechMenu from './components/NewMechMenu.vue';
import { UserStore } from '@/stores';
import { Pilot } from '@/class';
import { UserProfile } from '@/user';

export default {
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
      return UserStore().UserProfile as UserProfile;
    },
    getView() {
      const view = this.profile?.View('hangar');
      return view || 'cards';
    },
  },
  methods: {
    toMechSheet(mech) {
      // this.$router.push(`../mech/${mech.ID}`);
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
