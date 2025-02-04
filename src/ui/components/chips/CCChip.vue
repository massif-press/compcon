<template>
  <v-chip :color="bgColor" :variant="<any>variant" :size="size" tile class="pa-0">
    <span :class="`bg-${color} py-2 ${title ? 'px-2' : 'px-1'}`">
      <v-icon v-if="icon" :icon="icon" />
      <span v-if="title" v-text="title" />
    </span>
    <span v-if="label" class="px-2" v-text="label" />
  </v-chip>
</template>
<script lang="ts">
export default {
  name: 'CCChip',
  props: {
    color: {
      type: String,
      required: false,
      default: 'primary',
    },
    bgColor: {
      type: String,
      required: false,
    },
    title: {
      type: String,
    },
    label: {
      type: String,
    },
    icon: {
      type: String,
    },
    outlined: {
      type: Boolean,
    },
    size: {
      type: String,
      required: false,
      default: 'small',
    },
    variant: {
      type: String,
    },
  },
};
</script>
