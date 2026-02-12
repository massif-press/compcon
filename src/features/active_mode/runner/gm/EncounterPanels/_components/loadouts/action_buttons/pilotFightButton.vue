<template>
  <cc-dialog :color="available ? fightColor : 'panel'"
    :icon="fightIcon"
    :title="action.Name"
    :close-on-click="false"
    min-width="70vw"
    max-width="80vw"
    no-gutters>
    <template #activator="{ open }">
      <v-btn block
        flat
        tile
        size="small"
        :color="available ? fightColor : 'panel'"
        @click="open">
        <span class="ml-1">
          <v-icon :icon="fightIcon"
            :color="available ? '' : 'error'"
            start />
          <v-tooltip v-if="!available"
            location="top">
            <template #activator="{ props }">
              <v-icon v-bind="props"
                icon="mdi-exclamation-thick"
                color="error"
                class="ml-n2" />
            </template>
            <div class="text-center text-cc-overline">Cannot activate</div>
            <v-divider class="my-1" />
            <div v-if="!canActivate">
              <div v-if="!canUse">This action has already been used this turn.</div>
              <div v-else>
                Insufficient
                <v-chip :color="fightColor"
                  size="small"
                  variant="elevated"
                  :prepend-icon="fightIcon || ''">
                  {{ action.Activation }}
                </v-chip>
                actions remaining this turn.
              </div>
            </div>
            <div v-else-if="!canUse">This action has already been used this turn.</div>
          </v-tooltip>
        </span>
        <v-tooltip location="top"
          width="300">
          <template #activator="{ props }">
            <span v-bind="props">
              {{ action.Name }}
            </span>
          </template>
          <div class="d-flex">
            <div class="heading h4 d-flex">{{ action.Name }}</div>
            <v-spacer />
            <v-chip size="x-small"
              :color="fightColor"
              :prepend-icon="fightIcon"
              variant="elevated"
              elevation="0">
              {{ action.Activation }} Action
            </v-chip>
          </div>
          <v-divider class="my-1" />
          {{ action.Terse }}
        </v-tooltip>
      </v-btn>
    </template>
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
          activation-override="quick"
          @reset="reset($event)"
          @apply="apply" />
      </div>

    </template>
  </cc-dialog>
</template>

<script lang="ts">
import MenuInput from '@/ui/components/chips/_activeeffect/_ae_menu_input.vue';
import { CombatantData } from '@/classes/encounter/Encounter';
import { EncounterInstance } from '@/classes/encounter/EncounterInstance';
import { WeaponAttackEvent } from '@/classes/components/feature/active_effects/WeaponAttackEvent';
import ApplyButton from '@/ui/components/chips/_activeeffect/ApplyButton.vue';
import { ActiveEffectEvent } from '@/classes/components/feature/active_effects/ActiveEffectEvent';
import StagedPanel from './_stagedPanel.vue';
import { PilotWeapon } from '@/class';
import PilotWeaponAttack from './_pilotWeaponAttack.vue';

export default {
  name: 'PilotFightButton',
  props: {
    action: {
      type: Object,
      required: true,
    },
    owner: {
      type: Object,
      required: true,
    },
    encounter: {
      type: EncounterInstance,
      required: true,
    },
    presetWeapon: {
      type: PilotWeapon,
      required: false,
    },
  },
  components: {
    MenuInput,
    ApplyButton,
    StagedPanel,
    PilotWeaponAttack
  },
  data: () => ({
    event: null as WeaponAttackEvent | null,
    selectedWeapon: null as PilotWeapon | null,
  }),
  created() {
    this.reset();
  },
  computed: {
    available() {
      return this.canActivate && this.canUse;
    },
    controller() {
      return this.owner.actor.CombatController.ActiveActor.CombatController;
    },
    canActivate() {
      return this.controller.CanActivate(this.action.Activation);
    },
    canUse() {
      if (this.presetWeapon) {
        return !this.controller.IsActionUsed(this.presetWeapon.InstanceID);
      }
      return !this.controller.IsActionUsed(this.action.ID);
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
        arr = arr.filter(w => w.InstanceID === this.presetWeapon!.InstanceID);
      }

      return arr;
    },
    fightIcon() {
      if (this.presetWeapon && this.presetWeapon.IsSidearm) return 'mdi-hexagon-slice-3'
      else if (this.selectedWeapon && this.selectedWeapon.IsSidearm) return 'mdi-hexagon-slice-3'
      return 'mdi-hexagon-slice-6'
    },
    fightColor() {
      if (this.presetWeapon && this.presetWeapon.IsSidearm) return 'action--quick'
      else if (this.selectedWeapon && this.selectedWeapon.IsSidearm) return 'action--quick'
      return 'action--full'
    },
    eventArray() {
      return [this.event]
    },
  },
  methods: {
    reset(clearAction = false) {
      if (clearAction) this.owner.CombatController.ClearActionUsed(this.action.ID);
      const self = this.encounter.Combatants.find(
        (c: CombatantData) => c.actor.CombatController.RootActor.ID === this.owner.actor.CombatController.RootActor.ID
      );
      if (!self) {
        throw new Error('Owner combatant not found in encounter');
      }
      if (!this.selectedWeapon && this.presetWeapon) {
        this.selectedWeapon = this.presetWeapon;
      }

      if (!this.selectedWeapon)
        return;

      if (this.selectedWeapon)
        this.event = new WeaponAttackEvent(this.selectedWeapon as PilotWeapon, self, this.encounter, 'Skirmish');
    },
    apply() {
      const actor = this.owner.actor.CombatController.ActiveActor.CombatController;
      actor.MarkActionUsed(this.selectedWeapon!.InstanceID);

      const action = this.selectedWeapon?.IsSidearm ? 'quick' : 'full'
      if (actor.CanActivate(action)) {
        actor.toggleCombatAction(action);
      }
      this.reset();
    },
    onWeaponChanged(weapon: PilotWeapon) {
      this.selectedWeapon = weapon;
      this.reset();
    },
  },
};
</script>