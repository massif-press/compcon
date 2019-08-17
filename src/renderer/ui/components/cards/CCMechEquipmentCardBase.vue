<template>
  <v-card-text class="py-0">
    <v-layout row class="stat-text" fill-height>
      <slot></slot>
    </v-layout>

    <v-layout>
      <v-flex grow>
        <v-divider class="mt-3" />
      </v-flex>
      <v-flex shrink class="mx-1">
        <v-icon color="panel-border">cci-{{$_.kebabCase(item.ItemType)}}</v-icon>
      </v-flex>
      <v-flex grow>
        <v-divider class="mt-3" />
      </v-flex>
    </v-layout>

    <div v-if="item.Description">
      <span class="overline ml-n2">COMPENDIUM ENTRY</span>
      <p v-html="item.Description" class="flavor-text" />
    </div>

    <div v-if="item.Effect">
      <span class="overline ml-n2">WEAPON EFFECT</span>
      <p v-html="item.Effect" class="effect-text panel pa-2" />
    </div>

    <v-layout class="my-2">
      <cc-tag v-for="(t, index) in item.Tags" :key="t.id + index" :tag="t" />
    </v-layout>
  </v-card-text>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  name: 'cc-mech-card-base',
  props: {
    item: {
      type: Object,
      required: true,
    },
  },
})
</script>