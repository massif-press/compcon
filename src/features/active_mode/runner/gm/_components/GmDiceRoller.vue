<template>
  <v-card min-height="500px">
    <v-toolbar flat tile density="compact" color="primary" height="46">
      <v-toolbar-title class="heading h3">DICE ROLLER</v-toolbar-title>
      <v-spacer />
      <v-btn icon @click="$emit('close')">
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </v-toolbar>
    <div v-if="selected">
      <div class="heading bg-primary px-5">
        <span class="text-disabled pr-2">Currently Selected:</span>
        <strong v-if="selected">
          {{ actor.Name }}
        </strong>
        <span v-else class="text-disabled">None</span>
      </div>
      <div>
        <div class="text-cc-overline ma-1">Quick Roll:</div>
        <v-row no-gutters class="px-6">
          <v-col><v-btn border block tile flat color="primary" size="small">Hull</v-btn></v-col>
          <v-col><v-btn border block tile flat color="primary" size="small">Agility</v-btn></v-col>
          <v-col><v-btn border block tile flat color="primary" size="small">Systems</v-btn></v-col>
          <v-col>
            <v-btn border block tile flat color="primary" size="small">Engineering</v-btn>
          </v-col>
          <v-col cols="auto" style="width: 20px"><v-divider vertical /></v-col>
          <v-col>
            <v-btn border block tile flat color="primary" size="small">Melee Attack</v-btn>
          </v-col>
          <v-col>
            <v-btn border block tile flat color="primary" size="small">Ranged Attack</v-btn>
          </v-col>
          <v-col>
            <v-btn border block tile flat color="primary" size="small">Tech Attack</v-btn>
          </v-col>
        </v-row>
      </div>
    </div>
    <v-divider class="my-2" />
    <v-card-text class="pb-0">
      <v-row dense>
        <v-col cols="auto">
          <div>
            <v-row v-for="(die, index) in diceToRoll" dense align="center" class="mb-2">
              <v-col cols="auto" style="width: 40px">
                <span class="heading h3 text-accent pr-2">{{ index + 1 }}</span>
              </v-col>
              <v-col cols="auto" style="width: 110px">
                <v-select
                  v-model="die.type"
                  :items="diceTypes"
                  tile
                  label="Die"
                  variant="outlined"
                  density="compact"
                  hide-details />
              </v-col>
              <v-col cols="auto" style="width: 110px">
                <v-text-field
                  v-model="die.bonus"
                  type="number"
                  tile
                  :label="`Bonus`"
                  variant="outlined"
                  density="compact"
                  hide-details
                  min="-100"
                  max="100" />
              </v-col>
              <v-col cols="auto" style="width: 110px">
                <v-text-field
                  v-model="die.accuracy"
                  type="number"
                  :label="`Acc/Diff`"
                  variant="outlined"
                  density="compact"
                  tile
                  hide-details
                  min="-100"
                  max="100" />
              </v-col>
              <v-col cols="auto">
                <v-btn icon size="x-small" variant="text" color="error" @click="removeDie(index)">
                  <v-icon>mdi-delete</v-icon>
                </v-btn>
              </v-col>
            </v-row>
          </div>
          <v-btn
            size="x-small"
            block
            flat
            tile
            color="primary"
            class="my-1"
            prepend-icon="mdi-plus"
            @click="addDie">
            Add Die
          </v-btn>
          <v-divider class="my-4" />
          <div>
            <cc-button
              color="success"
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
        <v-divider vertical class="mx-1" />
        <v-col class="mt-n2">
          <div class="text-cc-overline">Roll Result</div>
          <div v-if="rollResults.length">
            <div class="text-center my-2 bg-primary heading h1">
              {{ sumResults }}
            </div>
            <div class="text-center">
              <v-tooltip v-for="(result, index) in rollResults">
                <template #activator="{ props }">
                  <v-chip
                    v-bind="props"
                    class="text-cc-overline mb-1 mx-1"
                    :title="sumResults"
                    size="small">
                    <v-icon :icon="`mdi-dice-${result.type}`" size="large" class="ml-n1 mr-1" />
                    {{ result.total }}
                  </v-chip>
                </template>
                <span class="text-cc-overline">
                  <b>{{ result.type }}</b>
                  <span v-if="result.accuracy !== 0">
                    &mdash;
                    {{ Math.abs(result.accuracy) }}
                    {{ result.accuracy > 0 ? 'Accuracy' : 'Difficulty' }}
                  </span>
                  <v-divider class="mt-1 mb-2" />

                  <div>
                    rolled
                    <span v-html="rollResultFormat(result.rolls, result.roll)" />
                  </div>

                  + {{ result.bonus }} Bonus
                  <br />
                  =
                  {{ result.total }}
                </span>
              </v-tooltip>
            </div>
          </div>
          <div v-else class="text-caption text-disabled">No rolls yet.</div>
          <v-divider class="my-2" />
          <div class="text-cc-overline mb-2">History</div>
          <div style="max-height: 300px; overflow-y: scroll">
            <div
              v-for="n in history.length"
              class="text-cc-overline bg-panel mb-1 pa-1"
              v-html="history[history.length - n]" />
          </div>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  name: 'GmDiceRoller',
  props: {
    selected: {
      type: Object,
      default: false,
    },
  },
  data: () => ({
    diceToRoll: [{ type: 'd20', accuracy: 0, bonus: 0 }],
    rollResults: [],
    history: [],
    diceTypes: ['d2', 'd4', 'd6', 'd8', 'd10', 'd12', 'd20', 'd100'],
  }),
  computed: {
    sumResults() {
      return this.rollResults.reduce((acc, result) => acc + result.total, 0);
    },
    actor() {
      return this.selected ? this.selected.actor : null;
    },
  },
  methods: {
    addDie() {
      this.diceToRoll.push({ type: 'd20', accuracy: 0, bonus: 0 });
    },
    removeDie(index) {
      if (this.diceToRoll.length > 1) {
        this.diceToRoll.splice(index, 1);
      }
    },
    addRollResult() {
      this.rollResults.push(0);
    },
    removeRollResult(index) {
      if (this.rollResults.length > 0) {
        this.rollResults.splice(index, 1);
      }
    },
    rollDice() {
      const results = [];
      this.diceToRoll.forEach((die) => {
        let rolls = [];
        for (let i = 0; i < Math.abs(die.accuracy) + 1; i++) {
          rolls.push(Math.floor(Math.random() * parseInt(die.type.replace('d', ''))) + 1);
        }
        const selected = die.accuracy > 0 ? Math.max(...rolls) : Math.min(...rolls);

        const total = selected + Number(die.bonus);

        results.push({
          type: die.type,
          bonus: die.bonus,
          rolls,
          roll: selected,
          accuracy: die.accuracy,
          total: Number(total),
        });
      });

      if (this.rollResults.length) {
        this.history.push(
          `${this.rollResults.map((result) => result.total).join(' + ')} = <b class='text-accent'>${this.sumResults}</b>`
        );
      }
      this.rollResults = results;
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
    clearRolls() {
      this.rollResults = [];
    },
  },
};
</script>
