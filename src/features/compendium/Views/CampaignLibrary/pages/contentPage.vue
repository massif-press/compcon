<template>
  <v-container>
    <div
      v-if="item.SectionType.toLowerCase() !== 'section' && item.ItemNumber > 0"
      class="text-overline mt-n2 mb-n3">
      <b>{{ item.SectionType }} {{ item.ItemNumber }}:</b>
    </div>
    <div class="heading h1 text-accent">
      {{ item.Title }}
    </div>
    <v-divider class="mt-n1 mb-3" />
    <page-content-container
      v-for="(e, i) in item.Content"
      :key="`content-${i}`"
      :item="e"
      class="mb-4"
      @delete-item="item.RemoveContentItem(i)" />
  </v-container>
</template>

<script setup lang="ts">
import PageContentContainer from './containers/campaignContentContainer.vue';

defineOptions({ name: 'campaign-content-page' })

const props = defineProps<{
  item: object
}>()
</script>
