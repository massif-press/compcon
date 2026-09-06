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
        <unavailable-toggle
          v-model="useState.showUnavailable"
          :count="hiddenWeapons"
        />
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
  import { computed } from 'vue'
  import { useDisplay } from 'vuetify'
  import MenuInput from '@/ui/components/chips/_activeeffect/_ae_menu_input.vue'
  import MechMountBonusCard from '../_mechMountBonusCard.vue'
  import { MechWeapon } from '@/classes/mech/components/equipment/MechWeapon'
  import type { Mech } from '@/classes/mech/Mech'
  import { WeaponAttackEvent } from '@/classes/components/feature/active_effects/WeaponAttackEvent'
  import { WeaponProfile } from '@/classes/mech/components/equipment/MechWeapon'
  import MechWeaponAttack from './_mechWeaponAttack.vue'
  import { useWeaponUse } from './useWeaponUse'
  import ApplyButton from '@/ui/components/chips/_activeeffect/ApplyButton.vue'
  import { ActiveEffectEvent } from '@/classes/components/feature/active_effects/ActiveEffectEvent'
  import StagedPanel from './_stagedPanel.vue'
  import UnavailableToggle from './_unavailableToggle.vue'
  import CombatActionButton from './CombatActionButton.vue'

  const _display = useDisplay()

  const { owner, encounterInstance, ownerController } = useEncounterContext()

  const props = defineProps<{
    action: Action
    presetWeapon?: MechWeapon
  }>()

  const mobile = computed(() => {
    return _display.mdAndDown.value
  })
  const {
    controller,
    useState,
    result,
    reset,
    apply,
    selected: selectedWeapon,
    weapons: skirmishWeapons,
    hiddenWeapons,
    eventArray,
  } = useWeaponUse({
    mode: 'skirmish',
    carry: true,
    actionId: () => props.action.ID,
    presetWeapon: () => props.presetWeapon,
    makeEvent: (self, weapon, label) =>
      new WeaponAttackEvent(
        weapon.SelectedProfile as WeaponProfile,
        self,
        encounterInstance.value,
        label
      ),
  })

  const event = computed(() => (useState.value.entries[0]?.event as WeaponAttackEvent) ?? null)
  const auxEvents = computed(
    () => (useState.value.entries[0]?.auxEvents as WeaponAttackEvent[]) ?? []
  )
  const include = computed(() => useState.value.entries[0]?.include ?? [])
  const selectedMount = computed(() => {
    if (!selectedWeapon.value) return null
    const aa = ownerController.value.RootActor
    if (!aa.ActiveMech) return null

    return aa.ActiveMech.MechLoadoutController.ActiveLoadout.Mounts.find(m =>
      m.Weapons.some(w => w.InstanceID === selectedWeapon.value!.InstanceID)
    )
  })
</script>
