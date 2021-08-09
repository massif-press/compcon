<template>
  <v-menu
    v-model="menu"
    :close-on-click="false"
    :close-on-content-click="false"
    right
    offset-x
    nudge-bottom="-200px"
  >
    <template v-slot:activator="{ on }">
      <v-btn icon @click.stop="menu = true" v-on="on">
        <v-icon>mdi-dice-multiple</v-icon>
      </v-btn>
    </template>
    <v-card height="400px" style="overflow-y: scroll">
      <v-toolbar
        v-if="title"
        tile
        dense
        flat
        :color="critical ? 'exotic' : 'primary'"
        class="white--text heading h3"
      >
        {{ title }}
        <span v-if="critical" class="flavor-text white--text text--secondary">// CRITICAL</span>
        <span v-if="overkill" class="flavor-text white--text text--secondary">// OVERKILL</span>
      </v-toolbar>
      <v-row no-gutters align="center" justify="center">
        <v-col>
          <v-card-text>
            <v-row
              dense
              justify="center"
              style="border: 1px solid var(--v-primary-base); border-radius: 2px"
            >
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
                <v-btn icon class="fadeSelect" @click="moreDice = !moreDice">
                  <v-icon v-if="moreDice">mdi-chevron-double-left</v-icon>
                  <v-icon v-else>mdi-chevron-double-right</v-icon>
                </v-btn>
              </v-col>
              <v-col cols="auto">
                <cc-tooltip content="Add Accuracy">
                  <v-btn icon color="accent" @click="accuracy++">
                    <v-icon large>cci-accuracy</v-icon>
                  </v-btn>
                </cc-tooltip>
              </v-col>
              <v-col cols="auto">
                <cc-tooltip content="Add Difficulty">
                  <v-btn icon color="accent" @click="accuracy--">
                    <v-icon large>cci-difficulty</v-icon>
                  </v-btn>
                </cc-tooltip>
              </v-col>
            </v-row>
            <v-row dense align="center" justify="center">
              <v-col cols="auto">
                <v-chip v-if="!dice.length" outlined style="opacity: 0.5">No Roll</v-chip>
              </v-col>
              <v-col v-for="(d, i) in dice" :key="`${i}_dice_${d.sides}`" cols="auto">
                <v-chip
                  outlined
                  class="mx-1"
                  close
                  close-icon="mdi-close"
                  @click:close="removeDice(d.sides)"
                >
                  {{ d.count }}d{{ d.sides }}
                </v-chip>
                <v-icon>mdi-plus</v-icon>
              </v-col>

              <v-col cols="auto">
                <v-text-field
                  v-model="flat"
                  dense
                  hide-details
                  outlined
                  :prepend-icon="!dice.length ? 'mdi-plus' : ''"
                  type="number"
                  style="width: 100px"
                />
              </v-col>
            </v-row>
            <v-slide-y-reverse-transition>
              <v-row v-if="accuracy" dense justify="center" align="center">
                <v-col cols="auto">
                  <v-chip
                    v-if="accuracy"
                    color="primary"
                    dark
                    small
                    close
                    close-icon="mdi-close"
                    @click:close="removeMod()"
                  >
                    <span v-html="accString" />
                  </v-chip>
                </v-col>
              </v-row>
            </v-slide-y-reverse-transition>
            <v-btn block outlined color="secondary" class="my-3" @click="roll">Roll</v-btn>
            <v-divider v-if="result" />
            <div style="min-height: 20px">
              <div v-if="result">
                <div v-for="(r, j) in result" :key="`${j}_res_${r.sides}`">
                  <div class="caption">ROLLING {{ r.rolls.length }}D{{ r.sides }}</div>
                  <v-row no-gutters>
                    <v-col
                      v-for="(val, i) in r.rolls"
                      :key="`roll_${r.sides}_${i}_${val}`"
                      cols="auto"
                    >
                      <v-chip
                        x-small
                        label
                        :style="r.class[i] === 'low' ? 'opacity: 0.4' : ''"
                        :color="r.class[i] === 'overkill' ? 'heat' : ''"
                      >
                        {{ val }}
                      </v-chip>
                      <v-icon v-if="i + 1 < r.rolls.length" small>mdi-plus</v-icon>
                    </v-col>
                    <v-col cols="auto" class="ml-auto stark--text">
                      <b>
                        =
                        {{
                          r.rolls
                            .map((x, i) => {
                              return r.class[i] === 'high' ? x : 0
                            })
                            .reduce((a, b) => a + b, 0)
                        }}
                      </b>
                    </v-col>
                  </v-row>
                </div>
                <div v-if="flat">
                  <div class="caption">FLAT MODIFIER</div>
                  <v-row no-gutters>
                    <v-col cols="auto">
                      <v-chip x-small label>
                        {{ flat }}
                      </v-chip>
                    </v-col>
                    <v-col cols="auto" class="ml-auto stark--text">
                      <b>= {{ flat }}</b>
                    </v-col>
                  </v-row>
                </div>
                <div v-if="accuracy">
                  <div class="caption">{{ accuracy > 0 ? 'ACCURACY' : 'DIFFICULTY' }}</div>
                  <v-row no-gutters>
                    <v-col v-for="(a, i) in accRolls" :key="`acc_${a}_${i}`" cols="auto">
                      <v-chip
                        x-small
                        label
                        :color="a === Math.abs(accTotal) ? 'primary' : 'grey'"
                        dark
                      >
                        {{ a }}
                      </v-chip>
                      <cc-slashes v-if="i + 1 < accRolls.length" small />
                    </v-col>
                    <v-col cols="auto" class="ml-auto stark--text">
                      <b>{{ accuracy > 0 ? '+' : '-' }}{{ Math.abs(accTotal) }}</b>
                    </v-col>
                  </v-row>
                </div>
                <v-row
                  no-gutters
                  class="pa-1 ma-1"
                  style="border: 1px solid var(--v-secondary-base); border-radius: 2px"
                >
                  <v-col cols="auto" class="ml-auto stark--text text-right">
                    <div class="caption">TOTAL</div>
                    <div class="heading h2">{{ total }}</div>
                  </v-col>
                </v-row>
                <v-row
                  v-if="overkill && overkillRolls"
                  no-gutters
                  class="pa-1 ma-1"
                  style="border: 1px solid var(--v-heat-base); border-radius: 2px"
                >
                  <v-col cols="auto" class="ml-auto stark--text text-right">
                    <div class="caption">// OVERKILL //</div>
                    <v-chip v-for="n in overkillRolls" :key="`overkill_${n}`" x-small color="heat">
                      <v-icon small>cci-heat</v-icon>
                    </v-chip>
                  </v-col>
                </v-row>
              </div>
            </div>
            <v-divider />
            <v-card-actions>
              <v-row dense justify="center" align="center" class="text-center">
                <v-col cols="12" md="auto">
                  <v-btn small text class="mr-3" @click="menu = false">Cancel</v-btn>
                </v-col>
                <v-col cols="12" md="auto">
                  <v-btn small outlined color="accent" @click="clear">Clear All</v-btn>
                  <v-btn small outlined color="accent" @click="reset">Reset All</v-btn>
                </v-col>

                <v-col cols="12" md="auto">
                  <v-btn
                    small
                    class="ml-3"
                    color="secondary"
                    :disabled="!result && !flat"
                    @click="commit"
                  >
                    Commit Result
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

<script lang="ts">
import Vue from 'vue'
import { DiceRoller } from '@/classes/dice/DiceRoller'

export default Vue.extend({
  name: 'cc-dice-menu',
  props: {
    title: { type: String, required: false },
    preset: { type: String, required: false },
    presetAccuracy: { type: Number, required: false, default: 0 },
    overkill: { type: Boolean },
    critical: { type: Boolean },
    autoroll: { type: Boolean },
  },
  data: () => ({
    menu: false,
    moreDice: false,
    dice: [],
    accRolls: [],
    flat: 0,
    result: null,
    accuracy: 0,
    accTotal: 0,
  }),
  mounted() {
    this.reset()
    if (this.autoroll) this.$nextTick(this.autoRoll)
  },
  watch: {
    menu() {
      if (!this.menu || !this.autoroll) this.reset()
    },
    presetAccuracy() {
      if (this.autoroll) {
        this.accuracy=this.presetAccuracy
        this.autoRoll()
      }
    },
  },
  computed: {
    accString() {
      if (this.accuracy > 0) return `<b>${this.accuracy}</b>&nbsp;&nbsp;ACCURACY`
      else return `<b>${Math.abs(this.accuracy)}</b>&nbsp;&nbsp;DIFFICULTY`
    },
    overkillRolls() {
      if (!this.result) return 0
      return this.result.map(x => x.overkill).reduce((a, b) => a + b, 0)
    },
    total() {
      if (!this.result) return parseInt(this.flat)
      return (
        this.result
          .flatMap(x =>
            x.rolls.map((y, i) => {
              return x.class[i] === 'high' ? y : 0
            })
          )
          .reduce((a, b) => a + b, 0) +
        parseInt(this.flat) +
        parseInt(this.accTotal)
      )
    },
  },
  methods: {
    addDice(sides) {
      this.result = null
      const idx = this.dice.findIndex(x => x.sides === sides)
      if (idx > -1) this.dice[idx].count++
      else this.dice.push({ sides, count: 1 })
    },
    removeDice(sides) {
      this.result = null
      const idx = this.dice.findIndex(x => x.sides === sides)
      this.dice[idx].count--
      if (this.dice[idx].count < 1) this.dice.splice(idx, 1)
    },
    removeMod() {
      this.result = null
      if (this.accuracy > 0) this.accuracy--
      else this.accuracy++
    },
    autoRoll() {
      this.roll()
      this.commit()
    },
    roll() {
      this.result = this.dice.map(x => {
        const dRoll = DiceRoller.rollDamage(`${x.count}d${x.sides}`, this.critical, this.overkill)
        return {
          sides: x.sides,
          rolls: dRoll.rawDieRolls,
          class: dRoll.rollClassifications,
          overkill: dRoll.overkillRerolls,
        }
      })

      if (this.accuracy) {
        this.accRolls = DiceRoller.rollDamage(
          `${Math.abs(this.accuracy)}d${6}`,
          false,
          false
        ).rawDieRolls
        this.accTotal = Math.max(...this.accRolls) * (this.accuracy > 0 ? 1 : -1)
      }
    },
    reset() {
      this.clear()
      if (this.preset) {
        const arr = this.preset.split(/\+|\-/)
        arr.forEach(e => {
          if (e.includes('d')) {
            const dice = e.split('d')
            this.dice.push({ sides: dice[1], count: dice[0] })
          } else this.flat += parseInt(e)
        })
      }
      this.accuracy = this.presetAccuracy
    },
    clear() {
      this.dice.splice(0, this.dice.length)
      this.accRolls.splice(0, this.dice.length)
      this.flat = 0
      this.result = null
      this.accuracy = 0
      this.accTotal = 0
    },
    commit() {
      this.$emit('commit', {
        total: this.total,
        overkill: this.overkillRolls,
      })
      this.menu = false
    },
  },
})
</script>
