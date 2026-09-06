<template>
  <combat-action-button :action="action">
    <template #default="{ close }">
      <div class="pa-2">
        <div class="heading h4">{{ action.Name }}</div>
        <p
          v-html-safe="action.Detail"
          class="text-text pl-2 mb-2"
        />

        <cc-alert
          v-if="melee"
          color="primary"
          class="mb-2"
        >
          {{ $t('active.targetedAction.meleeResolution') }}
        </cc-alert>

        <v-row
          dense
          align="start"
        >
          <base-target-selector :event="event" />
          <base-attack-roller
            v-if="melee"
            :event="event"
          />
        </v-row>

        <v-btn-toggle
          v-if="contested"
          v-model="succeeded"
          mandatory
          density="compact"
          class="my-2"
        >
          <v-btn :value="true">{{ $t('active.structureCheck.success') }}</v-btn>
          <v-btn :value="false">{{ $t('active.structureCheck.fail') }}</v-btn>
        </v-btn-toggle>

        <cc-force-override
          v-model="overridePrompt"
          :reason="blockReason || 'unavailable'"
          :action="action.Name"
          @confirm="apply(close, true)"
        />

        <div
          v-if="awaitingRoll"
          class="text-cc-overline text-disabled text-center"
        >
          {{ $t('active.targetedAction.rollFirst') }}
        </div>
        <cc-button
          block
          color="primary"
          class="mt-2"
          :disabled="!chosen.length || awaitingRoll"
          @click="apply(close)"
        >
          {{ $t('active.tooltips.apply') }}
        </cc-button>
      </div>
    </template>
  </combat-action-button>
</template>

<script setup lang="ts">
  import { computed, ref, type Ref } from 'vue'
  import { Action } from '@/classes/Action'
  import { useEncounterContext } from '../../../encounterContext'
  import type { CombatantData } from '@/classes/encounter/Encounter'
  import { ActiveEffect } from '@/classes/components/feature/active_effects/ActiveEffect'
  import { ActiveEffectEvent } from '@/classes/components/feature/active_effects/ActiveEffectEvent'
  import type { ActiveEventTarget } from '@/classes/components/feature/active_effects/effect_events/eventTarget'
  import BaseTargetSelector from '@/ui/components/chips/_activeeffect/_shared/BaseTargetSelector.vue'
  import BaseAttackRoller from '@/ui/components/chips/_activeeffect/_shared/BaseAttackRoller.vue'
  import CcForceOverride from '@/ui/components/modals/CCForceOverride.vue'
  import CombatActionButton from './CombatActionButton.vue'

  const { owner, encounterInstance, ownerController: controller } = useEncounterContext()

  const props = defineProps<{
    action: Action
  }>()

  const succeeded = ref(true)
  const overridePrompt = ref(false)

  const contested = computed(() => controller.value.IsContested(props.action.ID))
  const melee = computed(() => controller.value.IsMeleeResolved(props.action.ID))

  const activation = computed(
    () => controller.value.ActivationFor(props.action.ID) ?? props.action.Activation
  )
  const blockReason = computed(() =>
    controller.value.BlockedReasonFor(activation.value, { actionId: props.action.ID })
  )

  function newEvent(): ActiveEffectEvent {
    const self = encounterInstance.value.Combatants.find(
      (c: CombatantData) => c.actor.CombatController.RootActor.ID === controller.value.RootActor.ID
    )
    if (!self) throw new Error('Owner combatant not found in encounterInstance')
    const built = new ActiveEffectEvent(
      self,
      new ActiveEffect(
        {
          id: props.action.ID,
          name: props.action.Name,
          detail: props.action.Detail,
          activation: props.action.Activation,
          attack: melee.value ? 'melee' : undefined,
        } as any,
        self.actor
      ),
      encounterInstance.value
    )
    if (melee.value) built.AttackBonus = controller.value.MeleeActionBonus(props.action.ID)
    return built
  }

  const event = ref(newEvent()) as Ref<ActiveEffectEvent>

  const chosen = computed(() =>
    (event.value.Targets as ActiveEventTarget[]).filter(t => !!t?.Combatant)
  )

  const awaitingRoll = computed(
    () =>
      melee.value &&
      chosen.value.some(t => t.AttackRolledValue === undefined && !t.MissedFromInvisibility)
  )

  function landed(target: ActiveEventTarget): boolean {
    if (!melee.value) return succeeded.value
    return target.HitResult === 'hit' || target.HitResult === 'crit'
  }

  function apply(close: () => void, force = false) {
    const targets = chosen.value
    if (!targets.length) return
    if (!force && blockReason.value) {
      overridePrompt.value = true
      return
    }
    targets.forEach((t, i) => {
      const opts = {
        target: t.Combatant!.actor.CombatController,
        success: landed(t),
        force,
      }
      if (i === 0) controller.value.PerformAction(props.action.ID, opts)
      else controller.value.RunAction(props.action.ID, opts)
    })
    event.value = newEvent()
    succeeded.value = true
    close()
  }
</script>
