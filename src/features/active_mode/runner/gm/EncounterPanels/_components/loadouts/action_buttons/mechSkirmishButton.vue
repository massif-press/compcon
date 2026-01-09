<template>
  <cc-dialog
    :color="available ? action.Color : 'panel'"
    :icon="action.Icon"
    :title="action.Name"
    :close-on-click="false"
    min-width="70vw"
    max-width="80vw">
    <template #activator="{ open }">
      <v-btn block flat tile size="small" :color="available ? action.Color : 'panel'" @click="open">
        <span class="ml-1">
          <v-icon v-bind="props" :icon="action.Icon" :color="available ? '' : 'error'" start />
          <v-tooltip v-if="!available" location="top">
            <template #activator="{ props }">
              <v-icon v-bind="props" icon="mdi-exclamation-thick" color="error" class="ml-n2" />
            </template>
            <div class="text-center text-cc-overline">Cannot activate</div>
            <v-divider class="my-1" />
            <div v-if="!canActivate">
              Insufficient
              <v-chip
                :color="action.Color"
                size="small"
                variant="elevated"
                :prepend-icon="action.Icon || ''">
                {{ action.Activation }}
              </v-chip>
              actions remaining this turn.
            </div>
            <div v-else-if="!canUse">This action has already been used this turn.</div>
          </v-tooltip>
        </span>
        <v-tooltip location="top" width="300">
          <template #activator="{ props }">
            <span v-bind="props">
              {{ action.Name }}
            </span>
          </template>
          <div class="d-flex">
            <div class="heading h4 d-flex">{{ action.Name }}</div>
            <v-spacer />
            <v-chip
              size="x-small"
              :color="action.Color"
              :prepend-icon="action.Icon"
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
      <v-card flat tile class="px-12">
        <div class="text-cc-overline text-disabled">select weapon</div>
        <v-row dense align="center">
          <v-col>
            <cc-select
              v-model="selectedWeapon"
              :items="skirmishWeapons"
              return-object
              item-title="Name" />
          </v-col>
          <v-col v-if="selectedWeapon" cols="auto">
            <v-menu :open-on-hover="!mobile" :open-on-click="mobile" max-width="600px">
              <template #activator="{ props }">
                <v-icon icon="mdi-information-outline" v-bind="props" />
              </template>

              <v-card class="pt-2 pb-4 px-4">
                <cc-item-card :item="selectedWeapon" />
              </v-card>
            </v-menu>
          </v-col>
          <v-col v-if="selectedWeapon" cols="auto">
            <cc-tags :tags="selectedWeapon.ActiveTags" />
          </v-col>
          <v-col v-if="selectedWeapon && selectedWeapon.Mod" cols="auto">
            <cc-tags :tags="selectedWeapon.Mod.AddedTags" color="mod" />
          </v-col>
        </v-row>
        <mech-weapon-attack
          v-if="selectedWeapon"
          :controller="controller"
          :targets="getTargetsSorted('enemy')"
          :selected-weapon="selectedWeapon" />

        <div v-if="selectedMount && selectedWeaponAuxes.length" class="mt-4">
          <v-divider class="my-4" />
          <div class="text-cc-overline text-disabled mb-1">
            additional {{ selectedMount.Name }} aux weapons
          </div>
          <div v-for="(aux, aidx) in selectedWeaponAuxes">
            <v-row dense align="center" class="bg-panel">
              <v-col class="pl-6">
                {{ aux.Name }}
              </v-col>
              <v-col cols="auto">
                <cc-tags :tags="aux.Tags" />
              </v-col>
              <v-col v-if="aux.Mod" cols="auto">
                <cc-tags :tags="aux.Mod.AddedTags" color="mod" />
              </v-col>
              <v-col cols="auto">
                <cc-switch v-model="include[aidx]" bg-color="background" :label="`Include`" />
              </v-col>
            </v-row>
            <v-slide-y-reverse-transition v-if="aux">
              <mech-weapon-attack
                v-if="include[aidx]"
                :controller="controller"
                :targets="getTargetsSorted('enemy')"
                :selected-weapon="aux"
                is-additional-aux />
            </v-slide-y-reverse-transition>
          </div>
        </div>
      </v-card>
      <v-divider class="my-4" />
      <menu-input
        hide-input
        :key="controller.ID"
        :active-effect="action"
        :encounter="encounter"
        :owner="controller.Parent"
        :close="close"
        @apply="apply"
        @reset="reset" />
    </template>
  </cc-dialog>
</template>

<script>
import { CompendiumStore } from '@/stores';
import MenuInput from '@/ui/components/chips/_activeeffect/_ae_menu_input.vue';
import MechWeaponAttack from './_mechWeaponAttack.vue';

export default {
  name: 'MechSkirmishButton',
  props: {
    action: {
      type: Object,
      required: true,
    },
    controller: {
      type: Object,
      required: true,
    },
    encounter: {
      type: Object,
      required: true,
    },
  },
  components: {
    MenuInput,
    MechWeaponAttack,
  },
  data: () => ({
    selectedWeapon: null,
    include: [],
    otherSelections: [],
  }),
  watch: {
    selectedWeapon: {
      immediate: true,
      handler(newVal) {
        if (newVal) {
          this.include = new Array(
            this.selectedWeaponAuxes ? this.selectedWeaponAuxes.length : 0
          ).fill(true);
        } else {
          this.include = [];
        }
      },
    },
  },
  computed: {
    ordnanceWarning() {
      if (!this.selectedWeapon) return false;
      if (this.selectedWeapon.ActiveTags.find((t) => t.ID.toLowerCase() === 'tg_ordnance')) {
        return this.controller.CanActivate('ordnance') === false;
      }
      return false;
    },
    skirmishWeapons() {
      return this.controller.Parent.MechLoadoutController.ActiveLoadout.Weapons.filter(
        (x) => x.Size.toLowerCase() !== 'superheavy' && x.Skirmish
      );
    },
    selectedMount() {
      if (!this.selectedWeapon) return null;
      return this.controller.Parent.MechLoadoutController.getMount(this.selectedWeapon);
    },
    selectedWeaponAuxes() {
      if (!this.selectedMount) return [];
      return this.selectedMount.Weapons.filter(
        (x) =>
          x.InstanceID !== this.selectedWeapon.InstanceID && x.Size.toLowerCase() === 'auxiliary'
      );
    },
    canActivate() {
      return this.controller.CanActivate(this.action.Activation);
    },
    canUse() {
      // TODO: return action available and selected weapons used
      return true;
      // return !this.controller.IsActionUsed(this.actionId);
    },
    available() {
      return this.canActivate && this.canUse;
    },
  },
  emits: ['activate'],
  methods: {
    getTargetsSorted(target) {
      let out = [];
      const self = this.encounter.Combatants.find(
        (c) => c.actor.CombatController.ActiveActor.ID === this.controller.ActiveActor.ID
      );

      if (!self) return out;

      if (self.side === 'enemy' && target === 'enemy') target = 'ally';
      else if (self.side === 'enemy' && target === 'ally') target = 'enemy';

      out = [...this.encounter.Combatants].sort((a, b) => {
        if (target === 'self') {
          if (a.actor.CombatController.ActiveActor.ID === this.controller.ActiveActor.ID) return -1;
          if (b.actor.CombatController.ActiveActor.ID === this.controller.ActiveActor.ID) return 1;
        }
        if (a.side === target && b.side !== target) {
          return -1;
        } else if (a.side !== target && b.side === target) {
          return 1;
        } else {
          return a.actor.CombatController.Name.localeCompare(b.actor.CombatController.Name);
        }
      });
      return out;
    },
    getDamageEffect(damage, index) {
      damage.Owner = this.controller.Parent;
      damage.Attack = this.selectedWeapon.GetAttack(index);
      damage.Reliable = this.selectedWeapon.Reliable;
      damage.Accuracy = this.selectedWeapon.Accuracy;
      return damage;
    },
    clearableConditions(target) {
      if (!target) return [];
      return target.CombatController.Statuses.filter(
        (s) => s.status.StatusType.toLowerCase() === 'condition'
      );
    },
    apply(close) {
      this.controller.toggleCombatAction(this.action.Activation);

      this.$emit('activate', this.actionId);
    },
    reset() {
      this.controller.ResetActivation(this.action.Activation);
    },
  },
};
</script>
