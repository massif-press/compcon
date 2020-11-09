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
        Boot Up
        <v-btn slot="items" dark icon @click="hide">
          <v-icon large left>close</v-icon>
        </v-btn>
      </cc-titlebar>

      <v-card-text class="pt-2">
        <v-row dense justify="center" class="mb-n4">
          <v-col v-for="(s, i) in synergies" :key="`syn_${i}`" cols="auto" style="min-width: 30vw">
            <v-alert dense outlined class="py-1" color="primary">
              <div class="overline my-n2 subtle--text">
                ACTIVE SYNERGY
                <cc-slashes />
                <span class="text--text">{{ s.Origin }}</span>
              </div>
              <div class="body-text text--text" v-html="s.Detail" />
            </v-alert>
          </v-col>
        </v-row>

        <v-row justify="center" align="start">
          <v-col>
            <p class="text--text body-text ma-0">
              Clear SHUT DOWN and restore this mech to a powered state.
            </p>
          </v-col>
          <v-col cols="auto">
            <v-btn
              large
              tile
              block
              :disabled="actionFree"
              :color="`action--full ${actionFull ? 'lighten-1' : ''}`"
              @click="actionFull = select(actionFull)"
            >
              <v-icon left>mdi-hexagon-slice-6</v-icon>
              Boot Up
            </v-btn>
            <v-btn
              small
              tile
              block
              :disabled="actionFull"
              :color="`action--free ${actionFree ? 'lighten-1' : ''}`"
              @click="actionFree = select(actionFree)"
            >
              <v-icon left small>cci-free-action</v-icon>
              Free Action
              <cc-tooltip
                inline
                content="Special rules or equipment may allow you to Boot Up as a Free Action. Using this button will commit the action without spending a ${action.Activation} Action this turn"
              >
                <v-icon right small class="fadeSelect">mdi-information-outline</v-icon>
              </cc-tooltip>
            </v-btn>
          </v-col>
        </v-row>
        <v-slide-x-reverse-transition>
          <v-row v-if="actionFree || actionFull" no-gutters class="mt-2" justify="end">
            <v-spacer />
            <v-col style="min-width: 760px">
              <v-fade-transition group leave-absolute>
                <p v-if="timer > 0" key="p1" class="flavor-text stark--text ma-0">
                  >//[
                  <span class="accent--text">COMP/CON</span>
                  ] :
                  <span>COMPANION/CONCIERGE UNIT INITIALIZING</span>
                </p>
                <p v-if="timer > 10" key="p2" class="flavor-text stark--text ma-0">
                  >//[
                  <span class="accent--text">COMP/CON</span>
                  ] :
                  <span>GMS COMP/CON Unit Mk XI Rev 11.4.1c</span>
                </p>
                <p v-if="timer > 20" key="p3" class="flavor-text stark--text ma-0">
                  >//[
                  <span class="accent--text">COMP/CON</span>
                  ] :
                  <span>5016.8.22 General Massive Systems // Please Operate Responsibly</span>
                </p>
                <p v-if="timer > 30" key="p4" class="flavor-text stark--text ma-0">
                  >//[
                  <span class="accent--text">COMP/CON</span>
                  ] :
                  <span>HARD SYSTEM RESTART INITIATED</span>
                  <span v-if="timer > 40">{{ timeoutDots }}</span>
                </p>
                <p v-if="finished" key="p5" class="flavor-text stark--text ma-0">
                  >//[
                  <span class="accent--text">COMP/CON::COMBAT TELEMETRY LOG</span>
                  ] :
                  <span>INTERFACE ONLINE. REBOOT SUCCESSFUL.</span>
                  <cc-tooltip inline content="Undo this action, refunding any cost it may have had">
                    <v-btn x-small color="primary" class="fadeSelect" @click="reset">
                      <v-icon small left>mdi-reload</v-icon>
                      UNDO
                    </v-btn>
                  </cc-tooltip>
                </p>
              </v-fade-transition>
            </v-col>
          </v-row>
        </v-slide-x-reverse-transition>
      </v-card-text>

      <v-slide-y-reverse-transition>
        <div v-if="actionFree || actionFull">
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
import { Synergy } from '@/class'
import Vue from 'vue'

export default Vue.extend({
  name: 'disenage-dialog',
  props: {
    mech: {
      type: Object,
      required: true,
    },
  },
  data: () => ({
    actionFull: false,
    actionFree: false,
    dialog: false,
    timeoutDots: '',
    timer: 0,
    finished: false,
  }),
  computed: {
    synergies() {
      return Synergy.Collect('disengage', this.mech)
    },
  },
  methods: {
    runTimeout() {
      // eslint-disable-next-line @typescript-eslint/no-this-alias
      const self = this
      const timer = setInterval(function() {
        if (self.timer > 40) self.timeoutDots += '.'
        self.timer++

        if (self.timeoutDots.length === 30) {
          clearInterval(timer)
          self.timeoutDots += ' done'
          self.finished = true
        }
      }, 80)

      // const dotTimer = setTimeout(() => {
      //   this.timeoutDots += '.'
      // }, 1)
      // if (this.timeoutDots.length === 20) {
      //   clearTimeout(dotTimer)
      //   this.timeoutDots += 'done'
      // }
    },
    select(action) {
      this.runTimeout()
      return !action
    },
    reset() {
      this.actionFull = false
      this.actionFree = false
      this.finished = false
      this.timeoutDots = ''
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
