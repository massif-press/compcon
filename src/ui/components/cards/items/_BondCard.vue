<template>
  <cc-bond-info :bond="item"
    hide-title />
</template>

<script lang="ts">
export default {
  name: 'CcBondCard',
  props: {
    item: { type: Object, required: true },
  },
};
</script>
