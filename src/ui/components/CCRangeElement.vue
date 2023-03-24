<template>
  <div>
    <div
      v-for="(r, i) in range"
      :key="`rng_${i}`"
      class="text-center px-1"
      style="display: inline-block"
    >
      <cc-tooltip :title="r.Text" :content="Help(r.Type)">
        <span v-if="small">
          <v-icon :dark="dark" class="mr-n1">{{ r.Icon }}</v-icon>
          <v-icon v-if="r.Override">mdi-information-outline</v-icon>
          <span v-else>
            {{ `${added ? '+' : ''}${r.Value}` }}
          </span>
          <!-- <cc-slashes v-if="i + 1 < range.length" /> -->
        </span>
        <div v-else>
          <v-icon x-large :dark="dark" class="mt-n4 mr-n1">
            {{ r.Icon }}
          </v-icon>
          <span class="heading text--text" style="font-size: 24pt">
            {{ `${added ? '+' : ''}${r.Value}` }}
          </span>
        </div>
      </cc-tooltip>
      <span v-if="!small">
        <div class="overline mt-n1">
          <b>{{ r.Type }}</b>
        </div>
      </span>
    </div>
  </div>
</template>

<script lang="ts">
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
        return `<div class="overline subtle--text mb-n2 mt-n2">${name}:</div><div>${g.description}</div>`;
      return '';
    },
  },
};
</script>
