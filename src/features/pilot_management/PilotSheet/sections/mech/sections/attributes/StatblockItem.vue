<template>
  <v-col
    class="text-center flavor-text"
    :style="portrait ? 'margin-bottom:1px' : 'margin-bottom: 4px'"
    :class="!portrait && 'mx-1'"
    :cols="cols"
    :sm="sm"
    :md="md">
    <v-card flat tile class="clipped" color="panel">
      <v-toolbar
        :color="color"
        :class="mobile ? 'text-cc-overline' : 'heading h5'"
        :height="mobile ? 18 : 24">
        <v-tooltip location="top" :open-on-click="mobile">
          <template #activator="{ props }">
            <v-icon
              v-bind="props"
              :icon="icon || 'cc:talent'"
              size="small"
              :style="mobile ? 'margin-left: 2px' : 'margin-left: 4px'"
              class="fade-select" />
          </template>
          <div class="heading h5" v-text="title" />
          <v-divider />
          <p class="py-2" v-html="content" />
        </v-tooltip>
        <span class="pa-1">{{ attr?.toUpperCase() }}</span>
      </v-toolbar>
      <v-card-text class="pa-0">
        <span class="text-text font-weight-black" :style="`font-size: ${mobile ? '20px' : '32px'}`">
          {{ `${signed ? (val > -1 ? '+' : '-') : ''}${Math.abs(val)}` }}
        </span>
      </v-card-text>
    </v-card>
  </v-col>
</template>

<script lang="ts">
export default {
  name: 'statblock-item',
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
