<template>
  <p v-html-safe="item.Detail"></p>
</template>

<script lang="ts">

export default {
  name: 'CcSkillCard',
  props: {
    item: {
      type: Object,
      required: true,
    },
  },
};
</script>
