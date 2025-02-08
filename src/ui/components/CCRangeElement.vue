<template>
  <div v-for="r in <Range[]>range" class="text-center d-inline-block">
    <v-tooltip max-width="600">
      <template #activator="{ props }">
        <span v-if="small" v-bind="props">
          <v-icon :icon="r.Icon" />
          <v-icon v-if="r.Override" icon="mdi-information-outline" />
          <b v-else v-text="`${added ? '+' : ''}${r.Value}`" />
        </span>
        <v-row v-else align="center" no-gutters v-bind="props">
          <v-col cols="auto">
            <v-icon :size="dense ? 25 : 35" :icon="r.Icon" />
          </v-col>
          <v-col class="heading" :style="`font-size: ${dense ? '20' : '24'}pt`">
            {{ `${added ? '+' : ''}${r.Value}` }}
          </v-col>
        </v-row>
      </template>
      <div class="heading h3">{{ r.Text }}</div>
      <div v-if="gloss(r)">
        <v-divider class="my-2" />
        <b v-html-safe="gloss(r)!.name" />
        <br />
        <div v-html-safe="gloss(r)!.description" />
      </div>
    </v-tooltip>
    <div v-if="!small" class="text-cc-overline mt-n1">
      {{ r.Type }}
    </div>
  </div>
</template>

<script lang="ts">
import { Range } from '@/class';
import { glossary } from '@massif/lancer-data';

export default {
  name: 'CCRangeElement',
  props: {
    range: {
      type: Array,
      required: true,
    },
    small: {
      type: Boolean,
    },
    dense: {
      type: Boolean,
    },
    added: {
      type: Boolean,
    },
  },
  methods: {
    gloss(r): any {
      return glossary.find((x) => x.name.toLowerCase() === r.Type.toLowerCase());
    },
  },
};
</script>
