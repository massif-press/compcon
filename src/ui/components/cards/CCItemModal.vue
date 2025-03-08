<template>
  <cc-modal
    ref="dialog"
    :color="item.Color ? item.Color : 'primary'"
    :title="`${item.Name}`"
    :icon="item.Icon"
    shrink>
    <template #activator="{ open }">
      <cc-button
        :color="item.Color ? item.Color : 'primary'"
        class="d-inline-block"
        :class="density === 'compact' ? '' : 'ma-1'"
        style="margin: 1px"
        :block="block"
        :prepend-icon="itemIcon"
        :size="size"
        @click="open">
        {{ truncate(item.Name) }}
        <span v-if="!hideType">{{ item.ItemType === 'Frame' ? '&nbsp;FRAME' : '' }}</span>
      </cc-button>
    </template>

    <template v-if="!mobile" #toolbar-items>
      <cc-chip
        v-if="item.Source"
        :icon="item.Manufacturer?.Icon || item.Icon || ''"
        :title="item.Source || ''"
        :label="startCase(item.ItemType)"
        :color="item.Manufacturer?.Color || item.Color || ''" />
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
    size: {
      type: String,
      default: 'small',
    },
    density: {
      type: String,
      default: '',
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
      if (str.length > 26) return str.substring(0, 24) + '…';
      return str;
    },
  },
};
</script>
