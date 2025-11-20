<template>
  <v-row class="px-2 py-1">
    <DamageTypeSelector
      :selected-damage-type="selectedDamageType"
      :selected-damage-value="selectedDamageValue"
      :damage-placeholder="damagePlaceholder"
      :armor-piercing="damage.AP"
      @update:damage-type="selectedDamageType = $event"
      @update:damage-value="selectedDamageValue = $event"
      @roll-damage="rollDamage"
      @toggle-ap="damage.AP = !damage.AP" />

    <v-col>
      <v-row dense align="start">
        <BaseTargetSelector
          :selected-targets="selectedTargets"
          :targets="targets"
          :aoe="aoe"
          @toggle-aoe="toggleAoe"
          @add-target="addTarget"
          @remove-target="cancelTarget" />

        <BaseSaveRoller
          v-if="damage.Save"
          :selected-targets="selectedTargets"
          :target-saves="targetSaves"
          :save-data="damage.Save"
          :owner="owner"
          @update:target-saves="targetSaves = $event" />

        <SaveHalfToggle
          v-if="damage.Save"
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

export default {
  name: 'ae-damage-input',
  components: {
    BaseTargetSelector,
    BaseSaveRoller,
    DamageTypeSelector,
    SaveHalfToggle,
  },
  props: {
    targets: { type: Array, default: () => [] },
    damage: { type: Object, required: true },
    owner: { type: Object, required: true },
  },
  data: () => ({
    selectedTargets: [],
    targetSaves: [],
    aoe: null,
    selectedDamageType: 'kinetic',
    selectedDamageValue: 0,
    damagePlaceholder: '',
  }),
  mounted() {
    this.reset();
  },
  emits: ['update:modelValue', 'update:targets'],
  computed: {
    isReady() {
      return (
        this.selectedTargets.every((t) => t != null) &&
        (!this.damage.Save || this.targetSaves.every((s) => s != null && s > 0))
      );
    },
  },
  methods: {
    reset() {
      this.selectedTargets = [null];
      this.targetSaves = [null];
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
        return;
      }
      this.selectedTargets.splice(idx, 1);
      this.targetSaves.splice(idx, 1);
    },
    rollDamage() {
      // Implement damage rolling logic here
      console.log('Rolling damage:', this.damagePlaceholder);
    },
    getSummary() {
      let out = [];
      this.selectedTargets.forEach((t, idx) => {
        let part = `Deal ${this.selectedDamageValue} ${
          this.selectedDamageType
        } damage to ${t.actor.CombatController.Name}`;
        if (this.damage.AP) part += ' (ignores armor)';
        if (this.damage.Save) {
          if (this.targetSaves[idx] != null) {
            if (this.targetSaves[idx] >= this.owner.CombatController.SaveTarget) {
              part += ` [SAVED]`;
              if (this.damage.SaveHalf) part += ' (half damage)';
            } else {
              part += ` [FAILED SAVE]`;
            }
          }
        }
        out.push(part);
      });
      return out.join('; ');
    },
    apply() {
      this.selectedTargets.forEach((t, idx) => {
        if (this.targetSaves[idx] != null && this.damage.Save) {
          if (this.targetSaves[idx] >= this.owner.CombatController.SaveTarget) return;
        }
        t.actor.CombatController.ApplyDamage(
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
        })),
      };
    },
  },
};
</script>
