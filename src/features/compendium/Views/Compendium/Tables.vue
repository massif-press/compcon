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
import { useDisplay } from 'vuetify'
import { CompendiumStore } from '@/stores';
import { sortBy } from 'lodash-es';

const { smAndDown: mobile, xs: portrait } = useDisplay()

const tables = computed(() => {return sortBy(CompendiumStore().Tables, 'LcpName', 'Title');})
</script>
