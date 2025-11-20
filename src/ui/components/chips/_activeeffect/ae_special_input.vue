<template>
  <v-row dense class="px-2 py-1">
    <v-col cols="3">
      <div class="text-cc-overline text-disabled">special condition</div>
      <v-tooltip location="top" :text="status.Description" max-width="400px">
        <template #activator="{ props }">
          <v-card
            v-bind="props"
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
      <BaseDurationDisplay v-if="status.Duration" :duration="status.Duration" />
    </v-col>

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
          v-if="status.Save"
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
  },
  data: () => ({
    selectedTargets: [],
    targetSaves: [],
    aoe: null,
    selectedStatus: null,
  }),
  mounted() {
    this.reset();
  },
  emits: ['update:modelValue', 'update:targets'],
  computed: {
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
    toggleAoe() {
      if (this.aoe) {
        this.aoe = false;
      } else {
        this.aoe = this.status.AoE || true;
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
