<template>
  <v-dialog
    v-model="dialog"
    :fullscreen="$vuetify.breakpoint.mdAndDown"
    :style="$vuetify.breakpoint.mdAndDown ? `x-overflow: hidden` : ''"
    width="90vw"
  >
    <v-card tile class="background">
      <cc-titlebar large color="action--full">
        <v-icon x-large>mdi-hexagon-slice-6</v-icon>
        Skill Check
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
            <v-col class="mt-n2">
              <v-row dense justify="space-around" class="text-center">
                <v-col cols="auto">
                  <div class="heading h3">
                    hull
                    <cc-synergy-display :mech="mech" location="hull" />
                  </div>
                  <div class="heading h2 accent--text">{{ mech.Hull }}</div>
                </v-col>
                <v-divider vertical />
                <v-col cols="auto">
                  <div class="heading h3">
                    agility
                    <cc-synergy-display :mech="mech" location="agility" />
                  </div>
                  <div class="heading h2 accent--text">{{ mech.Agi }}</div>
                </v-col>
                <v-divider vertical />
                <v-col cols="auto">
                  <div class="heading h3">
                    systems
                    <cc-synergy-display :mech="mech" location="systems" />
                  </div>
                  <div class="heading h2 accent--text">{{ mech.Sys }}</div>
                </v-col>
                <v-divider vertical />
                <v-col cols="auto">
                  <div class="heading h3">
                    engineering
                    <cc-synergy-display :mech="mech" location="engineering" />
                  </div>
                  <div class="heading h2 accent--text">{{ mech.Eng }}</div>
                </v-col>
              </v-row>
            </v-col>
            <v-col cols="auto">
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
                  <div class="overline mt-n2 pl-1">Skill Roll</div>
                  <v-row no-gutters>
                    <v-col class="mr-n2 ml-n2">
                      <cc-tooltip title="Roll Skill Check" :content="rollResultTooltip">
                        <v-btn icon small color="accent" class="mt-1 mr-n3" @click="rollSkill">
                          <v-icon large>mdi-dice-multiple</v-icon>
                        </v-btn>
                      </cc-tooltip>
                    </v-col>
                    <v-col>
                      <v-text-field
                        v-model="skillRoll"
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
          <v-row v-if="skillRoll" dense class="mt-n2">
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
          <v-row v-if="succeeded || failed" no-gutters class="mt-2">
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
    accuracy: 0,
    difficulty: 0,
    skillRoll: '',
    skillRollString: '',
    rollResultString: '',
    rollAccuracyResults: '[]',
    succeeded: false,
    failed: false,
    complete: false,
    actionCost: false,
    actionFree: false,
    timer: 0,
    finished: false,
  }),
  computed: {
    rollResultTooltip() {
      let str = this.skillRollString
      if (this.rollResultString) {
        str += `<div class="overline my-n2">Last Roll:</div><div class="caption ml-3">${this.rollResultString}`
        if (this.rollAccuracyResults.length)
          str += ` <span class="subtle--text">[${this.rollAccuracyResults.join(', ')}]</span>`
        str += '</div>'
      }
      return str
    },
    skLog() {
      if (this.succeeded) return ['SUCCESS RECORDED.']
      return ['FAILURE RECORDED.']
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
      this.action.Use()
      this.mech.Pilot.State.Actions -= 2
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
      this.skillRoll = roll.total
    },
    reset() {
      this.accuracy = 0
      this.difficulty = 0
      this.skillRoll = ''
      this.skillRollString = ''
      this.rollResultString = ''
      this.rollAccuracyResults = '[]'
      this.succeeded = false
      this.failed = false
      this.complete = false
      this.actionCost = false
      this.actionFree = false
      this.timer = 0
      this.finished = false
      this.mech.Pilot.State.Actions += 2
      this.action.Undo()
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
