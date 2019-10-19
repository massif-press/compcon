<template>
  <div>
    <v-row class="pt-0">
      <v-col cols="10" class="pt-0 mb-n8">
        <ident-block />
      </v-col>
      <v-col cols="8" dense>
        <history-block />
        <appearance-block />
        <notes-block />
      </v-col>
      <v-col cols="4" dense>
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

export default Vue.extend({
  name: 'infor-view',
  components: { IdentBlock, HistoryBlock, AppearanceBlock, ImageBlock, NotesBlock },
})
</script>