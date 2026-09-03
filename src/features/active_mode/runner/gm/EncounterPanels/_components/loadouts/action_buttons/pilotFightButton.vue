<template>
  <combat-action-button
    :action="action"
    :preset-weapon="presetWeapon"
    :action-color="fightColor"
    :action-icon="fightIcon"
  >
    <template #default="{ close }">
      <div
        v-if="!presetWeapon"
        class="text-cc-overline text-disabled pl-3 py-2"
      >
        {{ $t('active.fight.selectWeapon') }}
      </div>
      <v-row
        dense
        align="center"
        class="bg-panel heading h3 pb-1 px-3"
      >
        <v-divider
          v-if="presetWeapon"
          class="my-1"
        />
        <v-col v-if="!presetWeapon">
          <cc-select
            v-model="selectedWeapon"
            :items="fightWeapons"
            bg-color="background"
            color="primary"
            return-object
            item-title="Name"
            @update:model-value="reset()"
          />
        </v-col>
        <v-col v-else-if="selectedWeapon">
          <v-icon
            icon="cc:weapon"
            class="ml-4 mt-n1"
          />
          {{ selectedWeapon.Name }}
        </v-col>
        <v-col
          v-if="selectedWeapon"
          cols="auto"
        >
          <cc-tags :tags="selectedWeapon.Tags" />
        </v-col>
        <v-col
          v-if="selectedWeapon"
          cols="auto"
        >
          <v-menu
            open-on-hover
            max-width="600px"
          >
            <template #activator="{ props }">
              <v-icon
                icon="mdi-information-outline"
                v-bind="props"
              />
            </template>
            <v-card class="pt-2 pb-4 px-4">
              <cc-item-card :item="selectedWeapon" />
            </v-card>
          </v-menu>
        </v-col>
      </v-row>

      <div class="px-6">
        <pilot-weapon-attack
          v-if="selectedWeapon && event"
          :event="<WeaponAttackEvent>event"
          :weapon="<PilotWeapon>event.Weapon"
        />
      </div>
      <cc-flow-request
        :request="result?.request"
        class="px-4 pb-2"
      />
      <v-slide-y-transition>
        <staged-panel
          v-if="event && event.BaseEvent.Staged"
          :events="eventArray"
        />
      </v-slide-y-transition>

      <v-divider />
      <div class="pa-4">
        <apply-button
          v-if="event"
          :owner="owner"
          :encounter-instance="encounterInstance"
          :event="<ActiveEffectEvent>event.BaseEvent"
          :weapon-event="<WeaponAttackEvent>event"
          :close="close"
          :action="action"
          :action-id="selectedWeapon ? selectedWeapon.InstanceID : ''"
          :activation-override="fightActivation"
          @reset="reset($event)"
          @apply="apply"
        />
      </div>
    </template>
  </combat-action-button>
</template>

<script setup lang="ts">
  import type { EncounterInstance } from '@/classes/encounter/EncounterInstance'
  import { useEncounterContext } from '../../../encounterContext'
  import type { Action } from '@/classes/Action'
  import { computed, ref, shallowRef } from 'vue'
  import { WeaponAttackEvent } from '@/classes/components/feature/active_effects/WeaponAttackEvent'
  import { ActiveEffectEvent } from '@/classes/components/feature/active_effects/ActiveEffectEvent'
  import { CombatantData } from '@/classes/encounter/Encounter'
  import { PilotWeapon } from '@/classes/pilot/components/Loadout/equipment/PilotWeapon'
  import CombatActionButton from './CombatActionButton.vue'
  import ApplyButton from '@/ui/components/chips/_activeeffect/ApplyButton.vue'
  import StagedPanel from './_stagedPanel.vue'
  import PilotWeaponAttack from './_pilotWeaponAttack.vue'
  import { WeaponUseFlow, weaponUseState, activeEvents } from '@/classes/components/combat/flows/WeaponUseFlow'
  import type { IWeaponUseState } from '@/classes/components/combat/flows/WeaponUseFlow'
  import type { IFlowResult } from '@/classes/components/combat/flows/Flow'

  const { owner, encounterInstance } = useEncounterContext()

  const props = defineProps<{
    action: Action
    presetWeapon?: PilotWeapon
  }>()

  const controller = computed(() => {
    return owner.value.actor.CombatController.ActiveActor.CombatController
  })

  function newState(): IWeaponUseState {
    const self = encounterInstance.value.Combatants.find(
      (c: CombatantData) =>
        c.actor.CombatController.RootActor.ID === owner.value.actor.CombatController.RootActor.ID
    )
    if (!self) throw new Error('Owner combatant not found in encounterInstance')
    return weaponUseState({
      cc: controller.value,
      actionId: props.action.ID,
      mode: 'fight',
      presetWeapon: props.presetWeapon,
      makeEvent: (weapon: any, label: string) =>
        new WeaponAttackEvent(weapon as PilotWeapon, self, encounterInstance.value, label),
    })
  }

  const useState = ref<IWeaponUseState>(newState())
  const result = shallowRef<IFlowResult<IWeaponUseState> | null>(null)

  function run() {
    result.value =
      result.value?.outcome === 'awaiting'
        ? WeaponUseFlow.Resume(result.value as IFlowResult<IWeaponUseState>)
        : WeaponUseFlow.Begin(useState.value)
  }

  function reset(clearAction = false) {
    if (clearAction) controller.value.ClearActionUsed(props.action.ID)
    const carried = useState.value.selected[0] ?? props.presetWeapon ?? null
    useState.value = newState()
    if (carried) useState.value.selected = [carried]
    result.value = null
    run()
  }

  function apply() {
    run()
    reset()
  }

  function onWeaponChanged(weapon: PilotWeapon) {
    selectedWeapon.value = weapon
    reset()
  }

  const selectedWeapon = computed<PilotWeapon | null>({
    get: () => (useState.value.selected[0] as PilotWeapon) ?? null,
    set: (weapon: PilotWeapon | null) => {
      useState.value.selected = weapon ? [weapon] : []
    },
  })
  const fightWeapon = computed(() => props.presetWeapon || selectedWeapon.value)
  const fightActivation = computed(() => fightWeapon.value?.FightActivation || 'full')
  const fightIcon = computed(() =>
    fightActivation.value === 'quick' ? 'mdi-hexagon-slice-3' : 'mdi-hexagon-slice-6'
  )
  const fightColor = computed(() =>
    fightActivation.value === 'quick' ? 'action--quick' : 'action--full'
  )
  const fightWeapons = computed(() => useState.value.options as PilotWeapon[])
  const event = computed(() => (useState.value.entries[0]?.event as WeaponAttackEvent) ?? null)
  const eventArray = computed(() => activeEvents(useState.value))

  reset()
</script>
