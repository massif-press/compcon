<template>
  <v-col :cols="cols">
    <v-card
      flat
      tile
      color="light-panel"
      class="text-center"
      height="100%"
      width="100%"
      :style="
        cols
          ? ''
          : inline
          ? 'min-width: 15vw; max-width: 20vw'
          : 'min-width: 20vw'
      "
    >
      <v-card-title class="heading h3 primary px-3 py-0 ma-0 white--text">
        <v-spacer v-if="!inline && $vuetify.display.mdAndDown" />
        <cc-tooltip inline :title="name" :content="glossary(name)">
          <v-icon large color="white">{{ icon }}</v-icon>
          <span v-if="inline || $vuetify.display.lgAndUp">{{ name }}</span>
        </cc-tooltip>
        <v-spacer />
        <span v-if="inline" class="pl-2">{{ value }}</span>
      </v-card-title>
      <v-card-text
        v-if="!inline"
        class="heading stark--text py-3"
        style="font-size: 32px"
      >
        <span>{{ value }}</span>
      </v-card-text>
    </v-card>
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
