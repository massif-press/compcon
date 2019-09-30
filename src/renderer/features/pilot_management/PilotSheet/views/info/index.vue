<template>
  <div>
    <v-row class="pt-0">
      <v-col cols="10" class="pt-0">
        <ident-block />
      </v-col>
      <v-col cols="8" dense>
        <history-block />
        <appearance-block />
        <notes-block />
      </v-col>
      <v-col dense>
        <v-card outlined height="150px" class="mx-5 my-1">full image (additional art?)</v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import IdentBlock from './components/IdentBlock.vue'
import HistoryBlock from './components/HistoryBlock.vue'
import AppearanceBlock from './components/AppearanceBlock.vue'
import NotesBlock from './components/NotesBlock.vue'

export default Vue.extend({
  name: 'infor-view',
  components: { IdentBlock, HistoryBlock, AppearanceBlock, NotesBlock },
})
</script>