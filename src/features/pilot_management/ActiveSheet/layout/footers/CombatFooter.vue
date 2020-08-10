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
                  pilot.State.StartCombat()
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
        {{ pilot.State.Round }}
      </span>
    </span>

    <v-btn
      outlined
      small
      class="ml-5"
      style="border-color: var(--v-active-base)"
      @click="pilot.State.NextRound()"
    >
      NEXT ROUND
    </v-btn>

    <v-spacer />

    <action-menu-button
      :actions="pilot.State.Protocols"
      color="action--protocol"
      title="PROTOCOLS"
      @open-menu="openMenu(0)"
    >
      <v-icon slot="icon" size="40">cci-protocol</v-icon>
    </action-menu-button>

    <v-divider vertical class="mx-3" />
    <action-menu-button
      :actions="pilot.State.MoveActions"
      color="action--move"
      title="MOVEMENT"
      @open-menu="openMenu(0)"
    >
      <v-icon slot="icon" size="30">mdi-arrow-right-bold-hexagon-outline</v-icon>
    </action-menu-button>

    <action-menu-button
      :actions="pilot.State.FullActions"
      color="action--full"
      title="FULL ACTIONS"
      @open-menu="openMenu(1)"
    >
      <v-icon slot="icon" size="30">mdi-hexagon-slice-6</v-icon>
    </action-menu-button>

    <action-menu-button
      :actions="pilot.State.QuickActions"
      color="action--quick"
      title="QUICK ACTIONS"
      @open-menu="openMenu(2)"
    >
      <v-icon slot="icon" size="30">mdi-hexagon-slice-3</v-icon>
    </action-menu-button>

    <action-menu-button
      :actions="pilot.State.Reactions"
      color="action--reaction"
      title="REACTIONS"
      @open-menu="openMenu(3)"
    >
      <v-icon slot="icon" size="35">cci-reaction</v-icon>
    </action-menu-button>

    <action-menu-button
      :actions="pilot.State.FreeActions"
      color="action--free"
      title="FREE ACTIONS"
      @open-menu="openMenu(4)"
    >
      <v-icon slot="icon" size="35">cci-free-action</v-icon>
    </action-menu-button>

    <v-divider vertical class="mx-3" />

    <action-menu-button
      :actions="pilot.State.Protocols"
      color="primary"
      title="DATA"
      @open-menu="openMenu(5)"
    >
      <v-icon slot="icon" size="25">mdi-notebook</v-icon>
    </action-menu-button>

    <action-menu-button
      :actions="pilot.State.Protocols"
      color="primary"
      title="OTHER"
      @open-menu="openMenu(6)"
    >
      <v-icon slot="icon" size="30">mdi-dots-vertical</v-icon>
    </action-menu-button>
    <cc-solo-dialog ref="actionMenu" no-confirm title="Actions" large>
      <action-menu :tab="menuTab" />
    </cc-solo-dialog>
  </v-footer>
</template>

<script lang="ts">
import ActionMenuButton from '../../components/ActionMenuButton.vue'
import ActionMenu from '../../components/ActionMenu.vue'
import activePilot from '@/features/pilot_management/mixins/activePilot'
import vueMixins from '@/util/vueMixins'

export default vueMixins(activePilot).extend({
  name: 'turn-footer',
  components: { ActionMenuButton, ActionMenu },
  data: () => ({
    menuTab: 0,
    ecDialog: false,
  }),
  methods: {
    openMenu(tab) {
      this.menuTab = tab
      this.$refs.actionMenu.show()
    },
  },
})
</script>
