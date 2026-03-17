<template>
  <v-bottom-navigation :height="xs ? 20 : 40">
    <v-tabs grow
      center
      density="compact"
      :height="xs ? 20 : 40"
      bg-color="primary"
      hide-slider>
      <v-tab variant="text"
        :class="selected === 1 ? 'bg-white' : ''"
        :size="xs ? 'small' : ''"
        :selected="selected === 1"
        @click="$emit('to', 1)">
        NARRATIVE
      </v-tab>
      <v-tab v-if="hasBonds"
        variant="text"
        :size="xs ? 'small' : ''"
        :class="selected === 2 ? 'bg-white' : ''"
        :selected="selected === 2"
        @click="$emit('to', 2)">
        BONDS
      </v-tab>
      <v-tab variant="text"
        :class="selected === 3 ? 'bg-white' : ''"
        :size="xs ? 'small' : ''"
        :selected="selected === 3"
        @click="$emit('to', 3)">
        TACTICAL
      </v-tab>
      <v-tab variant="text"
        :class="selected === 4 ? 'bg-white' : ''"
        :size="xs ? 'small' : ''"
        :selected="selected === 4"
        @click="$emit('to', 4)">
        HANGAR
      </v-tab>
      <v-tab variant="text"
        :class="selected === 5 ? 'bg-white' : ''"
        :size="xs ? 'small' : ''"
        :selected="selected === 5"
        @click="$emit('to', 5)">
        OPTIONS
      </v-tab>
    </v-tabs>
  </v-bottom-navigation>
</template>

<script lang="ts">
import { Pilot } from '@/class';
import { CompendiumStore } from '@/stores';

export default {
  name: 'PilotNav',
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
  emits: ['to'],
  data: () => ({
    loading: false,
  }),
  computed: {
    xs() {
      return this.$vuetify.display.smOrDown;
    },
    hasBonds() {
      return CompendiumStore().Bonds.length > 0;
    },
  },
};
</script>
