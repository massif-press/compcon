<template>
  <print-page-shell :options="options">
    <div
      v-if="selectedEncounter"
      class="pb-4"
    >
      <layout
        :options="options"
        :encounter="selectedEncounter"
      />
      <template v-if="has(options.extras, 'gmTracker')">
        <page-break />
        <gm-tracker :encounter="selectedEncounter" />
      </template>
      <template v-if="has(options.extras, 'combatRef')">
        <page-break />
        <combat-ref :statuses="CompendiumStore().Statuses" />
      </template>
      <template v-if="has(options.extras, 'actionRef')">
        <page-break />
        <action-ref :all-actions="CompendiumStore().Actions" />
      </template>
      <template v-if="has(options.extras, 'tagRef')">
        <page-break />
        <tag-info-print :npcs="encounterNpcs" />
      </template>
    </div>

    <template #selector>
      <v-select
        v-model="selectedEncounter"
        :items="allEncounters"
        :item-title="(x: Encounter) => `${x.Name} `"
        return-object
        density="compact"
        hide-details
        variant="outlined"
        :label="$t('gm.fields.encounter')"
        class="mx-3"
        clearable
      />
    </template>

    <template #options-dialog>
      <options-dialog :options="options" />
    </template>
  </print-page-shell>
</template>

<script setup lang="ts">
  import { ref, computed } from 'vue'
  import PrintPageShell from '@/ui/components/print/PrintPageShell.vue'
  import Layout from './layout.vue'
  import TagInfoPrint from '@/ui/components/print/TagInfoPrint.vue'
  import CombatRef from '@/ui/components/print/CombatRef.vue'
  import ActionRef from '@/ui/components/print/ActionRef.vue'
  import GmTracker from './extras/GmTracker.vue'
  import OptionsDialog from './OptionsDialog.vue'
  import { EncounterStore, CompendiumStore } from '@/stores'
  import PageBreak from '@/ui/components/print/PageBreak.vue'
  import { Encounter } from '@/classes/encounter/Encounter'
  import { LAYOUT, ORIENTATION, PAPER, has } from '@/ui/print/options'
  import type { GmPrintOptions } from '@/ui/print/types'
  import type { Npc } from '@/classes/npc/Npc'

  defineOptions({ name: 'EncounterPrint' })

  const props = withDefaults(defineProps<{ id?: string }>(), {})

  const selectedEncounter = ref<Encounter | null>(null)
  const options = ref<GmPrintOptions>({
    layout: LAYOUT.standard,
    orientation: ORIENTATION.portrait,
    paper: PAPER.letter,
    include: [],
    extras: [],
  })

  if (props.id) {
    selectedEncounter.value = EncounterStore().Encounters.find(p => p.ID === props.id) as Encounter
  }

  const allEncounters = computed(() =>
    EncounterStore().Encounters.filter(x => !x.SaveController.IsDeleted)
  )
  const encounterNpcs = computed(
    () => (selectedEncounter.value?.Combatants.map((c: any) => c.actor) ?? []) as Npc[]
  )
</script>
