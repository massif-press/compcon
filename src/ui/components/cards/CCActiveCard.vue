<template>
  <v-col :cols="cols" :xl="xl" :lg="lg" :md="md" :sm="sm" class="pa-1">
    <v-card
      tile
      color="panel clipped"
      :height="collapsed ? '' : '100%'"
      style="transition: all 0.2s"
    >
      <v-card-title class="pa-0 pl-2 pr-2" :class="color">
        <v-icon v-if="collapsible" left dark class="fadeSelect" @click="collapsed = !collapsed">
          {{ collapsed ? 'mdi-chevron-up' : 'mdi-chevron-down' }}
        </v-icon>
        <span class="heading h3 white--text">{{ header }}</span>
        <v-spacer />
        <span class="overline white--text mr-2">{{ subheader }}</span>
      </v-card-title>
      <v-scroll-y-transition leave-absolute>
        <v-card-text v-if="!collapsed" class="pa-1 pl-2 ma-0 text--text body-text">
          <div v-if="content" :class="prominent ? 'text-center heading h3' : ''">{{ content }}</div>
          <slot v-else />
        </v-card-text>
      </v-scroll-y-transition>
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
    xl: {
      type: [String, Number],
      required: false,
      default: '',
    },
    lg: {
      type: [String, Number],
      required: false,
      default: '',
    },
    md: {
      type: [String, Number],
      required: false,
      default: '',
    },
    sm: {
      type: [String, Number],
      required: false,
      default: '',
    },
    collapsible: {
      type: Boolean,
    },
    startClosed: {
      type: Boolean,
    },
    prominent: {
      type: Boolean,
    },
  },
  data: () => ({
    collapsed: false,
  }),
  created() {
    this.collapsed = this.startClosed
  },
})
</script>
