<template>
  <div class="text-black pa-2">
    <v-row
      dense
      align="start"
    >
      <v-col
        class="mr-4 mt-n2"
        cols="auto"
      >
        <div class="heading h2">
          {{ npc.Name }}
        </div>
        <div class="my-n2">
          <div class="text-caption">
            {{ $t('common.tierN', { n: npc.Tier }) }}
            <cc-slashes />
            {{ $t('gm.eidolonPrint.classLabel', { class: npc.Class }) }}
          </div>
        </div>
      </v-col>
      <v-col cols="auto ml-auto">
        <v-chip
          label
          size="small"
          :prepend-icon="npc.TagIcon"
          class="mx-1"
        >
          {{ $t('common.eidolon') }}
        </v-chip>
      </v-col>
    </v-row>
    <div
      v-if="has(options.include, 'gmNotes')"
      class="text-caption mt-1 pl-3"
    >
      {{ npc.GmDescription }}
    </div>

    <v-row dense>
      <v-col>
        <div
          v-if="npc.Description"
          class="mt-1 pl-3"
          v-html-safe="npc.Description"
        />
      </v-col>
      <v-col
        cols="4"
        v-if="has(options.include, 'image')"
      >
        <div
          class="no-print-break"
          :style="`background-image: url('${npc.Portrait}');`"
          style="height: 300px; width: 100%; background-position: top 0%; background-size: cover"
        />
      </v-col>
    </v-row>

    <fieldset class="mx-1 pa-1 mb-2">
      <legend
        class="text-overline text-primary px-1"
        style="line-height: 14px; border: 1px solid grey; border-radius: 3px"
      >
        {{ $t('gm.eidolonPrint.persistentTraits') }}
      </legend>
      <div
        v-for="(t, index) in persistentTraits"
        :key="`trait-${index}`"
        class="no-print-break"
      >
        <b class="text-caption font-weight-bold">
          <v-icon
            size="small"
            icon="cc:trait"
            class="mt-n1"
          />
          {{ t.name }}
        </b>
        <div
          v-html-safe="t.detail"
          class="pl-3 caption"
        />
      </div>
    </fieldset>

    <fieldset
      class="mx-1 pa-1 mb-2 no-print-break"
      v-for="l in npc.Layers"
      :key="l.ID"
    >
      <legend
        class="text-overline text-primary px-1"
        style="line-height: 14px; border: 1px solid grey; border-radius: 3px"
      >
        {{ $t('gm.eidolonPrint.layer') }}
        <cc-slashes />
        {{ l.Layer.Name }}
      </legend>
      <div>
        <div
          v-html-safe="l.Description"
          class="pl-3 caption"
        />
        <print-npc-stats :item="l" />
        <div
          v-html-safe="l.Layer.RulesByTier(npc.Tier)"
          class="pl-3 caption"
        />
        <div
          v-for="(f, i) in l.Layer.Features.filter(x => !x.HideActive)"
          :key="f.ID"
          class="mt-1 pl-3 caption"
        >
          <npc-feature-print
            :feature="f"
            :tier="npc.Tier"
            :owner="l"
          />
          <v-divider
            v-if="i + 1 < l.Layer.Features.length"
            class="mt-1"
          />
        </div>
      </div>

      <v-divider />
      <v-chip
        size="small"
        class="mt-1"
      >
        <b>{{ $t('gm.eidolonPrint.newShards', { n: l.Layer.Shards?.Count }) }}</b>
      </v-chip>
      <div
        v-html-safe="ByTier(l.Layer.Shards?.Detail || '', npc.Tier)"
        class="pl-3 caption"
      />
      <print-npc-stats
        v-if="l.Layer.Shards"
        :item="l.Layer.Shards"
        hide-zero
      />
      <div
        v-for="(f, i) in (l.Layer.Shards?.Features ?? []).filter(x => !x.HideActive)"
        :key="f.ID"
        class="mt-1 pl-3 caption no-print-break"
      >
        <npc-feature-print
          :feature="f"
          :tier="npc.Tier"
        />
        <v-divider
          v-if="i + 1 < (l.Layer.Shards?.Features?.length ?? 0)"
          class="mt-1"
        />
      </div>
    </fieldset>

    <div
      v-if="has(options.include, 'gmNotes') && npc.Note.length"
      class="mb-1 mt-3 no-print-break"
    >
      <div
        class="text-overline text-primary"
        style="line-height: 0"
      >
        {{ $t('gm.gmNotes') }}
      </div>
      <div
        v-html-safe="npc.Note"
        class="mt-1 pl-3 caption"
      />
    </div>
  </div>

  <npc-narrative-print-section
    :npc="npc"
    :options="options"
  />
</template>

<script setup lang="ts">
  import { has } from '@/ui/print/options'
  import type { GmPrintOptions } from '@/ui/print/types'
  import type { Eidolon } from '@/classes/npc/eidolon/Eidolon'
  import { computed } from 'vue'
  import { ByTier } from '@/util/tierFormat'
  import NpcFeaturePrint from './components/NpcFeaturePrint.vue'
  import PrintNpcStats from './components/PrintNpcStats.vue'
  import NpcNarrativePrintSection from './components/NpcNarrativePrintSection.vue'
  import persistent_traits from '@/classes/npc/eidolon/persistent_traits.json'

  defineOptions({ name: 'EidolonPrint' })

  const props = defineProps<{
    npc: Eidolon
    options: GmPrintOptions
  }>()

  const persistentTraits = computed(() => {
    return persistent_traits
  })
</script>
