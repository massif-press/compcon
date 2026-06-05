<template>
  <v-row dense>

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
    <div v-html-safe="rollResults"
      class="text-caption text-accent" />
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
const rollResults = ref('')

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

const bonus = ref((applicableBonuses.value.bonuses.reduce((acc, b) => acc + b.Value, 0) || 0) + (props.difficult ? -1 : 0))

const accDiff = ref(applicableBonuses.value.accDiff.reduce((acc, b) => acc + b.Accuracy, 0) || 0)

function rollCheck() {
  const baseRoll = Math.floor(Math.random() * 20) + 1;

  const count = Math.abs(accDiff.value);
  const accResults = [] as number[];

  for (let i = 1; i <= count; i++) {
    accResults.push((Math.floor(Math.random() * 6) + 1) * Math.sign(accDiff.value));
  }

  if (accDiff.value < 0) {
    accResults.sort((a, b) => a - b);
  } else {
    accResults.sort((a, b) => b - a);
  }

  const finalAccDiff = accResults.length ? accResults[0] : 0;

  roll.value = baseRoll + Number(bonus.value) + finalAccDiff;

  rollResults.value = `Base Roll: ${baseRoll}${bonus.value ? ` ${bonus.value > 0 ? '+' : '-'} ${Math.abs(bonus.value)}` : ''}${finalAccDiff ? `, ${finalAccDiff > 0 ? 'Accuracy: +' : 'Difficulty: -'} ${Math.abs(finalAccDiff)}` : ''} = <strong>${roll.value}</strong>`;

}
</script>
