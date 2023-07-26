<template>
  <cc-item-card v-if="item" :item="item" />
  <div v-else style="height: 100px">
    <div class="heading h2 light-text-panel text-center" style="margin-top: calc(50vh - 150px)">
      NO SELECTION
    </div>
  </div>
</template>

<script lang="ts">
export default {
  name: 'selector-list-item',
  props: {
    item: {
      type: Object,
      required: false,
    },
  },
};
</script>
