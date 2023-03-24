<template>
  <v-toolbar
    :color="color"
    :class="{ 'clipped-large': clipped }"
    :style="fixed ? 'position: fixed; width: 100%; z-index:99' : ''"
    density="compact"
  >
    <v-toolbar-title
      :class="`heading ${$vuetify.display.mdAndDown ? 'h3' : 'h2'} ${
        dark ? 'white--text' : 'stark--text'
      } pt-1`"
      style="text-transform: uppercase"
    >
      <v-icon v-if="icon" x-large :dark="dark" class="mt-n1" left>{{
        icon
      }}</v-icon>
      <slot />
    </v-toolbar-title>
    <v-spacer />
    <v-toolbar-items>
      <slot name="items" />
    </v-toolbar-items>
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
  },
};
</script>
