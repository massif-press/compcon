<template>
  <cc-bond-info :bond="item" hide-title />
</template>

<script lang="ts">
export default {
  name: 'cc-bond-card',
  props: {
    item: {
      type: Object,
      required: true,
    },
  },
};
</script>
