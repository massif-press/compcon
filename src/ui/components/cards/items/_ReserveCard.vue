<template>
  <p v-html-safe="item.Description" />
</template>

<script lang="ts">

export default {
  name: 'ReserveCard',
  props: {
    item: {
      type: Object,
      required: true,
    },
  },
};
</script>
