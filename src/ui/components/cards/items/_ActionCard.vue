<template>
  <cc-action :action="item" panel />
</template>

<script lang="ts">
export default {
  name: 'cc-action-card',
  props: {
    item: {
      type: Object,
      required: true,
    },
  },
};
</script>
