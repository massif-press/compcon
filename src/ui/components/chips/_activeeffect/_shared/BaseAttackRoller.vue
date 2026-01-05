<template>
  <v-col v-if="hasAttack" cols="auto">
    <div class="text-cc-overline text-disabled">vs Target {{ targetStat }}</div>
    <v-row no-gutters>
      <v-col>
        <v-text-field
          v-for="(s, idx) in attackRolls"
          v-model="attackRolls[idx]"
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
                  1d20 + {{ grit }} (Pilot Grit)
                  <br />
                  {{ accDiff[idx] }} {{ accDiff[idx] > 0 ? 'Accuracy' : 'Difficulty' }}
                  <br />
                  vs Target's
                  {{ targetStat.toUpperCase() }}

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
                  <div v-if="selectedTargets[idx]" class="text-center">
                    <div v-if="isRanged && engagedDifficulty">
                      - {{ engagedDifficulty }} (Currently ENGAGED)
                    </div>
                    <div v-if="isRanged && getTargetCoverDifficulty(idx)">
                      - {{ getTargetCoverDifficulty(idx) }} (Target is in COVER)
                    </div>
                  </div>

                  <v-btn
                    flat
                    tile
                    class="mt-2"
                    color="primary"
                    size="small"
                    block
                    @click="rollAttack(idx)">
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
      <v-col align-self="center">
        <v-text-field
          v-for="(s, idx) in attackRolls"
          :key="'target_val_' + idx"
          :value="getTargetVal(s, idx)"
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
                    !attackRolls[idx] ? '' : attackRolls[idx] >= saveTarget ? 'success' : 'error'
                  "
                  class="ml-n2"
                  v-bind="props"
                  @click="overrideSave(idx)">
                  <v-icon
                    size="25"
                    :icon="
                      !attackRolls[idx]
                        ? 'mdi-circle-outline'
                        : attackRolls[idx] >= saveTarget
                          ? 'mdi-check-circle'
                          : 'mdi-cancel'
                    " />
                </v-btn>
              </template>

              <div class="text-center">
                {{
                  !attackRolls[idx]
                    ? 'No Attack Rolled'
                    : attackRolls[idx] >= saveTarget
                      ? 'Successful Attack'
                      : 'Failed Attack'
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
  </v-col>
</template>

<script>
export default {
  name: 'BaseAttackRoller',
  props: {
    selectedTargets: { type: Array, required: true },
    attackRolls: { type: Array, required: true },
    attack: { type: String, default: '' },
    owner: { type: Object, required: true },
  },
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
  emits: ['update:target-saves'],
  computed: {
    hasAttack() {
      return !!this.attack;
    },
    isRanged() {
      return this.attack === 'ranged' || this.attack === 'range';
    },
    targetStat() {
      if (!this.attack) return '';
      if (this.attack === 'tech') return 'e-defense';
      return 'evasion';
    },
    saveTarget() {
      return this.owner.CombatController.SaveTarget;
    },
    grit() {
      return this.owner.CombatController.Grit;
    },
    engagedDifficulty() {
      return this.owner.CombatController.HasStatus('engaged') ? 1 : 0;
    },
  },
  methods: {
    getTargetVal(s, idx) {
      const target = this.selectedTargets[idx];
      if (!target) return '';

      if (this.attack === 'tech') {
        return target.actor.CombatController.StatController.getStat('edef');
      }
      return target.actor.CombatController.StatController.getStat('evasion');
    },
    getTargetCoverDifficulty(idx) {
      const target = this.selectedTargets[idx];
      if (!target) return 0;

      return target.actor.CombatController.Cover === 'none'
        ? 0
        : target.actor.CombatController.Cover === 'soft'
          ? 1
          : 2;
    },
    rollAttack(idx) {
      const target = this.selectedTargets[idx];
      if (!target) {
        this.updateAttack(idx, 0);
        return;
      }

      const results = [];
      const count = 1 + Math.abs(this.accDiff[idx]);

      for (let i = 1; i <= count; i++) {
        const roll = Math.floor(Math.random() * 20) + 1;
        const val = roll + this.grit;
        results.push({
          val,
          text: `${roll} + ${this.grit} (${val})`,
        });
      }

      if (this.accDiff[idx] < 0) {
        results.sort((a, b) => a.val - b.val);
      } else {
        results.sort((a, b) => b.val - a.val);
      }

      this.rollResults = results;

      this.updateAttack(idx, results[0].val);
    },
    overrideSave(idx) {
      if (this.attackRolls[idx] == null) return;
      if (this.attackRolls[idx] < this.saveTarget) {
        this.updateAttack(idx, 20);
      } else {
        this.updateAttack(idx, 1);
      }
    },
    updateAttack(idx, value) {
      const newAttacks = [...this.attackRolls];
      newAttacks[idx] = value;
      this.$emit('update:target-attacks', newAttacks);
    },
  },
};
</script>

<style scoped>
.thin >>> .v-field__input {
  padding: 0 !important;
  min-height: 20px;
  text-align: center;
}
</style>
