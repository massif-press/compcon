<template>
  <div v-for="r in (range as Range[])" class="text-center d-inline-block pl-3">
    <cc-tooltip :title="r.Text" :content="Help(r.Type)">
      <span v-if="small">
        <v-icon :dark="dark" class="mr-n1">{{ r.Icon }}</v-icon>
        <v-icon v-if="r.Override">mdi-information-outline</v-icon>
        <span v-else>
          {{ `${added ? '+' : ''}${r.Value}` }}
        </span>
      </span>
      <v-row v-else align="center" no-gutters>
        <v-col cols="auto">
          <v-icon size="35" :dark="dark" :icon="r.Icon" />
        </v-col>
        <v-col class="heading text-text" style="font-size: 24pt">
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
import { glossary } from 'lancer-data';

export default {
  name: 'CCRangeElement',
  props: {
    range: {
      type: Array,
      required: true,
    },
    small: {
      type: Boolean,
      required: false,
    },
    dark: {
      type: Boolean,
      required: false,
    },
    added: {
      type: Boolean,
      required: false,
    },
  },
  methods: {
    Help(name: string): string {
      const g = glossary.find(
        (x) => x.name.toLowerCase() === name.toLowerCase()
      );
      if (g)
        return `<div class="text-overline text-subtle mb-n2 mt-n2">${name}:</div><div>${g.description}</div>`;
      return '';
    },
  },
};
</script>
