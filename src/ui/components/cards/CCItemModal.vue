<template>
  <cc-modal
    ref="dialog"
    :color="item.Color ? item.Color : 'primary'"
    :title="`${item.Name}`"
    :icon="item.Icon">
    <template #activator="{ open }">
      <cc-button
        :color="item.Color ? item.Color : 'primary'"
        class="ma-1"
        :block="block"
        size="small"
        @click="open">
        <v-icon v-if="item.IsExotic" start color="exotic">mdi-star</v-icon>
        <v-icon v-if="!hideType" start :icon="item.Icon" />
        {{ truncate(item.Name) }}
        <span v-if="!hideType">{{ item.ItemType === 'Frame' ? '&nbsp;FRAME' : '' }}</span>
      </cc-button>
    </template>

    <template v-if="!mobile" #toolbar-items>
      <cc-chip
        :icon="item.Manufacturer.Icon"
        :title="item.Source || ''"
        :label="startCase(item.ItemType)"
        :color="item.Manufacturer.Color" />
    </template>

    <v-card-text class="pt-2" :class="wide && 'px-12'">
      <cc-item-card :item="item" />
    </v-card-text>

    <item-card-link :item="item" />
  </cc-modal>
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
  computed: {
    mobile() {
      return this.$vuetify.display.smAndDown;
    },
    wide() {
      return this.$vuetify.display.lgAndUp;
    },
  },
  methods: {
    startCase(str: string): string {
      return _.startCase(str);
    },
    truncate(str): string {
      if (this.block) return str;
      if (str.length > 26) return str.substring(0, 24) + '…';
      return str;
    },
  },
};
</script>
