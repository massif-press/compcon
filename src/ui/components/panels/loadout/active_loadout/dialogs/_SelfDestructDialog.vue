<template>
  <v-dialog
    v-model="dialog"
    :fullscreen="$vuetify.breakpoint.mdAndDown"
    :style="$vuetify.breakpoint.mdAndDown ? `x-overflow: hidden` : ''"
    width="90vw"
  >
    <v-card tile class="background">
      <cc-titlebar large color="error">
        <v-icon x-large>mdi-alert-rhombus</v-icon>
        SELF-DESTRUCT
        <v-btn slot="items" dark icon @click="hide">
          <v-icon large left>close</v-icon>
        </v-btn>
      </cc-titlebar>

      <div class="marquee">
        <span v-html="'WARNING // '.repeat(400)" />
      </div>
      <div class="text-center mx-12">
        <div class="body-text stark--text">
          <b>
            CONFIRMING THIS ACTION INITIATES A CRITICALITY EXCURSION EVENT THAT
            <u>WILL</u>
            RESULT IN CATASTROPIC REACTOR FAILURE AND EXPLOSIVE MELTDOWN.
          </b>
        </div>
        <div class="flavor-text">
          Occupant survival probability (monte_carlo//cc-n2@latest):
          <b class="error--text">0.000%</b>
        </div>
      </div>

      <div class="marquee">
        <span v-html="'WARNING // '.repeat(400)" />
      </div>

      <v-card-text class="pt-3">
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
              :disabled="actionCost"
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
      </v-card-text>

      <v-slide-x-reverse-transition>
        <v-card-text v-if="actionCost || actionFree">
          <p class="flavor-text stark--text ma-0 text-center">
            <span>
              >//[
              <span class="accent--text">
                COMP/CON:
              </span>
              ] :
              <span>MANUAL OVERRIDE REQUIRED</span>
            </span>
          </p>
          <v-row justify="space-around">
            <v-col cols="3">
              <v-btn
                large
                tile
                block
                :color="or1 ? 'error' : 'primary'"
                @click="or1 = true"
                v-html="
                  or1 ? 'REACTOR SAFETY PROTOCOLS DISABLED' : 'DISABLE REACTOR SAFETY PROTOCOLS'
                "
              />
            </v-col>
            <v-col cols="3">
              <v-btn
                large
                tile
                block
                :disabled="!or1"
                :color="or2 ? 'error' : 'primary'"
                @click="or2 = true"
                v-html="or2 ? 'CORE EMERGENCY VENTS LOCKED' : 'LOCK CORE EMERGENCY VENTS'"
              />
            </v-col>
            <v-col cols="3">
              <v-btn
                large
                tile
                block
                :disabled="!or2"
                :color="or3 ? 'error' : 'primary'"
                @click="or3 = true"
                v-html="or3 ? 'COOLANT RESERVOIR EMPTY' : 'DISCHARGE COOLANT RESERVOIR'"
              />
            </v-col>
          </v-row>
          <v-row dense justify="center">
            <v-col cols="10">
              <v-btn
                x-large
                block
                :disabled="!or3"
                :color="finished ? 'error' : `error darken-2`"
                @click="finished = true"
              >
                <v-icon style="position: absolute; left: 0" large>mdi-alert-rhombus-outline</v-icon>
                {{ finished ? 'CRITICAL ALERT: REACTOR MELTDOWN IMMINENT' : 'OVERLOAD REACTOR' }}
                <v-icon style="position: absolute; right: 0" large>
                  mdi-alert-rhombus-outline
                </v-icon>
              </v-btn>
            </v-col>
          </v-row>
        </v-card-text>
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

      <v-slide-y-reverse-transition>
        <div v-if="finished">
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

export default Vue.extend({
  name: 'self-destruct-dialog',
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
    finished: false,
    or1: false,
    or2: false,
    or3: false,
  }),
  methods: {
    select(action) {
      return !action
    },
    reset() {
      this.actionCost = false
      this.actionFree = false
      this.finished = false
      this.or1 = false
      this.or2 = false
      this.or3 = false
      this.timer = 0
    },
    show(): void {
      this.dialog = true
    },
    hide(): void {
      this.dialog = false
      this.$emit('close')
    },
  },
})
</script>

<style scoped>
.marquee {
  width: 100%;
  margin: 8px 0 8px 0px;
  padding-top: 4px;
  padding-bottom: 4px;
  background-color: var(--v-panel-darken2);
  color: var(--v-warning-base);
  white-space: nowrap;
  overflow: hidden;
  box-sizing: border-box;
  display: inline-flex;
}

.marquee span {
  display: flex;
  flex-basis: 100%;
  animation: marquee 3000s linear infinite;
  animation-play-state: running;
}

@keyframes marquee {
  0% {
    transform: translate(0%, 0);
  }
  50% {
    transform: translate(-100%, 0);
  }
  50.001% {
    transform: translate(100%, 0);
  }
  100% {
    transform: translate(0%, 0);
  }
}
</style>
