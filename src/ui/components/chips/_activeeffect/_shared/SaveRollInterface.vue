<template>

  <v-menu open-on-hover
    max-width="400"
    :close-on-content-click="false">
    <template #activator="{ props }">
      <div class="mr-n4 ml-n2">
        <v-btn icon
          size="x-small"
          variant="text"
          flat
          tile
          v-bind="props"
          @click="rollSave()">
          <v-icon size="25"
            icon="mdi-dice-d20" />
        </v-btn>
      </div>
    </template>
    <template #default>
      <v-card class="text-center text-text text-cc-overline"
        style="overflow-x: hidden;"
        border>
        <v-card-text class="pa-2">


          <div class="text-center">
            {{ $t('ui.combat.d20Plus') }}
            {{ rollData.SaveBonus }} {{ $t('ui.combat.saveBonusVs') }} {{ rollData.SaveTarget }}
          </div>

          <accuracy-difficulty-row
            v-model="rollData.AttackAccuracy"
            v-model:bonus="rollData.SaveBonus" />

          <v-btn size="x-small"
            flat
            tile
            block
            color="panel"
            class="mt-1"
            @click="reset()">{{ $t('ui.combat.reset') }}</v-btn>

          <v-btn flat
            tile
            class="mt-2"
            color="primary"
            size="small"
            block
            @click="rollSave()">
            {{ $t('common.roll') }}
          </v-btn>
          <div class="pa-2 text-left text-cc-overline text-accent">{{ $t('ui.combat.rollResults') }}</div>
          <div v-if="rollData.SaveRollResult"
            class="text-text">
            <span v-html-safe="rollData.SaveRollResult.toString()" />
          </div>
        </v-card-text>
      </v-card>
    </template>
  </v-menu>
</template>

<script setup lang="ts">
import { DiceRoller } from '@/classes/dice/DiceRoller'
import AccuracyDifficultyRow from './AccuracyDifficultyRow.vue'

const props = defineProps<{
  rollData: object
}>()

function reset() {
  props.rollData.AttackAccuracy = 0;
  props.rollData.SaveRollResult = null;
}

function rollSave() {
  const rollResult = DiceRoller.rollSkillCheck(
    props.rollData.SaveBonus, props.rollData.AttackAccuracy
  );
  props.rollData.SaveRollResult = rollResult;
  props.rollData.SaveRolledValue = rollResult.total;
}
</script>
