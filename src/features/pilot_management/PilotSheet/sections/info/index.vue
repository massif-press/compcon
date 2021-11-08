<template>
  <div>
    <v-row dense align="center" class="mt-n6 mb-n6">
      <v-col>
        <ident-block />
      </v-col>
      <v-col v-if="$vuetify.breakpoint.mdAndUp" cols="1" />
    </v-row>
    <v-row>
      <v-col v-if="$vuetify.breakpoint.smAndDown" cols="12">
        <image-block />
      </v-col>
      <v-col cols="12" md="8" dense>
        <clone-block />
        <history-block />
        <appearance-block />
        <notes-block />
        <combat-history-block />
      </v-col>
      <v-col v-if="$vuetify.breakpoint.mdAndUp" cols="4" dense>
        <image-block />
      </v-col>
    </v-row>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import IdentBlock from './components/IdentBlock.vue'
import HistoryBlock from './components/HistoryBlock.vue'
import AppearanceBlock from './components/AppearanceBlock.vue'
import ImageBlock from './components/ImageBlock.vue'
import NotesBlock from './components/NotesBlock.vue'
import CloneBlock from './components/CloneBlock.vue'
import CombatHistoryBlock from './components/CombatHistoryBlock.vue'

export default Vue.extend({
  name: 'info-view',
  components: { IdentBlock, HistoryBlock, AppearanceBlock, ImageBlock, NotesBlock, CloneBlock, CombatHistoryBlock },
})
</script>
