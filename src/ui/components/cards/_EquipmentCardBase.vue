<template>
  <v-card-text>
    <v-row class="flavor-text" no-gutters>
      <slot />
    </v-row>

    <v-row>
      <v-divider class="mt-3" />
      <v-icon color="panel-border">cci-{{ $_.kebabCase(item.ItemType) }}</v-icon>
      <v-divider class="mt-3" />
    </v-row>

    <slot name="statblock" />

    <div v-if="item.Description">
      <span class="overline ml-n2">COMPENDIUM ENTRY</span>
      <p class="flavor-text mb-1" v-html="item.Description" />
    </div>

    <cc-item-effect-panel v-if="item.Effect" :effects="item.Effect" class="mb-2" />

    <cc-tags v-if="item.Tags" :tags="item.Tags" extended />
  </v-card-text>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  name: 'equipment-card-base',
  props: {
    item: {
      type: Object,
      required: true,
    },
  },
})
</script>
