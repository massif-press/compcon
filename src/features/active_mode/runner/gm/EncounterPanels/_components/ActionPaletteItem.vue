<template>
  <v-row
    v-if="simple"
    no-gutters
    align="center"
  >
    <v-col>
      <deploy-button
        v-if="action.Deployable"
        action-only
        simple
        :deployable="toDeployable(action)"
        :actor="actor"
        @deploy="$emit('deploy', $event)"
      />
      <cc-button
        v-else
        size="x-small"
        block
        :color="available ? action.Color : 'panel'"
        :prepend-icon="action.Icon"
        :disabled="controller.IsActionUsed(action.ID)"
        @click="mark"
      >
        {{ action.Name }}
        <span v-if="action.HeatCost">
          &nbsp;({{ $t('ui.combat.heatSelf', { n: action.HeatCost }) }})
        </span>
      </cc-button>
    </v-col>
    <v-col
      v-if="controller.UsedCount(action.ID)"
      cols="auto"
      class="ml-1"
    >
      <cc-button
        size="x-small"
        color="primary"
        icon="mdi-undo"
        :tooltip="$t('active.playMode.markUnused')"
        @click="controller.UndoActivation(action.Activation, { actionId: action.ID })"
      />
    </v-col>
    <v-col
      cols="auto"
      class="ml-1"
    >
      <action-info-button :action="action" />
    </v-col>
  </v-row>
  <deploy-button
    v-else-if="action.Deployable"
    action-only
    :deployable="toDeployable(action)"
    :actor="actor"
    @deploy="$emit('deploy', $event)"
  />
  <slot v-else />
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import type { Action } from '@/classes/Action'
  import type { CombatController } from '@/classes/components/combat/CombatController'
  import { Deployable } from '@/classes/components/feature/deployable/Deployable'
  import { useEncounterContext } from '../encounterContext'
  import { isActionAvailable } from './actionPalette'
  import DeployButton from './loadouts/_deployButton.vue'
  import ActionInfoButton from '@/ui/components/items/features/actions/_actionInfoButton.vue'

  defineOptions({ name: 'ActionPaletteItem' })

  const props = defineProps<{
    action: Action
    controller: CombatController
    actor: any
  }>()

  defineEmits<{ deploy: [event: any] }>()

  const { simple } = useEncounterContext()

  const available = computed(() => isActionAvailable(props.controller, props.action))

  function mark() {
    props.controller.Activate(props.action.Activation, {
      actionId: props.action.ID,
      frequency: props.action.Frequency,
      heat: 0,
      force: !available.value,
    })
  }

  function toDeployable(action: any) {
    return new Deployable(action.Deployable)
  }
</script>
