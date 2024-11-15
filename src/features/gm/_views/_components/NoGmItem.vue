<template>
  <v-row style="height: 85vh">
    <v-col cols="auto" class="mx-auto text-center my-auto text-disabled">
      <div v-if="!canAddNpc">
        <v-icon size="100" class="">mdi-book-off-outline</v-icon>
        <div class="heading h4">Missing GM Content</div>
        <cc-missing-gm-lcp-text />
      </div>
      <div v-else>
        <v-icon size="100" class="">mdi-square-off-outline</v-icon>
        <div class="heading h4">No Item Selected</div>
      </div>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import { CompendiumStore } from '@/stores';

export default {
  name: 'no-gm-item',
  computed: {
    canAddNpc(): boolean {
      return CompendiumStore().hasNpcAccess;
    },
  },
};
</script>
