<template>
  <v-container class="px-12">
    <v-expansion-panels class="px-12">
      <v-expansion-panel v-for="t in tables">
        <v-expansion-panel-title class="heading h3 text-accent">
          <cc-lcp-info :item="t" class="mb-1 mr-4" />
          {{ t.Title }}
        </v-expansion-panel-title>
        <v-expansion-panel-text>
          <v-card flat tile>
            <cc-rollable-table :table="t" readonly hide-title />
          </v-card>
        </v-expansion-panel-text>
      </v-expansion-panel>
    </v-expansion-panels>
  </v-container>
</template>

<script lang="ts">
import { CompendiumStore } from '@/stores';
import _ from 'lodash';

export default {
  name: 'tables',
  computed: {
    tables() {
      return _.sortBy(CompendiumStore().Tables, 'LcpName', 'Title');
    },
  },
};
</script>
