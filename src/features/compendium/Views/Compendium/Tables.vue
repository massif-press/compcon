<template>
  <v-container :class="mobile ? '' : 'px-12'">
    <v-expansion-panels>
      <v-expansion-panel v-for="t in tables"
        :key="t.ID">
        <v-expansion-panel-title class="heading h3 text-accent">
          <cc-lcp-info :item="t"
            class="mb-1 mr-4" />
          {{ t.Title }}
        </v-expansion-panel-title>
        <v-expansion-panel-text>
          <v-card flat
            tile>
            <cc-rollable-table :table="t"
              readonly
              hide-title />
          </v-card>
        </v-expansion-panel-text>
      </v-expansion-panel>
    </v-expansion-panels>
  </v-container>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useMobile } from '@/composables/useMobile'
import { CompendiumStore } from '@/stores';
import { sortBy } from 'lodash-es';

const { mobile, portrait } = useMobile()

const tables = computed(() => {return sortBy(CompendiumStore().Tables, 'LcpName', 'Title');})
</script>
