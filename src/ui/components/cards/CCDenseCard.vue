<template>
  <v-col :style="`min-width: ${minWidth}`">
    <v-card
      tile
      variant="outlined"
      :style="`border-color: ${hexColor}`"
      class="light-panel"
      :height="fullHeight ? '100%' : ''">
      <v-toolbar
        density="compact"
        :color="item.Color"
        flat
        height="30px"
        class="text-white pa-1 pr-3">
        <span class="heading">
          <v-icon>{{ item.Icon }}</v-icon>
          {{ item.Name }}
        </span>
        <v-spacer />
        <v-spacer />
        <div class="text-overline text-right text-white" style="line-height: 11px !important">
          <cc-tooltip inline :content="item.LcpName">
            <v-icon small dark>cc:compendium</v-icon>
          </cc-tooltip>
        </div>
      </v-toolbar>
      <v-card-text class="pt-1 pb-0 px-3" style="min-height: 70px; height: calc(100% - 30px)">
        <cc-item-card :item="item" dense small-tags :collapse-actions="collapseActions" />
      </v-card-text>
    </v-card>
  </v-col>
</template>

<script lang="ts">
export default {
  name: 'CCDenseCard',
  props: {
    item: {
      type: Object,
      required: true,
    },
    fullHeight: {
      type: Boolean,
      required: false,
      default: false,
    },
    collapseActions: {
      type: Boolean,
      required: false,
      default: false,
    },
    minWidth: {
      type: String,
      required: false,
      default: '20vw',
    },
  },
  computed: {
    hexColor(): string {
      return this.item.Color;
    },
  },
};
</script>
