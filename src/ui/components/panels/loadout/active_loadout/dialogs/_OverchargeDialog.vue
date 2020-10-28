<template>
  <v-dialog
    v-model="dialog"
    :fullscreen="$vuetify.breakpoint.mdAndDown"
    :style="$vuetify.breakpoint.mdAndDown ? `x-overflow: hidden` : ''"
    width="90vw"
  >
    <v-card tile class="background">
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
            +{{ overcharge_levels[mech.CurrentOvercharge] }} Heat
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
              :disabled="actionFree || (!flat && !overcharge_heat)"
              @click="select()"
            >
              <v-icon large left>cci-overcharge</v-icon>
              Confirm
            </v-btn>
          </v-col>
        </v-row>
      </v-card-text>

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
    actionFree: false,
    timer: 0,
    finished: false,
    overcharge_heat: null,
    overcharge_levels: [1, '1d3', '1d6', '1d6+4'],
  }),
  computed: {
    flat() {
      return typeof this.overcharge_levels[this.mech.CurrentOvercharge] === 'number'
    },
  },
  methods: {
    rollOvercharge(): void {
      const roll = DiceRoller.rollDamage(this.overcharge_levels[this.mech.CurrentOvercharge])
      this.overcharge_heat = roll.total
    },
    runTimeout() {
      // eslint-disable-next-line @typescript-eslint/no-this-alias
      const self = this
      const timer = setInterval(function() {
        self.timer++

        if (self.timer > self.action.Log.length * 10) {
          clearInterval(timer)
          self.finished = true
        }
      }, 80)
    },
    select() {
      this.actionFree = true
      this.runTimeout()
    },
    reset() {
      this.actionFree = false
      this.finished = false
      this.timer = 0
      this.overcharge_heat = null
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
