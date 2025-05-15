<template>
  npc
  {{ npc }}
</template>

<script>
export default {
  name: 'PcPanel',
  props: {
    npc: {
      type: Object,
      required: true,
    },
  },
};
</script>
