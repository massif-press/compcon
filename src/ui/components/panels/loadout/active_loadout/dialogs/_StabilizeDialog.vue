<template>
  <v-dialog
    v-model="dialog"
    :fullscreen="$vuetify.breakpoint.mdAndDown"
    :style="$vuetify.breakpoint.mdAndDown ? `x-overflow: hidden` : ''"
    width="90vw"
  >
    <v-card tile class="background">
      <action-titlebar :action="action" :mech="mech" @hide="hide()" />

      <v-card-text class="pt-4">
        <cc-active-synergy :locations="action.SynergyLocations" :mech="mech" class="mb-n4" />

        <action-detail-expander :action="action" />
        <v-row justify="center" align="center">
          <v-col>
            <v-row dense justify="space-around">
              <v-col cols="auto">
                <div class="heading h3 text-center">Choose one of the following:</div>
                <v-radio-group v-model="stabilizeMajor" dense hide-details colum>
                  <v-radio
                    label="Cool Mech, resetting the heat gauge and ending the EXPOSED status"
                    value="cool"
                    color="accent"
                  />
                  <v-radio
                    :label="
                      `Spend 1 Repair to restore HP to maximum. ${
                        !mech.CurrentRepairs ? ' // REPAIR CAPACITY EXHAUSTED //' : ''
                      }`
                    "
                    value="repair"
                    color="accent"
                    :disabled="!mech.CurrentRepairs"
                  />
                </v-radio-group>
              </v-col>
              <v-col cols="auto">
                <v-divider vertical />
              </v-col>
              <v-col cols="auto">
                <div class="heading h3 text-center">And one of the following:</div>
                <v-radio-group v-model="stabilizeMinor" color="accent" dense hide-details column>
                  <v-radio
                    label="Reload all weapons with the LOADING Tag"
                    value="reload"
                    color="accent"
                  />
                  <v-radio
                    label="End all BURN currently affecting your mech"
                    value="end_burn"
                    color="accent"
                    :disabled="mech.Burn === 0"
                  />
                  <v-radio
                    label="End a condition affecting your mech"
                    value="end_self_condition"
                    color="accent"
                    :disabled="!mech.Conditions.length"
                  />
                  <v-radio
                    label="End a condition affecting an adjacent ally"
                    value="end_ally_condition"
                    color="accent"
                  />
                </v-radio-group>
              </v-col>
            </v-row>
          </v-col>
          <v-col cols="auto">
            <v-btn
              large
              tile
              block
              :disabled="!stabilizeMajor || !stabilizeMinor || actionFree"
              :color="`${action.Color} ${actionCost ? 'lighten-1' : ''}`"
              @click="actionCost = select(actionCost)"
            >
              <v-icon left>{{ action.Icon }}</v-icon>
              {{ action.Name }}
            </v-btn>
            <v-btn
              v-if="action.Activation !== 'Free'"
              small
              tile
              block
              :disabled="!stabilizeMajor || !stabilizeMinor || actionCost"
              :color="`action--free ${actionFree ? 'lighten-1' : ''}`"
              @click="actionFree = select(actionFree)"
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
          <v-row v-if="actionFree || actionCost" no-gutters class="mt-2">
            <v-col cols="auto" class="ml-auto" align="end">
              <v-fade-transition v-for="(s, i) in dLog" :key="`dLog_${i}`">
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
        <div v-if="actionFree || actionCost">
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
import Vue from 'vue'
import ActionDetailExpander from '../components/_ActionDetailExpander.vue'
import ActionTitlebar from '../components/_ActionTitlebar.vue'

export default Vue.extend({
  name: 'stabilize-dialog',
  components: { ActionDetailExpander, ActionTitlebar },
  props: {
    synergyLocation: { type: [String, Array], required: false, default: () => [] },
    log: { type: Array, required: false, default: () => [] },
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
    stabilizeMajor: null,
    stabilizeMinor: null,
    actionCost: false,
    actionFree: false,
    dialog: false,
    timer: 0,
    finished: false,
  }),
  computed: {
    dLog() {
      const arr = ['EMERGENCY PROTOCOLS ACTIVATED.']
      if (this.stabilizeMajor === 'cool') arr.push('VENTING REACTOR HEAT.')
      else if (this.stabilizeMajor === 'repair') arr.push('AUTOREPAIR SUBSYSTEMS ENGAGED.')

      if (this.stabilizeMinor === 'reload') arr.push('RELOADING WEAPONS.')
      else if (this.stabilizeMinor === 'end_burn') arr.push('SUPPRESSANTS DEPLOAYED.')
      else if (this.stabilizeMinor === 'end_self_condition')
        arr.push('SYSTEM RESTORATION COMPLETED.')
      else if (this.stabilizeMinor === 'end_ally_condition') arr.push('REMOTE ASSIST ON.')
      return arr
    },
  },
  methods: {
    runTimeout() {
      // eslint-disable-next-line @typescript-eslint/no-this-alias
      const self = this
      const timer = setInterval(function() {
        self.timer++

        if (self.timer > self.dLog.length * 10) {
          clearInterval(timer)
          self.finished = true
        }
      }, 80)
    },
    select(action) {
      this.runTimeout()
      this.action.Use()
      this.mech.Pilot.State.CommitStabilize(this.stabilizeMajor, this.stabilizeMinor)
      return !action
    },
    reset() {
      this.actionCost = false
      this.actionFree = false
      this.finished = false
      this.action.Use()
      this.mech.Pilot.State.UndoStabilize(this.stabilizeMajor, this.stabilizeMinor)
      this.timer = 0
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
