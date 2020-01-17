<template>
  <v-row dense no-gutters align="center">
    <v-col cols="auto" class="mr-1">
      <slot name="options" />
    </v-col>
    <v-col>
      <span
        :class="interior ? 'ml-n2 heading h3 white--text' : 'heading h3 text--text'"
        style="line-height: 35px"
      >
        <v-icon v-if="item.IsUnshackled" color="warning" class="mt-n1">
          mdi-link-variant-off
        </v-icon>
        <div class="mt-n2">{{ item.Size }} {{ item.Type }}</div>
      </span>
    </v-col>
    <v-col v-if="item.Note" cols="auto" class="ml-2">
      <cc-tooltip :key="item.Note.length" simple inline :content="item.Note">
        <v-icon small color="active">mdi-note</v-icon>
      </cc-tooltip>
    </v-col>
    <v-col v-if="item.IsLoading" cols="auto" class="mr-2">
      <v-chip small dark label :color="item.Loaded ? 'pilot' : 'grey'">
        <v-icon left small>mdi-progress-{{ item.Loaded ? 'upload' : 'download' }}</v-icon>
        {{ item.Loaded ? 'LOADED' : 'NOT LOADED' }}
      </v-chip>
    </v-col>
    <v-col v-if="item.SP" cols="auto" class="mr-3 ml-auto">
      <span class="heading h3" :style="`color: ${color}`">{{ item.SP }}SP</span>
    </v-col>
    <v-col cols="auto" class="">
      <slot />
    </v-col>
  </v-row>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'equipment-header',
  props: {
    item: {
      type: Object,
      required: true,
    },
    color: {
      type: String,
      required: false,
      default: null,
    },
    interior: {
      type: Boolean,
    },
    dark: {
      type: Boolean,
    },
  },
})
</script>
