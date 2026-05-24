<template>
  <div class="text-black pa-2">
    <v-row dense
      align="start">
      <v-col class="mr-4 mt-n2"
        cols="auto">
        <div class="heading h2">
          {{ npc.Name }}
        </div>
      </v-col>
      <v-col cols="auto ml-auto">
        <v-chip label
          size="small"
          :prepend-icon="npc.TagIcon"
          class="mx-1">
          {{ npc.Tag }}
        </v-chip>
      </v-col>
    </v-row>
    <div v-if="options.include.some((x) => x.title === 'GM Notes')"
      class="text-caption mt-1 pl-3">
      {{ npc.GmDescription }}
    </div>

    <v-row dense
      class="no-print-break">
      <v-col>
        <print-npc-stats :item="npc"
          :bonuses="[]"
          :tier="1" />
        <div v-if="npc.Description"
          v-html-safe="npc.Description"
          class="mt-1 pl-3" />
      </v-col>
      <v-col v-if="options.include.some((x) => x.title === 'Include Image')"
        cols="4">
        <div :style="`background-image: url('${npc.Portrait}');`"
          style="height: 300px; width: 100%; background-position: top 0%; background-size: cover" />
      </v-col>
    </v-row>

    <div v-if="options.include.some((x) => x.title === 'GM Notes') && npc.Note.length"
      class="mb-1 mt-3 no-print-break">
      <div class="text-overline text-primary"
        style="line-height: 0">GM NOTES</div>
      <div v-html-safe="npc.Note"
        class="mt-1 pl-3 caption" />
    </div>
  </div>

  <npc-narrative-print-section :npc="npc"
    :options="options" />
</template>

<script lang="ts">
import PrintNpcStats from './components/PrintNpcStats.vue';
import NpcNarrativePrintSection from './components/NpcNarrativePrintSection.vue';

export default {
  name: 'NpcPrint',
  components: {
    PrintNpcStats,
    NpcNarrativePrintSection,
  },
  props: {
    npc: { type: Object, required: true },
    options: { type: Object, required: true },
  },
};
</script>

<style scoped>
@import './npc-print.css';
</style>
