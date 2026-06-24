<template>
  <v-menu :open-on-hover="!mobile"
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
          @click="mobile ? props.isActive = true : rollAttack()">
          <v-icon :size="mobile ? 22 : 25"
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
            {{ $t('ui.combat.d20Plus') }} {{ rollData.AttackBonus }}
            <br />
            {{ rollData.AttackAccuracy }} {{ rollData.AttackAccuracy > 0 ? $t('common.accuracy') : $t('common.difficulty') }}
            <br />
            {{ $t('ui.combat.vsTarget') }}
            {{ rollData.TargetDefense }}
          </div>

          <div class="text-center">
            <div v-if="isRanged && engagedDifficulty">
              - {{ engagedDifficulty }} {{ $t('ui.combat.currentlyEngaged') }}
            </div>
            <div v-if="isRanged && targetCoverDifficulty">
              - {{ targetCoverDifficulty }} {{ $t('ui.combat.targetInCover') }}
            </div>
          </div>

          <accuracy-difficulty-row
            v-model="rollData.AttackAccuracy"
            v-model:bonus="rollData.AttackBonus" />

          <v-btn size="x-small"
            flat
            tile
            block
            color="panel"
            class="mt-1"
            @click="reset()">{{ $t('common.reset') }}</v-btn>

          <v-btn flat
            tile
            class="mt-2"
            color="primary"
            size="small"
            block
            @click="rollAttack()">
            {{ $t('common.roll_verb') }}
          </v-btn>
          <div class="pa-2 text-left text-cc-overline text-accent"><span class="text-lowercase">{{ $t('active.skillCheck.rollResults') }}</span></div>
          <div v-if="rollData.AttackRollResult"
            class="text-text">
            <span v-html-safe="rollData.AttackRollResult.toString()" />
          </div>
        </v-card-text>
      </v-card>
    </template>
  </v-menu>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useDisplay } from 'vuetify';
import { DiceRoller } from '@/classes/dice/DiceRoller'
import AccuracyDifficultyRow from './AccuracyDifficultyRow.vue'

const { mdAndDown: mobile } = useDisplay()

const props = defineProps<{
  rollData: object
}>()

const emit = defineEmits<{
  rolled: [value: number]
}>()

const dice = [2, 3, 4, 6, 8, 10, 12, 20, 100]

const isRanged = computed(() => props.rollData.AttackType === 'ranged')

const targetCoverDifficulty = computed(() => {
  const target = props.rollData.Combatant?.actor?.CombatController
  if (!target) return 0;

  return target.Cover === 'none'
    ? 0
    : target.Cover === 'soft'
      ? 1
      : 2;
})

const engagedDifficulty = computed(() =>
  props.rollData.Event.Initiator.actor.CombatController.HasStatus('engaged') ? 1 : 0
)

function reset() {
  props.rollData.AttackBonus = props.rollData.Event.AttackBonus || 0;
  props.rollData.AttackAccuracy = props.rollData.Event.Accuracy || 0;
  props.rollData.AttackRollResult = null;
  emit('rolled', 0);
}

function rollAttack() {
  const rollResult = DiceRoller.rollSkillCheck(
    Number(props.rollData.AttackBonus), props.rollData.AttackAccuracy
  );
  props.rollData.AttackRollResult = rollResult;
  props.rollData.AttackRolledValue = rollResult.total;

  emit('rolled', props.rollData.AttackRolledValue);
}
</script>
