<template>
  <v-toolbar
    :color="color"
    :class="{ 'clipped-large': clipped }"
    :style="fixed ? 'position: fixed; width: 100%; z-index:' : ''"
    :density="<any>density">
    <v-toolbar-title style="text-transform: uppercase" class="heading h2 mt-1">
      <v-icon v-if="icon" size="large" class="mt-n1 mr-2" :icon="icon" />
      <slot name="title" />
    </v-toolbar-title>
    <slot name="title-chips" />
    <v-spacer />
    <span class="pr-5">
      <slot name="title-items" />
    </span>
  </v-toolbar>
</template>

<script lang="ts">
export default {
  name: 'CCTitlebar',
  props: {
    fixed: {
      type: Boolean,
      required: false,
    },
    dark: {
      type: Boolean,
      required: false,
      default: true,
    },
    clipped: {
      type: Boolean,
      default: true,
    },
    color: {
      type: String,
      required: false,
      default: 'primary',
    },
    icon: {
      type: String,
      required: false,
      default: '',
    },
    large: {
      type: Boolean,
      required: false,
    },
    density: {
      type: String,
      required: false,
      default: 'default',
    },
  },
};
</script>
