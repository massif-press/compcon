<template>
  <div class="text-black pa-2">
    <v-row dense align="start">
      <v-col class="mr-4 mt-n2" cols="auto">
        <div class="heading h2">
          {{ npc.Name }}
        </div>
        <div v-if="npc.NpcClassController.HasClass">
          <div class="text-caption">
            <v-icon :icon="npc.TierIcon" class="mt-n1" />
            <v-icon :icon="npc.Icon" class="mt-n1" />
            {{ npc.NpcClassController.Class?.Name }}
          </div>
        </div>
      </v-col>
      <v-col cols="auto ml-auto">
        <v-chip label size="small" :prepend-icon="npc.TagIcon" class="mx-1">
          {{ npc.Tag }}
        </v-chip>

        <v-chip
          v-for="t in npc.NpcTemplateController.Templates"
          :key="t.ID"
          label
          size="small"
          variant="outlined"
          prepend-icon="cc:npc_template"
          class="mx-1">
          {{ t.Name }}
        </v-chip>
      </v-col>
    </v-row>
    <div v-if="options.include.some((x) => x.title === 'GM Notes')" class="text-caption mt-1 pl-3">
      {{ npc.GmDescription }}
    </div>

    <v-row dense class="no-print-break">
      <v-col>
        <print-npc-stats
          :item="npc"
          :bonuses="npc.FeatureController.Bonuses"
          :tier="npc.NpcClassController.Tier" />
        <div v-if="npc.Description" class="mt-1 pl-3" v-html-safe="npc.Description" />
      </v-col>
      <v-col cols="4" v-if="options.include.some((x) => x.title === 'Include Image')">
        <div
          :style="`background-image: url('${npc.Portrait}');`"
          style="height: 300px; width: 100%; background-position: top 0%; background-size: cover" />
      </v-col>
    </v-row>

    <fieldset class="mx-1 pa-1">
      <legend
        class="text-overline text-primary px-1"
        style="line-height: 14px; border: 1px solid grey; border-radius: 3px">
        {{ $t('common.features') }}
      </legend>
      <div
        v-for="f in npc.NpcFeatureController.Features.filter((x) => !x.HideActive)"
        :key="f.ID"
        class="mt-1 pl-3 caption no-print-break">
        <npc-feature-print :feature="f" :tier="npc.NpcClassController.Tier" />
        <v-divider class="mt-1" />
      </div>
    </fieldset>

    <div
      v-if="options.include.some((x) => x.title === 'GM Notes') && npc.Note.length"
      class="mb-1 mt-3 no-print-break">
      <div class="text-overline text-primary" style="line-height: 0">{{ $t('gm.gmNotes') }}</div>
      <div v-html-safe="npc.Note" class="mt-1 pl-3 caption" />
    </div>
  </div>

  <npc-narrative-print-section :npc="npc"
    :options="options" />
</template>

<script setup lang="ts">
import type { Unit } from '@/classes/npc/unit/Unit'
import PrintAction from './components/PrintAction.vue';
import NpcFeaturePrint from './components/NpcFeaturePrint.vue';
import PrintNpcStats from './components/PrintNpcStats.vue';
import NpcNarrativePrintSection from './components/NpcNarrativePrintSection.vue';

defineOptions({ name: 'npc-print' })

const props = defineProps<{
  npc: Unit
  options: object
}>()
</script>

<style scoped>
@import './npc-print.css';
</style>
