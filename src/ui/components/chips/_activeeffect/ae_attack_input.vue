<template>
  <v-row class="px-2 py-1">
    <BaseTargetSelector :selected-targets="selectedTargets"
      :targets="targets"
      :aoe="aoe"
      @toggle-aoe="toggleAoe"
      @add-target="addTarget"
      @remove-target="cancelTarget" />

    <base-attack-roller :selected-targets="selectedTargets"
      :attack-rolls="attackRolls"
      :attack="attack"
      :owner="owner"
      @update:target-attacks="attackRolls = $event" />
  </v-row>
</template>

<script>
import BaseAttackRoller from './_shared/BaseAttackRoller.vue';
import BaseTargetSelector from './_shared/BaseTargetSelector.vue';

export default {
  name: 'ae-attack-input',
  components: {
    BaseTargetSelector,
    BaseAttackRoller,
  },
  props: {
    targets: { type: Array, default: () => [] },
    attack: { type: String, required: true },
    owner: { type: Object, required: true },
    self: { type: Boolean },
  },
  data: () => ({
    selectedTargets: [],
    attackRolls: [],
    aoe: false,
  }),
  mounted() {
    this.reset();
    this.$emit('ready-changed', this.isReady);
  },
  watch: {
    isReady: {
      immediate: true,
      handler(newVal) {
        this.$emit('ready-changed', newVal);
      }
    }
  },
  computed: {
    isReady() {
      return (
        this.selectedTargets.every((t) => t != null) && this.attackRolls.every((a) => a != null)
      );
    },
  },
  emits: ['update:modelValue', 'update:targets', 'update:target-attacks', 'ready-changed'],
  methods: {
    reset() {
      this.selectedTargets = new Array(1);
      this.attackRolls = new Array(1);
    },
    toggleAoe() {
      if (this.aoe) {
        this.aoe = false;
      } else {
        this.aoe = this.save.AoE || true;
      }
      if (!this.aoe) {
        this.selectedTargets = [this.selectedTargets[0]];
        this.attackRolls = [this.attackRolls[0]];
      }
    },
    addTarget() {
      this.selectedTargets.push(null);
      this.attackRolls.push(null);
    },
    cancelTarget(idx) {
      if (idx === 0 && this.selectedTargets.length === 1) {
        this.selectedTargets = [null];
        this.attackRolls = [null];
        return;
      }
      this.selectedTargets.splice(idx, 1);
      this.attackRolls.splice(idx, 1);
    },
    getSummary() {
      let out = [];
      this.selectedTargets.forEach((t, idx) => {
        if (!t || !t.actor || !t.actor.CombatController) return;
        let part = `Force ${this.selectedSaveStat} save for ${t.actor.CombatController.Name}`;
        if (this.attackRolls[idx] != null) {
          if (this.attackRolls[idx] >= this.owner.CombatController.SaveTarget) {
            part += ` [HIT]`;
          } else {
            part += ` [MISSED]`;
          }
        }
        out.push(part);
      });
      if (out.length === 0) return '';
      return out.join('; ');
    },
    apply() {
      this.selectedTargets.forEach((t, idx) => {
        if (t && t.actor && t.actor.CombatController) {
          if (this.attackRolls[idx] != null) {
            if (this.attackRolls[idx] >= this.owner.CombatController.SaveTarget) {
              t.actor.CombatController.SaveLock = true;
            }
          }
        }
      });
    },
    getData() {
      return {
        Save: this.save,
        Stat: this.selectedSaveStat,
        AoE: this.aoe,
        Targets: this.selectedTargets.map((t) => (t ? t.actor.Id : null)),
      };
    },
  },
};
</script>
