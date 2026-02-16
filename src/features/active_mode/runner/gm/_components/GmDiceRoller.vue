<template>
  <v-card min-height="500px">
    <v-toolbar flat
      tile
      density="compact"
      color="primary"
      height="46">
      <v-toolbar-title class="heading h3">DICE ROLLER</v-toolbar-title>
      <v-spacer />
      <v-btn icon
        @click="$emit('close')">
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </v-toolbar>
    <div v-if="selected">
      <div class="heading bg-primary px-5">
        <span class="text-disabled pr-2">Currently Selected:</span>
        <strong v-if="selected">
          {{ actor.Name }}
        </strong>
        <span v-else
          class="text-disabled">None</span>
      </div>
      <div>
        <div class="text-cc-overline ma-1">Quick Roll:</div>
        <v-row no-gutters
          class="px-6">
          <v-col><v-btn border
              block
              tile
              flat
              color="primary"
              size="small"
              @click="setCheck('Hull')">Hull Check</v-btn></v-col>
          <v-col><v-btn border
              block
              tile
              flat
              color="primary"
              size="small"
              @click="setCheck('Agi')">Agility Check</v-btn></v-col>
          <v-col><v-btn border
              block
              tile
              flat
              color="primary"
              size="small"
              @click="setCheck('Sys')">Systems Check</v-btn></v-col>
          <v-col>
            <v-btn border
              block
              tile
              flat
              color="primary"
              size="small"
              @click="setCheck('Eng')">Engineering Check</v-btn>
          </v-col>

        </v-row>
      </div>
    </div>
    <v-divider v-if="selected"
      class="my-2" />
    <v-card-text class="pb-0">
      <v-row dense>
        <v-col cols="auto">

          <v-card class="text-text text-cc-overline"
            style="overflow-x: hidden; max-width: 600px;"
            border>
            <v-card-text class="pa-2">
              <v-row dense
                align="center">
                <v-col>
                  <div class="text-cc-overline text-disabled">Count</div>
                  <v-text-field v-model="count"
                    density="compact"
                    variant="outlined"
                    type="number"
                    hide-spin-buttons
                    flat
                    hide-details
                    tile />
                </v-col>
                <v-col>
                  <div class="text-cc-overline text-disabled">Die</div>
                  <v-select v-model="die"
                    :items="dice"
                    density="compact"
                    variant="outlined"
                    type="number"
                    flat
                    min-width="100"
                    hide-details
                    tile>
                    <template #prepend-inner>
                      <v-icon icon=mdi-alpha-d />
                    </template>
                  </v-select>
                </v-col>
                <v-col>
                  <div class="text-cc-overline text-disabled">Bonus</div>
                  <v-text-field v-model="plus"
                    density="compact"
                    variant="outlined"
                    type="number"
                    hide-spin-buttons
                    flat
                    hide-details
                    tile>
                    <template #prepend-inner>
                      <v-icon icon=mdi-plus />
                    </template>
                  </v-text-field>
                </v-col>
                <v-col>
                  <div class="text-cc-overline text-disabled">Accuracy</div>
                  <v-text-field v-model="accuracy"
                    density="compact"
                    variant="outlined"
                    type="number"
                    hide-spin-buttons
                    flat
                    hide-details
                    tile
                    max-width="140"
                    @update:model-value="accuracy = Number($event)">
                    <template #prepend>
                      <v-tooltip location="top">
                        <template #activator="{ props }">
                          <v-icon class="mr-n3"
                            v-bind="props"
                            size="x-large"
                            color="accent"
                            :icon="accuracy > 0 ? 'cc:accuracy' : 'cc:difficulty'" />
                        </template>
                      </v-tooltip>
                    </template>
                    <template #prepend-inner>
                      <v-btn flat
                        tile
                        icon
                        size="x-small"
                        class="ml-n2"
                        @click="accuracy--">
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
                        @click="accuracy++">
                        <v-icon size="20"
                          icon="mdi-plus" />
                      </v-btn>
                    </template>
                  </v-text-field>
                </v-col>
              </v-row>

              <div class="mt-2 mb-4">
                <cc-switch v-model="isCrit"
                  label="Critical"
                  class="mt-2"
                  tooltip="Roll all dice, taking the best result" />
                <cc-switch v-model="Overkill"
                  label="Overkill"
                  class="mt-2"
                  tooltip="Re-roll 1s" />
              </div>

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
                @click="rollDice()">
                Roll
              </v-btn>

            </v-card-text>
          </v-card>

          <v-divider class="my-4" />
          <div>
            <cc-button color="success"
              size="small"
              block
              @click="rollDice"
              :disabled="!diceToRoll.length"
              class="mt-2"
              prepend-icon="mdi-dice-d20">
              Roll Dice
            </cc-button>
          </div>
        </v-col>
        <v-divider vertical
          class="mx-1" />
        <v-col class="mt-n2">
          <div class="text-cc-overline">Roll Result</div>
          <div v-if="lastRoll !== null">
            <div class="text-center my-2 bg-primary heading h1">
              {{ lastRoll }}
            </div>
            <div class="text-center">
              <span v-html-safe="lastRollString" />
            </div>
          </div>
          <div v-else
            class="text-caption text-disabled">No rolls yet.</div>
          <v-divider class="my-2" />
          <div class="text-cc-overline mb-2">Session History</div>
          <div style="max-height: 300px; overflow-y: scroll">
            <div v-for="n in encounter.RollHistory"
              class="text-cc-overline bg-panel mb-1 pa-1"
              v-html="n" />
          </div>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script>
import { DiceRoller } from '@/class';
import DiceRollInterface from '@/ui/components/chips/_activeeffect/_shared/DiceRollInterface.vue';
import { last, set } from 'lodash';

export default {
  name: 'GmDiceRoller',
  props: {
    selected: {
      type: Object,
      default: false,
    },
    encounter: {
      type: Object,
      required: true,
    }
  },
  components: {
    DiceRollInterface
  },
  data: () => ({
    diceToRoll: [{ type: 'd20', accuracy: 0, bonus: 0 }],
    lastRoll: null,
    lastRollString: '',
    dice: [2, 3, 4, 6, 8, 10, 12, 20, 100],
    count: 1,
    die: '20',
    plus: 0,
    isCrit: false,
    Overkill: false,
    accuracy: 0,
    rollResult: null,
    rollType: '',
  }),
  computed: {
    actor() {
      return this.selected ? this.selected.actor : null;
    },
  },
  methods: {
    reset() {
      this.count = 1;
      this.die = '20';
      this.plus = 0;
      this.accuracy = 0;
      this.isCrit = false;
      this.Overkill = false;
    },
    rollResultFormat(roll, selected) {
      if (roll.length > 1) {
        let str = '';
        roll.forEach((r, idx) => {
          if (r === selected) {
            str += `<b class='text-accent'>${r}</b>`;
          } else {
            str += `<span class='text-disabled'>${r}</span>`;
          }
          if (idx < roll.length - 1) {
            str += ', ';
          }
        });
        return str;
      }
      return `<b class='text-accent'>${roll[0]}</b>`;
    },
    setCheck(type) {
      this.count = 1;
      this.die = '20';
      this.plus = this.actor.CombatController.getCheckBonus(type);
      this.accuracy = 0;
      this.isCrit = false;
      this.Overkill = false;
      this.rollType = `${type.toUpperCase()} CHECK`;
      this.rollDice();
    },

    rollDice() {
      const diceValue = this.count && this.die ? `${this.count}d${this.die}+${this.plus || 0}` : 0;

      const isAcc = this.accuracy > -1;

      this.rollResult = DiceRoller.rollAny(
        diceValue,
        this.bonus,
        this.accuracy,
        this.isCrit,
        this.Overkill,
        0
      );

      this.lastRollString = `${this.rollType ? ` [${this.rollType}] ` : ''}${this.rollResult.toString()}`
      this.lastRoll = this.rollResult.total;

      let str = this.actor ? `<b>${this.actor.CombatController.CombatName}</b> rolled: ` : 'GM Rolled: ';
      str += `(${diceValue}) `;
      if (this.accuracy) {
        str += ` [${isAcc ? '+' : '-'}${this.accuracy} ${isAcc ? 'ACC' : 'DIFF'}]`;
      }
      if (this.isCrit) {
        str += ' [CRIT]';
      }
      if (this.Overkill) {
        str += ' [OVERKILL]';
      }
      str += ` ${this.lastRollString}`;
      this.encounter.RollHistory.unshift(str);
      this.rollType = '';
    },
  },
};
</script>
