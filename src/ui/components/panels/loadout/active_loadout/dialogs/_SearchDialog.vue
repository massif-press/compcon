<template>
  <v-dialog
    v-model="dialog"
    :fullscreen="$vuetify.breakpoint.mdAndDown"
    :style="$vuetify.breakpoint.mdAndDown ? `x-overflow: hidden` : ''"
    width="90vw"
  >
    <v-card tile class="background">
      <cc-titlebar large color="action--quick">
        <v-icon x-large>mdi-hexagon-slice-3</v-icon>
        Search
        <v-btn slot="items" dark icon @click="hide">
          <v-icon large left>close</v-icon>
        </v-btn>
      </cc-titlebar>

      <v-card-text class="pt-4">
        <cc-active-synergy :locations="action.SynergyLocations" :mech="mech" class="mb-n4" />

        <v-row justify="center" align="center">
          <v-col>
            <action-detail-expander :action="action" />
          </v-col>
          <v-col cols="auto">
            <v-btn
              large
              tile
              block
              :disabled="actionFree"
              :color="`${action.Color} ${actionCost ? 'lighten-1' : ''}`"
              @click="actionCost = !actionCost"
            >
              <v-icon left>{{ action.Icon }}</v-icon>
              {{ action.Name }}
            </v-btn>
            <v-btn
              v-if="action.Activation !== 'Free'"
              small
              tile
              block
              :disabled="actionCost"
              :color="`action--free ${actionFree ? 'lighten-1' : ''}`"
              @click="actionFree = !actionFree"
            >
              <v-icon left small>cci-free-action</v-icon>
              Free Action
              <cc-tooltip
                inline
                :content="
                  `Special rules or equipment may allow you to ${action.Name} as a Free Action. Using this button will commit the action without spending a Full Action this turn`
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
                <v-col cols="auto" class="ml-auto px-12 panel dual-sliced" style="height: 70px">
                  <div class="overline mt-n2 pl-4 mr-n4">Contested SYSTEMS</div>
                  <v-text-field
                    v-model="sys"
                    type="number"
                    style="width: 60px"
                    class="hide-input-spinners mt-n1 ml-10"
                    color="accent"
                    dense
                    hide-details
                    @change="sys = parseInt($event)"
                  />
                </v-col>
              </v-row>
            </v-col>
            <v-col cols="auto" class="ml-auto">
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
                  <div class="overline mt-n2 mr-n6 pl-3">Contested Roll</div>
                  <v-row no-gutters>
                    <v-col class="mr-n2 ml-n2">
                      <cc-tooltip title="SYSTEMS Roll" :content="rollResultTooltip">
                        <v-btn icon small color="accent" class="mt-1 mr-n3" @click="rollSkill">
                          <v-icon large>mdi-dice-multiple</v-icon>
                        </v-btn>
                      </cc-tooltip>
                    </v-col>
                    <v-col>
                      <v-text-field
                        v-model="roll"
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
                <v-col cols="auto" class="text-center mt-3 mr-6">
                  <div class="heading h1" v-html="`+${mech.Sys}`" />
                  <div class="mt-2">SYSTEMS</div>
                </v-col>
              </v-row>
            </v-col>
          </v-row>
        </v-slide-x-reverse-transition>

        <v-slide-x-reverse-transition>
          <v-row v-if="roll && sys" no-gutters class="mt-2">
            <v-col cols="auto" class="ml-auto" align="end">
              <v-fade-transition v-for="(s, i) in skLog" :key="`skLog_${i}`">
                <p v-if="timer > 10 * i" class="flavor-text stark--text ma-0">
                  <span>
                    >//[
                    <span class="accent--text">
                      COMP/CON:
                    </span>
                    ] :
                    <span>{{ s }}</span>
                  </span>
                </p>
              </v-fade-transition>
            </v-col>
          </v-row>
        </v-slide-x-reverse-transition>
        <v-slide-x-reverse-transition>
          <v-row v-if="finished" no-gutters>
            <v-col cols="auto" class="ml-auto">
              <cc-tooltip content="Undo this action, refunding any cost it may have had">
                <v-btn x-small color="primary" class="fadeSelect" @click="reset">
                  <v-icon small left>mdi-reload</v-icon>
                  UNDO
                </v-btn>
              </cc-tooltip>
            </v-col>
          </v-row>
        </v-slide-x-reverse-transition>
      </v-card-text>

      <v-slide-y-reverse-transition>
        <div v-if="complete">
          <v-divider />
          <v-card-actions>
            <v-spacer />
            <v-btn color="primary" tile @click="dialog = false">DISMISS</v-btn>
          </v-card-actions>
        </div>
      </v-slide-y-reverse-transition>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import { DiceRoller } from '@/class'
import Vue from 'vue'
import ActionDetailExpander from '../components/_ActionDetailExpander.vue'

export default Vue.extend({
  name: 'skill-check-dialog',
  components: { ActionDetailExpander },
  props: {
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
    dialog: false,
    sys: '',
    accuracy: 0,
    difficulty: 0,
    roll: '',
    rollString: '',
    rollResultString: '',
    rollAccuracyResults: '[]',
    complete: false,
    actionCost: false,
    actionFree: false,
    timer: 0,
    finished: false,
  }),
  computed: {
    succeeded() {
      if (this.roll && this.sys) {
        this.runTimeout()
        return this.roll >= this.sys
      }
      return false
    },
    rollResultTooltip() {
      let str = this.rollString
      if (this.rollResultString) {
        str += `<div class="overline my-n2">Last Roll:</div><div class="caption ml-3">${this.rollResultString}`
        if (this.rollAccuracyResults.length)
          str += ` <span class="subtle--text">[${this.rollAccuracyResults.join(', ')}]</span>`
        str += '</div>'
      }
      return str
    },
    skLog() {
      const l = ['FULL SUITE SCAN INITIATED.']
      if (this.succeeded) l.push('ALERT: WAVEFORM DETECTED. SIGNATURE IDENTIFIED.')
      else l.push('SENSOR SUBPROCESS RETURNED 0 RESULTS.')
      return l
    },
  },
  methods: {
    runTimeout() {
      // eslint-disable-next-line @typescript-eslint/no-this-alias
      const self = this
      const timer = setInterval(function() {
        self.timer++

        if (self.timer > self.skLog.length * 10) {
          clearInterval(timer)
          self.finished = true
        }
      }, 80)
    },
    select(action) {
      this.runTimeout()
      return !action
    },
    rollSkill(): void {
      const roll = DiceRoller.rollToHit(this.mech.Sys, this.accuracy, this.difficulty)
      this.rollResultString = `${roll.rawDieRoll} + ${roll.staticBonus}`
      if (roll.accuracyResult) {
        this.rollResultString += ` ${roll.accuracyResult > 0 ? '+' : '-'} ${Math.abs(
          roll.accuracyResult
        )}`
      }
      this.rollAccuracyResults = roll.rawAccuracyRolls
      this.roll = roll.total
    },
    reset() {
      this.accuracy = 0
      this.difficulty = 0
      this.sys = ''
      this.roll = ''
      this.rollString = ''
      this.rollResultString = ''
      this.rollAccuracyResults = '[]'
      this.complete = false
      this.actionCost = false
      this.actionFree = false
      this.timer = 0
      this.finished = false
    },
    show(): void {
      this.dialog = true
    },
    hide(): void {
      this.dialog = false
    },
  },
})
</script>
