<template>
  <combat-action-button :action="action"
    :preset-weapon="presetWeapon">
    <template #default="{ close }">
      <div class="px-3">
        <cc-synergy-display v-if="selectedWeapon"
          location="attack"
          :mech="controller.Parent"
          alert />
      </div>

      <div v-if="!presetWeapon"
        class="text-cc-overline text-disabled pl-3 py-2">
        select skirmish weapon
      </div>
      <v-row dense
        align="center"
        class="bg-panel heading h3 pb-1 px-3">
        <v-divider v-if="presetWeapon"
          class="my-1 " />
        <v-col v-if="!presetWeapon">
          <cc-select v-model="selectedWeapon"
            :items="skirmishWeapons"
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
          <cc-npc-attack-bonus :attack-bonus="selectedWeapon.AttackBonus(tier)" />
        </v-col>
        <v-col v-if="selectedWeapon"
          cols="auto">
          <cc-npc-accuracy-element :accuracy="selectedWeapon.Accuracy(tier)" />
        </v-col>
        <v-divider v-if="selectedWeapon"
          class="ml-2"
          inset
          vertical />
        <v-col v-if="selectedWeapon"
          cols="auto">
          <cc-tags :tags="selectedWeapon.Tags" />
        </v-col>
        <v-divider v-if="selectedWeapon && selectedWeapon.Tags.length > 0"
          class="mx-1"
          inset
          vertical />
        <v-col v-if="selectedWeapon"
          cols="auto">
          <v-menu open-on-hover
            max-width="600px">
            <template #activator="{ props: activatorProps }">
              <v-icon icon="mdi-information-outline"
                v-bind="activatorProps" />
            </template>
            <v-card class="pt-2 pb-4 px-4">
              <cc-item-card :item="selectedWeapon" />
            </v-card>
          </v-menu>
        </v-col>
      </v-row>

      <div class="px-6">

        <cc-synergy-display v-if="selectedWeapon"
          :item="selectedWeapon"
          location="weapon"
          :mech="controller.Parent"
          alert />

        <npc-weapon-attack v-if="selectedWeapon && event"
          :event="<WeaponAttackEvent>event"
          :weapon="<NpcWeapon>event.Weapon" />

      </div>
      <v-slide-y-transition>
        <staged-panel v-if="event && event.BaseEvent.Staged"
          :events=eventArray />

      </v-slide-y-transition>

      <v-divider />
      <div class="pa-4">

        <apply-button v-if="event"
          :owner="owner"
          :encounter-instance="encounterInstance"
          :event="<ActiveEffectEvent>event.BaseEvent"
          :weapon-event="<WeaponAttackEvent>event"
          :close="close"
          :action="action"
          :action-id="selectedWeapon ? selectedWeapon.InstanceID : ''"
          activation-override="quick"
          @reset="reset($event)"
          @apply="apply" />
      </div>

    </template>
  </combat-action-button>
</template>

<script setup lang="ts">
import { useEncounterContext } from '../../../encounterContext'
import type { Action } from '@/classes/Action'
import { computed, ref } from 'vue'
import { CombatantData } from '@/classes/encounter/Encounter';
import { WeaponAttackEvent } from '@/classes/components/feature/active_effects/WeaponAttackEvent';
import ApplyButton from '@/ui/components/chips/_activeeffect/ApplyButton.vue';
import StagedPanel from './_stagedPanel.vue';
import { NpcWeapon } from '@/classes/npc/feature/NpcItem/NpcWeapon';
import NpcWeaponAttack from './_npcWeaponAttack.vue';
import { ActiveEffectEvent } from '@/classes/components/feature/active_effects/ActiveEffectEvent';
import CombatActionButton from './CombatActionButton.vue';

const { owner, encounterInstance } = useEncounterContext()

const props = defineProps<{
  action: Action
  presetWeapon?: NpcWeapon
}>()

const event = ref(null as WeaponAttackEvent | null)
const selectedWeapon = ref(null as NpcWeapon | null)

reset();

const controller = computed(() => {
  return owner.value.actor.CombatController.ActiveActor.CombatController;
})

const skirmishWeapons = computed(() => {
  const npc = controller.value.ActiveActor;

  let arr = (npc.NpcFeatureController?.Features || []).filter(
    (x) => !x.IsSuperheavy
  );

  if (props.presetWeapon) {
    arr = arr.filter(w => w.InstanceID === props.presetWeapon!.InstanceID);
  }

  return arr;
})
const eventArray = computed(() => {
  return [event.value]
})
const tier = computed(() => {
  return controller.value.ActiveActor.Tier;
})

function reset(clearAction = false) {
  if (clearAction) owner.value.CombatController.ClearActionUsed(props.action.ID);
  const self = encounterInstance.value.Combatants.find(
    (c: CombatantData) => c.actor.CombatController.RootActor.ID === owner.value.actor.CombatController.RootActor.ID
  );
  if (!self) {
    throw new Error('Owner combatant not found in encounterInstance');
  }
  if (!selectedWeapon.value && props.presetWeapon) {
    selectedWeapon.value = props.presetWeapon;
  }

  if (!selectedWeapon.value)
    return;

  if (selectedWeapon.value)
    event.value = new WeaponAttackEvent(selectedWeapon.value as NpcWeapon, self, encounterInstance.value, 'Skirmish');
}
function apply() {
  const actor = owner.value.actor.CombatController.ActiveActor.CombatController;
  actor.MarkActionUsed(selectedWeapon.value!.InstanceID);
  if (selectedWeapon.value!.IsLoading) selectedWeapon.value!.Used = true;
  reset();
}
</script>
