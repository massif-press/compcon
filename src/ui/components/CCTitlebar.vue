<template>
  <v-toolbar
    :color="getColor()"
    :class="{ 'clipped-large': clipped }"
    :style="fixed ? 'position: fixed; width: 100%; z-index:99' : ''"
  >
    <v-toolbar-title :class="`heading h2 ${dark ? 'white--text' : 'black--text'}`">
      <v-icon v-if="icon" :large="large" :dark="dark" left>{{ icon }}</v-icon>
      <slot></slot>
    </v-toolbar-title>
    <v-spacer />
    <v-toolbar-items>
      <slot name="items"></slot>
    </v-toolbar-items>
  </v-toolbar>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  name: 'cc-titlebar',
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
})
</script>
