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
    <div v-if="item.Effect">
      <p v-if="typeof item.Effect === 'string'" class="text--text body-text" v-html="item.Effect" />
      <cc-item-effect-panel v-else :key="item.ID" :effects="item.Effect" class="mb-2" />
    </div>
    <div v-if="item.Tags">
      <div class="overline ml-n2">EQUIPMENT TAGS</div>
      <cc-tags :tags="item.Tags" extended />
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
