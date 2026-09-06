<template>
  <combat-action-button
    :action="action"
    :preset-weapon="presetWeapon"
  >
    <template #default="{ close }">
      <div class="px-3">
        <cc-synergy-display
          v-if="selectedWeapon"
          location="attack"
          :mech="controller.Parent"
          alert
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
        class="bg-panel heading h3 pb-1 px-3"
      >
        <v-divider
          v-if="presetWeapon"
          class="my-1"
        />
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
            <template #activator="{ props: activatorProps }">
              <v-icon
                icon="mdi-information-outline"
                v-bind="activatorProps"
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
          v-if="selectedWeapon && event"
          :event="<WeaponAttackEvent>event"
          :weapon="<NpcWeapon>event.Weapon"
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
          activation-override="quick"
          @reset="reset($event)"
          @apply="apply"
        />
      </div>
    </template>
  </combat-action-button>
</template>

<script setup lang="ts">
  import { useEncounterContext } from '../../../encounterContext'
  import type { Action } from '@/classes/Action'
  import { computed } from 'vue'
  import { WeaponAttackEvent } from '@/classes/components/feature/active_effects/WeaponAttackEvent'
  import ApplyButton from '@/ui/components/chips/_activeeffect/ApplyButton.vue'
  import StagedPanel from './_stagedPanel.vue'
  import { NpcWeapon } from '@/classes/npc/feature/NpcItem/NpcWeapon'
  import NpcWeaponAttack from './_npcWeaponAttack.vue'
  import { ActiveEffectEvent } from '@/classes/components/feature/active_effects/ActiveEffectEvent'
  import CombatActionButton from './CombatActionButton.vue'
  import { useWeaponUse } from './useWeaponUse'
  import UnavailableToggle from './_unavailableToggle.vue'

  const props = defineProps<{
    action: Action
    presetWeapon?: NpcWeapon
  }>()

  const { owner, encounterInstance } = useEncounterContext()

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
      new WeaponAttackEvent(weapon as NpcWeapon, self, encounterInstance.value, label),
  })

  const event = computed(() => (useState.value.entries[0]?.event as WeaponAttackEvent) ?? null)
  const tier = computed(() => controller.value.ActiveActor.Tier)
</script>
