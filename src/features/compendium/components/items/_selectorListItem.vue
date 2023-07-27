<template>
  <div v-if="item">
    <div class="heading mech my-n2">
      {{ item.Name }}
    </div>
    <cc-item-card :item="item" />
  </div>
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
