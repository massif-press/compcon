<template>
  <v-row dense class="px-2 py-1">
    <v-col cols="3">
      <div class="text-cc-overline text-disabled">status</div>
      <v-select
        v-model="selectedStatus"
        :items="statusOptions"
        density="compact"
        hide-details
        variant="outlined"
        flat
        tile />
      <BaseDurationDisplay v-if="status.Duration" :duration="status.Duration" />
    </v-col>

    <v-row dense align="start">
      <BaseTargetSelector
        :selected-targets="selectedTargets"
        :targets="targets"
        :aoe="aoe"
        @toggle-aoe="toggleAoe"
        @add-target="addTarget"
        @remove-target="cancelTarget" />

      <BaseSaveRoller
        v-if="status.Save"
        :selected-targets="selectedTargets"
        :target-saves="targetSaves"
        :save-data="status.Save"
        :owner="owner"
        @update:target-saves="targetSaves = $event" />
    </v-row>
  </v-row>
</template>

<script>
import { CompendiumStore } from '@/stores';
import BaseTargetSelector from './_shared/BaseTargetSelector.vue';
import BaseSaveRoller from './_shared/BaseSaveRoller.vue';
import BaseDurationDisplay from './_shared/BaseDurationDisplay.vue';
import { useActiveEffectInput, useSaveRolling } from './_shared/composables.js';

export default {
  name: 'ae-status-input',
  components: {
    BaseTargetSelector,
    BaseSaveRoller,
    BaseDurationDisplay,
  },
  props: {
    targets: { type: Array, default: () => [] },
    status: { type: Object, required: true },
    owner: { type: Object, required: true },
  },
  data() {
    const { selectedTargets, targetSaves, aoe, toggleAoe, addTarget, cancelTarget } =
      useActiveEffectInput(this.status, this.targets);

    return {
      selectedTargets,
      targetSaves,
      aoe,
      selectedStatus: null,
      toggleAoe: () => toggleAoe(this.status.AoE),
      addTarget,
      cancelTarget,
    };
  },
  mounted() {
    this.reset();
  },
  emits: ['update:modelValue', 'update:targets'],
  computed: {
    statusOptions() {
      return CompendiumStore().Statuses.map((s) => ({
        title: s.Name,
        value: s.ID,
      }));
    },
    isReady() {
      return (
        this.selectedTargets.every((t) => t != null) &&
        (!this.status.Save || this.targetSaves.every((s) => s != null && s > 0))
      );
    },
  },
  methods: {
    reset() {
      this.selectedTargets = [null];
      this.targetSaves = [null];
      this.aoe = this.status.AoE || false;
      this.selectedStatus = this.status._statusId || null;
    },
    getData() {
      return {
        Status: this.selectedStatus,
        AoE: this.aoe,
        Targets: this.selectedTargets.map((t) => (t ? t.actor.Id : null)),
        Saves: this.status.Save ? this.targetSaves.map((s) => (s != null ? s : 0)) : null,
      };
    },
  },
};
</script>
