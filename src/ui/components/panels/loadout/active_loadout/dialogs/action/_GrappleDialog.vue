<template>
  <div class="pt-2">
    <v-row justify="center" align="center">
      <v-col>
        <action-detail-expander :action="action" />
      </v-col>
      <v-col cols="auto">
        <v-btn
          large
          tile
          block
          :disabled="used || actionFree"
          :color="action.Color"
          @click="actionCost = !actionCost"
        >
          <v-icon left>{{ action.Icon }}</v-icon>
          {{ action.Name }}
        </v-btn>
        <v-btn
          small
          tile
          block
          :disabled="actionCost"
          color="action--free"
          @click="actionFree = !actionFree"
        >
          <v-icon left small>cci-free-action</v-icon>
          Free Action
          <cc-tooltip
            inline
            :content="
              `Special rules or equipment may allow you to ${action.Name} as a Free Action. Using this button will commit the action without spending a ${action.Activation} Action this turn`
            "
          >
            <v-icon right small class="fadeSelect">mdi-information-outline</v-icon>
          </cc-tooltip>
        </v-btn>
      </v-col>
    </v-row>

    <v-slide-x-reverse-transition>
      <v-row v-if="actionFree || actionCost" justify="center" align="center">
        <v-col lg="auto" md="12" class="mt-n5">
          <v-row dense class="text-center mb-n3" justify="start" align="start">
            <v-col cols="auto" class="mx-8">
              <div class="overline mb-n2">Attack Roll</div>
              <div class="heading text--text" style="font-size: 24pt;">
                <v-icon x-large class="mr-n1">mdi-dice-d20-outline</v-icon>
                + {{ mech.AttackBonus }}
              </div>
            </v-col>
            <v-col cols="auto" class="mx-8">
              <div class="overline mb-n3">vs. Target</div>
              <v-icon x-large v-html="'cci-evasion'" />
              <div class="overline font-weight-bold mt-n2" v-html="'Evasion'" />
            </v-col>
          </v-row>
        </v-col>
        <v-col cols="auto" class="ml-auto">
          <v-row dense justify="end">
            <v-col cols="auto" class="ml-auto px-12 mr-n10 panel dual-sliced" style="height: 70px">
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
              <div class="overline mt-n2 mr-n6 pl-3">Melee Attack Roll</div>
              <v-row no-gutters>
                <v-col class="mr-n2 ml-n2">
                  <cc-tooltip title="Roll Melee Attack" :content="rollResultTooltip">
                    <v-btn icon small color="accent" class="mt-1 mr-n3" @click="rollSkill">
                      <v-icon large>mdi-dice-multiple</v-icon>
                    </v-btn>
                  </cc-tooltip>
                </v-col>
                <v-col>
                  <v-text-field
                    v-model="attackRoll"
                    type="number"
                    class="hide-input-spinners ml-n3"
                    style="max-width: 60px; margin-top: -0.5px"
                    color="accent"
                    dense
                    hide-details
                  />
                </v-col>
              </v-row>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </v-slide-x-reverse-transition>

    <v-slide-x-reverse-transition>
      <v-row v-if="attackRoll" dense class="mt-n2">
        <v-col md="6" lg="3" xl="2" class="ml-auto">
          <v-btn
            tile
            block
            class="primary"
            :color="`primary ${succeeded ? 'lighten-1' : ''}`"
            :disabled="failed"
            @click="succeeded = select(succeeded)"
          >
            SUCCESS
          </v-btn>
        </v-col>
        <v-col md="6" lg="3" xl="2">
          <v-btn
            tile
            block
            :disabled="succeeded"
            :color="failed ? 'error' : ''"
            @click="failed = select(failed)"
          >
            FAILURE
          </v-btn>
        </v-col>
      </v-row>
    </v-slide-x-reverse-transition>
    <v-slide-x-reverse-transition>
      <v-row v-if="succeeded" no-gutters justify="center" class="mt-2">
        <v-col cols="auto" class="ml-auto" align="end" style="max-width: 800px">
          <div class="body-text stark--text text-left">
            <b>Grapple Success</b>
            <ul>
              <li>You and your target are ENGAGED</li>
              <li>
                Neither you nor your target can BOOST or take reactions for the duration of the
                grapple
              </li>
              <li>
                The smaller character becomes IMMOBILIZED but moves when the larger party moves,
                mirroring their movement. If both parties are the same SIZE, either can make
                contested HULL checks at the start of their turn: the winner counts as larger than
                the loser until this contest is repeated.
              </li>
            </ul>
          </div>
        </v-col>
      </v-row>
    </v-slide-x-reverse-transition>
  </div>
</template>

<script lang="ts">
import { DiceRoller } from '@/class'
import Vue from 'vue'
import ActionDetailExpander from '../../components/_ActionDetailExpander.vue'

export default Vue.extend({
  name: 'grapple-dialog',
  components: { ActionDetailExpander },
  props: {
    used: { type: Boolean },
    mech: {
      type: Object,
      required: true,
    },
    action: {
      type: Object,
      required: true,
    },
  },
  data: () => ({
    accuracy: 0,
    difficulty: 0,
    attackRoll: '',
    attackRollString: '',
    rollResultString: '',
    rollAccuracyResults: '[]',
    succeeded: false,
    failed: false,
    actionCost: false,
    actionFree: false,
  }),
  computed: {
    rollResultTooltip() {
      let str = this.attackRollString
      if (this.rollResultString) {
        str += `<div class="overline my-n2">Last Roll:</div><div class="caption ml-3">${this.rollResultString}`
        if (this.rollAccuracyResults.length)
          str += ` <span class="subtle--text">[${this.rollAccuracyResults.join(', ')}]</span>`
        str += '</div>'
      }
      return str
    },
  },
  watch: {
    used: {
      immediate: true,
      deep: true,
      handler: function(newval) {
        if (!newval) this.init()
      },
    },
  },
  methods: {
    select(action) {
      this.$emit('use', this.actionFree)
      return !action
    },
    rollSkill(): void {
      const roll = DiceRoller.rollToHit(this.mech.AttackBonus, this.accuracy, this.difficulty)
      this.rollResultString = `${roll.rawDieRoll} + ${roll.staticBonus}`
      if (roll.accuracyResult) {
        this.rollResultString += ` ${roll.accuracyResult > 0 ? '+' : '-'} ${Math.abs(
          roll.accuracyResult
        )}`
      }
      this.rollAccuracyResults = roll.rawAccuracyRolls
      this.attackRoll = roll.total
    },
    init() {
      this.accuracy = 0
      this.difficulty = 0
      this.attackRoll = ''
      this.attackRollString = ''
      this.rollResultString = ''
      this.rollAccuracyResults = '[]'
      this.succeeded = false
      this.failed = false
      this.actionCost = false
      this.actionFree = false
    },
  },
})
</script>
