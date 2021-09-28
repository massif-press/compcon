<template>
  <v-row no-gutters align="center" class="mt-0 mb-n1">
    <v-col cols="auto">
      <span :class="`heading h3 ${interior ? 'white--text' : 'text--text'}`">
        <v-icon v-if="item.IsCascading" color="warning" class="mt-n1">
          mdi-link-variant-off
        </v-icon>
      </span>
    </v-col>
    <v-col v-if="item.IsLimited" cols="auto" class="mx-2">
      <cc-item-uses :item="item" :bonus="useBonus" :color="color" class="d-inline" />
      <span class="overline">({{ item.getTotalUses(useBonus) - item.MissingUses }}/{{ item.getTotalUses(useBonus) }}) USES</span>
    </v-col>
    <v-col v-if="item.IsLoading && readonly" cols="auto" class="ma-1">
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
    <v-col cols="auto">
      <slot name="left" />
    </v-col>
    <v-col cols="auto" class="mx-2">
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
    readonly: {
      type: Boolean,
    },
  },
})
</script>
