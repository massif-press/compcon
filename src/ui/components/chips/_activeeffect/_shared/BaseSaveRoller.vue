<template>
  <v-col v-if="hasSave" cols="auto">
    <div class="text-cc-overline text-disabled">{{ saveData.Stat }} Save</div>
    <v-text-field
      v-for="(s, idx) in targetSaves"
      v-model="targetSaves[idx]"
      density="compact"
      variant="outlined"
      class="mb-1"
      type="number"
      flat
      :disabled="!selectedTargets[idx]"
      hide-details
      clearable
      tile>
      <template #prepend>
        <v-tooltip location="top">
          <template #activator="{ props }">
            <v-btn
              icon
              size="x-small"
              variant="text"
              flat
              tile
              class="mr-n6"
              v-bind="props"
              @click="rollSave(idx)">
              <v-icon size="25" icon="mdi-dice-d20" />
            </v-btn>
          </template>

          <div v-if="selectedTargets[idx]" class="text-center">
            1d20 +
            {{
              selectedTargets[idx].actor?.CombatController?.getSavingThrowBonus(saveData.Stat) || 0
            }}
            vs {{ saveTarget }}

            <div>
              <i class="text-caption text-disabled">Click to roll save</i>
            </div>
          </div>
        </v-tooltip>
      </template>
      <template #append>
        <v-tooltip location="top">
          <template #activator="{ props }">
            <v-btn
              icon
              size="x-small"
              variant="text"
              flat
              tile
              :color="!targetSaves[idx] ? '' : targetSaves[idx] >= saveTarget ? 'success' : 'error'"
              class="ml-n2"
              v-bind="props"
              @click="overrideSave(idx)">
              <v-icon
                size="25"
                :icon="
                  !targetSaves[idx]
                    ? 'mdi-circle-outline'
                    : targetSaves[idx] >= saveTarget
                      ? 'mdi-check-circle'
                      : 'mdi-cancel'
                " />
            </v-btn>
          </template>

          <div class="text-center">
            {{
              !targetSaves[idx]
                ? 'No Save Rolled'
                : targetSaves[idx] >= saveTarget
                  ? 'Successful Save'
                  : 'Failed Save'
            }}

            <div>
              <i class="text-caption text-disabled">Click to override</i>
            </div>
          </div>
        </v-tooltip>
      </template>
    </v-text-field>
  </v-col>
</template>

<script>
export default {
  name: 'BaseSaveRoller',
  props: {
    selectedTargets: { type: Array, required: true },
    targetSaves: { type: Array, required: true },
    saveData: { type: Object, default: null },
    owner: { type: Object, required: true },
  },
  emits: ['update:target-saves'],
  computed: {
    hasSave() {
      return this.saveData != null;
    },
    saveTarget() {
      return this.owner.CombatController.SaveTarget;
    },
  },
  methods: {
    rollSave(idx) {
      const target = this.selectedTargets[idx];
      if (!target) {
        this.updateSave(idx, 0);
        return;
      }

      const bonus = target.actor.CombatController.getSavingThrowBonus(this.saveData.Stat);
      const roll = Math.floor(Math.random() * 20) + 1;
      this.updateSave(idx, roll + bonus);
    },
    overrideSave(idx) {
      if (this.targetSaves[idx] == null) return;
      if (this.targetSaves[idx] < this.saveTarget) {
        this.updateSave(idx, 20);
      } else {
        this.updateSave(idx, 1);
      }
    },
    updateSave(idx, value) {
      const newSaves = [...this.targetSaves];
      newSaves[idx] = value;
      this.$emit('update:target-saves', newSaves);
    },
  },
};
</script>
