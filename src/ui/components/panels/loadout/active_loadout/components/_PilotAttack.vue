<template>
  <div>
    <v-row dense>
      <v-col>
        <slot />
      </v-col>
      <v-col cols="auto" class="ml-auto">
        <cc-tags v-if="item.Tags" :tags="item.Tags" />
      </v-col>
    </v-row>

    <v-row dense justify="center" class="mt-n1 mb-n4">
      <v-col v-for="(s, i) in synergies" :key="`syn_${i}`" cols="auto" style="min-width: 30vw">
        <v-alert dense outlined class="py-1" color="primary">
          <div class="overline my-n2 subtle--text">
            ACTIVE SYNERGY
            <cc-slashes />
            <span class="text--text">{{ s.Origin }}</span>
          </div>
          <div class="body-text text--text" v-html-safe="s.Detail" />
        </v-alert>
      </v-col>
    </v-row>

    <v-slide-y-reverse-transition>
      <v-container v-if="!confirmed" fluid>
        <v-row dense align="center" class="mt-n1">
          <v-col lg="auto" md="12" class="mt-n5">
            <v-row dense class="text-center mb-n3" justify="start" align="start">
              <v-col v-if="item.Range" cols="auto" class="mr-8">
                <div class="overline">Range</div>
                <cc-range-element :range="getRange" class="d-inline" />
              </v-col>
              <v-col cols="auto" class="mx-8">
                <div class="overline mb-n2">Attack Roll</div>
                <div class="heading text--text" style="font-size: 24pt;">
                  <v-icon x-large class="mr-n1">mdi-dice-d20-outline</v-icon>
                  + {{ pilot.Grit }}
                </div>
              </v-col>
              <v-col cols="auto" class="mx-8">
                <div class="overline mb-n3">vs. Target</div>
                <v-icon x-large v-html="isSmart ? 'cci-edef' : 'cci-evasion'" />
                <div
                  class="overline font-weight-bold mt-n2"
                  v-html="isSmart ? 'E-Defense' : 'Evasion'"
                />
              </v-col>
              <v-col cols="auto" class="ml-8">
                <div class="overline">Damage</div>
                <cc-damage-element :damage="getDamage" class="d-inline" />
              </v-col>
            </v-row>
          </v-col>
          <v-col lg="auto" md="12" class="ml-auto">
            <v-row dense justify="end">
              <v-col
                cols="auto"
                class="ml-auto px-12 mr-n10 panel dual-sliced"
                style="height: 70px"
              >
                <div class="overline mt-n2 pl-1">Accuracy</div>
                <v-text-field
                  v-model="accuracy"
                  type="number"
                  append-outer-icon="mdi-plus-circle-outline"
                  append-icon="cci-accuracy"
                  prepend-icon="mdi-minus-circle-outline"
                  style="width: 115px"
                  class="hide-input-spinners"
                  color="accent"
                  dense
                  hide-details
                  @click:append-outer="accuracy < 99 ? (accuracy += 1) : ''"
                  @click:prepend="accuracy > minAccuracy ? (accuracy -= 1) : ''"
                  @change="accuracy = parseInt($event)"
                />
              </v-col>
              <v-col cols="auto" class="px-12 mr-n10 panel dual-sliced" style="height: 70px">
                <div class="overline mt-n2 pl-1">Difficulty</div>
                <v-text-field
                  v-model="difficulty"
                  type="number"
                  append-outer-icon="mdi-plus-circle-outline"
                  append-icon="cci-difficulty"
                  prepend-icon="mdi-minus-circle-outline"
                  style="width: 115px"
                  class="hide-input-spinners"
                  color="accent"
                  dense
                  hide-details
                  @click:append-outer="difficulty < 99 ? (difficulty += 1) : ''"
                  @click:prepend="difficulty > minDifficulty ? (difficulty -= 1) : ''"
                  @change="difficulty = parseInt($event)"
                />
              </v-col>
              <v-col cols="auto" class="px-12 panel dual-sliced" style="height: 70px">
                <div class="overline mt-n2 pl-1">Attack Roll</div>
                <v-row no-gutters>
                  <v-col class="mr-n2 ml-n2">
                    <cc-tooltip title="Roll to Attack" :content="attackRollTooltip">
                      <v-btn
                        icon
                        small
                        :color="crit ? 'secondary' : 'accent'"
                        class="mt-1 mr-n3"
                        @click="rollAttack"
                      >
                        <v-icon large>mdi-dice-multiple</v-icon>
                      </v-btn>
                    </cc-tooltip>
                  </v-col>
                  <v-col>
                    <v-text-field
                      v-model="attackRoll"
                      type="number"
                      :class="`hide-input-spinners ml-n3 ${crit ? 'font-weight-bold' : ''}`"
                      style="max-width: 60px; margin-top: -0.5px"
                      :color="crit ? 'secondary' : 'accent'"
                      dense
                      hide-details
                    />
                  </v-col>
                </v-row>
                <div v-if="crit" class="caption secondary--text font-weight-bold ml-8 my-n1">
                  CRITICAL
                </div>
              </v-col>
              <v-col cols="auto" class="ml-2 mt-n1">
                <v-btn
                  large
                  tile
                  block
                  :disabled="attackFree || !attackRoll"
                  :color="
                    `${crit ? 'secondary' : overwatch ? 'action--reaction' : 'action--full'} ${
                      attackQuick ? 'lighten-1' : ''
                    }`
                  "
                  @click="attackQuick = !attackQuick"
                >
                  <v-icon left>{{ overwatch ? 'cci-reaction' : 'mdi-hexagon-slice-6' }}</v-icon>
                  Attack
                </v-btn>
                <v-btn
                  small
                  tile
                  block
                  :disabled="attackQuick || !attackRoll"
                  :color="`action--free ${attackFree ? 'lighten-1' : ''}`"
                  @click="attackFree = !attackFree"
                >
                  <v-icon left small>cci-free-action</v-icon>
                  Free Action
                  <cc-tooltip
                    inline
                    content="Special rules or equipment may allow you to Fight as a Free Action. Using this button will commit the attack without spending a Quick Action this turn"
                  >
                    <v-icon right small class="fadeSelect">mdi-information-outline</v-icon>
                  </cc-tooltip>
                </v-btn>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
        <v-slide-x-reverse-transition>
          <v-row v-if="attacked" dense class="mt-n2">
            <v-col md="6" lg="3" xl="2" class="ml-auto">
              <v-btn
                tile
                block
                class="primary"
                :color="`${crit ? 'secondary' : 'primary'} ${hit ? 'lighten-1' : ''}`"
                :disabled="missed"
                @click="hit = !hit"
              >
                HIT
              </v-btn>
            </v-col>
            <v-col md="6" lg="3" xl="2">
              <v-btn
                tile
                block
                :disabled="hit"
                :color="missed ? 'error' : ''"
                @click="missed = !missed"
              >
                MISSED
              </v-btn>
            </v-col>
          </v-row>
        </v-slide-x-reverse-transition>
        <v-slide-x-reverse-transition>
          <v-row v-if="hit || missed" dense align="center" class="mt-1">
            <v-col cols="auto" class="ml-auto" />
            <v-col v-if="hit && crit" cols="auto" class="text-center">
              <cc-tooltip
                :content="
                  `On a critical hit, all damage dice are rolled twice
(including bonus damage) and the highest result from
each source of damage is used.`
                "
              >
                <v-icon x-large color="secondary">mdi-progress-alert</v-icon>
                <div class="secondary--text">CRITICAL HIT</div>
              </cc-tooltip>
            </v-col>
            <v-col
              v-if="hit"
              cols="auto"
              class="px-12 mr-n10 panel dual-sliced mt-n2"
              style="height: 70px"
            >
              <div class="overline mt-n2 mb-n2 pl-1">
                {{ getDamage.length > 1 ? 'Damage Rolls' : 'Damage Roll' }}
              </div>
              <v-row no-gutters>
                <v-col class="mr-n2 ml-n2">
                  <cc-tooltip title="Roll Damage" :content="damageRollTooltip">
                    <v-btn
                      icon
                      small
                      :color="crit ? 'secondary' : 'accent'"
                      class="mt-1 mr-n3"
                      @click="rollDamage"
                    >
                      <v-icon large>mdi-dice-multiple</v-icon>
                    </v-btn>
                  </cc-tooltip>
                </v-col>
                <v-col>
                  <v-text-field
                    v-for="(d, i) in getDamage"
                    :key="`rolled_damage_${i}`"
                    v-model="damageRolls[i]"
                    type="number"
                    :class="`hide-input-spinners ml-n3 ${crit ? 'font-weight-bold' : ''}`"
                    style="max-width: 60px; margin-top: -0.5px"
                    :color="crit ? 'secondary' : 'accent'"
                    dense
                    :hint="d.Type"
                    persistent-hint
                  />
                </v-col>
              </v-row>
            </v-col>
            <v-col
              v-if="hit"
              cols="auto"
              class="px-12 mr-n10 panel dual-sliced mt-n2"
              style="height: 70px"
            >
              <div class="overline mt-n2 mb-n2 pl-1">Bonus Damage</div>
              <v-text-field
                v-model="bonusDamage"
                type="number"
                style="width: 50px"
                class="hide-input-spinners mt-n1 mb-2 ml-6"
                color="accent"
                dense
                hide-details
                @change="bonusDamage = parseInt($event)"
              />
            </v-col>
            <v-slide-x-reverse-transition>
              <v-col
                v-if="hit"
                cols="auto"
                class="px-12 panel dual-sliced mt-n2"
                style="height: 70px"
              >
                <div class="overline mt-n2 mb-n2 pl-1">Total Damage</div>
                <v-row no-gutters justify="end">
                  <v-col v-for="(d, i) in getDamage" :key="`dm_result_${i}`" cols="auto">
                    <div class="heading h2 stark--text">
                      {{ damageRolls[i] ? damageRolls[i] : '--' }}
                      <cc-tooltip inline :content="d.Type">
                        <v-icon large :color="d.Color" class="ml-n3">
                          {{ d.Icon }}
                        </v-icon>
                      </cc-tooltip>
                    </div>
                  </v-col>
                  <v-col v-if="bonusDamage" cols="auto" class="ml-n1">
                    <div class="heading h2 stark--text" style="margin-top: 4px">
                      +{{ bonusDamage }}
                    </div>
                  </v-col>
                </v-row>
                <div v-if="summedDamage" class="overline my-n3 pr-1 subtle--text text-right">
                  <b v-if="!!reliable && summedDamage < reliable" class="accent--text">
                    ({{ reliable }})
                  </b>
                  <span v-else>({{ summedDamage }})</span>
                </div>
              </v-col>
            </v-slide-x-reverse-transition>
            <v-slide-x-reverse-transition>
              <v-col
                v-if="
                  (missed && !!reliable) || (summedDamage && !!reliable && summedDamage < reliable)
                "
                cols="auto"
                class="text-center mt-1 ml-n5 mr-6"
              >
                <cc-tooltip :content="`This attack deals a minimum of ${reliable} damage`">
                  <v-icon x-large>mdi-progress-alert</v-icon>
                  <div>RELIABLE {{ reliable }}</div>
                </cc-tooltip>
              </v-col>
            </v-slide-x-reverse-transition>

            <v-slide-x-reverse-transition>
              <v-col v-if="hit || missed" cols="auto" class="text-center mt-n2 mb-n5 ml-n4">
                <v-row no-gutters class="mt-2">
                  <v-col cols="auto" class="ml-auto">
                    <v-btn
                      large
                      tile
                      color="success darken-2"
                      :disabled="hit && !summedDamage"
                      @click="confirm()"
                    >
                      <v-icon left>mdi-check</v-icon>
                      Confirm
                    </v-btn>
                  </v-col>
                </v-row>
                <v-row v-if="hit || (missed && !!reliable)" no-gutters class="mt-n4">
                  <v-col cols="auto" class="ml-auto">
                    <v-checkbox
                      v-model="kill"
                      color="accent"
                      dense
                      :disabled="hit && !summedDamage"
                    >
                      <span slot="label" class="caption">TARGET DESTROYED</span>
                    </v-checkbox>
                  </v-col>
                </v-row>
              </v-col>
            </v-slide-x-reverse-transition>
          </v-row>
        </v-slide-x-reverse-transition>
      </v-container>
    </v-slide-y-reverse-transition>
    <v-slide-x-reverse-transition>
      <div v-if="hit || missed" no-gutters class="mt-2 text-right">
        <cc-tooltip inline content="Undo this attack, refunding any actions it may have cost">
          <v-btn x-small color="primary" class="fadeSelect" @click="reset">
            <v-icon small left>mdi-reload</v-icon>
            UNDO
          </v-btn>
        </cc-tooltip>
      </div>
    </v-slide-x-reverse-transition>
  </div>
</template>

<script lang="ts">
/* eslint-disable @typescript-eslint/indent */
import Vue from 'vue'
import { ActivationType, DiceRoller, Synergy } from '@/class'

export default Vue.extend({
  name: 'weapon-attack',
  props: {
    item: {
      type: Object,
      required: true,
    },
    pilot: {
      type: Object,
      required: true,
    },
    overwatch: { type: Boolean },
  },
  data: () => ({
    accuracy: 0,
    difficulty: 0,
    attackRoll: null,
    rollResultString: null,
    rollAccuracyResults: [],
    attackQuick: false,
    attackFree: false,
    hit: false,
    missed: false,
    damageRolls: [],
    damageResultString: null,
    bonusDamage: null,
    kill: false,
    confirmed: false,
  }),
  computed: {
    missText() {
      if (this.reliable) return 'Glancing hit'
      return 'Missed'
    },
    crit() {
      return this.attackRoll && this.attackRoll >= 20
    },
    attacked() {
      return this.attackQuick || this.attackFree
    },
    synergies() {
      const sArr = Synergy.Collect('pilot_weapon', this.pilot.ActiveMech, this.item)
      return sArr
    },
    getRange() {
      if (!this.item) return []
      return this.item.Range
    },
    getDamage() {
      if (!this.item) return []
      return this.item.Damage
    },
    isSmart() {
      if (this.item.Tags.some(x => x.IsSmart)) return true
      return false
    },
    reliable() {
      const r = this.item.Tags.find(x => x.ID === 'tg_reliable')
      return r ? r.Value : 0
    },
    minAccuracy() {
      let bonus = 0
      if (this.item.Tags.some(x => x.ID === 'tg_accurate')) bonus += 1
      if (this.item.Mod && this.item.Mod.AddedTags.some(x => x.ID === 'tg_accurate')) bonus += 1
      return bonus
    },
    minDifficulty() {
      if (this.item.Tags.some(x => x.ID === 'tg_inaccurate')) return 1
      if (this.item.Mod && this.item.Mod.AddedTags.some(x => x.ID === 'tg_inaccurate')) return 1
      return 0
    },
    attackRollString() {
      let str = `<div class="text-center"><div class='overline my-n2 subtle--text'>1d20 + Attack Bonus + (Accuracy - Difficulty)</div>`
      str += `<div class='heading h3 text--text'>1d20 + ${this.pilot.Grit}`
      const totalAcc = this.accuracy - this.difficulty
      if (totalAcc) {
        str += ` ${totalAcc > 0 ? '+' : '-'} ${Math.abs(totalAcc)}d6`
        if (Math.abs(totalAcc) > 1)
          str += ' <span class="caption subtle--text">(take highest)</span>'
      }
      str += '</div></div>'
      return str
    },
    attackRollTooltip() {
      let str = this.attackRollString
      if (this.rollResultString) {
        str += `<div class="overline my-n2">Last Roll:</div><div class="caption ml-3">${this.rollResultString}`
        if (this.rollAccuracyResults.length)
          str += ` <span class="subtle--text">[${this.rollAccuracyResults.join(', ')}]</span>`
        str += '</div>'
      } else str += '<div><br></div>'
      return str
    },
    damageRollString() {
      let str = '<div class="heading h3 text--text">'
      this.getDamage.forEach((d, i) => {
        str += `${i > 0 ? ' + ' : ''}${d.Value}`
      })
      str += '</div>'
      return str
    },
    damageRollTooltip() {
      let str = this.damageRollString
      str += `<div class="overline my-n2">Last Roll:</div><div class="caption ml-3">${this
        .damageResultString || '--'}</div>`
      return str
    },
    summedDamage() {
      let dmg = 0
      this.damageRolls.forEach(v => {
        dmg += parseInt(v)
      })
      if (this.bonusDamage) dmg += parseInt(this.bonusDamage)
      return dmg
    },
    finalDamage() {
      return this.reliable > this.summedDamage ? this.reliable : this.summedDamage
    },
  },
  mounted() {
    this.init()
  },
  methods: {
    rollAttack(): void {
      const roll = DiceRoller.rollToHit(this.pilot.Grit, this.accuracy, this.difficulty)
      this.rollResultString = `${roll.rawDieRoll} + ${roll.staticBonus}`
      if (roll.accuracyResult) {
        this.rollResultString += ` ${roll.accuracyResult > 0 ? '+' : '-'} ${Math.abs(
          roll.accuracyResult
        )}`
      }
      this.rollAccuracyResults = roll.rawAccuracyRolls
      this.attackRoll = roll.total
    },
    rollDamage(): void {
      this.damageResultString = ''
      this.getDamage.forEach((d, i) => {
        const result = DiceRoller.rollDamage(d.Value, this.crit)
        if (this.damageRolls[i]) {
          Vue.set(this.damageRolls, i, result.total)
        } else {
          this.damageRolls.push(result.total)
        }
        this.damageResultString += `<b>${result.total}</b> ${
          d.Type
        } Damage <span class="subtle--text">[${result.rawDieRolls.join(', ')}]</span>`
      })
    },
    confirm(): void {
      this.confirmed = true
      const actionObj = {
        accuracy: this.accuracy - this.difficulty,
        hit: this.hit,
        damage: this.summedDamage,
        kill: this.kill,
        activation: this.overwatch
          ? ActivationType.Reaction
          : this.attackQuick
          ? ActivationType.Quick
          : ActivationType.Free,
      }
      let cost = 1
      cost = this.item.Cost
      this.item.Use(cost)
      this.pilot.State.LogAttackAction('FIGHT', this.item.Name, this.summedDamage, this.kill)
      this.$emit('confirm', actionObj)
    },
    reset() {
      this.pilot.State.UndoLogAttackAction('FIGHT', this.item.Name, this.summedDamage, this.kill)
      this.init()
      this.$emit('reset')
    },
    init(): void {
      this.accuracy += this.minAccuracy
      this.difficulty += this.minDifficulty
      this.attackRoll = null
      this.rollResultString = null
      this.rollAccuracyResults = []
      this.attackQuick = false
      this.attackFree = false
      this.hit = false
      this.missed = false
      this.damageRolls = []
      this.damageResultString = null
      this.bonusDamage = null
      this.kill = false
      this.confirmed = false
    },
  },
})
</script>
