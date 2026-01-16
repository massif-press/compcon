<template>
  <v-col v-if="hasAttack"
    cols="auto">
    <div class="text-cc-overline text-disabled">vs Target {{ targetStat }}</div>
    <v-row no-gutters>
      <v-col>
        <v-text-field v-for="(s, idx) in attackRolls"
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
          tile
          @update:model-value="updateAttack(idx, $event)">
          <template #prepend>
            <v-menu open-on-hover
              :close-on-content-click="false">
              <template #activator="{ props }">
                <div class="mr-n4 ml-n2">
                  <v-btn icon
                    size="x-small"
                    variant="text"
                    flat
                    tile
                    v-bind="props"
                    @click="rollAttack(idx)">
                    <v-icon size="25"
                      icon="mdi-dice-d20" />
                  </v-btn>
                </div>
              </template>
              <template #default="{ isActive }">
                <v-card v-if="selectedTargets[idx]"
                  class="text-center text-text text-cc-overline pa-2"
                  width="300"
                  border>
                  1d20 + {{ grit }} (Pilot Grit)
                  <br />
                  {{ accDiff[idx] }} {{ accDiff[idx] > 0 ? 'Accuracy' : 'Difficulty' }}
                  <br />
                  vs Target's
                  {{ targetStat.toUpperCase() }}

                  <v-text-field v-model="accDiff[idx]"
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
                          <v-icon class="mr-n3"
                            v-bind="props"
                            size="x-large"
                            color="accent"
                            :icon="accDiff[idx] > 0 ? 'cc:accuracy' : 'cc:difficulty'" />
                        </template>
                      </v-tooltip>
                    </template>
                    <template #prepend-inner>
                      <v-btn flat
                        tile
                        icon
                        size="x-small"
                        class="ml-n2"
                        @click="accDiff[idx]--">
                        <v-icon size="20"
                          icon="mdi-minus" />
                      </v-btn>
                    </template>
                    <template #append-inner>
                      <v-btn flat
                        tile
                        icon
                        size="x-small"
                        class="mr-n2"
                        @click="accDiff[idx]++">
                        <v-icon size="20"
                          icon="mdi-plus" />
                      </v-btn>
                    </template>
                  </v-text-field>
                  <div v-if="selectedTargets[idx]"
                    class="text-center">
                    <div v-if="isRanged && engagedDifficulty">
                      - {{ engagedDifficulty }} (Currently ENGAGED)
                    </div>
                    <div v-if="isRanged && getTargetCoverDifficulty(idx)">
                      - {{ getTargetCoverDifficulty(idx) }} (Target is in COVER)
                    </div>
                  </div>

                  <v-btn flat
                    tile
                    class="mt-2"
                    color="primary"
                    size="small"
                    block
                    @click="rollAttack(idx)">
                    Roll
                  </v-btn>
                  <div class="pa-2 border-s text-left"
                    v-if="rollResults.length">
                    <div v-for="(r, idx) in rollResults"
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
      <v-col cols="auto"
        align-self="center">
        <div class="text-center text-cc-overline px-2">VS</div>
      </v-col>
      <v-col align-self="center">
        <v-text-field v-for="(s, idx) in attackRolls"
          :key="'target_val_' + idx"
          v-model="targetTargets[idx]"
          density="compact"
          variant="outlined"
          type="number"
          width="100"
          hide-spin-buttons
          flat
          :disabled="!selectedTargets[idx]"
          hide-details
          @update:model-value="updateTargets(idx, $event)">
          <template #append>
            <v-tooltip location="top">
              <template #activator="{ props }">
                <v-btn icon
                  size="x-small"
                  variant="text"
                  flat
                  tile
                  :color="!attackRolls[idx]
                    ? ''
                    : crits && attackRolls[idx] >= 20
                      ? 'exotic'
                      : attackRolls[idx] >= targetTargets[idx]
                        ? 'success'
                        : 'error'
                    "
                  class="ml-n2"
                  v-bind="props"
                  @click="overrideSave(idx)">
                  <v-icon size="25"
                    :icon="!attackRolls[idx]
                      ? 'mdi-circle-outline'
                      : crits && attackRolls[idx] >= 20
                        ? 'mdi-check-decagram'
                        : attackRolls[idx] >= targetTargets[idx]
                          ? 'mdi-check-circle'
                          : 'mdi-cancel'
                      " />
                </v-btn>
              </template>

              <div class="text-center">
                {{
                  !attackRolls[idx]
                    ? 'No Attack Rolled'
                    : crits && attackRolls[idx] >= 20
                      ? 'Critical Hit'
                      : attackRolls[idx] >= targetTargets[idx]
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
    baseAccuracy: { type: Number, default: 0 },
    crits: { type: Boolean, default: false },
  },
  data: () => ({
    targetTargets: [],
    accDiff: [],
    rollResults: [],
  }),
  emits: ['update:target-saves', 'update:target-attacks', 'ready-changed'],
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
    grit() {
      return this.owner.CombatController.Grit;
    },
    engagedDifficulty() {
      return this.owner.CombatController.HasStatus('engaged') ? 1 : 0;
    },
    ready() {
      return this.selectedTargets.length > 0 &&
        this.selectedTargets.every(target => target != null) &&
        this.attackRolls.length === this.selectedTargets.length &&
        this.attackRolls.every(roll => roll != null) &&
        this.targetTargets.length === this.selectedTargets.length &&
        this.targetTargets.every(target => target != null && target !== '');
    },
  },
  watch: {
    selectedTargets: {
      immediate: true,
      deep: true,
      handler(newVal) {
        this.accDiff = new Array(newVal.length).fill(this.baseAccuracy || 0);
        this.targetTargets = newVal.map((t, idx) => this.getTargetVal(t, idx));
      },
    },
    ready: {
      handler(newVal) {
        this.$emit('ready-changed', newVal);
      },
      immediate: true,
    },
  },
  methods: {
    getTargetVal(target, idx) {
      const targetController = target?.actor?.CombatController?.ActiveActor?.CombatController;
      if (!targetController) {
        // Try alternative path
        const altController = target?.actor?.CombatController;
        if (altController?.StatController) {
          if (this.attack === 'tech') {
            return altController.StatController.MaxStats['edef'];
          }
          return altController.StatController.MaxStats['evasion'];
        }
        return '';
      }

      if (this.attack === 'tech') {
        return targetController.StatController.MaxStats['edef'];
      }

      return targetController.StatController.MaxStats['evasion'];
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

      // Safety check for accDiff
      if (this.accDiff[idx] == null) {
        this.accDiff[idx] = 0;
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
      if (this.attackRolls[idx] >= 20) {
        this.updateAttack(idx, 1);
      } else if (this.attackRolls[idx] < this.targetTargets[idx]) {
        this.updateAttack(idx, this.targetTargets[idx]);
      } else {
        this.updateAttack(idx, 20);
      }
    },
    updateAttack(idx, value) {
      const newAttacks = [...this.attackRolls];
      newAttacks[idx] = value;
      this.$emit('update:target-attacks', newAttacks);
      const newHitMiss = newAttacks.map((a, i) =>
        a >= 20 ? 2 : a >= this.targetTargets[i] ? 1 : 0
      );
      this.$emit('update:target-hits', newHitMiss);
    },
    updateTargets(idx, value) {
      const newTargets = [...this.targetTargets];
      newTargets[idx] = value;
      this.$emit('update:target-saves', newTargets);
      const newAttacks = [...this.attackRolls];

      const newHitMiss = newAttacks.map((a, i) =>
        a >= 20 ? 2 : a >= this.targetTargets[i] ? 1 : 0
      );
      this.$emit('update:target-hits', newHitMiss);
    },
  },
};
</script>

<style scoped>
.thin>>>.v-field__input {
  padding: 0 !important;
  min-height: 20px;
  text-align: center;
}
</style>
