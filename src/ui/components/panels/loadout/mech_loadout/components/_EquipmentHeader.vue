<template>
  <v-row dense no-gutters align="center">
    <v-col cols="auto" class="mr-1">
      <slot name="options" />
    </v-col>
    <v-col>
      <span :class="`heading h3 ${interior ? 'white--text' : 'text--text'}`">
        <v-icon v-if="item.IsCascading" color="warning" class="mt-n1">
          mdi-link-variant-off
        </v-icon>
        <div v-if="item.Destroyed" class="error" style="text-decoration: line-through">
          {{ mod ? item.Name : '' }}DESTROYED
        </div>
        <div v-else-if="mod">WEAPON MODIFICATION</div>
        <div v-else>{{ item.Size }} {{ item.Type }}</div>
      </span>
    </v-col>
    <v-col v-if="item.Note" cols="auto" class="ml-2">
      <cc-tooltip :key="item.Note.length" simple inline :content="item.Note">
        <v-icon small color="active">mdi-note</v-icon>
      </cc-tooltip>
    </v-col>
    <v-col v-if="item.IsLimited" cols="auto" class="mx-2">
      <div class="overline">
        USES
      </div>
      <cc-item-uses :item="item" :bonus="useBonus" :color="color" />
    </v-col>
    <v-col v-if="item.IsLoading" cols="auto" class="mx-2">
      <v-btn
        small
        dark
        :color="item.Loaded ? 'pilot' : 'grey'"
        @click.stop="item.Loaded = !item.Loaded"
      >
        <v-icon left small>mdi-progress-{{ item.Loaded ? 'upload' : 'download' }}</v-icon>
        {{ item.Loaded ? 'LOADED' : 'NOT LOADED' }}
      </v-btn>
    </v-col>
    <v-col cols="auto" class="">
      <slot />
    </v-col>
    <v-col v-if="item.SP" cols="auto" class="mr-3 ml-auto">
      <span class="heading h3" :style="`color: ${color}`">{{ item.SP }}SP</span>
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
    useBonus: {
      type: Number,
      required: false,
      default: 0,
    },
    interior: {
      type: Boolean,
    },
    dark: {
      type: Boolean,
    },
    mod: {
      type: Boolean,
    },
  },
})
</script>
