<template>
  <v-col v-if="hasSave" cols="auto">
    <div class="text-cc-overline text-disabled">{{ saveData.Stat }} Save</div>
    <v-row no-gutters v-for="(s, idx) in targetSaves">
      <v-col>
        <v-text-field
          v-model="targetSaves[idx]"
          density="compact"
          variant="outlined"
          class="mb-1"
          type="number"
          width="85"
          hide-spin-buttons
          flat
          :disabled="!selectedTargets[idx]"
          hide-details
          tile>
          <template #prepend>
            <v-menu open-on-hover :close-on-content-click="false">
              <template #activator="{ props }">
                <v-btn icon size="x-small" variant="text" flat tile class="mr-n6" v-bind="props">
                  <v-icon size="25" icon="mdi-dice-d20" />
                </v-btn>
              </template>
              <template #default="{ isActive }">
                <v-card
                  v-if="selectedTargets[idx]"
                  class="text-center text-text text-cc-overline pa-2"
                  width="300"
                  border>
                  1d20 +
                  {{ getSaveBonus(idx, saveData.Stat) }} (Save Bonus) vs {{ saveTarget }}

                  <v-text-field
                    v-model="accDiff[idx]"
                    density="compact"
                    variant="outlined"
                    class="my-2"
                    type="number"
                    hide-spin-buttons
                    flat
                    :disabled="!selectedTargets[idx]"
                    hide-details
                    tile>
                    <template #prepend>
                      <v-tooltip location="top">
                        <template #activator="{ props }">
                          <v-icon
                            class="mr-n3"
                            v-bind="props"
                            size="x-large"
                            color="accent"
                            :icon="accDiff[idx] > 0 ? 'cc:accuracy' : 'cc:difficulty'" />
                        </template>
                      </v-tooltip>
                    </template>
                    <template #prepend-inner>
                      <v-btn flat tile icon size="x-small" class="ml-n2" @click="accDiff[idx]--">
                        <v-icon size="20" icon="mdi-minus" />
                      </v-btn>
                    </template>
                    <template #append-inner>
                      <v-btn flat tile icon size="x-small" class="mr-n2" @click="accDiff[idx]++">
                        <v-icon size="20" icon="mdi-plus" />
                      </v-btn>
                    </template>
                  </v-text-field>
                  <v-btn
                    flat
                    tile
                    class="mt-2"
                    color="primary"
                    size="small"
                    block
                    @click="rollSave(idx)">
                    Roll
                  </v-btn>
                  <div class="pa-2 border-s text-left" v-if="rollResults.length">
                    <div
                      v-for="(r, idx) in rollResults"
                      :class="idx === 0 ? 'font-weight-bold text-accent' : 'text-disabled'"
                      :key="r.text"
                      v-html="r.text"></div>
                  </div>
                </v-card>
              </template>
            </v-menu>
          </template>
        </v-text-field>
      </v-col>
      <v-col cols="auto" align-self="center">
        <div class="text-center text-cc-overline px-2">VS</div>
      </v-col>
      <v-col v-if="selectedTargets[idx]" align-self="center">
        <v-text-field
          v-for="(s, idx) in targetSaves"
          :key="'target_val_' + idx"
          :value="
            selectedTargets[idx].actor?.CombatController?.getSavingThrowBonus(saveData.Stat) || 0
          "
          density="compact"
          variant="outlined"
          type="number"
          width="100"
          hide-spin-buttons
          flat
          :disabled="!selectedTargets[idx]"
          hide-details>
          <template #append>
            <v-tooltip location="top">
              <template #activator="{ props }">
                <v-btn
                  icon
                  size="x-small"
                  variant="text"
                  flat
                  tile
                  :color="
                    !targetSaves[idx] ? '' : targetSaves[idx] >= saveTarget ? 'success' : 'error'
                  "
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
    </v-row>

    <!-- <v-text-field
      v-for="(s, idx) in targetSaves"
      v-model="targetSaves[idx]"
      density="compact"
      variant="outlined"
      class="mb-1"
      type="number"
      max-width="150"
      hide-spin-buttons
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
    </v-text-field> -->
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
  data: () => ({
    accDiff: [],
    rollResults: [],
  }),
  watch: {
    selectedTargets: {
      immediate: true,
      handler(newVal) {
        this.accDiff = new Array(newVal.length).fill(0);
      },
    },
  },
  computed: {
    hasSave() {
      return this.saveData != null;
    },
    saveTarget() {
      return this.owner.CombatController.SaveTarget;
    },
  },
  methods: {
    getSaveBonus(idx, stat) {
      const target = this.selectedTargets[idx];
      if (!target) return 0;
      return target.actor?.CombatController?.getSavingThrowBonus(stat) || 0;
    },
    rollSave(idx) {
      const target = this.selectedTargets[idx];
      if (!target) {
        this.updateSave(idx, 0);
        return;
      }

      const results = [];
      const count = this.accDiff[idx] < 0 ? Math.abs(this.accDiff[idx]) : 1;
      const bonus = this.getSaveBonus(idx, this.saveData.Stat);

      for (let i = 1; i <= count; i++) {
        const roll = Math.floor(Math.random() * 20) + 1;
        const val = roll + bonus;
        results.push({
          val,
          text: `${roll} + ${bonus} (${val})`,
        });
      }

      if (this.accDiff[idx] < 0) {
        results.sort((a, b) => a.val - b.val);
      } else {
        results.sort((a, b) => b.val - a.val);
      }

      this.rollResults = results;

      this.updateSave(idx, results[0].val);
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
