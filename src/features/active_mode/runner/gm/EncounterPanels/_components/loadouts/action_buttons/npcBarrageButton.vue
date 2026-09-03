<template>
  <combat-action-button
    :action="action"
    :preset-weapon="presetWeapon"
  >
    <template #default="{ close }">
      <cc-synergy-display
        location="attack"
        :mech="controller.Parent"
        alert
      />

      <div
        v-for="(selectedWeapon, idx) in selectedWeapons"
        :key="selectedWeapon ? selectedWeapon.InstanceID : `empty-${idx}`"
      >
        <div
          v-if="!selectedWeapon"
          class="text-cc-overline text-disabled pl-3 py-2"
        >
          {{ $t('active.barrage.selectWeapon') }}
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
          <v-col v-if="!presetWeapon || idx > 0">
            <cc-select
              v-model="selectedWeapons[idx]"
              :items="barrageWeapons"
              bg-color="background"
              color="primary"
              return-object
              item-title="Name"
              @update:model-value="setSelected(idx, $event)"
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
            <cc-npc-attack-bonus :attack-bonus="selectedWeapon.AttackBonus(tier)" />
          </v-col>
          <v-col
            v-if="selectedWeapon"
            cols="auto"
          >
            <cc-npc-accuracy-element :accuracy="selectedWeapon.Accuracy(tier)" />
          </v-col>
          <v-divider
            v-if="selectedWeapon"
            class="ml-2"
            inset
            vertical
          />
          <v-col
            v-if="selectedWeapon"
            cols="auto"
          >
            <cc-tags :tags="selectedWeapon.Tags" />
          </v-col>
          <v-divider
            v-if="selectedWeapon && selectedWeapon.Tags.length > 0"
            class="mx-1"
            inset
            vertical
          />
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
          <cc-synergy-display
            v-if="selectedWeapon"
            :item="selectedWeapon"
            location="weapon"
            :mech="controller.Parent"
            alert
          />

          <npc-weapon-attack
            v-if="selectedWeapon && events[idx]?.weaponEvent"
            :event="<WeaponAttackEvent>events[idx].weaponEvent"
            :weapon="<NpcWeapon>events[idx].weaponEvent.Weapon"
          />
        </div>
      </div>

      <cc-flow-request
        :request="result?.request"
        class="px-4 pb-2"
      />
      <v-slide-y-transition>
        <staged-panel
          v-if="allEventsStaged"
          :events="eventArray"
        />
      </v-slide-y-transition>

      <v-divider />
      <div class="pa-4">
        <apply-button
          v-if="events.length"
          :owner="owner"
          :encounter-instance="encounterInstance"
          :event="<ActiveEffectEvent[]>events.map(e => e.weaponEvent.BaseEvent)"
          :weapon-event="<WeaponAttackEvent[]>events.map(e => e.weaponEvent)"
          :close="close"
          :action="action"
          :action-id="selectedWeapons.filter(Boolean).map(w => w.InstanceID)"
          activation-override="full"
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
  import MenuInput from '@/ui/components/chips/_activeeffect/_ae_menu_input.vue'
  import { CombatantData } from '@/classes/encounter/Encounter'
  import { WeaponAttackEvent } from '@/classes/components/feature/active_effects/WeaponAttackEvent'
  import NpcWeaponAttack from './_npcWeaponAttack.vue'
  import ApplyButton from '@/ui/components/chips/_activeeffect/ApplyButton.vue'
  import StagedPanel from './_stagedPanel.vue'
  import { ActiveEffectEvent } from '@/classes/components/feature/active_effects/ActiveEffectEvent'
  import { NpcWeapon } from '@/classes/npc/feature/NpcItem/NpcWeapon'
  import { NpcFeatureType } from '@/classes/npc/feature/NpcFeature'
  import CombatActionButton from './CombatActionButton.vue'
  import { WeaponUseFlow, weaponUseState, activeEvents } from '@/classes/components/combat/flows/WeaponUseFlow'
  import type { IWeaponUseState } from '@/classes/components/combat/flows/WeaponUseFlow'
  import type { IFlowResult } from '@/classes/components/combat/flows/Flow'

  const { owner, encounterInstance } = useEncounterContext()

  const props = defineProps<{
    action: Action
    presetWeapon?: NpcWeapon
  }>()

  const controller = computed(() => {
    return owner.value.actor.CombatController.ActiveActor.CombatController
  })

  function newState(): IWeaponUseState {
    const self = encounterInstance.value.Combatants.find(
      (c: CombatantData) =>
        c.actor.CombatController.RootActor.ID === owner.value.actor.CombatController.RootActor.ID
    )
    if (!self) {
      throw new Error('Owner combatant not found in encounterInstance')
    }
    return weaponUseState({
      cc: controller.value,
      actionId: props.action.ID,
      mode: 'barrage',
      makeEvent: (weapon: any, label: string) =>
        new WeaponAttackEvent(weapon as NpcWeapon, self, encounterInstance.value, label),
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
    useState.value = newState()
    if (props.presetWeapon) useState.value.selected = [props.presetWeapon]
    result.value = null
    run()
  }

  function apply() {
    run()
    reset()
  }

  function setSelected(index: number, weapon: NpcWeapon) {
    if (!weapon) return
    const chosen = useState.value.selected.filter(Boolean)
    chosen[index] = weapon
    useState.value.selected = chosen
    result.value = null
    run()
  }

  const selectedWeapons = computed(() => {
    const chosen = useState.value.selected.filter(Boolean) as NpcWeapon[]
    if (chosen.length >= useState.value.capacity) return chosen
    return [...chosen, undefined as unknown as NpcWeapon]
  })
  const barrageWeapons = computed(() => useState.value.options as NpcWeapon[])
  const events = computed(() =>
    useState.value.entries.map(e => ({ weaponEvent: e.event as WeaponAttackEvent }))
  )
  const eventArray = computed(() => activeEvents(useState.value))
  const allEventsStaged = computed(
    () => !!eventArray.value.length && eventArray.value.every((e: any) => e.BaseEvent.Staged)
  )
  const tier = computed(() => {
    return owner.value.actor.CombatController.Tier
  })

  reset()
</script>
