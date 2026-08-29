<template>
  <print-page-shell :options="options">
    <component
      :is="resolveComponent()"
      :options="options"
      :selected-mech="<Mech>selectedMech"
      :selected-pilot="<Pilot>selectedPilot"
      :has-bonds="hasBondData"
    />
    <div v-if="selectedPilot">
      <template v-if="has(options.extras, EXTRA.combatRef.key)">
        <page-break />
        <combat-ref :statuses="CompendiumStore().Statuses" />
      </template>
      <template v-if="has(options.extras, EXTRA.actionRef.key)">
        <page-break />
        <action-ref :all-actions="CompendiumStore().Actions" />
      </template>
      <template v-if="has(options.extras, EXTRA.downtimeRef.key)">
        <page-break />
        <downtime-ref />
      </template>
      <template v-if="has(options.extras, EXTRA.triggerRef.key)">
        <page-break />
        <trigger-info-print :pilot="<Pilot>selectedPilot" />
      </template>
      <template v-if="has(options.extras, EXTRA.tagRef.key)">
        <page-break />
        <tag-info-print
          :pilot="<Pilot>selectedPilot"
          :mech="<Mech>selectedMech"
        />
      </template>
    </div>

    <template #selector>
      <v-select
        v-model="selectedPilot"
        :items="allPilots"
        :item-title="x => `${x.Name} // ${x.Callsign}`"
        return-object
        density="compact"
        hide-details
        variant="outlined"
        :label="$t('pm.new.pilot')"
        class="mx-3"
        clearable
        style="width: 10vw"
      />
      <v-select
        v-model="selectedMech"
        :items="pilotMechs"
        :item-title="x => `${x.Name} // ${x.Frame.Name}`"
        return-object
        density="compact"
        hide-details
        variant="outlined"
        :label="$t('common.mech')"
        class="mx-3"
        clearable
        style="width: 10vw"
      />
    </template>

    <template #options-dialog>
      <options-dialog
        :has-bonds="hasBondData"
        :options="options"
      />
    </template>
  </print-page-shell>
</template>

<script setup lang="ts">
  import { computed, ref, onMounted } from 'vue'
  import PrintPageShell from '@/ui/components/print/PrintPageShell.vue'
  import Standard from './layouts/standard/index.vue'
  import Expanded from './layouts/expanded/index.vue'
  import Terse from './layouts/terse/index.vue'
  import Minimal from './layouts/minimal/index.vue'
  import Cards from './layouts/cards/index.vue'
  import TagInfoPrint from '@/ui/components/print/TagInfoPrint.vue'
  import TriggerInfoPrint from './extras/TriggerInfoPrint.vue'
  import CombatRef from '@/ui/components/print/CombatRef.vue'
  import ActionRef from '@/ui/components/print/ActionRef.vue'
  import DowntimeRef from './extras/DowntimeRef.vue'
  import OptionsDialog from './OptionsDialog.vue'
  import { PilotStore, CompendiumStore } from '@/stores'
  import { Pilot } from '@/classes/pilot/Pilot'
  import { Mech } from '@/classes/mech/Mech'
  import PageBreak from '@/ui/components/print/PageBreak.vue'
  import { LAYOUT, ORIENTATION, PAPER, CONTENT, BONDS, EXTRA, has } from '@/ui/print/options'
  import type { PilotPrintOptions } from '@/ui/print/types'

  defineOptions({ name: 'PilotPrintPage' })

  const props = withDefaults(
    defineProps<{
      presetPilot: string
      presetMech?: string
    }>(),
    {
      presetMech: '',
    }
  )

  const selectedPilot = ref(null as Pilot | null)
  const selectedMech = ref(null as Mech | null)
  const options = ref<PilotPrintOptions>({
    layout: LAYOUT.standard,
    orientation: ORIENTATION.portrait,
    content: CONTENT.pilot,
    bonds: BONDS.include,
    paper: PAPER.letter,
    pilotInclude: [],
    mechInclude: [],
    extras: [],
    card: [],
  })
  const resolveComponent = () => {
    switch (options.value.layout.key) {
      case LAYOUT.expanded.key:
        return Expanded
      case LAYOUT.terse.key:
        return Terse
      case LAYOUT.minimal.key:
        return Minimal
      case LAYOUT.cards.key:
        return Cards
      default:
        return Standard
    }
  }
  const allPilots = computed(() => {
    return PilotStore().Pilots.filter(x => !x.SaveController.IsDeleted)
  })
  const pilotMechs = computed(() => {
    return selectedPilot.value ? selectedPilot.value.Mechs : []
  })
  const hasBondData = computed(() => {
    return CompendiumStore().Bonds.length > 0
  })

  onMounted(() => {
    if (!props.presetPilot) return
    selectedPilot.value = PilotStore().Pilots.find(p => p.ID === props.presetPilot) as Pilot
    if (props.presetMech)
      selectedMech.value = selectedPilot.value?.Mechs.find(m => m.ID === props.presetMech) || null
  })
</script>
