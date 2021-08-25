<template>
  <v-footer fixed style="padding-bottom: 4px; border-top: 2px solid var(--v-primary-base)">
    <v-row no-gutters justify="space-between" align="center">
      <v-col cols="auto">
        <v-dialog v-model="ecDialog" width="80vw">
          <template v-slot:activator="{ on }">
            <v-btn
              :small="$vuetify.breakpoint.mdAndUp"
              :x-small="$vuetify.breakpoint.smAndDown"
              color="warning darken-2"
              v-on="on"
            >
              END COMBAT
            </v-btn>
          </template>
          <v-card>
            <v-toolbar dense dark flat tile color="warning darken-3 heading h2">
              END COMBAT
            </v-toolbar>
            <v-card-text>
              <p class="flavor-text stark--text mt-1 mb-0 mx-6">
                >//[
                <span class="accent--text">COMP/CON</span>
                :
                <span class="stark-text--text">Confirmation Required</span>
                ] Pilot, proceeding will disengage combat mode and enable rest and repair protocols.
                This cannot be undone. Continue?
              </p>
              <v-row justify="center" no-gutters class="mt-n2"></v-row>
              <v-row justify="center" class="mt-2">
                <v-col cols="auto">
                  <v-btn
                    x-large
                    tile
                    color="warning darken-3"
                    @click="
                      ecDialog = false
                      state.StartRest()
                    "
                  >
                    &nbsp;Start Rest
                  </v-btn>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </v-dialog>
      </v-col>

      <v-col cols="auto">
        <v-row dense>
          <v-col cols="auto">
            <v-menu v-if="state.InTurn" v-model="turnConfirm" close-on-content-click offset-y>
              <v-btn
                slot="activator"
                :small="$vuetify.breakpoint.mdAndUp"
                :x-small="$vuetify.breakpoint.smAndDown"
                color="secondary"
                dark
                elevation="0"
                @click="endTurnConfirm.length ? (turnConfirm = true) : stageEndTurn()"
              >
                END TURN
              </v-btn>
              <cc-confirmation no-cc :content="endTurnConfirm" @confirm="stageEndTurn()" />
            </v-menu>
            <v-btn
              v-else
              outlined
              :small="$vuetify.breakpoint.mdAndUp"
              :x-small="$vuetify.breakpoint.smAndDown"
              color="secondary"
              @click="undoEndTurn"
            >
              UNDO END TURN
            </v-btn>
          </v-col>

          <v-col cols="auto">
            <v-menu v-model="roundConfirm" close-on-content-click offset-y>
              <template v-slot:activator="{ on }">
                <v-btn
                  :small="$vuetify.breakpoint.mdAndUp"
                  :x-small="$vuetify.breakpoint.smAndDown"
                  color="accent"
                  class="white--text"
                  elevation="0"
                  :disabled="state.InTurn"
                  v-on="on"
                >
                  START ROUND {{ state.Round + 1 }}
                </v-btn>
              </template>
              <cc-confirmation no-cc :content="nextRoundConfirm" @confirm="stageNextRound()" />
            </v-menu>
          </v-col>
        </v-row>
      </v-col>

      <v-col md="auto" cols="12">
        <v-row
          no-gutters
          :class="`text-center ${$vuetify.breakpoint.smAndDown ? 'mt-1' : ''}`"
          justify="space-around"
        >
          <v-col v-if="!mech.Pilot.IsDownAndOut" cols="auto">
            <cc-tooltip inline content="Protocol Actions" delayed>
              <action-menu-button
                :key="`protocol_btn_${state.IsProtocolAvailable}`"
                :actions="state.ActionsByType('Protocol')"
                :mech="pilot.ActiveMech"
                :available="state.IsProtocolAvailable"
                :color="state.IsProtocolAvailable ? 'action--protocol' : 'grey darken-1'"
                title="PROTOCOLS"
                @open-menu="openMenu(0)"
                @open-dialog="openDialog($event)"
              >
                <v-icon slot="icon" color="white" size="40">cci-protocol</v-icon>
              </action-menu-button>
            </cc-tooltip>
          </v-col>

          <v-col v-if="$vuetify.breakpoint.lgAndUp && !mech.Pilot.IsDownAndOut" cols="auto">
            <v-divider vertical class="mx-3" />
          </v-col>

          <v-col v-if="!mech.Pilot.IsDownAndOut" cols="auto">
            <cc-tooltip inline content="Movement" delayed>
              <move-menu-button :mech="pilot.ActiveMech" @open-dialog="openDialog($event)" />
            </cc-tooltip>
          </v-col>
          <v-col v-if="!mech.Pilot.IsDownAndOut">
            <cc-tooltip inline content="Full Actions" delayed>
              <action-menu-button
                :actions="state.ActionsByType('Full')"
                :mech="pilot.ActiveMech"
                :available="state.Actions > 1"
                :color="state.Actions > 1 ? 'action--full' : 'grey darken-1'"
                title="FULL ACTIONS"
                @open-menu="openMenu(1)"
                @open-dialog="openDialog($event)"
              >
                <v-icon slot="icon" color="white" size="30">mdi-hexagon-slice-6</v-icon>
              </action-menu-button>
            </cc-tooltip>
          </v-col>
          <v-col v-if="!mech.Pilot.IsDownAndOut" cols="auto">
            <cc-tooltip inline content="Quick Actions" delayed>
              <action-menu-button
                :actions="state.ActionsByType('Quick')"
                :mech="pilot.ActiveMech"
                :color="state.Actions > 0 ? 'action--quick' : 'grey darken-1'"
                :available="state.Actions > 0"
                title="QUICK ACTIONS"
                @open-menu="openMenu(2)"
                @open-dialog="openDialog($event)"
              >
                <v-icon slot="icon" color="white" size="30">mdi-hexagon-slice-3</v-icon>
              </action-menu-button>
            </cc-tooltip>
          </v-col>
          <v-col v-if="!mech.Pilot.IsDownAndOut" cols="auto">
            <cc-tooltip inline content="Reactions" delayed>
              <action-menu-button
                :actions="state.ActionsByType('Reaction')"
                :mech="pilot.ActiveMech"
                color="action--reaction"
                :available="!state.IsBraceCooldown"
                title="REACTIONS"
                @open-menu="openMenu(3)"
                @open-dialog="openDialog($event)"
              >
                <v-icon slot="icon" color="white" size="35">cci-reaction</v-icon>
              </action-menu-button>
            </cc-tooltip>
          </v-col>
          <v-col v-if="!mech.Pilot.IsDownAndOut" cols="auto">
            <cc-tooltip inline content="Free Actions" delayed>
              <action-menu-button
                :actions="state.ActionsByType('Free')"
                :mech="pilot.ActiveMech"
                :available="!state.IsBraceCooldown"
                color="action--free"
                title="FREE ACTIONS"
                @open-menu="openMenu(4)"
                @open-dialog="openDialog($event)"
              >
                <v-icon slot="icon" color="white" size="35">cci-free-action</v-icon>
              </action-menu-button>
            </cc-tooltip>
          </v-col>

          <v-col v-if="$vuetify.breakpoint.lgAndUp && !mech.Pilot.IsDownAndOut" cols="auto">
            <v-divider vertical class="mx-3" />
          </v-col>

          <v-col cols="auto">
            <cc-tooltip inline content="Combat Log" delayed>
              <v-btn
                class="mx-1"
                :small="$vuetify.breakpoint.lgAndUp"
                :x-small="$vuetify.breakpoint.smAndDown"
                dark
                :fab="$vuetify.breakpoint.lgAndUp || $vuetify.breakpoint.smAndDown"
                elevation="0"
                color="primary"
                @click="openMenu(5)"
              >
                <v-icon color="white" size="25">mdi-notebook</v-icon>
                <span v-if="$vuetify.breakpoint.md" class="pl-2">COMBAT LOG</span>
              </v-btn>
            </cc-tooltip>
          </v-col>
          <v-col>
            <cc-tooltip inline content="Other" delayed cols="auto">
              <v-btn
                class="mx-1"
                :small="$vuetify.breakpoint.lgAndUp"
                :x-small="$vuetify.breakpoint.smAndDown"
                dark
                :fab="$vuetify.breakpoint.lgAndUp || $vuetify.breakpoint.smAndDown"
                elevation="0"
                color="primary"
                @click="openMenu(6)"
              >
                <v-icon color="white" size="25">mdi-dots-vertical</v-icon>
                <span v-if="$vuetify.breakpoint.md" class="pl-2">OTHER</span>
              </v-btn>
            </cc-tooltip>
          </v-col>
        </v-row>
      </v-col>
    </v-row>

    <cc-combat-dialog
      v-for="(a, i) in state.AllActions"
      :key="`fa_${i}_${a.ID}`"
      :ref="`dialog_${a.ID}`"
      :action="a"
      :mech="pilot.ActiveMech"
    />

    <cc-solo-dialog ref="actionMenu" no-confirm title="Actions" large no-title-clip>
      <action-menu :tab="menuTab" />
    </cc-solo-dialog>
    <burn-dialog ref="burnDialog" :mech="mech" @complete="endTurn($event)" />
  </v-footer>
</template>

<script lang="ts">
import ActionMenuButton from '../../components/ActionMenuButton.vue'
import MoveMenuButton from '../../components/MoveMenuButton.vue'
import ActionMenu from '../../components/ActionMenu.vue'
import BurnDialog from '../../components/BurnDialog.vue'
import activePilot from '@/features/pilot_management/mixins/activePilot'
import vueMixins from '@/util/vueMixins'

export default vueMixins(activePilot).extend({
  name: 'combat-footer',
  components: { MoveMenuButton, ActionMenuButton, ActionMenu, BurnDialog },
  data: () => ({
    menuTab: 1,
    ecDialog: false,
    roundConfirm: false,
    turnConfirm: false,
  }),
  computed: {
    state() {
      return this.pilot.State
    },
    mech() {
      return this.pilot.ActiveMech
    },
    nextRoundConfirm() {
      let str = ''
      if (this.state.Actions > 0) str += `<div class='px-2'>Actions available</div>`
      if (this.state.Move > 0) str += `<div class='px-2'>Movement available</div>`
      if (str.length) {
        str = `<div class='error--text'>ALERT::<div>${str}`
      } else
        str =
          '<div>Confirm Round Complete</div> <div class="text--secondary">This cannot be undone.</div>'
      return str
    },
    endTurnConfirm() {
      let str = ''
      if (this.state.Actions > 0) str += `<div class='px-2'>Actions available</div>`
      if (this.state.Move > 0) str += `<div class='px-2'>Movement available</div>`
      if (str.length) {
        str = `<div class='error--text'>ALERT::<div>${str}`
      } else str = ''
      return str
    },
  },
  methods: {
    stageEndTurn() {
      if (this.mech.Burn) this.$refs.burnDialog.show()
      else this.endTurn()
    },
    stageNextRound() {
      if (this.mech.Burn) this.$refs.burnDialog.show()
      else this.nextRound()
    },
    nextRound() {
      this.state.NextRound()
      this.$store.dispatch('cloudSync', { callback: null, condition: 'turnEnd' })
      this.roundConfirm = false
    },
    endTurn(burn) {
      this.state.EndTurn(burn?.hp || 0, burn?.str || 0)
      this.$store.dispatch('cloudSync', { callback: null, condition: 'turnEnd' })
      this.turnConfirm = false
    },
    undoEndTurn() {
      this.state.UndoEndTurn()
    },
    openMenu(tab) {
      this.menuTab = tab
      this.$refs.actionMenu.show()
    },
    openDialog(action) {
      const r = this.$refs[`dialog_${action.ID}`]
      if (r && r[0]) r[0].show()
    },
  },
})
</script>
