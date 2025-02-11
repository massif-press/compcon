<template>
  <cc-panel :title="item.Name" :title-color="item.Color" :icon="item.Icon" class="mb-2">
    <template #toolbar-items>
      <span
        v-if="item.FeatureType"
        class="heading text-caption font-weight-bold text-uppercase pr-2">
        {{ item.WeaponType ? item.WeaponType : item.FeatureType }}
      </span>
      <span class="text-cc-overline text-right">
        <v-tooltip :open-on-hover="!mobile" :open-on-click="mobile" max-width="350px">
          <template #activator="{ props }">
            <v-icon icon="cc:content_manager" class="mr-2" v-bind="props" />
          </template>
          {{ item.LcpName }}
        </v-tooltip>
      </span>
    </template>
    <v-card-text class="px-0 pb-1">
      <cc-item-card
        :item="item"
        dense
        small-tags
        :collapse-actions="collapseActions"
        :tier="tier" />
      <slot name="extra" />
    </v-card-text>
  </cc-panel>
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
    tier: {
      type: Number,
      required: false,
    },
  },
  computed: {
    mobile() {
      return this.$vuetify.display.smAndDown;
    },
    hexColor(): string {
      return this.item.Color;
    },
  },
};
</script>
