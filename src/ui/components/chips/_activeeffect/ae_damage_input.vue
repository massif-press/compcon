<template>
  <v-row class="px-2 py-1">
    <DamageTypeSelector :selected-damage-type="selectedDamageType"
      :selected-damage-value="selectedDamageValue"
      :damage-placeholder="damagePlaceholder"
      :armor-piercing="damage.AP"
      :reliable="damage.Reliable"
      @update:damage-type="selectedDamageType = $event"
      @update:damage-value="selectedDamageValue = $event"
      @roll-damage="$emit('damage-rolled', $event)"
      @toggle-ap="damage.AP = !damage.AP"
      @toggle-irreducible="damage.Irreducible = !damage.Irreducible" />

    <v-col>
      <v-row dense
        align="start">
        <base-target-selector :selected-targets="selectedTargets"
          :targets="targets"
          :aoe="aoe"
          @toggle-aoe="toggleAoe"
          @add-target="addTarget"
          @remove-target="cancelTarget" />

        <base-save-roller v-if="damage.Save"
          :selected-targets="selectedTargets"
          :target-saves="targetSaves"
          :save-data="damage.Save"
          :owner="owner"
          @update:target-saves="targetSaves = $event" />

        <base-attack-roller v-if="damage.Attack"
          :selected-targets="selectedTargets"
          :attack-rolls="attackRolls"
          :attack="damage.Attack"
          :base-accuracy="damage.Accuracy"
          :owner="owner"
          @update:target-attacks="attackRolls = $event"
          @update:target-hits="hitMiss = $event" />

        <save-half-toggle v-if="damage.Save"
          :save-half="damage.SaveHalf"
          :has-save="!!damage.Save"
          @update:save-half="damage.SaveHalf = $event" />
      </v-row>
    </v-col>
  </v-row>
</template>

<script>
import BaseTargetSelector from './_shared/BaseTargetSelector.vue';
import BaseSaveRoller from './_shared/BaseSaveRoller.vue';
import DamageTypeSelector from './_shared/DamageTypeSelector.vue';
import SaveHalfToggle from './_shared/SaveHalfToggle.vue';
import { DiceRoller } from '@/classes/dice/DiceRoller';
import BaseAttackRoller from './_shared/BaseAttackRoller.vue';

export default {
  name: 'ae-damage-input',
  components: {
    BaseTargetSelector,
    BaseSaveRoller,
    DamageTypeSelector,
    SaveHalfToggle,
    BaseAttackRoller,
  },
  props: {
    targets: { type: Array, default: () => [] },
    damage: { type: Object, required: true },
    owner: { type: Object, required: true },
    self: { type: Boolean },
  },
  data: () => ({
    selectedTargets: [],
    targetSaves: [],
    attackRolls: [],
    attackDamage: [],
    hitMiss: [],
    aoe: null,
    selectedDamageType: 'kinetic',
    selectedDamageValue: null,
    damagePlaceholder: '',
  }),
  mounted() {
    this.reset();
    this.$emit('ready-changed', this.ready);
  },
  emits: [
    'update:modelValue',
    'update:targets',
    'update:target-attacks',
    'update:target-damage',
    'damage-rolled',
    'attack-rolled',
    'ready-changed',
  ],
  watch: {
    ready: {
      immediate: true,
      handler(newVal) {
        this.$emit('ready-changed', newVal);
      }
    },
    selectedTargets: {
      immediate: true,
      deep: true,
      handler(newVal) {
        this.targetSaves = new Array(newVal.length).fill(null);
        this.attackRolls = new Array(newVal.length).fill(null);
        this.attackDamage = new Array(newVal.length).fill(null);
        this.$emit('update:targets', this.selectedTargets);
      },
    },
    hitMiss: {
      immediate: true,
      deep: true,
      handler(newval) {
        this.$emit('attack-rolled', newval);
      },
    },
  },
  computed: {
    ready() {
      return (
        this.selectedTargets.every((t) => t != null) &&
        (!this.damage.Save || this.targetSaves.every((s) => s != null && s > 0)) &&
        (!this.damage.Attack || this.attackRolls.every((a) => a != null))
      );
    },
  },
  methods: {
    reset() {
      this.selectedTargets = [null];
      if (this.self) this.selectedTargets = [this.targets[0]];
      this.targetSaves = [null];
      this.attackRolls = [null];
      this.aoe = this.damage.AoE || false;
      this.selectedDamageType = this.damage.Type || 'kinetic';
      if (!this.damage.IsRollable) {
        const tier = this.owner.CombatController.Tier;
        this.selectedDamageValue = this.damage.TieredDamage(tier);
      } else {
        this.damagePlaceholder = this.damage.Value;
      }
    },
    toggleAoe() {
      if (this.aoe) {
        this.aoe = false;
      } else {
        this.aoe = this.damage.AoE || true;
      }
      if (!this.aoe) {
        this.selectedTargets = [this.selectedTargets[0]];
        this.targetSaves = [this.targetSaves[0]];
        this.attackRolls = [this.attackRolls[0]];
      }
    },
    addTarget() {
      this.selectedTargets.push(null);
      this.targetSaves.push(null);
    },
    cancelTarget(idx) {
      if (idx === 0 && this.selectedTargets.length === 1) {
        this.selectedTargets = [null];
        this.targetSaves = [null];
        this.attackRolls = [null];
        return;
      }
      this.selectedTargets.splice(idx, 1);
      this.targetSaves.splice(idx, 1);
      this.attackRolls.splice(idx, 1);
    },
    getSummary() {
      let out = [];
      this.selectedTargets.forEach((t, idx) => {
        if (!t || !t.actor || !t.actor.CombatController) return;
        let part = `Deal ${this.selectedDamageValue} ${this.selectedDamageType
          } damage to ${t.actor.CombatController.Name}`;
        if (this.damage.AP) part += ' (ignores armor)';
        if (this.damage.Save) {
          if (this.targetSaves[idx] != null) {
            if (this.targetSaves[idx] >= this.owner.CombatController.SaveTarget) {
              part += ` [SAVED]`;
              if (this.damage.SaveHalf) part += ' (half damage)';
              else {
                part = part.replace('Deal', 'Failed to deal');
              }
            } else {
              part += ` [FAILED SAVE]`;
            }
          }
        }
        if (this.damage.Attack) {
          if (this.attackRolls[idx] != null) {
            if (
              this.attackRolls[idx] >=
              (this.damage.Attack === 'tech'
                ? t.actor.CombatController.StatController.MaxStats['edef'] || 8
                : t.actor.CombatController.StatController.MaxStats['evasion'] || 5)
            ) {
              part += ` [HIT]`;
            } else {
              part += ` [MISS]`;
            }
          }
        }
        out.push(part);
      });
      if (out.length === 0) return '';
      return out.join('; ');
    },
    apply() {
      this.selectedTargets.forEach((t, idx) => {
        if (!t || !t.actor || !t.actor.CombatController) return;
        if (this.targetSaves[idx] != null && this.damage.Save) {
          if (this.targetSaves[idx] >= this.owner.CombatController.SaveTarget) return;
        }
        if (this.attackRolls[idx] != null && this.damage.Attack) {
          if (this.attackRolls[idx] < t.actor.CombatController.Evasion) return;
        }
        t.actor.CombatController.TakeDamage(
          this.selectedDamageType,
          this.selectedDamageValue,
          this.damage.AP
        );
      });
    },
    getData() {
      return {
        damage: {
          Type: this.selectedDamageType,
          Value: this.selectedDamageValue,
          AP: this.damage.AP,
          Save: this.damage.Save ? { ...this.damage.Save } : null,
          AoE: this.aoe,
          Duration: this.damage.Duration,
        },
        targets: this.selectedTargets.map((t, idx) => ({
          target: t,
          save: this.damage.Save ? this.targetSaves[idx] : null,
          attack: this.damage.Attack ? this.attackRolls[idx] : null,
        })),
      };
    },
  },
};
</script>
