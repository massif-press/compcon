<template>
  <v-row dense align="center">
    <v-col>
      <div class="text-cc-overline text-disabled">save</div>
      <v-select
        v-model="model"
        :items="saveStats"
        density="compact"
        hide-details
        variant="outlined"
        flat
        tile />
    </v-col>

    <BaseTargetSelector
      :selected-targets="selectedTargets"
      :targets="targets"
      :aoe="save.AoE"
      :multiple="!!save.AoE"
      @add-target="addTarget"
      @remove-target="removeTarget"
      @update:selected-targets="selectedTargets = $event" />
  </v-row>
</template>

<script>
import BaseTargetSelector from './_shared/BaseTargetSelector.vue';

export default {
  name: 'ae-save-input',
  components: {
    BaseTargetSelector,
  },
  props: {
    modelValue: { type: String, default: '' },
    save: { type: Object, required: true },
    targets: { type: Array, default: () => [] },
  },
  data: () => ({
    selectedTargets: [],
    saveStats: [
      { title: 'Hull', value: 'hull' },
      { title: 'Agility', value: 'agility' },
      { title: 'Systems', value: 'systems' },
      { title: 'Engineering', value: 'engineering' },
    ],
  }),
  emits: ['update:modelValue'],
  computed: {
    model: {
      get() {
        return this.modelValue;
      },
      set(val) {
        this.$emit('update:modelValue', val);
      },
    },
    isReady() {
      return this.model != null && this.model !== '' && this.selectedTargets.length > 0;
    },
  },
  methods: {
    addTarget() {
      this.selectedTargets.push(null);
    },
    removeTarget(idx) {
      if (idx === 0 && this.selectedTargets.length === 1) {
        this.selectedTargets = [null];
        return;
      }
      this.selectedTargets.splice(idx, 1);
    },
    getData() {
      return {
        Save: this.save,
        Roll: this.model,
        Targets: this.selectedTargets.map((t) => (t ? t.id : null)).filter((id) => id !== null),
      };
    },
  },
};
</script>
