<template>
  <combat-action-button
    :action="action"
    :owner="owner"
    :encounter="encounter"
    :preset-weapon="presetWeapon"
    :action-color="fightColor"
    :action-icon="fightIcon">
    <template #default="{ close }">
      <div v-if="!presetWeapon"
        class="text-cc-overline text-disabled pl-3 py-2">
        select weapon
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
          :owner="owner"
          :encounter="encounter"
          :weapon="<PilotWeapon>event.Weapon" />
      </div>
      <v-slide-y-transition>
        <staged-panel v-if="event && event.BaseEvent.Staged"
          :events=eventArray />
      </v-slide-y-transition>

      <v-divider />
      <div class="pa-4">
        <apply-button v-if="event"
          :event="<ActiveEffectEvent>event.BaseEvent"
          :weapon-event="<WeaponAttackEvent>event"
          :encounter="encounter"
          :owner="owner"
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

<script lang="ts">
import { WeaponAttackEvent } from '@/classes/components/feature/active_effects/WeaponAttackEvent';
import { ActiveEffectEvent } from '@/classes/components/feature/active_effects/ActiveEffectEvent';
import { CombatantData } from '@/classes/encounter/Encounter';
import { PilotWeapon } from '@/classes/pilot/components/Loadout/equipment/PilotWeapon';
import CombatActionButton from './CombatActionButton.vue';
import ApplyButton from '@/ui/components/chips/_activeeffect/ApplyButton.vue';
import StagedPanel from './_stagedPanel.vue';
import PilotWeaponAttack from './_pilotWeaponAttack.vue';

export default {
  name: 'PilotFightButton',
  components: { CombatActionButton, ApplyButton, StagedPanel, PilotWeaponAttack },
  props: {
    action: { type: Object, required: true },
    owner: { type: Object, required: true },
    encounter: { type: Object, required: true },
    presetWeapon: { type: PilotWeapon, required: false },
  },
  data: () => ({
    event: null as WeaponAttackEvent | null,
    selectedWeapon: null as PilotWeapon | null,
  }),
  created() {
    this.reset();
  },
  computed: {
    controller() {
      return this.owner.actor.CombatController.ActiveActor.CombatController;
    },
    fightIcon() {
      if (this.presetWeapon && this.presetWeapon.IsSidearm) return 'mdi-hexagon-slice-3';
      if (this.selectedWeapon && this.selectedWeapon.IsSidearm) return 'mdi-hexagon-slice-3';
      return 'mdi-hexagon-slice-6';
    },
    fightColor() {
      if (this.presetWeapon && this.presetWeapon.IsSidearm) return 'action--quick';
      if (this.selectedWeapon && this.selectedWeapon.IsSidearm) return 'action--quick';
      return 'action--full';
    },
    ordnanceWarning() {
      if (!this.selectedWeapon) return false;
      if (this.selectedWeapon.Tags.find((t) => t.ID.toLowerCase() === 'tg_ordnance')) {
        return this.owner.actor.CombatController.CanActivate('ordnance') === false;
      }
      return false;
    },
    fightWeapons() {
      const pilot = this.controller.RootActor;
      let arr = pilot.Loadout.Weapons;
      if (this.presetWeapon) {
        arr = arr.filter((w) => w.InstanceID === this.presetWeapon!.InstanceID);
      }
      return arr;
    },
    eventArray() {
      return [this.event];
    },
  },
  methods: {
    reset(clearAction = false) {
      if (clearAction) this.owner.CombatController.ClearActionUsed(this.action.ID);
      const self = this.encounter.Combatants.find(
        (c: CombatantData) => c.actor.CombatController.RootActor.ID === this.owner.actor.CombatController.RootActor.ID
      );
      if (!self) throw new Error('Owner combatant not found in encounter');
      if (!this.selectedWeapon && this.presetWeapon) this.selectedWeapon = this.presetWeapon;
      if (!this.selectedWeapon) return;
      this.event = new WeaponAttackEvent(this.selectedWeapon as PilotWeapon, self, this.encounter, 'Skirmish');
    },
    apply() {
      const actor = this.owner.actor.CombatController.ActiveActor.CombatController;
      actor.MarkActionUsed(this.selectedWeapon!.InstanceID);
      if (this.selectedWeapon!.IsLoading) this.selectedWeapon!.Used = true;
      this.reset();
    },
    onWeaponChanged(weapon: PilotWeapon) {
      this.selectedWeapon = weapon;
      this.reset();
    },
  },
};
</script>
