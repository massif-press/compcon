<template>
  <cc-panel color="panel-dark"
    :density="dense ? 'compact' : ''"
    style="position: relative">
    <v-card-text class="pr-4 pt-0">
      <div v-if="!dense"
        style="float: right; width: 22vw; height: 22vw">
        <cc-logo width="22vw"
          :source="item"
          :color="item.Color" />
      </div>
      <blockquote v-html-safe="item.Quote"
        class="quote-block" />
      <v-divider v-if="!dense"
        class="ma-2"
        style="width: 30vw" />
      <p v-html-safe="item.Description"
        class="body-text stark-text-text mb-2" />
    </v-card-text>
  </cc-panel>
</template>

<script setup lang="ts">
import { Manufacturer } from '@/classes/Manufacturer.js';

defineProps<{
  item: Manufacturer
  notes?: boolean
  smallTags?: boolean
  dense?: boolean
  charts?: boolean
  collapseActions?: boolean
  tier?: number
}>()
</script>

<style scoped>
.quote-block {
  border-left: 6px solid rgb(var(--v-theme-panel));
  border-radius: 0px;
  padding-left: 12px;
  font-size: 1.15rem;
  font-style: italic;
}
</style>
