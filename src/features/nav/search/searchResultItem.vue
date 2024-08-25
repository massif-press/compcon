<template>
  <v-list-item
    :key="indexItem.path"
    :prepend-icon="indexItem.icon"
    :title="indexItem.title"
    border
    class="my-1"
    :subtitle="unCamelCase(indexItem.type)"
    @click="navTo(indexItem.path)">
    <template #append>
      <i class="text-caption">{{ indexItem.pack }}</i>
    </template>
  </v-list-item>
</template>

<script lang="ts">
import { unCamelCase } from '@/classes/utility/accent_fold';
import { IndexItem, NavStore } from '@/stores';

export default {
  name: 'search-result-item',
  props: {
    indexItem: {
      type: Object,
      required: true,
    },
  },
  methods: {
    navTo(path) {
      this.$router.push(path);
      // this.$router.go(0);
      NavStore().setSearchHistory(this.indexItem as IndexItem);
      this.$emit('onNav');
    },
    unCamelCase(str) {
      return unCamelCase(str);
    },
  },
};
</script>
