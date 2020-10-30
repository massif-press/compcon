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
            ] TODO: text here about confirming end combat and enter rest mode, give option for
            ending mission
          </p>
          <v-row justify="center" no-gutters class="mt-n2"></v-row>
          <v-alert dense outlined :color="pilot.ActiveMech.Frame.Manufacturer.Color" class="mt-4">
            current running stats, number of encounters completed, etc
          </v-alert>
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

    <v-btn
      outlined
      small
      class="ml-5"
      style="border-color: var(--v-active-base)"
      @click="state.NextRound()"
    >
      NEXT ROUND
    </v-btn>

    <v-spacer />

    <div class="mt-n1">
      <cc-tooltip inline content="Protocol Actions" delayed>
        <action-menu-button
          :key="`protocol_btn_${state.IsProtocolAvailable}`"
          :base-actions="state.BaseActions('Protocol')"
          :item-actions="state.ItemActions('Protocol')"
          :mech="pilot.ActiveMech"
          :color="state.IsProtocolAvailable ? 'action--protocol' : 'grey darken-1'"
          title="PROTOCOLS"
          @open-menu="openMenu(0)"
          @open-dialog="openDialog($event)"
        >
          <v-icon slot="icon" color="white" size="40">cci-protocol</v-icon>
        </action-menu-button>
      </cc-tooltip>
    </div>

    <v-divider vertical class="mx-3" />

    <div class="mt-n1">
      <cc-tooltip inline content="Movement" delayed>
        <move-menu-button :mech="pilot.ActiveMech" @open-dialog="openDialog($event)" />
      </cc-tooltip>

      <cc-tooltip inline content="Full Actions" delayed>
        <action-menu-button
          :base-actions="state.BaseActions('Full')"
          :item-actions="state.ItemActions('Full')"
          :mech="pilot.ActiveMech"
          color="action--full"
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
          color="action--quick"
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
  </v-footer>
</template>

<script lang="ts">
import ActionMenuButton from '../../components/ActionMenuButton.vue'
import MoveMenuButton from '../../components/MoveMenuButton.vue'
import ActionMenu from '../../components/ActionMenu.vue'
import activePilot from '@/features/pilot_management/mixins/activePilot'
import vueMixins from '@/util/vueMixins'

export default vueMixins(activePilot).extend({
  name: 'combat-footer',
  components: { MoveMenuButton, ActionMenuButton, ActionMenu },
  data: () => ({
    menuTab: 0,
    ecDialog: false,
  }),
  computed: {
    state() {
      return this.pilot.State
    },
    mech() {
      return this.pilot.ActiveMech
    },
  },
  methods: {
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
