<template>
  <div style="position: absolute; bottom: 10px; right: 11px">
    <v-tooltip location="top"
      open-delay="300">
      <template #activator="{ props }">
        <v-btn v-bind="props"
          size="25"
          flat
          tile
          variant="outlined"
          class="fade-select"
          color="secondary"
          @click="copyToClipboard">
          <v-icon icon="mdi-share-variant" />
        </v-btn>
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
      return CompendiumStore().referenceLink(this.item as any);
    },
  },
  methods: {
    copyToClipboard() {
      navigator.clipboard.writeText(encodeURI(this.link));
      this.$notify({
        type: 'success',
        title: 'Link Copied',
        text: `${this.item.Name} static link has been copied to the clipboard.`,
      });
    },
  },
};
</script>
