<template>
  <v-dialog
    v-model="dialog"
    :fullscreen="$vuetify.breakpoint.mdAndDown"
    :style="$vuetify.breakpoint.mdAndDown ? `x-overflow: hidden` : ''"
    width="90vw"
  >
    <v-card tile class="background">
      <cc-titlebar large :color="action.Color" class="mb-1">
        <v-icon x-large>{{ action.Icon }}</v-icon>
        {{ action.Name }}
        <span
          v-if="action.Origin"
          class="pl-1 flavor-text white--text font-weight-light"
          style="opacity: 0.7"
        >
          // {{ action.Origin }}
        </span>
        <v-btn slot="items" dark icon @click="hide">
          <v-icon large left>close</v-icon>
        </v-btn>
      </cc-titlebar>

      <v-card-text class="pt-3">
        <cc-active-synergy :locations="action.SynergyLocations" :mech="mech" class="mb-n4" />

        <v-row justify="center" align="center">
          <v-col v-if="action.Detail">
            <action-detail-expander :action="action" />
          </v-col>
          <v-col cols="auto">
            <v-btn
              large
              tile
              block
              :disabled="canCostActivate"
              :color="`${action.Color} ${actionCost ? 'lighten-1' : ''}`"
              @click="actionCost = select(actionCost, action.Activation)"
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
              @click="actionFree = select(actionFree, 'Free')"
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
            <div v-if="action.HeatCost" class="overline error--text text-center">
              ALERT: This action will incur {{ action.HeatCost }} heat
            </div>
          </v-col>
        </v-row>
        <v-slide-x-reverse-transition>
          <v-row v-if="actionFree || actionCost" no-gutters class="mt-2">
            <v-col cols="auto" class="ml-auto" align="end">
              <v-fade-transition v-for="(s, i) in finalLog" :key="`log_${i}`">
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
import { ActivationType } from '@/class'
import Vue from 'vue'
import ActionDetailExpander from '../components/_ActionDetailExpander.vue'

export default Vue.extend({
  name: 'action-dialog-base',
  components: { ActionDetailExpander },
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
    actionCost: false,
    actionFree: false,
    dialog: false,
    expanded: false,
    timer: 0,
    finished: false,
  }),
  computed: {
    canCostActivate() {
      if (this.actionFree) return true
      if (this.action.Used) return true
      //check item canUse
      let activationCost = 0
      if (this.action.Activation === ActivationType.Quick) activationCost = 1
      else if (this.action.Activation === ActivationType.Full) activationCost = 2
      return this.mech.Pilot.State.Actions < activationCost
    },
    finalLog() {
      const out = this.action.Confirm
      if (this.action.HeatCost) out.push('ALERT: REACTOR HEAT LEVELS INCREASING')
      return out
    },
  },
  methods: {
    runTimeout() {
      // eslint-disable-next-line @typescript-eslint/no-this-alias
      const self = this
      const timer = setInterval(function() {
        self.timer++

        if (self.timer > self.action.Confirm.length * 10) {
          clearInterval(timer)
          self.finished = true
        }
      }, 80)
    },
    select(activation, activationType) {
      this.runTimeout()
      this.mech.Pilot.State.CommitAction(this.action, activationType)
      this.$emit('use', this.action.Cost || 1)
      return !activation
    },
    reset() {
      const activationType = this.actionFree ? ActivationType.Free : this.action.Activation
      this.mech.Pilot.State.UndoAction(this.action, activationType)
      this.$emit('reset', this.action.Cost)
      this.actionCost = false
      this.actionFree = false
      this.finished = false
      this.timer = 0
    },
    show(): void {
      this.dialog = true
    },
    hide(): void {
      const activation = this.actionCost ? this.action.Activation : ActivationType.Free
      this.$emit('close', activation)
      this.dialog = false
    },
  },
})
</script>
