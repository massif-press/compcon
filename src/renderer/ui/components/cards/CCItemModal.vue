<template>
  <div>
    <cc-dialog no-confirm :color="$_.kebabCase(item.ItemType)" large>
      <span slot="button" class="white--text" style="width: 100%">
        <v-icon left>cci-{{ $_.kebabCase(item.ItemType) }}</v-icon>
        {{ item.Name }} {{ item.ItemType === 'Frame' ? 'FRAME' : '' }}
      </span>

      <span slot="title">
        <v-icon left large dark>cci-{{ $_.kebabCase(item.ItemType) }}</v-icon>
        {{ item.Name }}
      </span>
      <v-chip
        slot="title-items"
        color="white"
        class="stat-text mt-4 mr-6"
        outlined
        label
      >{{ item.Source }} {{ $_.startCase(item.ItemType) }}</v-chip>

      <cc-item-card :item="item" />
    </cc-dialog>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  name: 'cc-item-modal',
  props: {
    item: {
      type: Object,
      required: true,
    },
  },
  data: () => ({
    dialog: false,
  }),
})
</script>
