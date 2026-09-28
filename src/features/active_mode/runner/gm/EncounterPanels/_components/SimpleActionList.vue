<template>
  <div class="mt-4">
    <div class="d-flex align-center">
      <div class="text-cc-overline text-disabled">{{ $t('active.actions.allActions') }}</div>
      <v-spacer />
      <unavailable-toggle
        v-model="showUnavailable"
        :count="hiddenCount"
        :showing-text="$t('active.playMode.showingUnavailableActions')"
        :hiding-text="$t('active.playMode.hidingUnavailableActions')"
      />
    </div>
    <v-row dense>
      <v-col
        v-for="a in shown"
        :key="a.ID"
        cols="12"
        sm="6"
        md="4"
      >
        <deploy-button
          v-if="a.Deployable"
          action-only
          :deployable="toDeployable(a)"
          :actor="owner.actor"
          @deploy="$emit('deploy', $event)"
        />
        <v-row
          v-else
          no-gutters
          align="center"
        >
          <v-col>
            <cc-button
              size="x-small"
              block
              :color="available(a) ? a.Color : 'panel'"
              :prepend-icon="a.Icon"
              :disabled="controller.IsActionUsed(a.ID)"
              @click="mark(a)"
            >
              {{ a.Name }}
              <span v-if="a.HeatCost">
                &nbsp;({{ $t('ui.combat.heatSelf', { n: a.HeatCost }) }})
              </span>
            </cc-button>
          </v-col>
          <v-col
            v-if="controller.UsedCount(a.ID)"
            cols="auto"
            class="ml-1"
          >
            <cc-button
              size="x-small"
              color="primary"
              icon="mdi-undo"
              :tooltip="$t('active.playMode.markUnused')"
              @click="controller.UndoActivation(a.Activation, { actionId: a.ID })"
            />
          </v-col>
          <v-col
            cols="auto"
            class="ml-1"
          >
            <action-info-button :action="a" />
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </div>
</template>

<script setup lang="ts">
  import { computed, ref } from 'vue'
  import type { Action } from '@/classes/Action'
  import type { ActivationType } from '@/classes/enums'
  import type { CombatController } from '@/classes/components/combat/CombatController'
  import { CompendiumStore } from '@/stores'
  import { Deployable } from '@/classes/components/feature/deployable/Deployable'
  import { useEncounterContext } from '../encounterContext'
  import DeployButton from './loadouts/_deployButton.vue'
  import UnavailableToggle from './loadouts/action_buttons/_unavailableToggle.vue'
  import ActionInfoButton from '@/ui/components/items/features/actions/_actionInfoButton.vue'

  defineOptions({ name: 'SimpleActionList' })

  const props = defineProps<{
    controller: CombatController
    quickActions: string[]
    fullActions: string[]
  }>()

  defineEmits<{ deploy: [event: any] }>()

  const { owner } = useEncounterContext()

  const showUnavailable = ref(false)

  function base(ids: string[]): Action[] {
    return ids
      .map(id => CompendiumStore().Actions.find((a: any) => a.ID === id))
      .filter(Boolean) as Action[]
  }

  const actions = computed<Action[]>(() => {
    const granted = (...types: `${ActivationType}`[]) =>
      types.flatMap(t => props.controller.AllActions(t))
    return [
      ...granted('Protocol'),
      ...base(props.quickActions),
      ...granted('Quick', 'Quick Tech'),
      ...base(props.fullActions),
      ...granted('Full', 'Full Tech', 'Free', 'Reaction'),
    ]
  })

  function available(a: Action): boolean {
    const cc = props.controller
    return !!a.Deployable || !!cc.UsedCount(a.ID) || cc.CanActivate(a.Activation, a.ID)
  }

  const shown = computed(() =>
    showUnavailable.value ? actions.value : actions.value.filter(available)
  )
  const hiddenCount = computed(() => actions.value.length - actions.value.filter(available).length)

  function mark(a: Action) {
    props.controller.Activate(a.Activation, {
      actionId: a.ID,
      frequency: a.Frequency,
      heat: 0,
      force: !available(a),
    })
  }

  function toDeployable(action: any) {
    return new Deployable(action.Deployable)
  }
</script>
