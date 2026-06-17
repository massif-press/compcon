<template>
  <v-btn :color="controller.CanActivate('protocol') ? 'protocol' : 'panel'"
    :size="size"
    flat
    tile
    height="25"
    @click="$emit('action')">
    <v-tooltip v-if="!controller.CanActivate('protocol')"
      location="top">
      <template #activator="{ props }">
        <v-avatar v-bind="props"
          size="x-small"
          class="mr-2">
          <v-icon icon="mdi-exclamation-thick"
            color="error" />
        </v-avatar>
      </template>
      <div class="text-center text-cc-overline">{{ $t('ui.combat.cannotActivateShort') }}</div>
      <v-divider class="my-1" />
      <div>
        {{ $t('active.combatAction.insufficient') }}
        <v-chip color="protocol"
          size="small"
          variant="elevated"
          prepend-icon="cc:protocol">
          {{ $t('active.actionChips.protocol') }}
        </v-chip>
        {{ $t('active.combatAction.actionsRemaining') }}
      </div>
    </v-tooltip>
    <v-tooltip location="top"
      max-width="300"
      :text="tooltipText">
      <template #activator="{ props }">
        <span v-bind="props">
          <v-icon icon="cc:protocol"
            class="mr-1"
            size="19" />
          {{ label }}
        </span>
      </template>
    </v-tooltip>
  </v-btn>
</template>

<script setup lang="ts">
import { CombatController } from '@/classes/components/combat/CombatController';

const props = withDefaults(defineProps<{
  controller: CombatController
  label: string
  tooltipText: string
  size?: string
}>(), {
  size: 'small'
})

const emit = defineEmits<{
  'action': []
}>()
</script>
