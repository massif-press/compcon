<template>
  <v-row dense
    class="px-2 py-1">
    <v-col cols="3">
      <div class="text-cc-overline text-disabled">remove special condition</div>
      <v-card v-bind="props"
        flat
        border="sm"
        color="exotic"
        class="text-center heading h3 rounded-lg mt-1">
        {{ status }}
      </v-card>
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
  },
  props: {
    targets: { type: Array, default: () => [] },
    status: { type: String, required: true },
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
      const details = `Remove ${this.status} from`;

      return createSummaryText('Apply', target, details);
    },

    applyToTarget(target, idx) {
      target.actor.CombatController.RemoveCustomStatus(this.status);
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
