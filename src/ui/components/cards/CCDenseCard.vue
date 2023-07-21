<template>
  <v-card
    tile
    variant="outlined"
    :style="`border-color: ${hexColor}`"
    class="light-panel"
    :height="fullHeight ? '100%' : ''"
  >
    <v-toolbar
      density="compact"
      :color="item.Color"
      flat
      height="30px"
      class="text-white pa-1 pr-3"
    >
      <span class="heading">
        <item-menu v-if="showMenu" :item="item" />
        <v-icon>{{ item.Icon }}</v-icon>
        {{ item.Name }}
      </span>
      <v-spacer />
      <div class="text-overline text-right text-white" style="line-height: 11px !important">
        {{ item.OriginString }}
        <cc-tooltip inline :content="item.LcpName">
          <v-icon small dark>cc:compendium</v-icon>
        </cc-tooltip>
      </div>
    </v-toolbar>
    <v-card-text class="py-1 px-3">
      <cc-item-card :item="item" dense small-tags />
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import ItemMenu from './npc/cards/_ItemMenu.vue';

export default {
  name: 'CCDenseCard',
  components: { ItemMenu },
  props: {
    item: {
      type: Object,
      required: true,
    },
    showMenu: {
      type: Boolean,
      required: false,
      default: false,
    },
    fullHeight: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  computed: {
    hexColor(): string {
      return this.item.Color;
    },
  },
};
</script>
