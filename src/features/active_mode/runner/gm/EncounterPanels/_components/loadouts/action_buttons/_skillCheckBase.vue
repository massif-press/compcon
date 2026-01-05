<template>
  <v-row dense>
    <v-col>
      <div class="text-cc-overline text-disabled">Skill Check Roll</div>
      <v-text-field
        v-model="roll"
        density="compact"
        variant="outlined"
        type="number"
        hide-spin-buttons
        flat
        hide-details
        tile>
        <template #prepend-inner>
          <v-icon size="25" icon="mdi-dice-d20" />
        </template>
      </v-text-field>
    </v-col>
    <v-col>
      <div class="text-cc-overline text-disabled">Bonus</div>
      <v-text-field
        v-model="bonus"
        density="compact"
        variant="outlined"
        type="number"
        hide-spin-buttons
        flat
        hide-details
        tile>
        <template #prepend-inner>
          <v-icon size="25" :icon="bonus < 0 ? 'mdi-minus' : 'mdi-plus'" />
        </template>
      </v-text-field>
      <v-card
        v-for="a in applicableBonuses.bonuses"
        flat
        tile
        class="pa-1 text-cc-overline"
        color="light-panel">
        {{ a.Value > 0 ? '+' : '' }}{{ a.Value }} ({{ a.Source }})
      </v-card>
    </v-col>
    <v-col>
      <div class="text-cc-overline text-disabled">
        {{ accDiff < 0 ? 'Difficulty' : 'Accuracy' }}
      </div>
      <v-text-field
        v-model="accDiff"
        density="compact"
        variant="outlined"
        type="number"
        flat
        hide-details
        tile>
        <template #prepend-inner>
          <v-tooltip location="top">
            <template #activator="{ props }">
              <v-icon
                v-bind="props"
                size="x-large"
                :icon="accDiff > 0 ? 'cc:accuracy' : 'cc:difficulty'" />
            </template>
          </v-tooltip>
        </template>
      </v-text-field>
      <v-card v-if="difficult" flat tile class="pa-1 text-cc-overline" color="light-panel">
        -1 (Difficult)
      </v-card>
      <v-card
        v-for="a in applicableBonuses.accDiff"
        flat
        tile
        class="pa-1 text-cc-overline"
        color="light-panel">
        {{ a.Accuracy > 0 ? '+' : '' }}{{ a.Accuracy }} ({{ a.Source }})
      </v-card>
    </v-col>
    <slot />
  </v-row>

  <v-btn flat tile class="mt-2" color="primary" size="small" block @click="rollCheck()">Roll</v-btn>

  <div class="pa-2 border-s mt-2 text-left" v-if="rollResults.length">
    <div class="text-cc-overline text-disabled">Roll Results</div>
    <div
      v-for="(r, idx) in rollResults"
      class="text-caption"
      :class="idx === 0 ? 'font-weight-bold text-accent' : 'text-disabled'"
      :key="`${r.text}_${idx}`"
      v-html="r.text" />
  </div>
</template>

<script>
export default {
  name: 'SkillCheckBase',
  props: {
    controller: { type: Object, required: true },
    difficult: { type: Boolean, default: false },
    selectedHase: { type: String, default: null },
  },
  data: () => ({
    roll: null,
    bonus: 0,
    accDiff: 0,
    rollResults: [],
  }),
  watch: {
    difficult(newVal) {
      if (newVal) {
        this.accDiff -= 1;
      } else {
        this.accDiff += 1;
      }
    },
    applicableBonuses: {
      immediate: true,
      handler(newVal) {
        this.bonus = newVal.bonuses.reduce((acc, curr) => acc + curr.Value, 0);
        this.accDiff = newVal.accDiff.reduce((acc, curr) => acc + curr.Accuracy, 0);
      },
    },
  },
  computed: {
    applicableBonuses() {
      let bonuses = [];
      bonuses = this.controller.ActiveActor.FeatureController?.Bonuses?.filter(
        (b) => b.ID === this.selectedHase || b.ID === 'check'
      );
      const result = {
        bonuses: bonuses.filter((b) => !!b.Value) || [],
        accDiff: bonuses.filter((b) => !!b.Accuracy) || [],
      };
      if (this.selectedHase) {
        const statBonus = this.controller.ActiveActor.CombatController.StatController.getStat(
          this.selectedHase
        );
        if (statBonus) {
          result.bonuses.push({
            Source: `${this.selectedHase.charAt(0).toUpperCase() + this.selectedHase.slice(1)} Stat`,
            Value: statBonus,
          });
        }
      }

      return result;
    },
  },
  methods: {
    rollCheck() {
      this.rollResults = [];
      const results = [];
      const count = 1 + Math.abs(this.accDiff);

      for (let i = 1; i <= count; i++) {
        const roll = Math.floor(Math.random() * 20) + 1;
        const val = roll + this.bonus;
        results.push({
          val,
          text: `${roll} + ${this.bonus} (${val})`,
        });
      }

      if (this.accDiff < 0) {
        results.sort((a, b) => a.val - b.val);
      } else {
        results.sort((a, b) => b.val - a.val);
      }

      this.rollResults = results;

      this.roll = results[0].val;
    },
  },
};
</script>
