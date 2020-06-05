<template>
  <div>
    <cc-dialog
      ref="dialog"
      no-confirm
      :color="item.Color"
      :large="$vuetify.breakpoint.mdAndUp"
      :fullscreen="$vuetify.breakpoint.smAndDown"
      :small-btn="smallBtn"
    >
      <span slot="button" class="white--text" style="width: 100%">
        <v-icon :left="!smallBtn">{{ item.Icon }}</v-icon>
        {{ truncate(item.Name) }} {{ item.ItemType === 'Frame' ? 'FRAME' : '' }}
      </span>

      <span slot="title">
        <v-icon left large dark>{{ item.Icon }}</v-icon>
        {{ item.Name }}
      </span>

      <v-btn
        v-if="$vuetify.breakpoint.smAndDown"
        slot="title-items"
        dark
        icon
        @click="$refs.dialog.confirm()"
      >
        <v-icon large left>close</v-icon>
      </v-btn>

      <v-chip
        v-if="$vuetify.breakpoint.lgAndUp"
        slot="title-items"
        color="white"
        class="stat-text mt-4 mr-6"
        outlined
        label
      >
        {{ item.Source || '' }} {{ $_.startCase(item.ItemType) }}
      </v-chip>

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
    smallBtn: {
      type: Boolean,
    },
  },
  methods: {
    truncate(str) {
      if (str.length > 26) return str.substring(0, 24) + '…'
      return str
    },
  },
})
</script>
