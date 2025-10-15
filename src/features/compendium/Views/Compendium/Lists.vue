<template>
  <v-container class="px-12">
    <v-expansion-panels class="px-12">
      <v-expansion-panel v-for="l in lists">
        <v-expansion-panel-title class="heading h3 text-accent">
          {{ l.name }}
        </v-expansion-panel-title>
        <v-expansion-panel-text v-if="l.type === 'string'">
          <v-card
            v-for="s in l.data"
            variant="outlined"
            style="border-color: rgb(var(--v-theme-subtle))"
            class="pa-3 ma-4"
            v-html-safe="s" />
        </v-expansion-panel-text>
      </v-expansion-panel>
    </v-expansion-panels>
  </v-container>
</template>

<script lang="ts">
import { CompendiumStore } from '@/stores';
export default {
  name: 'lists',
  computed: {
    lists() {
      let out = [] as { name: string; data: any[]; type: string }[];
      const lists = CompendiumStore().Lists;
      for (const t in lists) {
        if (lists.hasOwnProperty(t) && lists[t].length > 0)
          out.push({
            // TODO: remove this hack
            name: t === 'quirks' ? 'Clone Quirks' : t.replace(/_/g, ' '),
            data: lists[t],
            type: typeof lists[t][0],
          });
      }

      return out;
    },
  },
};
</script>
