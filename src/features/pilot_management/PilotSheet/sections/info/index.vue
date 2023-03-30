<template>
  <div>
    <v-row density="compact" align="center" class="mt-n6 mb-n6">
      <v-col>
        <ident-block />
      </v-col>
      <v-col v-if="$vuetify.display.mdAndUp" cols="1" />
    </v-row>
    <v-row>
      <v-col v-if="$vuetify.display.smAndDown" cols="12">
        <image-block />
      </v-col>
      <v-col cols="12" md="8" density="compact">
        <clone-block />
        <history-block />
        <appearance-block />
        <notes-block />
        <combat-history-block />
      </v-col>
      <v-col v-if="$vuetify.display.mdAndUp" cols="4" density="compact">
        <image-block />
      </v-col>
    </v-row>
  </div>
</template>

<script lang="ts">
import IdentBlock from './components/IdentBlock.vue';
import HistoryBlock from './components/HistoryBlock.vue';
import AppearanceBlock from './components/AppearanceBlock.vue';
import ImageBlock from './components/ImageBlock.vue';
import NotesBlock from './components/NotesBlock.vue';
import CloneBlock from './components/CloneBlock.vue';
import CombatHistoryBlock from './components/CombatHistoryBlock.vue';

export default {
  name: 'info-view',
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
