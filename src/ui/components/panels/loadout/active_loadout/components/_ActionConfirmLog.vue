<template>
  <div>
    action.used:
    {{ action.Used }} {{ action.LogID }}
    <v-card-text class="my-0 pt-0 pb-1">
      <v-slide-x-reverse-transition v-if="!hideLog">
        <div v-if="finished" class="text-right">
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
        </div>
      </v-slide-x-reverse-transition>
      <v-slide-x-reverse-transition>
        <div v-if="finished" class="text-right">
          <v-btn x-small color="primary" class="fadeSelect" @click="undo()">
            <cc-tooltip content="Undo this action, refunding any cost it may have had">
              <v-icon small left>mdi-reload</v-icon>
              UNDO
            </cc-tooltip>
          </v-btn>
        </div>
      </v-slide-x-reverse-transition>
    </v-card-text>
    <v-slide-y-reverse-transition>
      <div v-if="finished">
        <v-divider />
        <v-card-actions>
          <v-spacer />
          <v-btn color="primary" tile @click="$emit('hide')">DISMISS</v-btn>
        </v-card-actions>
      </div>
    </v-slide-y-reverse-transition>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  name: 'action-confirm-log',
  props: {
    used: { type: Boolean },
    action: {
      type: Object,
      required: true,
    },
    mech: {
      type: Object,
      required: true,
    },
    hideLog: { type: Boolean },
    completeCondition: {
      type: Boolean,
      required: false,
      default: true,
    },
    logOverride: {
      type: Array,
      required: false,
      default: () => [],
    },
  },
  data: () => ({
    timer: 0,
  }),
  computed: {
    finalLog() {
      const out =
        this.logOverride && this.logOverride.length ? this.logOverride : this.action.Confirm
      if (this.action.HeatCost) out.push('ALERT: REACTOR HEAT LEVELS INCREASING')
      return out
    },
    finished() {
      return this.completeCondition && this.used
    },
  },
  watch: {
    used: function(newval, oldval) {
      console.log('in watch')
      console.log(newval, oldval)
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
        }
      }, 80)
    },
    reset() {
      this.timer = 0
    },
    undo() {
      this.$emit('undo')
      this.reset()
    },
  },
})
</script>
