<template>
  <v-col :cols="cols" class="pa-1">
    <v-card tile color="panel clipped" height="100%">
      <v-card-title class="pa-0 pl-2 pr-2" :class="color">
        <span class="heading h3 white--text">{{ header }}</span>
        <v-spacer />
        <span class="overline white--text mr-2">{{ subheader }}</span>
      </v-card-title>
      <v-card-text class="pa-1 pl-2 ma-0 text--text flavor-text">
        <div v-if="content" class="text-center heading h2 pb-2">{{ content }}</div>
        <slot v-else />
      </v-card-text>
    </v-card>
  </v-col>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  name: 'cc-active-card',
  props: {
    color: {
      type: String,
      required: false,
      default: 'primary',
    },
    header: {
      type: String,
      required: true,
    },
    subheader: {
      type: String,
      required: false,
      default: '',
    },
    content: {
      type: [String, Number],
      required: false,
      default: '',
    },
    cols: {
      type: [String, Number],
      required: false,
      default: '',
    },
  },
})
</script>
