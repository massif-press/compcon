<template>
  <div class="mb-2">
    <v-toolbar :color="color" dark flat dense class="clipped-large-invert">
      <v-toolbar-title>
        <v-icon v-if="icon" x-large left>{{icon}}</v-icon>
        <span class="heading h3">{{title}}</span>
      </v-toolbar-title>
    </v-toolbar>

    <v-card flat outlined>
      <v-card-text>
        <slot></slot>
      </v-card-text>
    </v-card>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  name: 'cc-titled-panel',
  props: {
    title: {
      type: String,
      required: true,
    },
    icon: {
      type: String,
      required: false,
    },
    color: {
      type: String,
      required: false,
      default: 'primary',
    },
  },
})
</script>