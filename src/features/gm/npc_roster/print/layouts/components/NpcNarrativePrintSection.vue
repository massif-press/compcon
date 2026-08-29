<template>
  <div class="mt-n3">
    <fieldset
      v-if="has(options.include, 'additionalDetail') && npc.NarrativeController.TextItems.length"
      class="mx-1 my-2 px-3 no-print-break"
    >
      <div
        v-for="(t, index) in npc.NarrativeController.TextItems"
        :key="`text-${index}`"
        class="no-print-break"
      >
        <div
          class="font-weight-bold mb-n2"
          v-text="t.header"
        />
        <div
          v-html-safe="t.body"
          class="pl-2"
        />
      </div>
    </fieldset>

    <div
      v-if="has(options.include, 'clocks') && npc.NarrativeController.Clocks.length"
      class="mx-1 my-2"
    >
      <v-card
        v-for="(c, index) in npc.NarrativeController.Clocks"
        :key="`clock-${index}`"
        variant="outlined"
        class="text-caption px-2 pb-1 no-print-break"
      >
        <div
          class="font-weight-bold text-caption"
          v-text="c.Title"
        />
        <v-row no-gutters>
          <v-col
            v-for="n in c.Segments"
            :key="`segment-${n}`"
            class="px-1"
          >
            <blank-line :height="20" />
          </v-col>
        </v-row>
        <div
          v-if="c.Description"
          class="font-weight-bold text-caption"
          v-text="$t('common.description')"
        />
        <div
          v-html-safe="c.Description"
          class="pl-2"
        />
        <div
          v-if="c.Resolution"
          class="font-weight-bold text-caption"
          v-text="$t('ui.fields.resolution')"
        />
        <div
          v-html-safe="c.Resolution"
          class="pl-2"
        />
      </v-card>
    </div>

    <div
      v-if="has(options.include, 'tables') && npc.NarrativeController.Tables.length"
      class="mx-1 my-2"
    >
      <v-card
        v-for="(t, index) in npc.NarrativeController.Tables"
        :key="`table-${index}`"
        variant="outlined"
        class="text-caption px-2 no-print-break"
      >
        <div
          class="font-weight-bold text-caption"
          v-text="t.Title"
        />
        <div
          v-html-safe="t.Description"
          class="pl-2"
        />
        <v-row
          v-for="(r, ri) in t.Results"
          :key="`result-${ri}`"
          dense
        >
          <v-col cols="auto">
            <b>{{ r.min }}-{{ r.max }}</b>
          </v-col>
          <v-col>{{ r.result }}</v-col>
        </v-row>
      </v-card>
    </div>

    <fieldset
      v-if="has(options.include, 'appendLined')"
      class="mx-1 my-2 px-3 no-print-break"
    >
      <div class="mb-4">
        <notes
          :rows="16"
          lined
        />
      </div>
    </fieldset>

    <fieldset
      v-if="has(options.include, 'appendUnlined')"
      class="mx-1 my-2 px-3 no-print-break"
    >
      <div class="mb-4">
        <notes :rows="16" />
      </div>
    </fieldset>
  </div>
</template>

<script setup lang="ts">
  import { has } from '@/ui/print/options'
  import type { GmPrintOptions } from '@/ui/print/types'
  import type { NarrativeController } from '@/classes/narrative/NarrativeController'
  import blankLine from '@/ui/components/print/BlankLine.vue'
  import notes from '@/ui/components/print/BlankNotes.vue'

  const props = defineProps<{
    npc: { NarrativeController: NarrativeController }
    options: GmPrintOptions
  }>()
</script>
