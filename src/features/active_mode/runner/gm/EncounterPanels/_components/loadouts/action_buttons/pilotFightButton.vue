<template>
  <combat-action-button :action="action"
    :preset-weapon="presetWeapon"
    :action-color="fightColor"
    :action-icon="fightIcon">
    <template #default="{ close }">
      <div v-if="!presetWeapon"
        class="text-cc-overline text-disabled pl-3 py-2">
        {{ $t('active.fight.selectWeapon') }}
      </div>
      <v-row dense
        align="center"
        class="bg-panel heading h3 pb-1 px-3">
        <v-divider v-if="presetWeapon"
          class="my-1 " />
        <v-col v-if="!presetWeapon">
          <cc-select v-model="selectedWeapon"
            :items="fightWeapons"
            bg-color="background"
            color="primary"
            return-object
            item-title="Name"
            @update:model-value="reset()" />

        </v-col>
        <v-col v-else-if="selectedWeapon">
          <v-icon icon="cc:weapon"
            class="ml-4 mt-n1" />
          {{ selectedWeapon.Name }}
        </v-col>
        <v-col v-if="selectedWeapon"
          cols="auto">
          <cc-tags :tags="selectedWeapon.Tags" />
        </v-col>
        <v-col v-if="selectedWeapon"
          cols="auto">
          <v-menu open-on-hover
            max-width="600px">
            <template #activator="{ props }">
              <v-icon icon="mdi-information-outline"
                v-bind="props" />
            </template>
            <v-card class="pt-2 pb-4 px-4">
              <cc-item-card :item="selectedWeapon" />
            </v-card>
          </v-menu>
        </v-col>
      </v-row>

      <div class="px-6">
        <pilot-weapon-attack v-if="selectedWeapon && event"
          :event="<WeaponAttackEvent>event"
          :weapon="<PilotWeapon>event.Weapon" />
      </div>
      <v-slide-y-transition>
        <staged-panel v-if="event && event.BaseEvent.Staged"
          :events=eventArray />
      </v-slide-y-transition>

      <v-divider />
      <div class="pa-4">
        <apply-button :owner="owner"
          :encounter-instance="encounterInstance"
          v-if="event"
          :event="<ActiveEffectEvent>event.BaseEvent"
          :weapon-event="<WeaponAttackEvent>event"
          :close="close"
          :action="action"
          :action-id="selectedWeapon ? selectedWeapon.InstanceID : ''"
          :activation-override="selectedWeapon?.IsSidearm ? 'quick' : 'full'"
          @reset="reset($event)"
          @apply="apply" />
      </div>
    </template>
  </combat-action-button>
</template>

<script setup lang="ts">
import type { EncounterInstance } from '@/classes/encounter/EncounterInstance'
import { useEncounterContext } from '../../../encounterContext'
import type { Action } from '@/classes/Action'
import { computed, ref } from 'vue'
import { WeaponAttackEvent } from '@/classes/components/feature/active_effects/WeaponAttackEvent';
import { ActiveEffectEvent } from '@/classes/components/feature/active_effects/ActiveEffectEvent';
import { CombatantData } from '@/classes/encounter/Encounter';
import { PilotWeapon } from '@/classes/pilot/components/Loadout/equipment/PilotWeapon';
import CombatActionButton from './CombatActionButton.vue';
import ApplyButton from '@/ui/components/chips/_activeeffect/ApplyButton.vue';
import StagedPanel from './_stagedPanel.vue';
import PilotWeaponAttack from './_pilotWeaponAttack.vue';

const { owner, encounterInstance } = useEncounterContext()

const props = defineProps<{
  action: Action
  presetWeapon?: PilotWeapon
}>()

const event = ref(null as WeaponAttackEvent | null)
const selectedWeapon = ref(null as PilotWeapon | null)

reset();

const controller = computed(() => {
  return owner.value.actor.CombatController.ActiveActor.CombatController;
})
const fightIcon = computed(() => {
  if (props.presetWeapon && props.presetWeapon.IsSidearm) return 'mdi-hexagon-slice-3';
  if (selectedWeapon.value && selectedWeapon.value.IsSidearm) return 'mdi-hexagon-slice-3';
  return 'mdi-hexagon-slice-6';
})
const fightColor = computed(() => {
  if (props.presetWeapon && props.presetWeapon.IsSidearm) return 'action--quick';
  if (selectedWeapon.value && selectedWeapon.value.IsSidearm) return 'action--quick';
  return 'action--full';
})
const ordnanceWarning = computed(() => {
  if (!selectedWeapon.value) return false;
  if (selectedWeapon.value.Tags.find((t) => t.ID.toLowerCase() === 'tg_ordnance')) {
    return owner.value.actor.CombatController.CanActivate('ordnance') === false;
  }
  return false;
})
const fightWeapons = computed(() => {
  const pilot = controller.value.RootActor;
  let arr = pilot.Loadout.Weapons;
  if (props.presetWeapon) {
    arr = arr.filter((w) => w.InstanceID === props.presetWeapon!.InstanceID);
  }
  return arr;
})
const eventArray = computed(() => {
  return [event.value];
})

function reset(clearAction = false) {
  if (clearAction) owner.value.CombatController.ClearActionUsed(props.action.ID);
  const self = encounterInstance.value.Combatants.find(
    (c: CombatantData) => c.actor.CombatController.RootActor.ID === owner.value.actor.CombatController.RootActor.ID
  );
  if (!self) throw new Error('Owner combatant not found in encounterInstance');
  if (!selectedWeapon.value && props.presetWeapon) selectedWeapon.value = props.presetWeapon;
  if (!selectedWeapon.value) return;
  event.value = new WeaponAttackEvent(selectedWeapon.value as PilotWeapon, self, encounterInstance.value, 'Skirmish');
}
function apply() {
  const actor = owner.value.actor.CombatController.ActiveActor.CombatController;
  actor.MarkActionUsed(selectedWeapon.value!.InstanceID);
  if (selectedWeapon.value!.IsLoading) selectedWeapon.value!.Used = true;
  reset();
}
function onWeaponChanged(weapon: PilotWeapon) {
  selectedWeapon.value = weapon;
  reset();
}
</script>
