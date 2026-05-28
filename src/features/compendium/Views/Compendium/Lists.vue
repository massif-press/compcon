<template>
  <v-container :class="mobile ? '' : 'px-12'">
    <v-expansion-panels>
      <v-expansion-panel v-for="l in lists"
        :key="l.name">
        <v-expansion-panel-title class="heading h3 text-accent">
          {{ l.name }}
        </v-expansion-panel-title>
        <v-expansion-panel-text v-if="l.type === 'string'">
          <v-card v-for="(s, sIdx) in l.data"
            :key="`list-item-${sIdx}`"
            v-html-safe="s"
            variant="outlined"
            style="border-color: rgb(var(--v-theme-subtle))"
            class="pa-3 ma-4" />
        </v-expansion-panel-text>
      </v-expansion-panel>
    </v-expansion-panels>
  </v-container>
</template>

<script lang="ts">
import { CompendiumStore } from '@/stores';
import { useMobile } from '@/composables/useMobile';
export default {
  setup() {
    return useMobile()
  },
  name: 'Lists',
  computed: {
    lists() {
      const out = [] as { name: string; data: any[]; type: string }[];
      const lists = CompendiumStore().Lists;
      for (const t in lists) {
        if (lists.hasOwnProperty(t) && lists[t].length > 0)
          out.push({
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
