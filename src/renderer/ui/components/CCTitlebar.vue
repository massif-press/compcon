<template>
  <v-toolbar :color="getColor()" class="clipped-large">
    <v-toolbar-title :class="`heading h2 ${dark ? 'white--text' : 'black--text'}`">
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
    dark: {
      type: Boolean,
      required: false,
      default: true,
    },
    color: {
      type: String,
      required: false,
      default: 'primary',
    },
  },
})
</script>
