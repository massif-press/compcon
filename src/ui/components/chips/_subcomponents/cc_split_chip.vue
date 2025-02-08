<template>
  <base-chip v-bind="$props">
    <template #content>
      <span :class="`py-2 ${title ? 'px-2' : 'px-1'}`" :style="`background-color: ${hexColor}`">
        <v-icon v-if="icon" :icon="icon" :start="!!title" />
        <span v-if="title" v-text="title" />
      </span>
      <span v-if="label" class="px-2" v-text="label" />
      <slot />
    </template>
    <template #tooltip><slot name="tooltip" /></template>
  </base-chip>
</template>

<script lang="ts">
import baseChip from './cc_base_chip.vue';

export default {
  name: 'CCChip',
  components: { baseChip },
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
  computed: {
    hexColor() {
      if (this.color[0] === '#') return this.color;
      return this.$vuetify.theme.themes[this.$vuetify.theme.global.name].colors[this.color];
    },
  },
};
</script>
