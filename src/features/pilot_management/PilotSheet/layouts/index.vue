<template>
  <div v-if="profile && profile.GetView">
    <tabbed-layout
      v-if="profile.GetView('pilotSheet') === 'tabbed'"
      :page="tab"
      :pilot="pilot"
    />
    <classic-layout
      v-else-if="profile.GetView('pilotSheet') === 'classic'"
      :page="tab"
      :pilot="pilot"
    />
    <pilot-nav
      :pilot="pilot"
      :selected="tab"
      @set="profile.SetView('pilotSheet', $event)"
    />
  </div>
</template>

<script lang="ts">
import { UserStore } from '@/stores';
import { Pilot } from '@/class';
import { UserProfile } from '@/user';
import TabbedLayout from './Tabbed.vue';
import ClassicLayout from './Classic.vue';
import PilotNav from '../components/PilotNav.vue';

export default {
  name: 'pilot-sheet-content',
  components: { PilotNav, TabbedLayout, ClassicLayout },
  props: {
    tab: {
      type: String,
      required: true,
    },
    pilotID: {
      type: String,
      required: true,
    },
  },
  data: () => ({
    page: 2,
  }),
  computed: {
    pilot(): Pilot {
      return this.$store.state.management.Pilots.find(
        (p) => p.ID === this.pilotID
      );
    },
    profile(): UserProfile {
      const store = UserStore();
      return store.UserProfile;
    },
  },
  watch: {
    tab() {
      this.page = this.tab;
    },
    layout() {
      this.page = 0;
    },
  },
};
</script>
