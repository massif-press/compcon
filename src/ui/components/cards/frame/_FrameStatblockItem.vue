<template>
  <v-col :cols="portrait ? '' : cols"
    :style="portrait ? 'max-width: 100%; min-width: fit-content' : ''">
    <v-card flat
      tile
      :color="color"
      :variant="<any>variant"
      style="height: 100%;"
      :style="portrait ? 'max-width: 100%; min-width: fit-content' : ''"
      class="pa-1">

      <v-row dense>
        <v-col cols="auto">
          <v-tooltip max-width="400">
            <template #activator="{ props }">
              <v-icon :icon="icon"
                v-bind="props"
                start
                size="40" />
            </template>
            <div class="heading h3">{{ name }}</div>
            <v-divider class="my-2" />
            <div v-html-safe="glossary" />
          </v-tooltip>
        </v-col>
        <v-col class="heading h3">
          <span>{{ name }}</span>
          <div v-if="isNaN(Number(value)) && value !== '½'"
            class="text-accent"
            style="font-size: 16px;">
            {{ value }}
          </div>
          <span v-else
            class="pl-4 heading text-accent"
            :class="!portrait && 'h2'">
            {{ value }}
          </span>
        </v-col>
      </v-row>
    </v-card>


  </v-col>
</template>

<script lang="ts">
import { glossary } from '@massif/lancer-data';
import { isArray } from 'lodash-es';

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
      default: '',
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
      let name = this.name.toLowerCase();
      if (name === 'e-def') name = 'e-defense'
      const n = glossary.find((x) => x.name.toLowerCase() === name.toLowerCase());
      return n ? n.description : 'MISSING ' + this.name;
    },
  },
};
</script>
