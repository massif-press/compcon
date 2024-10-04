<template>
  <v-container>
    <v-row style="height: 129px" class="pt-5">
      <v-col>
        <ident-block :pilot="pilot" />
      </v-col>
      <v-col style="min-width: 215px; max-width: 215px" />
    </v-row>
    <v-row>
      <v-col cols="8" class="mt-n2">
        <clone-block :pilot="pilot" />

        <section-header title="Pilot Biography" />
        <cc-rich-text-area v-model="pilot.History" class="pt-2 mb-3" />

        <section-header title="Pilot Appearance" />
        <cc-rich-text-area v-model="pilot.TextAppearance" class="pt-2 mb-3" />

        <section-header title="Pilot Notes" />
        <cc-rich-text-area v-model="pilot.Notes" class="pt-2 mb-3" />
      </v-col>
      <v-col cols="4">
        <image-block :pilot="pilot" />
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { Pilot } from '@/class';
import SectionHeader from '../components/SectionHeader.vue';

import IdentBlock from './components/IdentBlock.vue';
import ImageBlock from './components/ImageBlock.vue';
import CloneBlock from './components/CloneBlock.vue';

export default {
  name: 'info-view',
  props: {
    pilot: {
      type: Pilot,
      required: true,
    },
  },
  components: {
    SectionHeader,
    IdentBlock,
    ImageBlock,
    CloneBlock,
  },
};
</script>
