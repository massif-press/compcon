<template>
  <div>
    <div
      v-if="item.Actions?.length"
      class="mb-2 mt-1"
    >
      <cc-combat-action-chip :owner="owner" :encounter-instance="encounterInstance"
        v-for="a in item.Actions"
        :key="a.ID || a.Name"
        :action="a"
        @activate="handleActivation($event)"
        @reset="handleRefund($event)"
      >
        <template #icon>
          <v-tooltip
            location="top"
            :text="$t('active.tooltips.equipmentAction')"
          >
            <template #activator="{ props }">
              <v-icon
                v-bind="props"
                :icon="actionIcon"
              />
            </template>
          </v-tooltip>
        </template>
      </cc-combat-action-chip>
    </div>

    <div
      v-if="item.Deployables?.length"
      class="mb-2"
    >
      <deploy-button
        v-for="d in item.Deployables"
        :key="d.ID || d.Name"
        :deployable="d"
        :actor="actor"
        @deploy="handleDeploy(d)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { CombatantData } from '@/classes/encounter/Encounter'
import { useEncounterContext } from '../../encounterContext'
import type { ICombatant } from '@/classes/components/combat/ICombatant'
import type { EncounterInstance } from '@/classes/encounter/EncounterInstance'
import { toRef } from 'vue'
import DeployButton from './_deployButton.vue'
import { useEquipmentActions } from '@/composables/useEquipmentActions'

const { owner, encounterInstance } = useEncounterContext()

const props = withDefaults(defineProps<{
  item: any
  actor: ICombatant
  actionIcon?: string
}>(), {
  actionIcon: 'cc:system',
})

const emit = defineEmits<{ (e: 'deploy', deployable: any): void }>()

const { handleActivation, handleRefund, handleDeploy } = useEquipmentActions(
  toRef(props, 'item'),
  (_event, deployable) => emit('deploy', deployable)
)
</script>
