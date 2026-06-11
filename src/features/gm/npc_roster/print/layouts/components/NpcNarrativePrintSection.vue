<template>
  <div class="mt-n3">
    <fieldset
      v-if="
        options.include.some((x) => x.title === 'Additional Detail') &&
        npc.NarrativeController.TextItems.length
      "
      class="mx-1 my-2 px-3 no-print-break">
      <div
        v-for="(t, index) in npc.NarrativeController.TextItems"
        :key="`text-${index}`"
        class="no-print-break">
        <div class="font-weight-bold mb-n2"
          v-text="t.header" />
        <div v-html-safe="t.body"
          class="pl-2" />
      </div>
    </fieldset>

    <div
      v-if="
        options.include.some((x) => x.title === 'Clocks') &&
        npc.NarrativeController.Clocks.length
      "
      class="mx-1 my-2">
      <v-card
        v-for="(c, index) in npc.NarrativeController.Clocks"
        :key="`clock-${index}`"
        variant="outlined"
        class="text-caption px-2 pb-1 no-print-break">
        <div class="font-weight-bold text-caption"
          v-text="c.Title" />
        <v-row no-gutters>
          <v-col
            v-for="n in c.Segments"
            :key="`segment-${n}`"
            class="px-1">
            <blank-line :height="20" />
          </v-col>
        </v-row>
        <div v-if="c.Description"
          class="font-weight-bold text-caption"
          v-text="$t('common.description')" />
        <div v-html-safe="c.Description"
          class="pl-2" />
        <div v-if="c.Resolution"
          class="font-weight-bold text-caption"
          v-text="$t('gm.resolution')" />
        <div v-html-safe="c.Resolution"
          class="pl-2" />
      </v-card>
    </div>

    <div
      v-if="
        options.include.some((x) => x.title === 'Tables') &&
        npc.NarrativeController.Tables.length
      "
      class="mx-1 my-2">
      <v-card
        v-for="(t, index) in npc.NarrativeController.Tables"
        :key="`table-${index}`"
        variant="outlined"
        class="text-caption px-2 no-print-break">
        <div class="font-weight-bold text-caption"
          v-text="t.Title" />
        <div v-html-safe="t.Description"
          class="pl-2" />
        <v-row
          v-for="(r, ri) in t.Results"
          :key="`result-${ri}`"
          dense>
          <v-col cols="auto">
            <b>{{ r.min }}-{{ r.max }}</b>
          </v-col>
          <v-col>{{ r.result }}</v-col>
        </v-row>
      </v-card>
    </div>

    <fieldset
      v-if="options.include.some((x) => x.title === 'Append Lined Section')"
      class="mx-1 my-2 px-3 no-print-break">
      <div class="mb-4">
        <notes :rows="16"
          lined />
      </div>
    </fieldset>

    <fieldset
      v-if="options.include.some((x) => x.title === 'Append Unlined Section')"
      class="mx-1 my-2 px-3 no-print-break">
      <div class="mb-4">
        <notes :rows="16" />
      </div>
    </fieldset>
  </div>
</template>

<script setup lang="ts">
import blankLine from '../../components/blank/line.vue';
import notes from '../../components/blank/notes.vue';

const props = defineProps<{
  npc: object
  options: object
}>()
</script>
