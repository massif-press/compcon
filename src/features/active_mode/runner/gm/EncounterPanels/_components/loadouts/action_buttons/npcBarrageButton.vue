<template>
  <combat-action-button
    :action="action"
    :preset-weapon="presetWeapon">
    <template #default="{ close }">

      <cc-synergy-display location="attack"
        :mech="controller.Parent"
        alert />

      <div v-for="(selectedWeapon, idx) in selectedWeapons"
        :key="selectedWeapon ? selectedWeapon.InstanceID : `empty-${idx}`">
        <div v-if="!selectedWeapon"
          class="text-cc-overline text-disabled pl-3 py-2">
          {{ $t('active.barrage.selectWeapon') }}
        </div>
        <v-row dense
          align="center"
          class="bg-panel heading h3 pb-1 px-3">
          <v-divider v-if="presetWeapon"
            class="my-1 " />
          <v-col v-if="!presetWeapon || idx > 0">
            <cc-select v-model="selectedWeapons[idx]"
              :items="barrageWeapons"
              bg-color="background"
              color="primary"
              return-object
              item-title="Name"
              @update:model-value="setSelected(idx, $event)" />

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

          <cc-synergy-display v-if="selectedWeapon"
            :item="selectedWeapon"
            location="weapon"
            :mech="controller.Parent"
            alert />

          <npc-weapon-attack v-if="selectedWeapon && events[idx]?.weaponEvent"
            :event="<WeaponAttackEvent>events[idx].weaponEvent"
            :weapon="<NpcWeapon>events[idx].weaponEvent.Weapon" />

        </div>
      </div>

      <v-slide-y-transition>
        <staged-panel v-if="allEventsStaged"
          :events=eventArray />
      </v-slide-y-transition>

      <v-divider />
      <div class="pa-4">

        <apply-button :owner="owner" :encounter-instance="encounterInstance" v-if="events.length"
          :event="<ActiveEffectEvent[]>events.map(e => e.weaponEvent.BaseEvent)"
          :weapon-event="<WeaponAttackEvent[]>events.map(e => e.weaponEvent)"
          :close="close"
          :action="action"
          :action-id="selectedWeapons.length ? selectedWeapons.map(w => w.InstanceID) : []"
          activation-override="full"
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
import MenuInput from '@/ui/components/chips/_activeeffect/_ae_menu_input.vue';
import { CombatantData } from '@/classes/encounter/Encounter';
import { WeaponAttackEvent } from '@/classes/components/feature/active_effects/WeaponAttackEvent';
import NpcWeaponAttack from './_npcWeaponAttack.vue';
import ApplyButton from '@/ui/components/chips/_activeeffect/ApplyButton.vue';
import StagedPanel from './_stagedPanel.vue';
import { ActiveEffectEvent } from '@/classes/components/feature/active_effects/ActiveEffectEvent';
import { NpcWeapon } from '@/classes/npc/feature/NpcItem/NpcWeapon';
import { NpcFeatureType } from '@/classes/npc/feature/NpcFeature';
import CombatActionButton from './CombatActionButton.vue';

const { owner, encounterInstance } = useEncounterContext()

const props = defineProps<{
  action: Action
  presetWeapon?: NpcWeapon
}>()

const events = ref([] as {
      weaponEvent: WeaponAttackEvent,
    }[])
const selectedWeapons = ref([] as NpcWeapon[])

reset();

reset();

const controller = computed(() => {
      return owner.value.actor.CombatController.ActiveActor.CombatController;
    })
const barrageWeapons = computed(() => {
      const npc = controller.value.ActiveActor;

      let arr = (npc.NpcFeatureController?.Features || []).filter(x => x.FeatureType === NpcFeatureType.Weapon)

      if (props.presetWeapon) {
        arr = arr.filter(w => w.InstanceID !== props.presetWeapon!.InstanceID);
      }

      return arr;
    })
const eventArray = computed(() => {
      const out = [] as any[];
      for (let i = 0; i < selectedWeapons.value.length; i++) {
        const ev = events.value[i];
        if (ev && ev.weaponEvent) {
          out.push(ev.weaponEvent);
        }
      }
      return out;
    })
const allEventsStaged = computed(() => {
      if (!eventArray.value.length) return false;
      return eventArray.value.every((e) => e.BaseEvent.Staged);
    })
const tier = computed(() => {
      return owner.value.actor.CombatController.Tier;
    })

function reset(clearAction = false) {
      if (clearAction) owner.value.CombatController.ClearActionUsed(props.action.ID);
      selectedWeapons.value = new Array(2);
      events.value = new Array(2);
      if (!selectedWeapons.value[0] && props.presetWeapon) {
        setSelected(0, props.presetWeapon);
      }
    }
function apply() {
      const actor = owner.value.actor.CombatController.ActiveActor.CombatController;
      selectedWeapons.value.forEach((w) => {
        actor.MarkActionUsed(w.InstanceID);
        if (w.IsLoading) w.Used = true;
      });
      reset();
    }
function ordnanceWarning(selectedWeapon) {
      if (!selectedWeapon) return false;
      if (selectedWeapon.ActiveTags.find((t) => t.ID.toLowerCase() === 'tg_ordnance')) {
        return owner.value.actor.CombatController.CanActivate('ordnance') === false;
      }
      return false;
    }
function setSelected(index: number, weapon: NpcWeapon) {
      if (!weapon) return;

      const self = encounterInstance.value.Combatants.find(
        (c: CombatantData) => c.actor.CombatController.RootActor.ID === owner.value.actor.CombatController.RootActor.ID
      );
      if (!self) {
        throw new Error('Owner combatant not found in encounterInstance');
      }

      selectedWeapons.value[index] = weapon;

      events.value[index] = {
        weaponEvent: new WeaponAttackEvent(weapon, self, encounterInstance.value, 'Barrage'),
      };

      if (weapon.IsSuperheavy) {
        selectedWeapons.value = [weapon];
        events.value = [events.value[index]];
      } else if (selectedWeapons.value.length === 1) {
        selectedWeapons.value.push(undefined as any);
        events.value.push(undefined as any);
      }
    }
</script>
