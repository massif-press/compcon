<template>
  <cc-talent :talent="item"
    hide-change
    hide-title />
</template>

<script lang="ts">

export default {
  name: 'TalentCard',
  props: {
    item: {
      type: Object,
      required: true,
    },
  },
};
</script>
