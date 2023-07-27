<template>
  <div>
    <cc-dialog
      ref="dialog"
      no-confirm
      :color="item.Color"
      :large="$vuetify.display.mdAndUp"
      :fullscreen="$vuetify.display.smAndDown"
      :small-btn="smallBtn"
      :icon="item.Icon"
    >
      <template #button>
        <span class="text-white" style="width: 100%">
          <v-icon v-if="!hideType" :icon="item.Icon" />
          {{ truncate(item.Name) }}
          <span v-if="!hideType">{{ item.ItemType === 'Frame' ? 'FRAME' : '' }}</span>
        </span>
      </template>

      <template #title>
        {{ item.Name }}
      </template>

      <template #title-chips>
        <v-chip class="stat-text mt-n1" size="small" variant="outlined" label>
          {{ item.Source || '' }} {{ startCase(item.ItemType) }}
        </v-chip>
      </template>

      <template #title-items>
        <v-btn slot="title-items" dark icon @click="($refs.dialog as any).confirm()">
          <v-icon size="large" class="fade-select">mdi-close</v-icon>
        </v-btn>
      </template>

      <cc-item-card :item="item" />
    </cc-dialog>
  </div>
</template>

<script lang="ts">
import _ from 'lodash';

export default {
  name: 'CCItemModal',
  props: {
    item: {
      type: Object,
      required: true,
    },
    smallBtn: {
      type: Boolean,
    },
    hideType: {
      type: Boolean,
    },
  },
  methods: {
    startCase(str: string): string {
      return _.startCase(str);
    },
    truncate(str): string {
      if (str.length > 26) return str.substring(0, 24) + '…';
      return str;
    },
  },
};
</script>
