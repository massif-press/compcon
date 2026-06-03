<template>
  <combat-action-button
    :action="action"
    :preset-weapon="presetWeapon"
    :mobile="mobile">
    <template #default="{ close }">
      <div :class="mobile ? 'px-1 pb-1' : 'px-3'">
        <cc-synergy-display v-if="selectedWeapon"
          location="attack"
          :mech="controller.Parent"
          alert />
      </div>
      <div :class="mobile ? '' : 'px-3'">
        <mech-mount-bonus-card v-if="selectedMount"
          v-for="b in selectedMount.Bonuses"
          :key="b.ID"
          expanded
          :bonus="b"
          :mech="owner.actor.CombatController.Parent" />
      </div>


      <div v-if="!presetWeapon"
        class="text-cc-overline text-disabled pl-3 py-2">
        select skirmish weapon
      </div>
      <v-row dense
        align="center"
        class="bg-panel heading h3 px-3">

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
          cols="12"
          :order="mobile ? 12 : ''"
          md="auto">
          <cc-tags :tags="selectedWeapon.Tags" />
        </v-col>
        <v-col v-if="selectedWeapon?.Mod"
          cols="12"
          :order="mobile ? 12 : ''"
          md="auto">
          <cc-tags :tags="selectedWeapon.Mod!.AddedTags"
            color="mod" />
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


      <div :class="mobile ? 'px-1' : 'px-6'">

        <cc-synergy-display v-if="selectedWeapon"
          :item="selectedWeapon"
          location="weapon"
          :mech="controller.Parent"
          alert />

        <mech-weapon-attack v-if="selectedWeapon && event"
          :event="<WeaponAttackEvent>event"
          :profile="<WeaponProfile>event.Weapon" />

        <div v-if="auxEvents && auxEvents.length"
          class="mt-4">
          <v-divider class="my-4" />
          <div class="text-cc-overline text-disabled mb-1">
            additional {{ selectedMount.Name }} aux weapons
          </div>
          <div v-for="(aux, aidx) in auxEvents"
            :key="`aux-${aidx}`">
            <v-row dense
              align="center"
              class="bg-panel mb-1 heading">
              <v-col cols="auto">
                <v-icon icon="cc:weapon"
                  class="ml-4"
                  start />
              </v-col>
              <v-col>
                {{ aux.Weapon.Name }}
              </v-col>
              <v-col cols="auto">
                <cc-tags :tags="aux.Weapon.Tags" />
              </v-col>
              <v-col v-if="(aux.Weapon as WeaponProfile).Parent.Mod"
                cols="auto">
                <cc-tags :tags="(aux.Weapon as WeaponProfile).Parent.Mod!.AddedTags"
                  color="mod" />
              </v-col>
              <v-col cols="auto">
                <cc-switch v-model="include[aidx]"
                  bg-color="background"
                  :label="`Include`" />
              </v-col>
            </v-row>
            <v-slide-y-reverse-transition>
              <div v-if="aux && include[aidx]">
                <cc-synergy-display :key="aux.Weapon.ID"
                  :item="(aux.Weapon as WeaponProfile).Parent"
                  location="weapon"
                  :mech="controller.Parent"
                  alert />

                <mech-weapon-attack v-if="selectedWeapon"
                  :event="<WeaponAttackEvent>aux"
                  :profile="<WeaponProfile>aux.Weapon" />

              </div>
            </v-slide-y-reverse-transition>
          </div>
        </div>

      </div>
      <v-slide-y-transition>
        <staged-panel v-if="event && event.BaseEvent.Staged"
          :events=eventArray />

      </v-slide-y-transition>

      <v-divider />
      <div class="pa-4">

        <apply-button :owner="owner" :encounter-instance="encounterInstance" v-if="event"
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
import type { EncounterInstance } from '@/classes/encounter/EncounterInstance'
import { useEncounterContext } from '../../../encounterContext'
import type { Action } from '@/classes/Action'
import { computed, ref, watch } from 'vue'
import { useDisplay } from 'vuetify'
import MenuInput from '@/ui/components/chips/_activeeffect/_ae_menu_input.vue';
import MechMountBonusCard from '../_mechMountBonusCard.vue';
import { MechWeapon } from '@/classes/mech/components/equipment/MechWeapon'
import { CombatantData } from '@/classes/encounter/Encounter';
import { WeaponAttackEvent } from '@/classes/components/feature/active_effects/WeaponAttackEvent';
import { WeaponProfile } from '@/classes/mech/components/equipment/MechWeapon';
import MechWeaponAttack from './_mechWeaponAttack.vue';
import ApplyButton from '@/ui/components/chips/_activeeffect/ApplyButton.vue';
import { ActiveEffectEvent } from '@/classes/components/feature/active_effects/ActiveEffectEvent';
import StagedPanel from './_stagedPanel.vue';
import CombatActionButton from './CombatActionButton.vue';

const _display = useDisplay()

const { owner, encounterInstance } = useEncounterContext()

const props = defineProps<{
  action: Action
  presetWeapon?: MechWeapon
}>()

const event = ref(null as WeaponAttackEvent | null)
const auxEvents = ref([] as WeaponAttackEvent[])
const selectedWeapon = ref(null as MechWeapon | null)
const include = ref([] as boolean[])

reset();

reset();

const mobile = computed(() => {
      return _display.mdAndDown.value;
    })
const controller = computed(() => {
      return owner.value.actor.CombatController.ActiveActor.CombatController;
    })
const selectedMount = computed(() => {
      if (!selectedWeapon.value) return null;
      const aa = owner.value.actor.CombatController.RootActor;
      if (!aa.ActiveMech) return null;

      return aa.ActiveMech.MechLoadoutController.ActiveLoadout.Mounts.find((m) => m.Weapons.some((w) => w.InstanceID === selectedWeapon.value!.InstanceID));
    })
const ordnanceWarning = computed(() => {
      if (!selectedWeapon.value) return false;
      if (selectedWeapon.value.ActiveTags.find((t) => t.ID.toLowerCase() === 'tg_ordnance')) {
        return owner.value.actor.CombatController.CanActivate('ordnance') === false;
      }
      return false;
    })
const skirmishWeapons = computed(() => {
      const mech = controller.value.ActiveActor;
      if (!mech || !mech.MechLoadoutController) return []
      let arr = mech.MechLoadoutController.ActiveLoadout.Weapons.filter(
        (x) => x.Skirmish
      );
      if (props.presetWeapon) {
        arr = arr.filter(w => w.InstanceID === props.presetWeapon!.InstanceID);
      }
      return arr;
    })
const eventArray = computed(() => {
      const enabledAuxes = auxEvents.value.filter((x, idx) => include.value[idx]);
      return [event.value].concat(enabledAuxes)
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


      event.value = new WeaponAttackEvent(selectedWeapon.value?.SelectedProfile as WeaponProfile, self, encounterInstance.value, 'Skirmish');
      const auxes = selectedMount.value?.Weapons.filter(
        (x) =>
          x.InstanceID !== selectedWeapon.value!.InstanceID && x.Size.toLowerCase() === 'auxiliary'
      ) ?? [];

      auxEvents.value = auxes.map(x => new WeaponAttackEvent(x.SelectedProfile as WeaponProfile, owner.value as CombatantData, encounterInstance.value, 'Additional Aux Attack'));

      include.value = auxEvents.value.map(() => true);
    }
function apply() {
      const actor = owner.value.actor.CombatController.ActiveActor.CombatController;
      actor.MarkActionUsed(selectedWeapon.value!.InstanceID);
      if (selectedWeapon.value!.IsLoading) selectedWeapon.value!.Used = true;
      reset();
    }
function onWeaponChanged(weapon: MechWeapon) {
      selectedWeapon.value = weapon;
      reset();
    }
</script>
