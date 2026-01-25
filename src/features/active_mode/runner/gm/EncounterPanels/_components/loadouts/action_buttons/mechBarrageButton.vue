<template>
  <cc-dialog :color="available ? action.Color : 'panel'"
    :icon="action.Icon"
    :title="action.Name"
    :close-on-click="false"
    min-width="70vw"
    max-width="80vw">
    <template #activator="{ open }">
      <v-btn block
        flat
        tile
        size="small"
        :color="available ? action.Color : 'panel'"
        @click="open">
        <span class="ml-1">
          <v-icon v-bind="props"
            :icon="action.Icon"
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
                <v-chip :color="action.Color"
                  size="small"
                  variant="elevated"
                  :prepend-icon="action.Icon || ''">
                  {{ action.Activation }}
                </v-chip>
                actions remaining this turn.
              </div>
            </div>
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
      <mech-mount-bonus-card v-if="selectedMount"
        v-for="b in selectedMount.Bonuses"
        :key="b.ID"
        expanded
        :bonus="b"
        :mech="controller.Parent"
        :encounter="encounter" />

      <mech-weapon-attack ref="attackInternal0"
        :controller="controller"
        :encounter="encounter"
        :preset-weapon="presetWeapon"
        :prevent-select="selectedWeapon1"
        @weapon-changed="selectedWeapon0 = $event"
        @damage-staged="finalDamageArray0 = $event" />
      <mech-weapon-attack ref="attackInternal1"
        v-if="!superheavySelected"
        :controller="controller"
        :encounter="encounter"
        :prevent-select="selectedWeapon0"
        is-barrage-additional
        @weapon-changed="selectedWeapon1 = $event"
        @damage-staged="finalDamageArray1 = $event" />
      <v-divider class="my-4" />
      <menu-input hide-input
        :key="controller.ID"
        :active-effect="action"
        :encounter="encounter"
        :owner="controller.Parent"
        :close="close"
        @apply="apply(close)"
        @reset="reset"
        @stage="stage" />
    </template>
  </cc-dialog>
</template>

<script>
import { CompendiumStore } from '@/stores';
import MenuInput from '@/ui/components/chips/_activeeffect/_ae_menu_input.vue';
import MechWeaponAttack from './_mechWeaponAttack.vue';
import { WeaponSize } from '@/class';

export default {
  name: 'MechBarrageButton',
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
    presetWeapon: {
      type: Object,
      required: false,
    },
  },
  components: {
    MenuInput,
    MechWeaponAttack,
  },
  data: () => ({
    selectedWeapon0: null,
    selectedWeapon1: null,
    finalDamageArray0: [],
    finalDamageArray1: [],
  }),

  watch: {
    presetWeapon: {
      immediate: true,
      handler(newVal) {
        if (newVal) {
          this.selectedWeapon = newVal;
        }
      },
    },
  },
  computed: {
    ordnanceWarning() {
      if (!this.selectedWeapon0 && !this.selectedWeapon1) return false;
      if (this.selectedWeapon.ActiveTags.find((t) => t.ID.toLowerCase() === 'tg_ordnance') || this.selectedWeapon1.ActiveTags.find((t) => t.ID.toLowerCase() === 'tg_ordnance')) {
        return this.controller.CanActivate('ordnance') === false;
      }
      return false;
    },
    canActivate() {
      return this.controller.CanActivate(this.action.Activation) && !this.selectedWeapon?.Used && !this.selectedWeapon1?.Used;
    },
    canUse() {
      return !this.controller.IsActionUsed(this.actionId) && (!this.presetWeapon || !this.presetWeapon.Used) && (!this.presetWeapon1 || !this.presetWeapon1.Used);
    },
    available() {
      return this.canActivate && this.canUse;
    },
    superheavySelected() {
      if (!this.selectedWeapon0 && !this.presetWeapon) return false;
      return (this.selectedWeapon0 && this.selectedWeapon0.Size === WeaponSize.Superheavy) || (this.presetWeapon && this.presetWeapon.Size === WeaponSize.Superheavy);
    }
  },
  emits: ['activate'],
  methods: {
    stage() {
      if (this.$refs.attackInternal0) {
        this.$refs.attackInternal0.stage();
      } if (this.$refs.attackInternal1) {
        this.$refs.attackInternal1.stage();
      }
    },
    apply(close) {
      this.controller.toggleCombatAction(this.action.Activation);

      this.finalDamageArray0.concat(this.finalDamageArray1).forEach(dmg => {
        const actor = this.encounter.Combatants.find(c => c.actor.CombatController.ActiveActor.ID === dmg.targetId)?.actor;
        if (actor) {
          actor.CombatController.ApplyDamage(dmg.damageType, dmg.damageValue);
        }

      });

      this.$emit('activate', this.actionId);
      if (this.selectedWeapon0) this.selectedWeapon0.Use()
      if (this.selectedWeapon1) this.selectedWeapon1.Use()
      close;
    },
    reset() {
      this.controller.ResetActivation(this.action.Activation);
    },
  },
};
</script>
