<template>
  <combat-action-button
    :action="action"
    :preset-weapon="presetWeapon"
    :mobile="mobile"
  >
    <template #default="{ close }">
      <div :class="mobile ? 'px-1 pb-1' : 'px-3'">
        <cc-synergy-display
          v-if="selectedWeapon"
          location="attack"
          :mech="controller.Parent"
          alert
        />
      </div>
      <div :class="mobile ? '' : 'px-3'">
        <mech-mount-bonus-card
          v-for="b in selectedMount.Bonuses"
          v-if="selectedMount"
          :key="b.ID"
          expanded
          :bonus="b"
          :mech="<Mech>owner.actor.CombatController.Parent"
        />
      </div>

      <div
        v-if="!presetWeapon"
        class="text-cc-overline text-disabled pl-3 py-2"
      >
        {{ $t('active.skirmish.selectWeapon') }}
      </div>
      <v-row
        dense
        align="center"
        class="bg-panel heading h3 px-3"
      >
        <v-col v-if="!presetWeapon">
          <cc-select
            v-model="selectedWeapon"
            :items="skirmishWeapons"
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
          cols="12"
          :order="mobile ? 12 : ''"
          md="auto"
        >
          <cc-tags :tags="selectedWeapon.Tags" />
        </v-col>
        <v-col
          v-if="selectedWeapon?.Mod"
          cols="12"
          :order="mobile ? 12 : ''"
          md="auto"
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

      <div :class="mobile ? 'px-1' : 'px-6'">
        <cc-synergy-display
          v-if="selectedWeapon"
          :item="selectedWeapon"
          location="weapon"
          :mech="controller.Parent"
          alert
        />

        <mech-weapon-attack
          v-if="selectedWeapon && event"
          :event="<WeaponAttackEvent>event"
          :profile="<WeaponProfile>event.Weapon"
        />

        <div
          v-if="auxEvents && auxEvents.length"
          class="mt-4"
        >
          <v-divider class="my-4" />
          <div class="text-cc-overline text-disabled mb-1">
            {{ $t('active.barrage.additionalAux', { name: selectedMount.Name }) }}
          </div>
          <div
            v-for="(aux, aidx) in auxEvents"
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
                  v-model="include[aidx]"
                  bg-color="background"
                  :label="`Include`"
                />
              </v-col>
            </v-row>
            <v-slide-y-reverse-transition>
              <div v-if="aux && include[aidx]">
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
          activation-override="quick"
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
  import { computed, ref } from 'vue'
  import { useDisplay } from 'vuetify'
  import MenuInput from '@/ui/components/chips/_activeeffect/_ae_menu_input.vue'
  import MechMountBonusCard from '../_mechMountBonusCard.vue'
  import { MechWeapon } from '@/classes/mech/components/equipment/MechWeapon'
  import type { Mech } from '@/classes/mech/Mech'
  import { CombatantData } from '@/classes/encounter/Encounter'
  import { WeaponAttackEvent } from '@/classes/components/feature/active_effects/WeaponAttackEvent'
  import { WeaponProfile } from '@/classes/mech/components/equipment/MechWeapon'
  import MechWeaponAttack from './_mechWeaponAttack.vue'
  import { WeaponUseFlow, weaponUseState, activeEvents } from '@/classes/components/combat/flows/WeaponUseFlow'
  import type { IWeaponUseState } from '@/classes/components/combat/flows/WeaponUseFlow'
  import type { IFlowResult } from '@/classes/components/combat/flows/Flow'
  import ApplyButton from '@/ui/components/chips/_activeeffect/ApplyButton.vue'
  import { ActiveEffectEvent } from '@/classes/components/feature/active_effects/ActiveEffectEvent'
  import StagedPanel from './_stagedPanel.vue'
  import CombatActionButton from './CombatActionButton.vue'

  const _display = useDisplay()

  const { owner, encounterInstance } = useEncounterContext()

  const props = defineProps<{
    action: Action
    presetWeapon?: MechWeapon
  }>()

  const mobile = computed(() => {
    return _display.mdAndDown.value
  })
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
      mode: 'skirmish',
      presetWeapon: props.presetWeapon,
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
  const result = ref<IFlowResult<IWeaponUseState> | null>(null)

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

  const selectedWeapon = computed<MechWeapon | null>({
    get: () => (useState.value.selected[0] as MechWeapon) ?? null,
    set: (weapon: MechWeapon | null) => {
      useState.value.selected = weapon ? [weapon] : []
    },
  })
  const skirmishWeapons = computed(() => useState.value.options as MechWeapon[])
  const event = computed(() => (useState.value.entries[0]?.event as WeaponAttackEvent) ?? null)
  const auxEvents = computed(
    () => (useState.value.entries[0]?.auxEvents as WeaponAttackEvent[]) ?? []
  )
  const include = computed(() => useState.value.entries[0]?.include ?? [])
  const eventArray = computed(() => activeEvents(useState.value))
  const selectedMount = computed(() => {
    if (!selectedWeapon.value) return null
    const aa = owner.value.actor.CombatController.RootActor
    if (!aa.ActiveMech) return null

    return aa.ActiveMech.MechLoadoutController.ActiveLoadout.Mounts.find(m =>
      m.Weapons.some(w => w.InstanceID === selectedWeapon.value!.InstanceID)
    )
  })

  reset()
</script>
