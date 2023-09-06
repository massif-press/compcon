<template>
  <v-container class="px-12">
    <div class="heading h4">Other</div>
    <v-expansion-panels class="px-12">
      <v-expansion-panel v-for="t in tables">
        <v-expansion-panel-title class="heading h3 text-accent">
          {{ t.name }}
        </v-expansion-panel-title>
        <v-expansion-panel-text v-if="t.type === 'string'">
          <v-card
            v-for="s in t.data"
            variant="outlined"
            style="border-color: rgb(var(--v-theme-subtle))"
            class="pa-3 ma-4"
            v-html-safe="s"
          />
        </v-expansion-panel-text>
      </v-expansion-panel>
    </v-expansion-panels>
  </v-container>
</template>

<script lang="ts">
import { CompendiumStore } from '@/stores';
export default {
  name: 'tables',
  computed: {
    tables() {
      let out = [] as { name: string; data: any[]; type: string }[];
      const tables = CompendiumStore().Tables;
      for (const t in tables) {
        if (tables.hasOwnProperty(t) && tables[t].length > 0)
          out.push({
            // TODO: remove this hack
            name: t === 'quirks' ? 'Clone Quirks' : t.replace(/_/g, ' '),
            data: tables[t],
            type: typeof tables[t][0],
          });
      }

      return out;
    },
  },
};
</script>
