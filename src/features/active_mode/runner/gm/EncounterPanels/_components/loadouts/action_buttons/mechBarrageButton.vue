<template>
  <combat-action-button
    :action="action"
    :preset-weapon="presetWeapon"
    :mobile="mobile"
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
            <cc-tags :tags="selectedWeapon.Tags" />
          </v-col>
          <v-col
            v-if="selectedWeapon?.Mod"
            cols="auto"
          >
            <cc-tags
              :tags="selectedWeapon.Mod!.AddedTags"
              color="mod"
            />
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

        <mech-mount-bonus-card
          v-for="b in selectedMount(selectedWeapon).Bonuses"
          v-if="selectedMount(selectedWeapon)"
          :key="b.ID"
          expanded
          :bonus="b"
          :mech="<Mech>owner.actor.CombatController.Parent"
        />

        <div class="px-6">
          <cc-synergy-display
            v-if="selectedWeapon"
            :item="selectedWeapon"
            location="weapon"
            :mech="controller.Parent"
            alert
          />

          <mech-weapon-attack
            v-if="selectedWeapon && events[idx]?.weaponEvent"
            :event="<WeaponAttackEvent>events[idx].weaponEvent"
            :profile="<WeaponProfile>events[idx].weaponEvent.Weapon"
          />

          <div
            v-if="
              selectedMount(selectedWeapon) &&
              events[idx]?.auxEvents &&
              events[idx]?.auxEvents.length
            "
            class="mt-4"
          >
            <v-divider class="my-4" />
            <div class="text-cc-overline text-disabled mb-1">
              {{ $t('active.barrage.additionalAux', { name: selectedMount(selectedWeapon).Name }) }}
            </div>
            <div
              v-for="(aux, aidx) in events[idx]?.auxEvents"
              :key="`aux-${aidx}`"
            >
              <v-row
                dense
                align="center"
                class="bg-panel mb-1 heading"
              >
                <v-col cols="auto">
                  <v-icon
                    icon="cc:weapon"
                    class="ml-4"
                    start
                  />
                </v-col>
                <v-col>
                  {{ aux.Weapon.Name }}
                </v-col>
                <v-col cols="auto">
                  <cc-tags :tags="aux.Weapon.Tags" />
                </v-col>
                <v-col
                  v-if="(aux.Weapon as WeaponProfile).Parent.Mod"
                  cols="auto"
                >
                  <cc-tags
                    :tags="(aux.Weapon as WeaponProfile).Parent.Mod!.AddedTags"
                    color="mod"
                  />
                </v-col>
                <v-col cols="auto">
                  <cc-switch
                    v-model="events[idx].include[aidx]"
                    bg-color="background"
                    :label="`Include`"
                  />
                </v-col>
              </v-row>
              <v-slide-y-reverse-transition>
                <div v-if="aux && events[idx]?.include[aidx]">
                  <cc-synergy-display
                    :key="aux.Weapon.ID"
                    :item="(aux.Weapon as WeaponProfile).Parent"
                    location="weapon"
                    :mech="controller.Parent"
                    alert
                  />

                  <mech-weapon-attack
                    v-if="selectedWeapon"
                    :event="<WeaponAttackEvent>aux"
                    :profile="<WeaponProfile>aux.Weapon"
                  />
                </div>
              </v-slide-y-reverse-transition>
            </div>
          </div>
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
          v-if="events.some(e => e?.weaponEvent)"
          :owner="owner"
          :encounter-instance="encounterInstance"
          :event="
            <ActiveEffectEvent[]>(
              events.filter(e => e?.weaponEvent).map(e => e.weaponEvent.BaseEvent)
            )
          "
          :weapon-event="
            <WeaponAttackEvent[]>events.filter(e => e?.weaponEvent).map(e => e.weaponEvent)
          "
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
  import { useDisplay } from 'vuetify'
  import MenuInput from '@/ui/components/chips/_activeeffect/_ae_menu_input.vue'
  import MechMountBonusCard from '../_mechMountBonusCard.vue'
  import { MechWeapon } from '@/classes/mech/components/equipment/MechWeapon'
  import type { Mech } from '@/classes/mech/Mech'
  import { CombatantData } from '@/classes/encounter/Encounter'
  import { WeaponAttackEvent } from '@/classes/components/feature/active_effects/WeaponAttackEvent'
  import { ActiveEffectEvent } from '@/classes/components/feature/active_effects/ActiveEffectEvent'
  import { WeaponProfile } from '@/classes/mech/components/equipment/MechWeapon'
  import MechWeaponAttack from './_mechWeaponAttack.vue'
  import { WeaponUseFlow, weaponUseState, activeEvents } from '@/classes/components/combat/flows/WeaponUseFlow'
  import type { IWeaponUseState } from '@/classes/components/combat/flows/WeaponUseFlow'
  import type { IFlowResult } from '@/classes/components/combat/flows/Flow'
  import ApplyButton from '@/ui/components/chips/_activeeffect/ApplyButton.vue'
  import StagedPanel from './_stagedPanel.vue'
  import CombatActionButton from './CombatActionButton.vue'

  defineOptions({ name: 'MechBarrageButton' })

  const { owner, encounterInstance } = useEncounterContext()

  const props = defineProps<{
    action: Action
    presetWeapon?: MechWeapon
  }>()

  const { mdAndDown: mobile } = useDisplay()

  const controller = computed(
    () => (owner.value as any).actor.CombatController.ActiveActor.CombatController
  )

  function newState(): IWeaponUseState {
    const self = (encounterInstance.value as any).Combatants.find(
      (c: CombatantData) =>
        c.actor.CombatController.RootActor.ID ===
        (owner.value as any).actor.CombatController.RootActor.ID
    )
    if (!self) throw new Error('Owner combatant not found in encounterInstance')
    return weaponUseState({
      cc: controller.value,
      actionId: props.action.ID,
      mode: 'barrage',
      makeEvent: (weapon: any, label: string) =>
        new WeaponAttackEvent(
          weapon.SelectedProfile as WeaponProfile,
          self,
          encounterInstance.value,
          label
        ),
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
    if (clearAction) controller.value.ClearActionUsed((props.action as any).ID)
    useState.value = newState()
    if (props.presetWeapon) useState.value.selected = [props.presetWeapon]
    result.value = null
    run()
  }

  function apply() {
    run()
    reset()
  }

  function setSelected(index: number, weapon: MechWeapon) {
    if (!weapon) return
    const chosen = useState.value.selected.filter(Boolean)
    chosen[index] = weapon
    useState.value.selected = chosen
    result.value = null
    run()
  }

  function selectedMount(selectedWeapon: any) {
    if (!selectedWeapon) return null
    const aa = (owner.value as any).actor.CombatController.RootActor
    if (!aa.ActiveMech) return null
    return aa.ActiveMech.MechLoadoutController.ActiveLoadout.Mounts.find((m: any) =>
      m.Weapons.some((w: any) => w.InstanceID === selectedWeapon.InstanceID)
    )
  }

  const selectedWeapons = computed(() => {
    const chosen = useState.value.selected.filter(Boolean) as MechWeapon[]
    if (chosen.length >= useState.value.capacity) return chosen
    return [...chosen, undefined as unknown as MechWeapon]
  })
  const barrageWeapons = computed(() => useState.value.options as MechWeapon[])
  const events = computed(() =>
    useState.value.entries.map(e => ({
      weaponEvent: e.event as WeaponAttackEvent,
      auxes: e.auxes as MechWeapon[],
      auxEvents: e.auxEvents as WeaponAttackEvent[],
      include: e.include,
    }))
  )
  const eventArray = computed(() => activeEvents(useState.value))
  const allEventsStaged = computed(
    () => !!eventArray.value.length && eventArray.value.every((e: any) => e.BaseEvent.Staged)
  )

  reset()
</script>
