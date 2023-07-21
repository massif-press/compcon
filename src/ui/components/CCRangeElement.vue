<template>
  <div v-for="r in (range as Range[])" class="text-center d-inline-block px-2">
    <cc-tooltip :title="r.Text" :content="Help(r.Type)">
      <span v-if="small">
        <v-icon :icon="r.Icon" />
        <v-icon v-if="r.Override" icon="mdi-information-outline" />
        <b v-else>
          {{ `${added ? '+' : ''}${r.Value}` }}
        </b>
      </span>
      <v-row v-else align="center" no-gutters>
        <v-col cols="auto">
          <v-icon :size="dense ? 25 : 35" :icon="r.Icon" />
        </v-col>
        <v-col class="heading text-text" :style="`font-size: ${dense ? '20' : '24'}pt`">
          {{ `${added ? '+' : ''}${r.Value}` }}
        </v-col>
      </v-row>
    </cc-tooltip>
    <div v-if="!small" class="text-overline mt-n2">
      <b>{{ r.Type }}</b>
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
    Help(name: string): string {
      const g = glossary.find((x) => x.name.toLowerCase() === name.toLowerCase());
      if (g)
        return `<div class="text-overline text-subtle mb-n2 mt-n2">${name}:</div><div>${g.description}</div>`;
      return '';
    },
  },
};
</script>
