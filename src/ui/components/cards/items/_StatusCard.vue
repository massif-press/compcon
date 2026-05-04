<template>
  <div class="heading h3"
    v-text="item.StatusType" />
  <div v-html-safe="item.Effects" />
</template>

<script lang="ts">
export default {
  name: 'CcStatusCard',
  props: {
    item: {
      type: Object,
      required: true,
    },
  },
};
</script>
