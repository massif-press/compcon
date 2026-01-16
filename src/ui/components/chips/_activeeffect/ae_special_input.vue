<template>
  <v-row dense
    class="px-2 py-1">
    <v-col cols="3">
      <div class="text-cc-overline text-disabled">special condition</div>
      <v-tooltip location="top"
        :text="status.Description"
        max-width="400px">
        <template #activator="{ props }">
          <v-card v-bind="props"
            flat
            border="sm"
            color="exotic"
            class="text-center heading h3 rounded-lg mt-1">
            {{ status.Attribute }}
          </v-card>
        </template>
        <div class="text-center pa-1">
          {{ status.Detail }}
        </div>
      </v-tooltip>
      <BaseDurationDisplay v-if="status.Duration"
        :duration="status.Duration" />
    </v-col>

    <v-col>
      <v-row dense
        align="start">
        <BaseTargetSelector :selected-targets="selectedTargets"
          :targets="targets"
          :aoe="aoe"
          @toggle-aoe="toggleAoe"
          @add-target="addTarget"
          @remove-target="cancelTarget" />

        <base-attack-roller v-if="status.Attack"
          :selected-targets="selectedTargets"
          :attack-rolls="attackRolls"
          :attack="status.Attack"
          :owner="owner"
          @update:target-attacks="attackRolls = $event" />

        <BaseSaveRoller v-if="status.Save"
          :selected-targets="selectedTargets"
          :target-saves="targetSaves"
          :save-data="status.Save"
          :owner="owner"
          @update:target-saves="targetSaves = $event" />
      </v-row>
    </v-col>
  </v-row>
</template>

<script>
import BaseTargetSelector from './_shared/BaseTargetSelector.vue';
import BaseSaveRoller from './_shared/BaseSaveRoller.vue';
import BaseDurationDisplay from './_shared/BaseDurationDisplay.vue';
import { useActiveEffectBase } from './_shared/baseEffectInput.js';
import { createSummaryText } from './_shared/_effectUtils.js';

const baseEffect = useActiveEffectBase();

export default {
  name: 'ae-special-input',
  components: {
    BaseTargetSelector,
    BaseSaveRoller,
    BaseDurationDisplay,
  },
  props: {
    targets: { type: Array, default: () => [] },
    status: { type: Object, required: true },
    owner: { type: Object, required: true },
    encounter: { type: Object, required: true },
    self: { type: Boolean },
  },
  data() {
    return {
      ...baseEffect.data(),
    };
  },
  mounted() {
    baseEffect.mounted.call(this);
    this.$emit('ready-changed', this.isReady);
  },
  emits: ['ready-changed'],
  watch: {
    isReady: {
      immediate: true,
      handler(newVal) {
        this.$emit('ready-changed', newVal);
      }
    }
  },
  emits: ['update:modelValue', 'update:targets'],
  computed: {
    ...baseEffect.computed,
  },
  methods: {
    ...baseEffect.methods,

    getAoeValue() {
      return this.status.AoE;
    },

    getSaveData() {
      return this.status.Save;
    },

    createTargetSummary(target, idx) {
      const details = `${this.status.Attribute} to`;
      const saveInfo = this.status.Save
        ? {
          saveResult: this.targetSaves[idx],
          saveTarget: this.owner.CombatController.SaveTarget,
        }
        : null;

      return createSummaryText('Apply', target, details, saveInfo);
    },

    applyToTarget(target, idx) {
      target.actor.CombatController.ApplyCustomStatus(
        this.status,
        this.status.Duration || '',
        this.owner.CombatController,
        target.actor.CombatController,
        this.encounter
      );
    },

    getData() {
      return {
        ...baseEffect.methods.getData.call(this),
        Status: this.selectedStatus,
      };
    },
  },
};
</script>
