<template>
  <v-bottom-navigation height="20">
    <v-tabs grow center density="compact" height="20" bg-color="primary">
      <v-tab
        variant="text"
        :class="selected === 0 ? 'bg-white' : ''"
        size="x-small"
        :selected="selected === 0"
        @click="$emit('to', 0)">
        DOSSIER
      </v-tab>
      <v-tab
        variant="text"
        :class="selected === 1 ? 'bg-white' : ''"
        size="x-small"
        :selected="selected === 1"
        @click="$emit('to', 1)">
        NARRATIVE PROFILE
      </v-tab>
      <v-tab
        v-if="hasBonds"
        variant="text"
        size="x-small"
        :class="selected === 2 ? 'bg-white' : ''"
        :selected="selected === 2"
        @click="$emit('to', 2)">
        BONDS
      </v-tab>
      <v-tab
        variant="text"
        :class="selected === 3 ? 'bg-white' : ''"
        size="x-small"
        :selected="selected === 3"
        @click="$emit('to', 3)">
        TACTICAL PROFILE
      </v-tab>
      <v-tab
        variant="text"
        :class="selected === 4 ? 'bg-white' : ''"
        size="x-small"
        :selected="selected === 4"
        @click="$emit('to', 4)">
        MECH HANGAR
      </v-tab>
      <v-tab
        variant="text"
        :class="selected === 5 ? 'bg-white' : ''"
        size="x-small"
        :selected="selected === 5"
        @click="$emit('to', 5)">
        OPTIONS
      </v-tab>
    </v-tabs>
  </v-bottom-navigation>
</template>

<script lang="ts">
import EditMenu from './PilotEditMenu.vue';
import ShareDialog from './ShareDialog.vue';
import { Pilot } from '@/class';
import { PilotStore, CompendiumStore, UserStore } from '@/stores';
import NavItem from '../../_components/NavItem.vue';
import { CloudController } from '@/classes/components';

export default {
  name: 'pilot-nav',
  components: {
    EditMenu,
    ShareDialog,
    NavItem,
  },
  emits: ['to'],
  props: {
    pilot: {
      type: Pilot,
      required: true,
    },
    selected: {
      type: Number,
      required: true,
    },
  },
  data: () => ({
    loading: false,
  }),

  computed: {
    hasBonds() {
      return CompendiumStore().Bonds.length > 0;
    },
  },
};
</script>
