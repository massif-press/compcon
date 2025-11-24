<template>
  <v-row class="px-2 py-1">
    <v-col>
      <div class="text-cc-overline text-disabled">save</div>
      <v-select
        v-model="selectedSaveStat"
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
      :aoe="aoe"
      @toggle-aoe="toggleAoe"
      @add-target="addTarget"
      @remove-target="cancelTarget" />

    <BaseSaveRoller
      :selected-targets="selectedTargets"
      :target-saves="targetSaves"
      :save-data="save"
      :owner="owner"
      @update:target-saves="targetSaves = $event" />
  </v-row>
</template>

<script>
import BaseSaveRoller from './_shared/BaseSaveRoller.vue';
import BaseTargetSelector from './_shared/BaseTargetSelector.vue';

export default {
  name: 'ae-save-input',
  components: {
    BaseTargetSelector,
    BaseSaveRoller,
  },
  props: {
    targets: { type: Array, default: () => [] },
    save: { type: Object, required: true },
    owner: { type: Object, required: true },
    self: { type: Boolean },
  },
  data: () => ({
    selectedTargets: [],
    targetSaves: [],
    selectedSaveStat: 'hull',
    aoe: null,
    saveStats: [
      { title: 'Hull', value: 'hull' },
      { title: 'Agility', value: 'agility' },
      { title: 'Systems', value: 'systems' },
      { title: 'Engineering', value: 'engineering' },
    ],
  }),
  mounted() {
    this.reset();
  },
  computed: {
    isReady() {
      return (
        this.selectedSaveStat != null &&
        this.selectedSaveStat !== '' &&
        this.selectedTargets.every((t) => t != null)
      );
    },
  },
  methods: {
    reset() {
      this.selectedTargets = [null];
      if (this.self) this.selectedTargets = [this.targets[0]];
      this.targetSaves = [null];
      this.selectedSaveStat = this.save.Stat || 'hull';
      this.aoe = this.save.AoE || false;
    },
    toggleAoe() {
      if (this.aoe) {
        this.aoe = false;
      } else {
        this.aoe = this.save.AoE || true;
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
        if (!t || !t.actor || !t.actor.CombatController) return;
        let part = `Force ${this.selectedSaveStat} save for ${t.actor.CombatController.Name}`;
        if (this.targetSaves[idx] != null) {
          if (this.targetSaves[idx] >= this.owner.CombatController.SaveTarget) {
            part += ` [SAVED]`;
          } else {
            part += ` [FAILED SAVE]`;
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
          if (this.targetSaves[idx] != null) {
            if (this.targetSaves[idx] >= this.owner.CombatController.SaveTarget) {
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
