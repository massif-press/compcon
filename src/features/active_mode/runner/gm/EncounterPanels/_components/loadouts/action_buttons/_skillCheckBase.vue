<template>
  <v-row dense>
    <v-col>
      <div class="text-cc-overline text-disabled">Skill Check Roll</div>
      <v-text-field v-model="roll"
        density="compact"
        variant="outlined"
        type="number"
        hide-spin-buttons
        flat
        hide-details
        tile>
        <template #prepend-inner>
          <v-icon size="25"
            icon="mdi-dice-d20" />
        </template>
      </v-text-field>
    </v-col>
    <v-col>
      <div class="text-cc-overline text-disabled">Bonus</div>
      <v-text-field v-model="bonus"
        density="compact"
        variant="outlined"
        type="number"
        hide-spin-buttons
        flat
        hide-details
        tile>
        <template #prepend-inner>
          <v-icon size="25"
            :icon="bonus < 0 ? 'mdi-minus' : 'mdi-plus'" />
        </template>
      </v-text-field>
      <v-card v-for="(a, index) in applicableBonuses.bonuses"
        :key="`bonus-${index}`"
        flat
        tile
        class="pa-1 text-cc-overline"
        color="light-panel">
        {{ a.Value > 0 ? '+' : '' }}{{ a.Value }} ({{ a.Source }})
      </v-card>
    </v-col>
    <v-col>
      <div class="text-cc-overline text-disabled">
        {{ accDiff < 0
          ? 'Difficulty'
          : 'Accuracy'
        }}
          </div>
          <v-text-field v-model="accDiff"
            density="compact"
            variant="outlined"
            type="number"
            flat
            hide-details
            tile>
            <template #prepend-inner>
              <v-tooltip location="top">
                <template #activator="{ props: innerProps }">
                  <v-icon v-bind="innerProps"
                    size="x-large"
                    :icon="accDiff > 0 ? 'cc:accuracy' : 'cc:difficulty'" />
                </template>
              </v-tooltip>
            </template>
          </v-text-field>
          <v-card v-if="difficult"
            flat
            tile
            class="pa-1 text-cc-overline"
            color="light-panel">
            -1 (Difficult)
          </v-card>
          <v-card v-for="(a, index) in applicableBonuses.accDiff"
            :key="`accdiff-${index}`"
            flat
            tile
            class="pa-1 text-cc-overline"
            color="light-panel">
            {{ a.Accuracy > 0 ? '+' : '' }}{{ a.Accuracy }} ({{ a.Source }})
          </v-card>
    </v-col>
    <slot />
  </v-row>

  <v-btn flat
    tile
    class="mt-2"
    color="primary"
    size="small"
    block
    @click="rollCheck()">Roll</v-btn>

  <div v-if="rollResults.length"
    class="pa-2 border-s mt-2 text-left">
    <div class="text-cc-overline text-disabled">Roll Results</div>
    <div v-for="(r, idx) in rollResults"
      :key="`${r.text}_${idx}`"
      v-html-safe="r.text"
      class="text-caption"
      :class="idx === 0 ? 'font-weight-bold text-accent' : 'text-disabled'" />
  </div>
</template>

<script setup lang="ts">
import { CombatController } from '@/classes/components/combat/CombatController';
import { computed, ref } from 'vue'

const props = withDefaults(defineProps<{
  controller: CombatController
  difficult?: boolean
  selectedHase?: string
}>(), {
  difficult: false,
  selectedHase: ''
})

const roll = ref(null as number | null)
const bonus = ref(0)
const accDiff = ref(0)
const rollResults = ref([] as { val: number, text: string }[])

const applicableBonuses = computed(() => {
  const bonuses = props.controller.ActiveActor.FeatureController?.Bonuses?.filter(
    (b) => b.ID === props.selectedHase || b.ID === 'check'
  );
  const result = {
    bonuses: bonuses.filter((b) => !!b.Value) || [],
    accDiff: bonuses.filter((b) => !!b.Accuracy) || [],
  };
  if (props.selectedHase) {
    const statBonus = props.controller.ActiveActor.CombatController.StatController.getStat(
      props.selectedHase
    );
    if (statBonus) {
      result.bonuses.push({
        Source: `${props.selectedHase.charAt(0).toUpperCase() + props.selectedHase.slice(1)} Stat`,
        Value: statBonus,
      });
    }
  }

  return result;
})

function rollCheck() {
  rollResults.value = [];
  const results = [] as { val: number, text: string }[];
  const count = 1 + Math.abs(accDiff.value);

  for (let i = 1; i <= count; i++) {
    const roll = Math.floor(Math.random() * 20) + 1;
    const val = roll + bonus.value;
    results.push({
      val,
      text: `${roll} + ${bonus.value} (${val})`,
    });
  }

  if (accDiff.value < 0) {
    results.sort((a, b) => a.val - b.val);
  } else {
    results.sort((a, b) => b.val - a.val);
  }

  rollResults.value = results;

  roll.value = results[0].val;
}
</script>
