<template>
  <v-card-text class="mb-0 pb-0">
    <v-row class="flavor-text" no-gutters>
      <slot />
    </v-row>

    <v-row v-if="item.LicenseString">
      <v-divider class="mt-3" />
      <v-icon color="panel-border">cci-{{ $_.kebabCase(item.ItemType) }}</v-icon>
      <v-divider class="mt-3" />
    </v-row>

    <slot name="statblock" />

    <div v-if="item.Effect">
      <p v-if="typeof item.Effect === 'string'" class="text--text body-text" v-html="item.Effect" />
      <cc-item-effect-panel v-else :key="item.ID" :effects="item.Effect" />
    </div>
    <div v-if="item.Tags && item.Tags.length" class="mt-5">
      <div class="overline ml-n2 mb-n1">EQUIPMENT TAGS</div>
      <cc-tags :tags="item.Tags" extended />
    </div>
    <div v-if="item.Description">
      <v-row v-if="item.Effect || (item.Tags && item.Tags.length)" class="mt-4">
        <v-divider class="mt-3" />
        <v-icon color="panel-border">cci-{{ $_.kebabCase(item.ItemType) }}</v-icon>
        <v-divider class="mt-3" />
      </v-row>
      <div class="overline ml-n2 mb-n2">COMPENDIUM ENTRY</div>
      <p class="flavor-text mb-1" v-html="item.Description" />
    </div>
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
