<template>
  <div style="position: fixed; bottom: 2px; right: 8px">
    <v-tooltip location="top" open-delay="300">
      <template #activator="{ props }">
        <v-icon
          v-bind="props"
          size="small"
          class="fade-select"
          color="secondary"
          icon="mdi-share-variant"
          @click="copyToClipboard" />
      </template>
      <span>Copy link</span>
    </v-tooltip>
  </div>
</template>

<script lang="ts">
import { CompendiumStore } from '@/stores';

export default {
  name: 'ItemCardLink',
  props: {
    item: {
      type: Object,
      required: true,
    },
  },
  computed: {
    link() {
      return CompendiumStore().referenceLink(this.item);
    },
  },
  methods: {
    copyToClipboard() {
      navigator.clipboard.writeText(this.link);
    },
  },
};
</script>
