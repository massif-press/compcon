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
      class="text-white"
    >
      <span class="heading">
        <item-menu v-if="showMenu" :item="item" />
        <cc-tooltip inline :content="item.FeatureType">
          <v-icon start dark>{{ item.Icon }}</v-icon>
        </cc-tooltip>
        {{ item.Name }}
      </span>
      <v-spacer />
      <div
        class="text-overline text-right text-white"
        style="line-height: 11px !important"
      >
        {{ item.OriginString }}
        <cc-tooltip inline :content="item.LcpName">
          <v-icon small dark>cc:compendium</v-icon>
        </cc-tooltip>
      </div>
    </v-toolbar>
    <cc-item-card :item="item" density="compact" small-tags />
  </v-card>
</template>

<script lang="ts">
import ItemMenu from './npc/cards/_ItemMenu.vue';
import GetColorMixin from '@/mixins/getColor';

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
      return this.getColor(this.item.Color, this.$vuetify);
    },
  },
  methods: {
    getColor() {
      return GetColorMixin;
    },
  },
};
</script>
