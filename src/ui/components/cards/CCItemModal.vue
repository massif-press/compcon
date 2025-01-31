<template>
  <div>
    <cc-dialog
      ref="dialog"
      no-confirm
      :color="item.Color ? item.Color : 'primary'"
      :large="!$vuetify.display.mdAndDown"
      :fullscreen="$vuetify.display.mdAndDown"
      :small-btn="smallBtn"
      :block="block"
      :icon="item.Icon">
      <template #button>
        <v-icon v-if="item.IsExotic" start color="exotic">mdi-star</v-icon>
        <v-icon v-if="!hideType" start :icon="item.Icon" />
        {{ truncate(item.Name) }}
        <span v-if="!hideType">{{ item.ItemType === 'Frame' ? '&nbsp;FRAME' : '' }}</span>
      </template>

      <template #title>
        {{ item.Name }}
      </template>

      <template #title-chips>
        <v-chip class="stat-text mt-n1" size="small" variant="outlined" label>
          {{ item.Source || '' }} {{ startCase(item.ItemType) }}
        </v-chip>
      </template>

      <cc-item-card :item="item" />
      <item-card-link :item="item" />
    </cc-dialog>
  </div>
</template>

<script lang="ts">
import _ from 'lodash';
import ItemCardLink from './items/_components/ItemCardLink.vue';

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
    block: {
      type: Boolean,
    },
  },
  components: {
    ItemCardLink,
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
