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
import { useActiveEffectBase } from './_shared/baseEffectInput.js';
import { createSummaryText } from './_shared/_effectUtils.js';

const baseEffect = useActiveEffectBase();

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
    self: { type: Boolean },
  },
  data() {
    return {
      ...baseEffect.data(),
      selectedResist: null,
      selectedResistType: null,
    };
  },
  mounted: baseEffect.mounted,
  computed: {
    ...baseEffect.computed,
  },
  methods: {
    ...baseEffect.methods,

    getAoeValue() {
      return this.resist.AoE;
    },

    getSaveData() {
      return this.resist.Save;
    },

    resetCustomFields() {
      this.selectedResist = this.resist.Resist || 'kinetic';
      this.selectedResistType = this.resist.Resistance || 'Resistance';
    },

    createTargetSummary(target, idx) {
      const details = `${this.selectedResist} ${this.selectedResistType} to`;
      const saveInfo = this.resist.Save
        ? {
            saveResult: this.targetSaves[idx],
            saveTarget: this.owner.CombatController.SaveTarget,
          }
        : null;

      return createSummaryText('Apply', target, details, saveInfo);
    },

    applyToTarget(target, idx) {
      target.actor.CombatController.SetResistance(this.selectedResist, this.selectedResistType);
    },

    getData() {
      return {
        ...baseEffect.methods.getData.call(this),
        Resist: this.selectedResist,
        Resistance: this.selectedResistType,
      };
    },
  },
};
</script>
