<template>
  <v-footer fixed style="padding-bottom: 2px; border-top: 2px solid var(--v-primary-base)">
    <v-dialog v-model="scDialog" :fullscreen="$vuetify.breakpoint.smAndDown" width="80vw">
      <template v-slot:activator="{ on }">
        <v-btn
          small
          class="mr-5"
          color="accent"
          :disabled="pilot.IsDead || pilot.IsDownAndOut"
          v-on="on"
        >
          START MISSION
        </v-btn>
      </template>
      <v-card>
        <v-toolbar dense dark flat tile color="warning darken-3 heading h2">
          START MISSION
          <v-spacer />
          <v-btn large dark icon @click="scDialog = false"><v-icon>mdi-close</v-icon></v-btn>
        </v-toolbar>
        <v-card-text>
          <p class="flavor-text mt-2 mb-0 mx-6">
            >//[
            <span class="accent--text">COMP/CON</span>
            :
            <span class="stark--text">Active Protocols Standing By</span>
            ] Pilot, proceeding will engage COMP/CON ACTIVE MODE, which will assist with running
            LANCER Missions and Encounters.
            <!-- First-time users are encouraged to enable the Active Mode Tutorial. -->
          </p>
          <!-- <v-row justify="center" no-gutters class="mt-n2">
            <v-col cols="auto">
              <v-checkbox color="accent" label="Enable Active Mode Tutorial" dense hide-details />
            </v-col>
          </v-row> -->
          <v-alert
            dense
            outlined
            :color="pilot.ActiveMech ? pilot.ActiveMech.Frame.Manufacturer.Color : 'primary'"
            class="mt-4"
          >
            <v-row justify="start" no-gutters>
              <v-col>
                <div class="overline text--text pb-1">ACTIVE MECH</div>
                <div :class="$vuetify.breakpoint.mdAndDown ? 'heading h3' : 'heading h1'">
                  <cc-logo
                    v-if="pilot.ActiveMech"
                    :source="pilot.ActiveMech.Frame.Manufacturer"
                    size="xLarge"
                    class="mb-n3 mt-n3 mr-n2"
                  />
                  <span
                    v-if="pilot.ActiveMech"
                    :class="pilot.ActiveMech.Destroyed ? 'text-decoration-line-through' : ''"
                  >
                    {{ pilot.ActiveMech.Name }}
                  </span>
                  <div v-else class="pb-3">NO ACTIVE MECH</div>
                </div>
                <div v-if="pilot.ActiveMech" class="overline text--text ml-4">
                  {{ pilot.ActiveMech.Frame.Source }} {{ pilot.ActiveMech.Frame.Name }}
                </div>
              </v-col>
              <v-col cols="auto">
                <mech-select-button
                  v-if="pilot.Mechs.length"
                  :mechs="pilot.Mechs"
                  @select="pilot.ActiveMech = $event"
                />
              </v-col>
            </v-row>
          </v-alert>
          <div v-if="pilot.ActiveMech">
            <p
              v-if="pilot.ActiveMech.StatusString.length"
              class="flavor-text stark--text mt-2 mx-6 mb-0"
            >
              >//[
              <span class="accent--text">COMP/CON</span>
              :
              <span class="stark--text">Frame Issues Detected</span>
              ] Pilot, COMP/CON has detected one ore more issues with the selected mech. If these
              issues are not addressed, your mech may operate at reduced combat efficacy. Caution is
              advised.
            </p>
            <v-row dense justify="center">
              <v-col v-for="s in pilot.ActiveMech.StatusString" :key="`status-${s}`" cols="12">
                <div class="px-10">
                  <cc-mech-status-alert
                    :type="s"
                    readonly
                    @reprint="pilot.ActiveMech.FullRepair()"
                  />
                </div>
              </v-col>
            </v-row>
            <v-row justify="center" class="mt-2">
              <v-col cols="auto">
                <v-btn
                  x-large
                  tile
                  color="primary"
                  :disabled="startDisabled"
                  @click="
                    scDialog = false
                    pilot.State.StartMission()
                  "
                >
                  <v-icon large left>cci-activate</v-icon>
                  &nbsp;Engage Combat Mode
                </v-btn>
              </v-col>
            </v-row>
          </div>
        </v-card-text>
      </v-card>
    </v-dialog>

    <span v-if="$vuetify.breakpoint.mdAndUp" class="flavor-text">
      >//[
      <span class="accent--text">COMP/CON</span>
      :
      <span class="stark-text--text">Downtime Mode Active</span>
      ]
    </span>

    <v-spacer />

    <cc-tooltip inline content="Downtime Actions" delayed>
      <downtime-menu-button
        :actions="pilot.State.DowntimeActions"
        :pilot="pilot"
        available
        color="action--downtime"
        title="DOWNTIME ACTIONS"
        @open-menu="$refs.dialog.show()"
        @open-dialog="openDialog($event)"
      >
        <v-icon slot="icon" color="white" size="35">cci-downtime</v-icon>
      </downtime-menu-button>
    </cc-tooltip>

    <cc-downtime-dialog
      v-for="a in pilot.State.DowntimeActions"
      :key="`fa_${a.ID}`"
      :ref="`dialog_${a.ID}`"
      :action="a"
      :pilot="pilot"
    />

    <cc-solo-dialog
      ref="dialog"
      title="Downtime Actions"
      icon="cci-downtime"
      color="action--downtime"
      no-actions
      fullscreen
    >
      <downtime-menu @close="$refs.dialog.hide()" />
    </cc-solo-dialog>
  </v-footer>
</template>

<script lang="ts">
import MechSelectButton from '../../components/MechSelectButton.vue'
import activePilot from '@/features/pilot_management/mixins/activePilot'
import vueMixins from '@/util/vueMixins'
import DowntimeMenuButton from '../../components/DowntimeMenuButton.vue'
import DowntimeMenu from '../../components/DowntimeMenu.vue'

export default vueMixins(activePilot).extend({
  name: 'narrative-footer',
  components: {
    DowntimeMenuButton,
    MechSelectButton,
    DowntimeMenu,
  },
  data: () => ({ scDialog: false }),
  computed: {
    startDisabled() {
      const m = this.pilot.ActiveMech
      return m.Destroyed || m.ReactorDestroyed
    },
  },
  methods: {
    openDialog(action) {
      const r = this.$refs[`dialog_${action.ID}`]
      if (r && r[0]) r[0].show()
    },
  },
})
</script>
