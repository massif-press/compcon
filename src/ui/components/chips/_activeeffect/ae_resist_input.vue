<template>
  <v-row class="px-2 py-1">
    <ResistanceTypeSelector
      :selected-resist="selectedResist"
      :selected-resist-type="selectedResistType"
      @update:resist-type="selectedResist = $event"
      @update:resistance-type="selectedResistType = $event" />

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
          v-if="resist.Save"
          :selected-targets="selectedTargets"
          :target-saves="targetSaves"
          :save-data="resist.Save"
          :owner="owner"
          @update:target-saves="targetSaves = $event" />
      </v-row>
    </v-col>
  </v-row>
  <BaseDurationDisplay :duration="resist.Duration" />
</template>

<script>
import BaseTargetSelector from './_shared/BaseTargetSelector.vue';
import BaseSaveRoller from './_shared/BaseSaveRoller.vue';
import BaseDurationDisplay from './_shared/BaseDurationDisplay.vue';
import ResistanceTypeSelector from './_shared/ResistanceTypeSelector.vue';

export default {
  name: 'ae-resist-input',
  components: {
    BaseTargetSelector,
    BaseSaveRoller,
    BaseDurationDisplay,
    ResistanceTypeSelector,
  },
  props: {
    targets: { type: Array, default: () => [] },
    resist: { type: Object, required: true },
    owner: { type: Object, required: true },
  },
  data: () => ({
    selectedTargets: [],
    targetSaves: [],
    aoe: null,
    selectedResist: null,
    selectedResistType: null,
  }),
  mounted() {
    this.reset();
  },
  emits: ['update:modelValue', 'update:targets'],
  computed: {
    isReady() {
      return (
        this.selectedTargets.every((t) => t != null) &&
        (!this.resist.Save || this.targetSaves.every((s) => s != null && s > 0))
      );
    },
  },
  methods: {
    reset() {
      this.selectedTargets = [null];
      this.targetSaves = [null];
      this.aoe = this.resist.AoE || false;
      this.selectedResist = this.resist.Resist || 'kinetic';
      this.selectedResistType = this.resist.Resistance || 'Resistance';
    },
    toggleAoe() {
      if (this.aoe) {
        this.aoe = false;
      } else {
        this.aoe = this.resist.AoE || true;
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
    getSummary() {
      let out = [];
      this.selectedTargets.forEach((t, idx) => {
        let part = `Apply ${this.selectedResist} ${this.selectedResistType} to ${t ? t.actor.Name : 'Unknown Target'}`;
        if (this.resist.Save) {
          if (this.targetSaves[idx] != null) {
            if (this.targetSaves[idx] >= this.owner.CombatController.SaveTarget) {
              part += ` [SAVED]`;
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
        if (this.targetSaves[idx] != null && this.resist.Save) {
          if (this.targetSaves[idx] >= this.owner.CombatController.SaveTarget) return;
        }
        t.actor.CombatController.SetResistance(this.selectedResist, this.selectedResistType);
      });
    },
    getData() {
      return {
        Resist: this.selectedResist,
        Resistance: this.selectedResistType,
        AoE: this.aoe,
        Targets: this.selectedTargets.map((t) => (t ? t.actor.Id : null)),
        Saves: this.resist.Save ? this.targetSaves.map((s) => (s != null ? s : 0)) : null,
      };
    },
  },
};
</script>
