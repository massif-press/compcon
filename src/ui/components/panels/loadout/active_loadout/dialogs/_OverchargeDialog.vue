<template>
  <v-dialog
    v-model="dialog"
    :fullscreen="$vuetify.breakpoint.mdAndDown"
    :style="$vuetify.breakpoint.mdAndDown ? `x-overflow: hidden` : ''"
    width="90vw"
  >
    <v-card :key="action.Used" tile class="background">
      <cc-titlebar large color="overcharge">
        <v-icon x-large>cci-overcharge</v-icon>
        Overcharge
        <v-btn slot="items" dark icon @click="hide">
          <v-icon large left>close</v-icon>
        </v-btn>
      </cc-titlebar>

      <v-card-text class="pt-3">
        <cc-active-synergy :locations="action.SynergyLocations" :mech="mech" class="mb-n4" />

        <v-row justify="center" align="center">
          <v-col>
            <action-detail-expander :action="action" />
          </v-col>
        </v-row>

        <div class="text-center heading h3 pb-0 mt-4 mb-2">
          Overcharging will incur
          <span class="red--text text--darken-2">
            +{{ mech.OverchargeTrack[mech.CurrentOvercharge] }} Heat
          </span>
        </div>
        <v-row v-if="!flat" justify="center">
          <v-col cols="auto">
            <cc-tooltip content="Roll Overcharge">
              <v-btn icon small color="overcharge" class="mt-1 mr-n3" @click="rollOvercharge">
                <v-icon large>mdi-dice-multiple</v-icon>
              </v-btn>
            </cc-tooltip>
          </v-col>
          <v-col cols="3">
            <v-text-field
              v-model="overcharge_heat"
              type="number"
              label="Heat Roll Result"
              outlined
              dense
              hide-details
              class="hide-spinners"
              append-outer-icon="mdi-plus-circle-outline"
              prepend-icon="mdi-minus-circle-outline"
              @click:append-outer="overcharge_heat < 10 ? overcharge_heat++ : ''"
              @click:prepend="overcharge_heat > 0 ? overcharge_heat-- : ''"
            />
          </v-col>
        </v-row>
        <v-row dense justify="center">
          <v-col cols="3">
            <v-btn
              large
              color="overcharge"
              block
              :disabled="action.Used || (!flat && !overcharge_heat)"
              @click="select()"
            >
              <v-icon large left>cci-overcharge</v-icon>
              Confirm
            </v-btn>
          </v-col>
        </v-row>
        <v-slide-x-reverse-transition>
          <v-row v-if="action.Used" no-gutters>
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
        <div v-if="action.Used">
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
    dialog: false,
    expanded: false,
    timer: 0,
    finished: false,
    overcharge_heat: null,
  }),
  computed: {
    flat() {
      return typeof parseInt(this.mech.OverchargeTrack[this.mech.CurrentOvercharge]) === 'number'
    },
  },
  methods: {
    rollOvercharge(): void {
      const roll = DiceRoller.rollDamage(this.mech.OverchargeTrack[this.mech.CurrentOvercharge])
      this.overcharge_heat = roll.total
    },
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
    select() {
      this.mech.Pilot.State.CommitOvercharge(this.action, this.overcharge_heat)
      this.$forceUpdate()
      this.runTimeout()
    },
    reset() {
      this.mech.Pilot.State.UndoOvercharge(this.action, this.overcharge_heat)
      this.finished = false
      this.timer = 0
      this.overcharge_heat = null
      this.$forceUpdate()
    },
    show(): void {
      this.dialog = true
    },
    hide(): void {
      this.overcharge_heat = null
      this.dialog = false
      this.$emit('close')
    },
  },
})
</script>
