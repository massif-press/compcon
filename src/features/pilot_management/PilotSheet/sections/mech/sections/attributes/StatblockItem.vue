<template>
  <v-col class="text-center flavor-text"
    :style="portrait ? 'margin-bottom:1px' : 'margin-bottom: 4px'"
    :class="!portrait && 'mx-1'"
    :cols="cols"
    :sm="sm"
    :md="md">
    <v-card flat
      tile
      class="clipped"
      color="panel">
      <v-tooltip location="top"
        :open-on-click="mobile">
        <template #activator="{ props }">
          <v-toolbar v-bind="props"
            :color="color"
            :class="mobile ? 'text-cc-overline' : 'heading h5'"
            :height="mobile ? 18 : 24">
            <v-icon :icon="icon || 'cc:talent'"
              size="small"
              :style="mobile ? 'margin-left: 2px' : 'margin-left: 4px'"
              class="fade-select" />
            <span class="pa-1">{{ attr?.toUpperCase() }}</span>
          </v-toolbar>
        </template>
        <div class="heading h5"
          v-text="title" />
        <v-divider />
        <p v-html-safe="content"
          class="py-2" />
      </v-tooltip>

      <v-card-text class="pa-0">
        <span class="text-text font-weight-black"
          :style="`font-size: ${mobile ? '20px' : '32px'}`">
          {{ `${signed ? (val > -1 ? '+' : '-') : ''}${Math.abs(val)}` }}
        </span>
        <cc-bonus-tooltip v-if="bonuses && bonuses.length > 0"
          :bonuses="bonuses"
          :right-offset="15" />
      </v-card-text>
    </v-card>
  </v-col>
</template>

<script lang="ts">
import { useMobile } from '@/mixins/useMobile';
export default {
  name: 'StatblockItem',
  mixins: [useMobile],
  props: {
    attr: { type: String, required: true },
    val: { type: Number, required: true },
    signed: { type: Boolean, required: false },
    icon: { type: String, required: false },
    contributors: {
      type: Array,
      required: true,
    },
    color: {
      type: String,
      required: false,
      default: '#bdbdbd',
    },
    cols: {
      type: String,
      required: false,
    },
    sm: {
      type: String,
      required: false,
    },
    md: {
      type: String,
      required: false,
    },
    bonuses: {
      type: Array,
      required: false,
    },
  },
  computed: {
    mobile(): boolean {
      return this.$vuetify.display.smAndDown;
    },
    portrait(): boolean {
      return this.$vuetify.display.xs;
    },
    title(): string {
      const value = this.signed ? (this.val > -1 ? '+' : '') + this.val : this.val;
      return `${value} ${this.attr}`;
    },
    content(): string {
      if (!this.contributors || this.contributors.length === 0) return '';
      return this.contributors.join('<br />');
    },
  },
};
</script>
