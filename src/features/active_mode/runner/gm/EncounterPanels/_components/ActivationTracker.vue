<template>
  <div class="text-center">
    <v-menu>
      <template #activator="{ props: activatorProps }">
        <v-btn v-for="i in cc.StatController.MaxStats['activations']"
          :key="`activation-${i}`"
          icon="cc:activate"
          size="40"
          flat
          variant="outlined"
          class="mx-1"
          :disabled="cc.StatController.CurrentStats['activations'] < i"
          :class="cc.StatController.CurrentStats['activations'] >= i ? 'bg-success' : ''"
          style="corner-shape: bevel; border-radius: 10px 0px !important;"
          :color="cc.StatController.CurrentStats['activations'] >= i ? 'panel' : 'grey'"
          v-bind="activatorProps">
          <v-tooltip activator="parent"
            location="top"
            :text="$t('active.panelBase.endActivation')" />
          <v-icon icon="cc:activate" />
        </v-btn>
      </template>
      <v-card flat
        tile
        max-width="300"
        class="pa-2 text-center"
        border="sm">
        <div>{{ $t('active.panelBase.markActivation') }}</div>

        <div v-if="cc.StatController.CurrentStats['activations'] > 1"
          class="text-cc-overline text-text mt-1 mb-2">
          {{ $t('active.panelBase.reduceActivations') }}
        </div>
        <div v-else
          class="text-cc-overline text-text mt-1 mb-2">
          {{ $t('active.panelBase.endTurn', { name: item.Name }) }}
        </div>
        <v-btn block
          flat
          tile
          size="small"
          color="primary"
          @click="confirm">
          {{ $t('common.confirm') }}
        </v-btn>
      </v-card>
    </v-menu>

    <burn-check-modal v-model="burnDialog"
      :cc="cc"
      @resolved="cc.EndTurn()" />
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { ICombatant } from '@/classes/components/combat/ICombatant'
import { StatKey } from '@/classes/components/combat/stats/Stats'
import BurnCheckModal from './BurnCheckModal.vue'

const props = defineProps<{ item: ICombatant }>()
const cc = computed(() => props.item.CombatController)

const burnDialog = ref(false)

function confirm() {
  if (cc.value.StatController.getCurrent(StatKey.BURN) > 0) burnDialog.value = true
  else cc.value.EndTurn()
}
</script>
