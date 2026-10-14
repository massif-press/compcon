<template>
  <slot :confirm="confirm" />

  <burn-check-modal
    v-model="burnDialog"
    :cc="cc"
    @resolved="finishTurn"
  />

  <v-dialog
    v-model="holdDialog"
    max-width="480"
  >
    <v-card class="pa-4">
      <div class="heading h3 mb-2">{{ $t('combat.structureCheck.blocksTurn') }}</div>
      <cc-flow-request :request="pendingTurn?.request" />
      <v-card-actions>
        <v-spacer />
        <cc-button
          variant="text"
          @click="holdDialog = false"
        >
          {{ $t('common.closeAction') }}
        </cc-button>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
  import { ref, shallowRef } from 'vue'
  import type { CombatController } from '@/classes/components/combat/CombatController'
  import BurnCheckModal from './BurnCheckModal.vue'
  import type { IFlowResult } from '@/classes/components/combat/flows/Flow'
  import type { IEndTurnState } from '@/classes/components/combat/flows/LifecycleFlow'
  import { useEncounterContext } from '../encounterContext'

  defineOptions({ name: 'EndTurnControl' })

  const props = defineProps<{ cc: CombatController }>()
  const emit = defineEmits<{ complete: [] }>()
  const { encounterInstance } = useEncounterContext()

  const burnDialog = ref(false)
  const holdDialog = ref(false)
  const pendingTurn = shallowRef<IFlowResult<IEndTurnState> | null>(null)

  function confirm() {
    hold(props.cc.EndTurn(encounterInstance.value))
  }

  function hold(result: IFlowResult<IEndTurnState>) {
    if (result.outcome !== 'awaiting') {
      pendingTurn.value = null
      burnDialog.value = false
      holdDialog.value = false
      if (result.outcome === 'complete') emit('complete')
      return
    }
    pendingTurn.value = result
    burnDialog.value = result.pending === 'burn-check'
    holdDialog.value = !burnDialog.value && !!result.request
  }

  function finishTurn(answer: { success?: boolean; skip?: boolean; rolled?: number }) {
    if (!pendingTurn.value) return
    hold(props.cc.ResumeEndTurn(pendingTurn.value, answer))
  }
</script>
