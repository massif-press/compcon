<template>
  <v-footer fixed style="padding-bottom: 2px; border-top: 2px solid var(--v-primary-base)">
    <v-dialog v-model="scDialog" width="80vw">
      <template v-slot:activator="{ on }">
        <v-btn
          outlined
          small
          class="mr-5"
          style="border-color: var(--v-warning-base)"
          :disabled="pilot.IsDead || pilot.IsDownAndOut"
          v-on="on"
        >
          START MISSION
        </v-btn>
      </template>
      <v-card>
        <v-toolbar dense flat tile color="warning darken-3 heading h2">
          START MISSION
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
                <div class="overline text--text">ACTIVE MECH</div>
                <div class="heading h1">
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

    <span class="flavor-text">
      >//[
      <span class="accent--text">COMP/CON</span>
      :
      <span class="stark-text--text">Downtime Mode Active</span>
      ]
    </span>

    <v-spacer />

    <v-menu offset-y top>
      <template v-slot:activator="{ on }">
        <v-btn class="mx-1" small fab elevation="0" color="action--downtime" v-on="on">
          <v-icon size="30">cci-downtime</v-icon>
        </v-btn>
      </template>
      <div>
        <v-toolbar dense flat class="heading h3" style="min-width: 80px">
          DOWNTIME ACTIONS
          <v-spacer />
          <v-btn small icon color="accent" class="ml-4" @click="$refs.dialog.show()">
            <v-icon>mdi-open-in-new</v-icon>
          </v-btn>
        </v-toolbar>
        <v-list class="px-2 py-3" color="panel" two-line>
          <dt-menu-item ref="atcost" action-id="act_power_at_a_cost">
            <power-at-cost :pilot="pilot" @close="$refs.atcost.dialog = false" />
          </dt-menu-item>
          <dt-menu-item ref="buytime" action-id="act_buy_some_time">
            <buy-time :pilot="pilot" @close="$refs.buytime.dialog = false" />
          </dt-menu-item>
          <dt-menu-item ref="damndrink" action-id="act_get_a_damn_drink">
            <damn-drink :pilot="pilot" @close="$refs.damndrink.dialog = false" />
          </dt-menu-item>
          <dt-menu-item ref="getcreative" action-id="act_get_creative">
            <get-creative :pilot="pilot" @close="$refs.getcreative.dialog = false" />
          </dt-menu-item>
          <dt-menu-item ref="getfocused" action-id="act_get_focused">
            <get-focused :pilot="pilot" @close="$refs.getfocused.dialog = false" />
          </dt-menu-item>
          <dt-menu-item ref="getorganized" action-id="act_get_organized">
            <get-organized :pilot="pilot" @close="$refs.getorganized.dialog = false" />
          </dt-menu-item>
          <dt-menu-item ref="gatherinfo" action-id="act_gather_information">
            <gather-information :pilot="pilot" @close="$refs.gatherinfo.dialog = false" />
          </dt-menu-item>
          <dt-menu-item ref="getconnected" action-id="act_get_connected">
            <get-connected :pilot="pilot" @close="$refs.getconnected.dialog = false" />
          </dt-menu-item>
          <dt-menu-item ref="scrounge" action-id="act_scrounge_and_barter">
            <scrounge-barter :pilot="pilot" @close="$refs.scrounge.dialog = false" />
          </dt-menu-item>
        </v-list>
      </div>
    </v-menu>
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
import DtMenuItem from '../../components/Downtime/DtMenuItem.vue'
import MechSelectButton from '../../components/MechSelectButton.vue'
import activePilot from '@/features/pilot_management/mixins/activePilot'
import vueMixins from '@/util/vueMixins'
import {
  PowerAtCost,
  BuyTime,
  DamnDrink,
  GatherInformation,
  GetConnected,
  ScroungeBarter,
  GetFocused,
  GetCreative,
  GetOrganized,
  DowntimeMenu,
} from '../../components/Downtime'

export default vueMixins(activePilot).extend({
  name: 'narrative-footer',
  components: {
    DtMenuItem,
    MechSelectButton,
    PowerAtCost,
    BuyTime,
    DamnDrink,
    GatherInformation,
    GetConnected,
    ScroungeBarter,
    GetFocused,
    GetCreative,
    GetOrganized,
    DowntimeMenu,
  },
  data: () => ({ scDialog: false }),
  computed: {
    startDisabled() {
      const m = this.pilot.ActiveMech
      return m.Destroyed || m.ReactorDestroyed
    },
  },
})
</script>
