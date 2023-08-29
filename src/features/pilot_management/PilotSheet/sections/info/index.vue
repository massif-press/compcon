<template>
  <div>
    <v-row style="height: 129px" class="pt-5">
      <v-col>
        <ident-block :pilot="pilot" />
      </v-col>
      <v-col style="min-width: 215px; max-width: 215px" />
    </v-row>
    <v-row align="center">
      <v-col cols="8">
        <clone-block :pilot="pilot" />
        <history-block :pilot="pilot" />
        <appearance-block :pilot="pilot" />
        <notes-block :pilot="pilot" />
        <!-- <combat-history-block :pilot="pilot" /> -->
      </v-col>
      <v-col cols="4">
        <image-block :pilot="pilot" />
      </v-col>
    </v-row>
  </div>
</template>

<script lang="ts">
import { Pilot } from '@/class';

import IdentBlock from './components/IdentBlock.vue';
import HistoryBlock from './components/HistoryBlock.vue';
import AppearanceBlock from './components/AppearanceBlock.vue';
import ImageBlock from './components/ImageBlock.vue';
import NotesBlock from './components/NotesBlock.vue';
import CloneBlock from './components/CloneBlock.vue';
import CombatHistoryBlock from './components/CombatHistoryBlock.vue';

export default {
  name: 'info-view',
  props: {
    pilot: {
      type: Pilot,
      required: true,
    },
  },
  components: {
    IdentBlock,
    HistoryBlock,
    AppearanceBlock,
    ImageBlock,
    NotesBlock,
    CloneBlock,
    CombatHistoryBlock,
  },
};
</script>
