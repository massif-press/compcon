<template>
  <v-menu
    v-model="menu"
    :close-on-click="false"
    :close-on-content-click="false"
    right
    offset-x
    nudge-bottom="-200px">
    <template #activator="{ props }">
      <v-btn icon @click.stop="menu = true" v-bind="props">
        <v-icon icon="mdi-dice-multiple" />
      </v-btn>
    </template>
    <v-card height="400px" style="overflow-y: scroll">
      <v-toolbar
        v-if="title"
        tile
        density="compact"
        flat
        :color="critical ? 'exotic' : 'primary'"
        class="text-white heading h3">
        {{ title }}
        <span v-if="critical" class="flavor-text text-white text--secondary">{{ $t('ui.dice.critical') }}</span>
        <span v-if="overkill" class="flavor-text text-white text--secondary">// {{ $t('active.fields.overkill') }}</span>
      </v-toolbar>
      <v-row no-gutters align="center" justify="center">
        <v-col>
          <v-card-text>
            <v-row
              density="compact"
              justify="center"
              style="border: 1px solid rgb(var(--v-theme-primary)); border-radius: 2px">
              <v-col v-show="moreDice" cols="auto">
                <cc-tooltip content="Add coin flip (d2)">
                  <v-btn icon color="accent" @click="addDice(2)">
                    <v-icon large>mdi-numeric-2-circle-outline</v-icon>
                  </v-btn>
                </cc-tooltip>
              </v-col>
              <v-col v-show="moreDice" cols="auto">
                <cc-tooltip content="Add d4 roll">
                  <v-btn icon color="accent" @click="addDice(4)">
                    <v-icon large>mdi-dice-d4-outline</v-icon>
                  </v-btn>
                </cc-tooltip>
              </v-col>
              <v-col cols="auto">
                <cc-tooltip content="Add d6 roll">
                  <v-btn icon color="accent" @click="addDice(6)">
                    <v-icon large>mdi-dice-d6-outline</v-icon>
                  </v-btn>
                </cc-tooltip>
              </v-col>
              <v-col v-show="moreDice" cols="auto">
                <cc-tooltip content="Add d8 roll">
                  <v-btn icon color="accent" @click="addDice(8)">
                    <v-icon large>mdi-dice-d8-outline</v-icon>
                  </v-btn>
                </cc-tooltip>
              </v-col>
              <v-col v-show="moreDice" cols="auto">
                <cc-tooltip content="Add d10 roll">
                  <v-btn icon color="accent" @click="addDice(10)">
                    <v-icon large>mdi-dice-d10-outline</v-icon>
                  </v-btn>
                </cc-tooltip>
              </v-col>
              <v-col v-show="moreDice" cols="auto">
                <cc-tooltip content="Add d12 roll">
                  <v-btn icon color="accent" @click="addDice(12)">
                    <v-icon large>mdi-dice-d12-outline</v-icon>
                  </v-btn>
                </cc-tooltip>
              </v-col>
              <v-col cols="auto">
                <cc-tooltip content="Add d20 roll">
                  <v-btn icon color="accent" @click="addDice(20)">
                    <v-icon large>mdi-dice-d20-outline</v-icon>
                  </v-btn>
                </cc-tooltip>
              </v-col>
              <v-col cols="auto">
                <v-btn icon variant="plain" @click="moreDice = !moreDice">
                  <v-icon v-if="moreDice">mdi-chevron-double-left</v-icon>
                  <v-icon v-else>mdi-chevron-double-right</v-icon>
                </v-btn>
              </v-col>
              <v-col cols="auto">
                <cc-tooltip content="Add Accuracy">
                  <v-btn icon color="accent" @click="accuracy++">
                    <v-icon large>cc:accuracy</v-icon>
                  </v-btn>
                </cc-tooltip>
              </v-col>
              <v-col cols="auto">
                <cc-tooltip content="Add Difficulty">
                  <v-btn icon color="accent" @click="accuracy--">
                    <v-icon large>cc:difficulty</v-icon>
                  </v-btn>
                </cc-tooltip>
              </v-col>
            </v-row>
            <v-row density="compact" align="center" justify="center">
              <v-col cols="auto">
                <v-chip v-if="!dice.length" variant="outlined" style="opacity: 0.5">{{ $t('ui.dice.noRoll') }}</v-chip>
              </v-col>
              <v-col v-for="(d, i) in dice" :key="`dice-${i}`" cols="auto">
                <v-chip
                  variant="outlined"
                  class="mx-1"
                  close
                  close-icon="mdi-close"
                  @click:close="removeDice(d.sides)">
                  {{ d.count }}{{ $t('ui.combat.diceD') }}{{ d.sides }}
                </v-chip>
                <v-icon icon="mdi-plus" />
              </v-col>

              <v-col cols="auto">
                <v-text-field
                  v-model="flat"
                  density="compact"
                  hide-details
                  variant="outlined"
                  :prepend-icon="!dice.length ? 'mdi-plus' : ''"
                  type="number"
                  style="width: 100px" />
              </v-col>
            </v-row>
            <v-slide-y-reverse-transition>
              <v-row v-if="accuracy" density="compact" justify="center" align="center">
                <v-col cols="auto">
                  <v-chip
                    v-if="accuracy"
                    color="primary"
                    dark
                    small
                    close
                    close-icon="mdi-close"
                    @click:close="removeMod()">
                    <span v-html-safe="accString" />
                  </v-chip>
                </v-col>
              </v-row>
            </v-slide-y-reverse-transition>
            <v-btn block variant="outlined" color="secondary" class="my-3" @click="roll">
              {{ $t('common.roll_verb') }}
            </v-btn>
            <v-divider v-if="result" />
            <div style="min-height: 20px">
              <div v-if="result">
                <div v-for="(r, j) in result" :key="`result-${j}`">
                  <div class="caption">{{ $t('ui.dice.rolling', { n: r.rolls.length, sides: r.sides }) }}</div>
                  <v-row no-gutters>
                    <v-col v-for="(val, i) in r.rolls" :key="`roll-${i}`" cols="auto">
                      <v-chip
                        x-small
                        label
                        :style="r.class[i] === 'low' ? 'opacity: 0.4' : ''"
                        :color="r.class[i] === 'overkill' ? 'heat' : ''">
                        {{ val }}
                      </v-chip>
                      <v-icon v-if="i + 1 < r.rolls.length" small>mdi-plus</v-icon>
                    </v-col>
                    <v-col cols="auto" class="ml-auto text-stark">
                      <b>
                        =
                        {{
                          r.rolls
                            .map((x, i) => {
                              return r.class[i] === 'high' ? x : 0;
                            })
                            .reduce((a, b) => a + b, 0)
                        }}
                      </b>
                    </v-col>
                  </v-row>
                </div>
                <div v-if="flat">
                  <div class="caption">{{ $t('ui.dice.flatModifier') }}</div>
                  <v-row no-gutters>
                    <v-col cols="auto">
                      <v-chip x-small label>
                        {{ flat }}
                      </v-chip>
                    </v-col>
                    <v-col cols="auto" class="ml-auto text-stark">
                      <b>= {{ flat }}</b>
                    </v-col>
                  </v-row>
                </div>
                <div v-if="accuracy">
                  <div class="caption">
                    {{ accuracy > 0 ? $t('common.accuracy') : $t('common.difficulty') }}
                  </div>
                  <v-row no-gutters>
                    <v-col v-for="(a, i) in accRolls" :key="`acc-${i}`" cols="auto">
                      <v-chip
                        x-small
                        label
                        :color="a === Math.abs(accTotal) ? 'primary' : 'grey'"
                        dark>
                        {{ a }}
                      </v-chip>
                      <cc-slashes v-if="i + 1 < accRolls.length" small />
                    </v-col>
                    <v-col cols="auto" class="ml-auto text-stark">
                      <b>{{ accuracy > 0 ? '+' : '-' }}{{ Math.abs(accTotal) }}</b>
                    </v-col>
                  </v-row>
                </div>
                <v-row
                  no-gutters
                  class="pa-1 ma-1"
                  style="border: 1px solid rgb(var(--v-theme-secondary)); border-radius: 2px">
                  <v-col cols="auto" class="ml-auto text-stark text-right">
                    <div class="caption">{{ $t('ui.dice.total') }}</div>
                    <div class="heading h2">{{ total }}</div>
                  </v-col>
                </v-row>
                <v-row
                  v-if="overkill && overkillRolls"
                  no-gutters
                  class="pa-1 ma-1"
                  style="border: 1px solid rgb(var(--v-theme-heat)); border-radius: 2px">
                  <v-col cols="auto" class="ml-auto text-stark text-right">
                    <div class="caption">// {{ $t('active.fields.overkill') }} //</div>
                    <v-chip v-for="(n, index) in overkillRolls" :key="`overkill-${index}`" x-small color="heat">
                      <v-icon small>cc:heat</v-icon>
                    </v-chip>
                  </v-col>
                </v-row>
              </div>
            </div>
            <v-divider />
            <v-card-actions>
              <v-row density="compact" justify="center" align="center" class="text-center">
                <v-col cols="12" md="auto">
                  <v-btn small text class="mr-3" @click="menu = false">{{ $t('common.cancel') }}</v-btn>
                </v-col>
                <v-col cols="12" md="auto">
                  <v-btn small variant="outlined" color="accent" @click="clear">{{ $t('ui.dice.clearAll') }}</v-btn>
                  <v-btn small variant="outlined" color="accent" @click="reset">{{ $t('ui.dice.resetAll') }}</v-btn>
                </v-col>

                <v-col cols="12" md="auto">
                  <v-btn
                    small
                    class="ml-3"
                    color="secondary"
                    :disabled="!result && !flat"
                    @click="commit">
                    {{ $t('ui.dice.commitResult') }}
                  </v-btn>
                </v-col>
              </v-row>
            </v-card-actions>
          </v-card-text>
        </v-col>
      </v-row>
    </v-card>
  </v-menu>
</template>

<script setup lang="ts">
import { computed, ref, watch, nextTick } from 'vue'
import { DiceRoller } from '@/classes/dice/DiceRoller';

defineOptions({ name: 'cc-dice-menu' })

const props = withDefaults(defineProps<{
  title?: string
  preset?: string
  presetAccuracy?: number
  overkill?: boolean
  critical?: boolean
  autoroll?: boolean
}>(), {
  presetAccuracy: 0
})

const emit = defineEmits<{
  'commit': []
}>()

const menu = ref(false)
const moreDice = ref(false)
const dice = ref([])
const accRolls = ref([])
const flat = ref(0)
const result = ref(null)
const accuracy = ref(0)
const accTotal = ref(0)

reset();
    if (props.autoroll) nextTick(autoRoll);

reset();
    if (props.autoroll) nextTick(autoRoll);

const accString = computed(() => {
      if (accuracy.value > 0) return `<b>${accuracy.value}</b>&nbsp;&nbsp;ACCURACY`;
      else return `<b>${Math.abs(accuracy.value)}</b>&nbsp;&nbsp;DIFFICULTY`;
    })
const overkillRolls = computed(() => {
      if (!result.value) return 0;
      return result.value.map((x) => x.overkill).reduce((a, b) => a + b, 0);
    })
const total = computed(() => {
      if (!result.value) return parseInt(flat.value);
      return (
        result.value
          .flatMap((x) =>
            x.rolls.map((y, i) => {
              return x.class[i] === 'high' ? y : 0;
            })
          )
          .reduce((a, b) => a + b, 0) +
        parseInt(flat.value) +
        parseInt(accTotal.value)
      );
    })

function addDice(sides) {
      result.value = null;
      const idx = dice.value.findIndex((x) => x.sides === sides);
      if (idx > -1) dice.value[idx].count++;
      else dice.value.push({ sides, count: 1 });
    }
function removeDice(sides) {
      result.value = null;
      const idx = dice.value.findIndex((x) => x.sides === sides);
      dice.value[idx].count--;
      if (dice.value[idx].count < 1) dice.value.splice(idx, 1);
    }
function removeMod() {
      result.value = null;
      if (accuracy.value > 0) accuracy.value--;
      else accuracy.value++;
    }
function autoRoll() {
      roll();
      commit();
    }
function roll() {
      result.value = dice.value.map((x) => {
        const dRoll = DiceRoller.rollDamage(`${x.count}d${x.sides}`, props.critical, props.overkill);
        return {
          sides: x.sides,
          rolls: dRoll.rawDieRolls,
          class: dRoll.rollClassifications,
          overkill: dRoll.overkillRerolls,
        };
      });
      rollAccuracy();
    }
function rollAccuracy() {
      accTotal.value = 0;
      if (accuracy.value) {
        accRolls.value = DiceRoller.rollDamage(
          `${Math.abs(accuracy.value)}d${6}`,
          false,
          false
        ).rawDieRolls;
        accTotal.value = Math.max(...accRolls.value) * (accuracy.value > 0 ? 1 : -1);
      }
    }
function reset() {
      clear();
      if (props.preset) {
        const arr = props.preset.split(/\+|\-/);
        arr.forEach((e) => {
          if (e.includes('d')) {
            const dice = e.split('d');
            dice.value.push({ sides: dice[1], count: dice[0] });
          } else flat.value += parseInt(e);
        });
      }
      accuracy.value = props.presetAccuracy;
    }
function clear() {
      dice.value.splice(0, dice.value.length);
      accRolls.value.splice(0, dice.value.length);
      flat.value = 0;
      result.value = null;
      accuracy.value = 0;
      accTotal.value = 0;
    }
function commit() {
      emit('commit', {
        total: total.value,
        overkill: overkillRolls.value,
      });
      menu.value = false;
    }
</script>
