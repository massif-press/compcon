<template>
  <div class="heading h3" v-text="item.StatusType" />
  <div v-html="item.Effects" />
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
