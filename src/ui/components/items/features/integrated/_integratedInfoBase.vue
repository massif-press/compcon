<template>
  <cc-item-card :item="item" />
</template>

<script lang="ts">
export default {
  name: 'integrated-info-base',
  props: {
    item: {
      type: Object,
      required: true,
    },
  },
};
</script>
