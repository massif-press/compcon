<template>
  <v-menu :open-on-hover="!mobile" :open-on-click="mobile" max-width="600px">
    <template #activator="{ props }">
      <cc-button
        :color="item.Color ? item.Color : 'primary'"
        class="d-inline-block"
        :class="density === 'compact' ? '' : 'ma-1'"
        style="margin: 1px"
        :block="block"
        :prepend-icon="!hideIcon && itemIcon"
        :size="size"
        v-bind="props">
        {{ truncate(item.Name) }}
        <span v-if="!hideType">{{ item.ItemType === 'Frame' ? '&nbsp;FRAME' : '' }}</span>
        <cc-broken-reference :item="item" end />
      </cc-button>
    </template>

    <v-card class="pt-2 pb-4 px-4">
      <cc-item-card :item="item" />
    </v-card>

    <item-card-link :item="item" />
  </v-menu>
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
    hideIcon: {
      type: Boolean,
    },
    block: {
      type: Boolean,
    },
    size: {
      type: String,
      default: 'small',
    },
    density: {
      type: String,
      default: '',
    },
    limit: {
      type: Number,
      default: 26,
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
    itemIcon() {
      if (this.item.IsExotic) return 'mdi-star';
      if (this.hideType) return undefined;
      return this.item.Icon;
    },
  },
  methods: {
    startCase(str: string): string {
      return _.startCase(str);
    },
    truncate(str): string {
      if (this.block) return str;
      if (str.length > this.limit) return str.substring(0, this.limit - 2) + '…';
      return str;
    },
  },
};
</script>
