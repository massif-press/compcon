<template>
  <div class="text-black pa-2">
    <div class="heading h2 mt-n2">
      {{ encounter.Name }}
    </div>

    <div v-html-safe="encounter.Description"
      class="pl-2 mt-n1" />
  </div>

  <fieldset class="pb-2 px-2 mx-2 mt-n3 text-caption"
    style="border-radius: 4px; border: 1px solid grey">
    <legend class="text-overline ml-3">
      <v-chip variant="outlined"
        size="x-small"
        style="border-color: grey">
        <span>{{ $t('gm.encPrint.sitrep') }}</span>
        <cc-slashes class="mx-1" />
        <b>{{ encounter.Sitrep.Name }}</b>
      </v-chip>
    </legend>
    <div v-if="encounter.Sitrep.Description">
      <div class="text-caption"><b>{{ $t('common.description') }}</b></div>
      <v-divider style="width: 150px" />
      {{ encounter.Sitrep.Description }}
    </div>
    <div v-if="encounter.Sitrep.Deployment"
      class="mt-1">
      <div class="text-caption"><b>{{ $t('gm.encPrint.deployment') }}</b></div>
      <v-divider style="width: 150px" />
      {{ encounter.Sitrep.Deployment }}
    </div>
    <div v-if="encounter.Sitrep.ControlZone"
      class="mt-1">
      <div class="text-caption"><b>{{ $t('gm.encPrint.controlZone') }}</b></div>
      <v-divider style="width: 150px" />
      {{ encounter.Sitrep.ControlZone }}
    </div>
    <div v-if="encounter.Sitrep.Extraction"
      class="mt-1">
      <div class="text-caption"><b>{{ $t('gm.encPrint.extraction') }}</b></div>
      <v-divider style="width: 150px" />
      {{ encounter.Sitrep.Extraction }}
    </div>
    <div v-if="encounter.Sitrep.Objective"
      class="mt-1">
      <div class="text-caption"><b>{{ $t('gm.encPrint.objective') }}</b></div>
      <v-divider style="width: 150px" />
      {{ encounter.Sitrep.Objective }}
    </div>
    <div v-for="(c, index) in encounter.Sitrep.Conditions"
      :key="`condition-${index}`"
      class="mt-1">
      <div class="text-caption">
        <b>{{ c.title }}</b>
      </div>
      <v-divider style="width: 150px" />

      {{ c.condition }}
    </div>
  </fieldset>

  <fieldset class="pb-2 px-2 mx-2 text-caption"
    style="border-radius: 4px; border: 1px solid grey">
    <legend class="text-overline ml-3">
      <v-chip variant="outlined"
        size="x-small"
        style="border-color: grey">
        <span>{{ $t('gm.encPrint.environment') }}</span>
        <cc-slashes class="mx-1" />
        <b>{{ encounter.Environment.Name }}</b>
      </v-chip>
    </legend>
    <div v-if="encounter.Environment.Description">
      <div class="text-caption"><b>{{ $t('common.description') }}</b></div>
      <v-divider style="width: 150px" />
      {{ encounter.Environment.Description }}
    </div>
  </fieldset>

  <fieldset class="pb-2 px-2 mx-2 mt-1 text-caption"
    style="border-radius: 4px; border: 1px solid grey">
    <legend>
      <v-icon icon="cc:mech"
        class="mt-n1"
        color="error" />
      {{encounter.Combatants.filter((x) => x.side === 'enemy').length}}
      {{ $t('gm.encPrint.enemies') }}
      <cc-slashes class="mx-2" />
      <v-icon icon="cc:mech"
        class="mt-n1"
        color="success" />
      {{encounter.Combatants.filter((x) => x.side === 'ally').length}}
      {{ $t('gm.encPrint.allies') }}
      <cc-slashes class="mx-2" />
      <v-icon icon="cc:mech"
        class="mt-n1" />
      {{encounter.Combatants.filter((x) => x.side === 'neutral').length}}
      {{ $t('gm.encPrint.neutral') }}
    </legend>
    <div v-for="(n, i) in SortedCombatants"
      :key="`combatant-${i}`">
      <v-card class="pa-2"
        color="transparent">
        <v-row dense
          class="bg-grey-lighten-3"
          style="border-radius: 4px">
          <v-col v-if="n.playerCount > 1"
            cols="auto">
            <v-icon icon="mdi-account-group"
              color="accent"
              class="mr-1" />
            <i18n-t keypath="gm.encPrint.atLeastPcs" tag="span" scope="global">
              <template #count><b>{{ n.playerCount }}</b></template>
            </i18n-t>
          </v-col>
          <v-col v-if="n.reinforcement"
            cols="auto">
            <v-icon icon="mdi-refresh"
              color="accent"
              class="mr-1" />
            <b>{{ $t('gm.encPrint.reinforcement') }}</b>
          </v-col>
          <v-col v-if="n.reinforcement && n.reinforcementTurn > 0"
            cols="auto">
            <cc-slashes />
            {{ $t('gm.encPrint.reinforcesOnTurn', { turn: n.reinforcementTurn }) }}
          </v-col>
        </v-row>

        <component :is="getComponentByType(n.type)"
          :npc="n.actor"
          :options="UnitOptions" />
      </v-card>
      <page-break v-if="i + 1 < encounter.Combatants.length" />
    </div>
  </fieldset>

  <div class="mt-n3">
    <fieldset v-if="encounter.NarrativeController.TextItems.length"
      class="mx-1 my-2 px-3">
      <div v-for="(t, index) in encounter.NarrativeController.TextItems"
        :key="`text-${index}`">
        <div class="font-weight-bold mb-n2"
          v-text="t.header" />
        <div v-html-safe="t.body"
          class="pl-2" />
      </div>
    </fieldset>

    <div v-if="encounter.NarrativeController.Clocks.length"
      class="mx-1 my-2">
      <v-card v-for="(c, index) in encounter.NarrativeController.Clocks"
        :key="`clock-${index}`"
        variant="outlined"
        class="text-caption px-2 pb-1">
        <div class="font-weight-bold text-caption"
          v-text="c.Title" />
        <v-row no-gutters>
          <v-col v-for="(n, si) in c.Segments"
            :key="`segment-${si}`"
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

    <div v-if="encounter.NarrativeController.Tables.length"
      class="mx-1 my-2">
      <v-card v-for="(t, index) in encounter.NarrativeController.Tables"
        :key="`table-${index}`"
        variant="outlined"
        class="text-caption px-2">
        <div class="font-weight-bold text-caption"
          v-text="t.Title" />
        <div v-html-safe="t.Description"
          class="pl-2" />
        <v-row dense
          v-for="(r, ri) in t.Results"
          :key="`result-${ri}`">
          <v-col cols="auto">
            <b>{{ r.min }}-{{ r.max }}</b>
          </v-col>
          <v-col>{{ r.result }}</v-col>
        </v-row>
      </v-card>
    </div>

    <fieldset v-if="options.include?.includes('Append Lined Section')"
      class="mx-1 my-2 px-3">
      <div class="mb-4">
        <notes :rows="16"
          lined />
      </div>
    </fieldset>

    <fieldset v-if="options.include?.includes('Append Unlined Section')"
      class="mx-1 my-2 px-3">
      <div class="mb-4">
        <notes :rows="16" />
      </div>
    </fieldset>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { sortBy } from 'lodash-es'
import UnitPrint from '@/features/gm/npc_roster/print/layouts/UnitPrint.vue'
import EidolonPrint from '@/features/gm/npc_roster/print/layouts/EidolonPrint.vue'
import DoodadPrint from '@/features/gm/npc_roster/print/layouts/DoodadPrint.vue'
import Notes from './components/blank/notes.vue'
import BlankLine from './components/blank/line.vue'
import PageBreak from '@/features/pilot_management/Print/components/PageBreak.vue'

const props = defineProps<{
  encounter: Record<string, any>
  options: Record<string, any>
}>()

const SortedCombatants = computed(() => sortBy(props.encounter.Combatants, (x: any) => x.playerCount))
const UnitOptions = computed(() => {
  const options = { ...props.options }
  options.include = []
  return options
})

function getComponentByType(npc: string) {
  switch (npc) {
    case 'unit': return UnitPrint
    case 'eidolon': return EidolonPrint
    default: return DoodadPrint
  }
}
</script>
