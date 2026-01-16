<template>
  <v-row dense
    align="center">
    <v-col>
      <div class="text-cc-overline text-disabled">{{ effect.Type }}</div>
      <v-text-field v-if="['overshield', 'hp', 'repair'].includes(effect.Type)"
        v-model="selectedValue"
        type="number"
        density="compact"
        hide-details
        variant="outlined"
        flat
        tile />
      <v-select v-if="effect.Type === 'cover'"
        v-model="selectedValue"
        :items="cover"
        density="compact"
        hide-details
        variant="outlined"
        flat
        tile />
    </v-col>

    <BaseTargetSelector :selected-targets="selectedTargets"
      :targets="targets"
      :aoe="aoe"
      @toggle-aoe="toggleAoe"
      @add-target="addTarget"
      @remove-target="cancelTarget" />
  </v-row>
</template>

<script>
import BaseTargetSelector from './_shared/BaseTargetSelector.vue';
import { useActiveEffectBase } from './_shared/baseEffectInput.js';
import { createSummaryText } from './_shared/_effectUtils.js';

const baseEffect = useActiveEffectBase();

export default {
  name: 'ae-other-input',
  components: {
    BaseTargetSelector,
  },
  props: {
    targets: { type: Array, default: () => [] },
    effect: { type: Object, required: true },
    owner: { type: Object, required: true },
    self: { type: Boolean },
  },
  data() {
    return {
      ...baseEffect.data(),
      selectedValue: 0,
      cover: [
        {
          title: 'Soft Cover',
          value: 'soft',
        },
        {
          title: 'Hard Cover',
          value: 'hard',
        },
        {
          title: 'No Cover',
          value: 'none',
        },
      ],
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
  computed: {
    ...baseEffect.computed,
    isReady() {
      return (
        this.selectedValue != null &&
        this.selectedValue !== '' &&
        this.selectedTargets.every((t) => t != null)
      );
    },
  },
  methods: {
    ...baseEffect.methods,

    getAoeValue() {
      return this.effect.AoE;
    },

    resetCustomFields() {
      let val = this.effect.Value;
      if (!Array.isArray(val)) val = [val];
      this.selectedValue = val[this.owner.CombatController.Tier - 1] || 0;
    },

    createTargetSummary(target, idx) {
      const details = `${this.selectedValue} ${this.effect.Type} to`;
      return createSummaryText('Apply', target, details);
    },

    applyToTarget(target, idx) {
      if (this.effect.Type === 'cover') {
        target.actor.CombatController.Cover = this.selectedValue;
      } else {
        target.actor.CombatController.AddStatVal(this.effect.Type, this.selectedValue);
      }
    },

    getData() {
      return {
        ...baseEffect.methods.getData.call(this),
        Effect: this.effect,
        Value: this.selectedValue,
      };
    },
  },
};
</script>
