<template>
  <v-chip size="x-small" label class="pa-0"
    ><span :class="`bg-${color} pa-2`">{{ label.title }}</span>
    <span v-if="label.value" class="px-2">{{ label.value }}</span></v-chip
  >
</template>

<script lang="ts">
export default {
  name: 'CCStatblockPanel',
  props: {
    label: {
      type: Object,
      required: true,
    },
    color: {
      type: String,
      required: false,
      default: 'primary',
    },
  },
};
</script>
