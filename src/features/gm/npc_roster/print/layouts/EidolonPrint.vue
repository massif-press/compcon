<template>
  <div class="text-black pa-2">
    <v-row dense align="start">
      <v-col class="mr-4 mt-n2" cols="auto">
        <div class="heading h2">
          {{ npc.Name }}
        </div>
        <div class="my-n2">
          <div class="text-caption">
            Tier {{ npc.Tier }}
            <cc-slashes />
            Class {{ npc.Class }}
          </div>
        </div>
      </v-col>
      <v-col cols="auto ml-auto">
        <v-chip label size="small" :prepend-icon="npc.TagIcon" class="mx-1">EIDOLON</v-chip>
      </v-col>
    </v-row>
    <div v-if="options.include.some((x) => x.title === 'GM Notes')" class="text-caption mt-1 pl-3">
      {{ npc.GmDescription }}
    </div>

    <v-row dense class="no-print-break">
      <v-col>
        <div v-if="npc.Description" class="mt-1 pl-3" v-html-safe="npc.Description" />
      </v-col>
      <v-col cols="4" v-if="options.include.some((x) => x.title === 'Include Image')">
        <div
          :style="`background-image: url('${npc.Portrait}');`"
          style="height: 300px; width: 100%; background-position: top 0%; background-size: cover" />
      </v-col>
    </v-row>

    <fieldset class="mx-1 pa-1 mb-2">
      <legend
        class="text-overline text-primary px-1"
        style="line-height: 14px; border: 1px solid grey; border-radius: 3px">
        Persistent Traits
      </legend>
      <div v-for="(t, index) in persistentTraits" :key="`trait-${index}`" class="no-print-break">
        <b class="text-caption font-weight-bold">
          <v-icon size="small" icon="cc:trait" class="mt-n1" />
          {{ t.name }}
        </b>
        <div v-html-safe="t.detail" class="pl-3 caption" />
      </div>
    </fieldset>

    <fieldset class="mx-1 pa-1 mb-2 no-print-break" v-for="l in npc.Layers" :key="l.ID">
      <legend
        class="text-overline text-primary px-1"
        style="line-height: 14px; border: 1px solid grey; border-radius: 3px">
        LAYER
        <cc-slashes />
        {{ l.Layer.Name }}
      </legend>
      <div>
        <div v-html-safe="l.Description" class="pl-3 caption" />
        <print-npc-stats :item="l" :bonuses="l.FeatureController.Bonuses" :tier="npc.Tier" />
        <div v-html-safe="l.Layer.Rules" class="pl-3 caption" />
        <div
          v-for="(f, i) in l.Layer.Features.filter((x) => !x.HideActive)"
          :key="f.ID"
          class="mt-1 pl-3 caption">
          <npc-feature-print :feature="f" :tier="npc.Tier" />
          <v-divider v-if="i + 1 < l.Layer.Features.length" class="mt-1" />
        </div>
      </div>

      <v-divider />
      <v-chip size="small" class="mt-1">
        <b>New Shards: {{ l.Layer.Shards.Count }}</b>
      </v-chip>
      <div v-html-safe="l.Layer.Shards.Detail" class="pl-3 caption" />
      <print-npc-stats :item="l.Layer.Shards" :bonuses="[]" :tier="npc.Tier" hide-zero />
      <div
        v-for="(f, i) in l.Layer.Shards.Features.filter((x) => !x.HideActive)"
        :key="f.ID"
        class="mt-1 pl-3 caption no-print-break">
        <npc-feature-print :feature="f" :tier="npc.Tier" />
        <v-divider v-if="i + 1 < l.Layer.Shards.Features.length" class="mt-1" />
      </div>
    </fieldset>

    <div
      v-if="options.include.some((x) => x.title === 'GM Notes') && npc.Note.length"
      class="mb-1 mt-3 no-print-break">
      <div class="text-overline text-primary" style="line-height: 0">GM NOTES</div>
      <div v-html-safe="npc.Note" class="mt-1 pl-3 caption" />
    </div>
  </div>

  <npc-narrative-print-section :npc="npc"
    :options="options" />
</template>

<script setup lang="ts">
import { computed } from 'vue'
import NpcFeaturePrint from './components/NpcFeaturePrint.vue';
import PrintNpcStats from './components/PrintNpcStats.vue';
import NpcNarrativePrintSection from './components/NpcNarrativePrintSection.vue';
import persistent_traits from '@/classes/npc/eidolon/persistent_traits.json';

defineOptions({ name: 'npc-print' })

const props = defineProps<{
  npc: object
  options: object
}>()

const persistentTraits = computed(() => {
      return persistent_traits;
    })
</script>

<style scoped>
@import './npc-print.css';
</style>
