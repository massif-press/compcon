<template>
  <div class="text-center">
    <v-menu>
      <template #activator="{ props: activatorProps }">
        <v-btn
          v-for="i in cc.StatController.MaxStats['activations']"
          :key="`activation-${i}`"
          icon="cc:activate"
          size="40"
          flat
          variant="outlined"
          class="mx-1"
          :disabled="cc.StatController.CurrentStats['activations'] < i"
          :class="cc.StatController.CurrentStats['activations'] >= i ? 'bg-success' : ''"
          style="corner-shape: bevel; border-radius: 10px 0px !important"
          :color="cc.StatController.CurrentStats['activations'] >= i ? 'panel' : 'grey'"
          v-bind="activatorProps"
        >
          <v-tooltip
            activator="parent"
            location="top"
            :text="$t('active.panelBase.endActivation')"
          />
          <v-icon icon="cc:activate" />
        </v-btn>
      </template>
      <v-card
        flat
        tile
        max-width="300"
        class="pa-2 text-center"
        border="sm"
      >
        <div>{{ $t('active.panelBase.markActivation') }}</div>

        <div
          v-if="cc.StatController.CurrentStats['activations'] > 1"
          class="text-cc-overline text-text mt-1 mb-2"
        >
          {{ $t('active.panelBase.reduceActivations') }}
        </div>
        <div
          v-else
          class="text-cc-overline text-text mt-1 mb-2"
        >
          {{ $t('active.panelBase.endTurn', { name: item.Name }) }}
        </div>
        <v-btn
          block
          flat
          tile
          size="small"
          color="primary"
          @click="confirm"
        >
          {{ $t('common.confirm') }}
        </v-btn>
      </v-card>
    </v-menu>

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
        <div class="heading h3 mb-2">{{ $t('active.structureCheck.blocksTurn') }}</div>
        <cc-flow-request :request="pendingTurn?.request" />
        <v-card-actions>
          <v-spacer />
          <cc-button
            variant="text"
            @click="holdDialog = false"
          >
            {{ $t('common.close') }}
          </cc-button>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup lang="ts">
  import { computed, ref, shallowRef } from 'vue'
  import { ICombatant } from '@/classes/components/combat/ICombatant'
  import BurnCheckModal from './BurnCheckModal.vue'
  import type { IFlowResult } from '@/classes/components/combat/flows/Flow'
  import type { IEndTurnState } from '@/classes/components/combat/flows/LifecycleFlow'
  import { useEncounterContext } from '../encounterContext'

  const props = defineProps<{ item: ICombatant }>()
  const cc = computed(() => props.item.CombatController)
  const { encounterInstance } = useEncounterContext()

  const burnDialog = ref(false)
  const holdDialog = ref(false)
  const pendingTurn = shallowRef<IFlowResult<IEndTurnState> | null>(null)

  function confirm() {
    hold(cc.value.EndTurn(encounterInstance.value))
  }

  function hold(result: IFlowResult<IEndTurnState>) {
    if (result.outcome !== 'awaiting') {
      pendingTurn.value = null
      burnDialog.value = false
      holdDialog.value = false
      return
    }
    pendingTurn.value = result
    // the burn check has a bespoke modal; anything else the step can describe goes to the
    // shared renderer, and a step that describes nothing opens no dialog at all
    burnDialog.value = result.pending === 'burn-check'
    holdDialog.value = !burnDialog.value && !!result.request
  }

  function finishTurn(answer: { success?: boolean; skip?: boolean }) {
    if (!pendingTurn.value) return
    hold(cc.value.ResumeEndTurn(pendingTurn.value, answer))
  }
</script>
