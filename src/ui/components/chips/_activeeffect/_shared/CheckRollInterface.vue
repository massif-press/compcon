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
          @click="rollAttack()">
          <v-icon size="25"
            icon="mdi-dice-d20" />
        </v-btn>
      </div>
    </template>
    <template #default="{ isActive }">
      <v-card class="text-center text-text text-cc-overline"
        style="overflow-x: hidden;"
        border>
        <v-card-text class="pa-2">


          <div class="text-center">
            1d20 + {{ rollData.Event.Grit }} (Attacker GRIT)
            <br />
            {{ rollData.AttackAccuracy }} {{ rollData.AttackAccuracy > 0 ? 'Accuracy' : 'Difficulty'
            }}
            <br />
            vs Target's
            {{ rollData.TargetDefense }}
          </div>

          <div class="text-center">
            <div v-if="isRanged && engagedDifficulty">
              - {{ engagedDifficulty }} (Currently ENGAGED)
            </div>
            <div v-if="isRanged && getTargetCoverDifficulty(idx)">
              - {{ targetCoverDifficulty(idx) }} (Target is in COVER)
            </div>
          </div>

          <v-row align="center"
            no-gutters
            class="heading h3">
            <v-col cols="auto">1d20</v-col>
            <v-col cols="auto"
              class="mx-2">+</v-col>
            <v-col cols="auto">
              <v-text-field v-model="plus"
                density="compact"
                variant="outlined"
                type="number"
                hide-spin-buttons
                flat
                max-width="80"
                hide-details
                tile />
            </v-col>
            <v-col cols="auto"
              class="mx-2">
              <cc-slashes />
            </v-col>
            <v-col cols="auto">
              <v-text-field v-model="rollData.AttackAccuracy"
                density="compact"
                variant="outlined"
                class="my-2"
                type="number"
                hide-spin-buttons
                flat
                hide-details
                tile
                max-width="140"
                @update:model-value="rollData.AttackAccuracy = Number($event)">
                <template #prepend>
                  <v-tooltip location="top">
                    <template #activator="{ props }">
                      <v-icon class="mr-n3"
                        v-bind="props"
                        size="x-large"
                        color="accent"
                        :icon="rollData.AttackAccuracy > 0 ? 'cc:accuracy' : 'cc:difficulty'" />
                    </template>
                  </v-tooltip>
                </template>
                <template #prepend-inner>
                  <v-btn flat
                    tile
                    icon
                    size="x-small"
                    class="ml-n2"
                    @click="rollData.AttackAccuracy--">
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
                    @click="rollData.AttackAccuracy++">
                    <v-icon size="20"
                      icon="mdi-plus" />
                  </v-btn>
                </template>
              </v-text-field>
            </v-col>
          </v-row>

          <v-btn size="x-small"
            flat
            tile
            block
            color="panel"
            class="mt-1"
            @click="reset()">RESET</v-btn>

          <v-btn flat
            tile
            class="mt-2"
            color="primary"
            size="small"
            block
            @click="rollAttack()">
            Roll
          </v-btn>
          <div class="pa-2 text-left text-cc-overline text-accent">roll results</div>
          <div v-if="rollData.AttackRollResult"
            class="text-text">
            <span v-html-safe="rollData.AttackRollResult.toString()" />
          </div>
        </v-card-text>
      </v-card>
    </template>
  </v-menu>
</template>

<script>
import { DiceRoller } from '@/class';

export default {
  name: 'CheckRollInterface',
  props: {
    rollData: { type: Object, required: true },
  },
  data: () => ({
    plus: 0,
    dice: [2, 3, 4, 6, 8, 10, 12, 20, 100],
  }),
  targetCoverDifficulty() {
    const target = this.rollData.Combatant.actor.CombatController
    if (!target) return 0;

    return target.Cover === 'none'
      ? 0
      : target.Cover === 'soft'
        ? 1
        : 2;
  },
  engagedDifficulty() {
    return this.rollData.Event.Initiator.actor.CombatController.HasStatus('engaged') ? 1 : 0;
  },
  methods: {
    reset() {
      this.plus = 0;
      this.rollData.AttackAccuracy = 0;
      this.rollData.AttackRollResult = null;
    },
    rollAttack() {
      const diceValue = this.count && this.die ? `${this.count}d${this.die}+${this.plus || 0}` : 0;
      const rollResult = DiceRoller.rollSkillCheck(
        0, this.rollData.AttackAccuracy
      );
      this.rollData.AttackRollResult = rollResult;
      this.rollData.AttackRolledValue = rollResult.total;
    },
  },
};
</script>
