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
          :disabled="actionFree || used"
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
          :disabled="actionCost || used"
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
              </div>
              <div class="heading h2 accent--text">
                {{ mech.Hull }}
                <cc-synergy-display inline :mech="mech" location="hull" />
              </div>
            </v-col>
            <v-divider vertical />
            <v-col cols="auto">
              <div class="heading h3">
                agility
              </div>
              <div class="heading h2 accent--text">
                {{ mech.Agi }}
                <cc-synergy-display inline :mech="mech" location="agility" />
              </div>
            </v-col>
            <v-divider vertical />
            <v-col cols="auto">
              <div class="heading h3">
                systems
              </div>
              <div class="heading h2 accent--text">
                {{ mech.Sys }}
                <cc-synergy-display inline :mech="mech" location="systems" />
              </div>
            </v-col>
            <v-divider vertical />
            <v-col cols="auto">
              <div class="heading h3">
                engineering
              </div>
              <div class="heading h2 accent--text">
                {{ mech.Eng }}
                <cc-synergy-display inline :mech="mech" location="engineering" />
              </div>
            </v-col>
          </v-row>
        </v-col>
        <v-col cols="auto">
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
            :disabled="used"
            @click="$emit('use', actionFree)"
          >
            SUCCESS
          </v-btn>
        </v-col>
        <v-col md="6" lg="3" xl="2">
          <v-btn
            tile
            block
            :disabled="used"
            :color="failed ? 'error' : ''"
            @click="$emit('use', actionFree)"
          >
            FAILURE
          </v-btn>
        </v-col>
      </v-row>
    </v-slide-x-reverse-transition>
  </div>
</template>

<script lang="ts">
import { DiceRoller } from '@/class'
import Vue from 'vue'
import ActionDetailExpander from '../components/_ActionDetailExpander.vue'

export default Vue.extend({
  name: 'skill-check-dialog',
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
  },
  watch: {
    used: {
      immediate: true,
      deep: true,
      handler: function(newval) {
        if (!newval) this.reset()
      },
    },
  },
  methods: {
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
    },
  },
})
</script>
