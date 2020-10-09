<template>
  <v-dialog
    v-model="dialog"
    :quickscreen="$vuetify.breakpoint.mdAndDown"
    :style="$vuetify.breakpoint.mdAndDown ? `x-overflow: hidden` : ''"
    width="90vw"
  >
    <v-card tile class="background">
      <cc-titlebar large color="action--quick">
        <v-icon x-large>mdi-hexagon-slice-3</v-icon>
        Prepare
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
            <p class="text--text body-text mb-1">
              Ready a
              <b>QUICK ACTION</b>
              for a specific time or when a specific condition is met.
              <br />
              Specify a
              <b><u>trigger</u></b>
              <cc-tooltip
                inline
                content="The trigger for your prepared action must be phrased as “When
              X, then Y,” where X is a reaction, action or move taken by a hostile or allied
              character and Y is your action. For example, “when an allied character moves adjacent
              to me, I want to throw a smoke grenade,” or “when a hostile character moves adjacent
              to me, I want to ram them”"
              >
                <v-icon small class="fadeSelect">mdi-information-outline</v-icon>
                .
              </cc-tooltip>
              Until the start of your next turn, when it is triggered, you can take your prepared
              action as a reaction. Your preparation counts as taking the action, so it follows all
              usual restrictions on that action and on taking multiple actions.
            </p>
          </v-col>
          <v-col cols="auto">
            <v-btn
              large
              tile
              block
              :disabled="actionFree"
              :color="`action--quick ${actionQuick ? 'lighten-1' : ''}`"
              @click="actionQuick = !actionQuick"
            >
              <v-icon left>mdi-hexagon-slice-6</v-icon>
              Prepare
            </v-btn>
            <v-btn
              small
              tile
              block
              :disabled="actionQuick"
              :color="`action--free ${actionFree ? 'lighten-1' : ''}`"
              @click="actionFree = !actionFree"
            >
              <v-icon left small>cci-free-action</v-icon>
              Free Action
              <cc-tooltip
                inline
                content="Special rules or equipment may allow you to Prepare as a Free Action. Using this button will commit the action without spending a quick Action this turn"
              >
                <v-icon right small class="fadeSelect">mdi-information-outline</v-icon>
              </cc-tooltip>
            </v-btn>
          </v-col>
        </v-row>
        <v-slide-x-reverse-transition>
          <v-row v-if="actionFree || actionQuick" no-gutters class="mt-2">
            <v-col cols="auto" class="ml-auto">
              <p class="flavor-text stark--text ma-0">
                >//[
                <span class="accent--text">COMP/CON::COMBAT TELEMETRY LOG</span>
                ] :
                <span>COMMAND QUEUED, STANDING BY.</span>
                <cc-tooltip inline content="Undo this action, refunding any cost it may have had">
                  <v-btn x-small color="primary" class="fadeSelect" @click="reset">
                    <v-icon small left>mdi-reload</v-icon>
                    UNDO
                  </v-btn>
                </cc-tooltip>
              </p>
            </v-col>
          </v-row>
        </v-slide-x-reverse-transition>
      </v-card-text>

      <v-slide-y-reverse-transition>
        <div v-if="actionFree || actionQuick">
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
  name: 'prepare-dialog',
  props: {
    mech: {
      type: Object,
      required: true,
    },
  },
  data: () => ({
    actionQuick: false,
    actionFree: false,
    dialog: false,
  }),
  computed: {
    synergies() {
      return Synergy.Collect('Prepare', this.mech)
    },
  },
  methods: {
    reset() {
      this.actionQuick = false
      this.actionFree = false
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
