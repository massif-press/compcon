<template>
  <v-footer fixed style="padding-bottom: 2px; border-top: 2px solid var(--v-primary-base)">
    <v-dialog v-model="ecDialog" width="80vw">
      <template v-slot:activator="{ on }">
        <v-btn outlined small class="mr-5" style="border-color: var(--v-warning-base)" v-on="on">
          END COMBAT
        </v-btn>
      </template>
      <v-card>
        <v-toolbar dense flat tile color="warning darken-3 heading h2">
          END COMBAT
        </v-toolbar>
        <v-card-text>
          <p class="flavor-text stark--text mt-2 mb-0 mx-6">
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

    <span class="flavor-text">
      >//[
      <span class="active--text">COMP/CON</span>
      :
      <span class="stark-text--text">Combat Mode Active</span>
      ]
    </span>

    <span class="heading h3 accent--text pl-4">
      ROUND
      <span class="font-weight-bold">
        {{ state.Round }}
      </span>
    </span>

    <v-menu v-model="roundConfirm" close-on-content-click offset-y>
      <template v-slot:activator="{ on }">
        <v-btn outlined small class="ml-5" style="border-color: var(--v-active-base)" v-on="on">
          NEXT ROUND
        </v-btn>
      </template>
      <cc-confirmation no-cc :content="nextRoundConfirm" @confirm="stageNextRound()" />
    </v-menu>

    <v-spacer />
    <div v-if="!mech.Destroyed && !mech.Pilot.IsDownAndOut" class="mt-n1">
      <cc-tooltip inline content="Protocol Actions" delayed>
        <action-menu-button
          :key="`protocol_btn_${state.IsProtocolAvailable}`"
          :base-actions="state.BaseActions('Protocol')"
          :item-actions="state.ItemActions('Protocol')"
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
    </div>

    <v-divider v-if="!mech.Destroyed && !mech.Pilot.IsDownAndOut" vertical class="mx-3" />

    <div v-if="!mech.Destroyed && !mech.Pilot.IsDownAndOut" class="mt-n1">
      <cc-tooltip inline content="Movement" delayed>
        <move-menu-button :mech="pilot.ActiveMech" @open-dialog="openDialog($event)" />
      </cc-tooltip>

      <cc-tooltip inline content="Full Actions" delayed>
        <action-menu-button
          :base-actions="state.BaseActions('Full')"
          :item-actions="state.ItemActions('Full')"
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

      <cc-tooltip inline content="Quick Actions" delayed>
        <action-menu-button
          :base-actions="state.BaseActions('Quick')"
          :item-actions="state.ItemActions('Quick')"
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

      <cc-tooltip inline content="Reactions" delayed>
        <action-menu-button
          :base-actions="state.BaseActions('Reaction')"
          :item-actions="state.ItemActions('Reaction')"
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
      <cc-tooltip inline content="Free Actions" delayed>
        <action-menu-button
          :base-actions="state.BaseActions('Free')"
          :item-actions="state.ItemActions('Free')"
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
    </div>

    <v-divider vertical class="mx-3" />

    <div class="mt-n1">
      <cc-tooltip inline content="Combat Log" delayed>
        <v-btn class="mx-1" small fab elevation="0" color="primary" @click="openMenu(5)">
          <v-icon color="white" size="25">mdi-notebook</v-icon>
        </v-btn>
      </cc-tooltip>

      <cc-tooltip inline content="Other" delayed>
        <v-btn class="mx-1" small fab elevation="0" color="primary" @click="openMenu(6)">
          <v-icon color="white" size="25">mdi-dots-vertical</v-icon>
        </v-btn>
      </cc-tooltip>
    </div>

    <cc-combat-dialog
      v-for="a in state.AllActions"
      :key="`fa_${a.ID}`"
      :ref="`dialog_${a.ID}`"
      :action="a"
      :mech="pilot.ActiveMech"
    />

    <cc-solo-dialog ref="actionMenu" no-confirm title="Actions" large no-title-clip>
      <action-menu :tab="menuTab" />
    </cc-solo-dialog>
    <burn-dialog ref="burnDialog" :mech="mech" @close="nextRound()" />
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
      } else str = '<div>Round Complete</div>'
      return str
    },
  },
  methods: {
    stageNextRound() {
      if (this.mech.Burn) this.$refs.burnDialog.show()
      else this.nextRound()
    },
    nextRound() {
      this.state.NextRound()
      this.roundConfirm = false
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
