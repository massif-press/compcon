<template>
  <v-col :cols="portrait ? '12' : cols">
    <v-tooltip max-width="400">
      <template #activator="{ props }">
        <v-card
          v-bind="props"
          flat
          tile
          :color="color"
          :variant="<any>variant"
          class="text-center"
          width="100%">
          <div class="heading h3 py-1">
            <v-icon :icon="icon" start />
            <span>{{ name }}</span>
            <span v-if="isInline" class="pl-2">{{ value }}</span>
          </div>
          <div v-if="!isInline" class="heading mt-n2" style="font-size: 26px">
            {{ isArray ? (value as string[]).join('/') : value }}
          </div>
        </v-card>
      </template>
      <div class="heading h3">{{ name }}</div>
      <v-divider class="my-2" />
      <div v-html-safe="glossary" />
    </v-tooltip>
  </v-col>
</template>

<script lang="ts">
import { glossary } from '@massif/lancer-data';
import { isArray } from 'lodash';

export default {
  name: 'CCStatblockPanel',
  props: {
    name: {
      type: String,
      required: true,
    },
    icon: {
      type: String,
      required: true,
    },
    value: {
      type: [String, Number, Array],
      required: true,
    },
    cols: {
      type: [String, Number],
      required: false,
    },
    inline: {
      type: Boolean,
      required: false,
    },
    color: {
      type: String,
      default: 'light-panel',
    },
    variant: {
      type: String,
      default: 'elevated',
    },
  },
  computed: {
    portrait(): boolean {
      return this.$vuetify.display.xs;
    },
    isInline(): boolean {
      return this.inline || this.$vuetify.display.smAndDown;
    },
    isArray(): boolean {
      return isArray(this.value);
    },
    glossary() {
      const n = glossary.find((x) => x.name.toLowerCase() === this.name.toLowerCase());
      return n ? n.description : 'MISSING';
    },
  },
};
</script>
