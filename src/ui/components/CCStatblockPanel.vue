<template>
  <v-col :cols="cols">
    <cc-tooltip inline :title="name" :content="glossary(name)" delayed>
      <v-card
        flat
        tile
        color="light-panel"
        class="text-center"
        height="100%"
        width="100%"
        :style="cols ? '' : inline"
      >
        <v-row class="heading h3 py-1" dense align="center" justify="center">
          <v-col cols="auto">
            <v-icon size="30" :icon="icon" />
          </v-col>
          <v-col cols="auto">
            <span>{{ name }}</span>
            <span v-if="inline" class="pl-2">{{ value }}</span>
          </v-col>
        </v-row>
        <div v-if="!inline" class="heading pb-4" style="font-size: 32px">
          {{ value }}
        </div>
      </v-card>
    </cc-tooltip>
  </v-col>
</template>

<script lang="ts">
import { glossary } from 'lancer-data';

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
      type: [String, Number],
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
  },
  methods: {
    glossary(name: string): string {
      const n = glossary.find(
        (x) => x.name.toLowerCase() === name.toLowerCase()
      );
      return n ? n.description : 'MISSING';
    },
  },
};
</script>
