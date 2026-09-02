<template>
  <combat-action-button :action="action">
    <template #default="{ close }">
      <div class="pa-2">
        <div class="heading h4">{{ action.Name }}</div>
        <p v-html-safe="action.Detail"
          class="text-text pl-2 mb-2" />

        <div class="text-cc-overline text-disabled">{{ $t('ui.combat.target') }}</div>
        <v-select v-model="selectedTarget"
          :items="targets"
          :item-title="combatantLabel"
          return-object
          flat
          tile
          density="compact"
          variant="outlined" />

        <v-btn-toggle v-if="contested"
          v-model="succeeded"
          mandatory
          density="compact"
          class="mb-2">
          <v-btn :value="true">{{ $t('active.structureCheck.success') }}</v-btn>
          <v-btn :value="false">{{ $t('active.structureCheck.fail') }}</v-btn>
        </v-btn-toggle>

        <cc-button block
          color="primary"
          :disabled="!selectedTarget"
          @click="apply(close)">
          {{ $t('common.apply') }}
        </cc-button>
      </div>
    </template>
  </combat-action-button>
</template>

<script setup lang="ts">
  import { computed, ref } from 'vue'
  import type { Action } from '@/classes/Action'
  import type { CombatantData } from '@/classes/encounter/Encounter'
  import { useEncounterContext } from '../../../encounterContext'
  import { combatantLabel } from '@/util/combatantLabel'
  import CombatActionButton from './CombatActionButton.vue'

  const { owner, encounterInstance } = useEncounterContext()

  const props = defineProps<{
    action: Action
  }>()

  const emit = defineEmits<{
    activate: [payload: string]
  }>()

  const selectedTarget = ref<CombatantData | null>(null)
  const succeeded = ref(true)

  const controller = computed(() => owner.value.actor.CombatController)
  const contested = computed(() => controller.value.IsContested(props.action.ID))

  const targets = computed(() =>
    encounterInstance.value.Combatants.filter(c => c.actor.ID !== controller.value.RootActor.ID)
  )

  function apply(close: () => void) {
    if (!selectedTarget.value) return
    controller.value.PerformAction(props.action.ID, {
      target: selectedTarget.value.actor.CombatController,
      success: succeeded.value,
    })
    emit('activate', props.action.ID)
    selectedTarget.value = null
    succeeded.value = true
    close()
  }
</script>
