<template>
  <div>
    <div
      v-if="item.Actions?.length"
      class="mb-2 mt-1"
    >
      <cc-combat-action-chip
        v-for="a in item.Actions"
        :key="a.ID || a.Name"
        :action="a"
        :owner="owner"
        :encounter="encounter"
        @activate="handleActivation($event)"
        @reset="handleRefund($event)"
      >
        <template #icon>
          <v-tooltip
            location="top"
            text="Equipment Action"
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
import { toRef } from 'vue'
import DeployButton from './_deployButton.vue'
import { useEquipmentActions } from '@/composables/useEquipmentActions'

const props = withDefaults(defineProps<{
  item: any
  actor: any
  owner: any
  encounter: any
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
