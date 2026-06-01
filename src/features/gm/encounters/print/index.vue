<template>
  <print-page-shell :orientation="options.orientation.title">
    <div v-if="selectedEncounter" class="pb-4">
      <layout :options="options" :encounter="selectedEncounter" />
      <div v-if="options && options.extras">
        <page-break v-if="options.extras.some((x) => x.title === 'GM Tracker')" />
        <gm-tracker
          v-if="options.extras.some((x) => x.title === 'GM Tracker')"
          :encounter="selectedEncounter" />
        <page-break v-if="options.extras.some((x) => x.title === 'Combat Quick Reference')" />
        <combat-ref v-if="options.extras.some((x) => x.title === 'Combat Quick Reference')" />
        <page-break v-if="options.extras.some((x) => x.title === 'Action Reference')" />
        <action-ref v-if="options.extras.some((x) => x.title === 'Action Reference')" />
        <page-break v-if="options.extras.some((x) => x.title === 'Tag Reference')" />
        <tag-info-print v-if="options.extras.some((x) => x.title === 'Tag Reference')" />
      </div>
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
        label="Encounter"
        class="mx-3"
        clearable />
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
import { EncounterStore } from '@/stores'
import PageBreak from '@/features/pilot_management/Print/components/PageBreak.vue'
import { Encounter } from '@/classes/encounter/Encounter'

const props = withDefaults(defineProps<{ id?: string }>(), {})

const selectedEncounter = ref<Encounter | null>(null)
const options = ref<any>({
  layout: { title: 'Standard', icon: 'mdi-book-open' },
  orientation: { title: 'Portrait', icon: 'mdi-file' },
  paper: { title: 'Letter', icon: 'mdi-text-box-check-outline' },
  include: [],
  extras: [],
  card: [],
})

if (props.id) {
  selectedEncounter.value = EncounterStore().Encounters.find((p) => p.ID === props.id) as Encounter
}

const allEncounters = computed(() => EncounterStore().Encounters.filter((x) => !x.SaveController.IsDeleted))
</script>
