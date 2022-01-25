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

        <v-row justify="center" align="center">
          <v-col cols="12" md="">
            <action-detail-expander :action="action" />
          </v-col>
          <action-activation-buttons
            :fulltech="fulltech"
            :used="action.Used"
            :action="action"
            :mech="mech"
            @use="use($event)"
          />
        </v-row>
        <tech-attack
          :used="actionFree || actionCost"
          :action="action"
          :mech="mech"
          @techAttackComplete="techAttackComplete($event)"
        />
        <v-slide-x-reverse-transition>
          <div v-if="succeeded">
            <v-row no-gutters justify="center" class="mt-4 mb-n2">
              <v-col cols="auto" class="ml-auto" align="end">
                <div class="body-text stark--text text-left">
                  <b>Invasion Success</b>
                  <p>
                    Your target takes
                    <b>2 Heat</b>
                    , and you choose one of the following Invasion Options:
                  </p>
                </div>
              </v-col>
            </v-row>
            <v-row dense justify="center">
              <v-col
                v-for="(a, j) in actions"
                :key="`action_${j}`"
                cols="auto"
                style="min-width: 400px"
              >
                <v-card
                  tile
                  outlined
                  :class="selected === a ? 'optionSelect' : 'optionFade'"
                  @click="select(a)"
                >
                  <v-toolbar :color="selected === a ? 'secondary' : ''" dense>
                    <v-toolbar-title class="px-n2 heading h3">
                      {{ a.Name }}
                    </v-toolbar-title>
                  </v-toolbar>
                  <v-card-text>
                    <div v-html-safe="a.Terse" class="body-text text--text" />
                    <div v-html-safe="a.Detail" class="flavor-text mt-1 mx-3" />
                  </v-card-text>
                </v-card>
              </v-col>
            </v-row>
          </div>
        </v-slide-x-reverse-transition>

        <v-slide-x-reverse-transition>
          <v-row v-if="failed || (succeeded && selected)" no-gutters class="mt-2">
            <v-col cols="auto" class="ml-auto" align="end">
              <v-fade-transition v-for="(s, i) in skLog" :key="`skLog_${i}`">
                <p v-if="timer > 10 * i" class="flavor-text stark--text ma-0">
                  <span>
                    >//[
                    <span class="accent--text">COMP/CON:</span>
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
import { ActivationType, DiceRoller } from '@/class'
import Vue from 'vue'
import ActionDetailExpander from '../../components/_ActionDetailExpander.vue'
import ActionTitlebar from '../../components/_ActionTitlebar.vue'
import TechAttack from '../../components/_TechAttack.vue'
import ActionActivationButtons from '../../components/_ActionActivationButtons.vue'

export default Vue.extend({
  name: 'invade-dialog',
  components: { ActionDetailExpander, ActionTitlebar, TechAttack, ActionActivationButtons },
  props: {
    mech: {
      type: Object,
      required: true,
    },
    action: {
      type: Object,
      required: true,
    },
    fulltech: { type: Boolean },
  },
  data: () => ({
    dialog: false,
    selected: null,
    succeeded: false,
    failed: false,
    complete: false,
    actionCost: false,
    actionFree: false,
    timer: 0,
    finished: false,
  }),
  computed: {
    state() {
      return this.mech.Pilot.State
    },
    actions() {
      return this.state.TechActions.filter(x => x.Activation === ActivationType.Invade)
    },
    skLog() {
      let l = ['UPLINK ESTABLISHED. ATTEMPTING REMOTE ACCESS.']
      if (this.succeeded) {
        l.push('SYSTEM INVASION SUCCESSFUL.')
        l = l.concat(this.selected.Log)
      } else l.push('ACCESS DENIED. INVASION FAILURE RECORDED.')
      return l
    },
    round() {
      return this.state.Round
    },
  },
  watch: {
    round: {
      immediate: true,
      deep: true,
      handler: function () {
        this.reset()
      },
    },
  },
  methods: {
    use(free) {
      this.actionFree = free
      this.actionCost = !free
    },
    runTimeout() {
      // eslint-disable-next-line @typescript-eslint/no-this-alias
      const self = this
      const timer = setInterval(function () {
        self.timer++

        if (self.timer > self.skLog.length * 10) {
          clearInterval(timer)
          self.finished = true
        }
      }, 80)
    },
    select(a) {
      if (this.fulltech) {
        this.$emit('add-invade', a)
        this.init()
        this.hide()
      } else {
        this.state.CommitAction(this.action, this.actionFree)
      }
      this.$emit('use')
      this.selected = a
      this.runTimeout()
    },
    techAttackComplete(success) {
      if (success) {
        this.succeeded = true
      } else {
        if (this.fulltech) {
          this.$emit('add-fail')
          this.init()
          this.hide()
        } else {
          this.state.CommitAction(this.action, this.actionFree)
        }
        this.failed = true
        this.$emit('use')
        this.runTimeout()
      }
    },
    undo() {
      this.state.Undo(this.action, this.actionFree)
      this.reset()
    },
    reset() {
      this.$emit('undo')
      this.init()
    },
    init() {
      this.succeeded = false
      this.failed = false
      this.complete = false
      this.actionCost = false
      this.actionFree = false
      this.timer = 0
      this.finished = false
      this.selected = null
    },
    show(): void {
      this.dialog = true
    },
    hide(): void {
      this.init()
      this.dialog = false
    },
  },
})
</script>

<style scoped>
.optionSelect {
  border-color: var(--v-warning-base);
  opacity: 1;
}

.optionFade {
  opacity: 0.7;
}

.optionFade:hover {
  opacity: 1;
}
</style>
