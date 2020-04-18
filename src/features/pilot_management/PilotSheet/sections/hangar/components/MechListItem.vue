<template>
  <div id="pc-wrapper" @click="$emit('go', mech)">
    <v-card
      tile
      :color="mech.IsActive ? 'success' : mech.Frame.Manufacturer.Color"
      style="position: absolute; z-index:5"
      class="overlay clipped-square-invert"
      min-width="138px"
      min-height="138px"
    >
      <div id="interior" class="clipped-square-invert">
        <v-img :src="mech.Portrait" position="top center" height="138px" />
      </div>
    </v-card>
    <div id="banner" style="width: 100%">
      <div
        style="width: 100%"
        class="overlay"
        :style="
          `background-color: ${
            mech.IsActive ? 'var(--v-success-base)' : mech.Frame.Manufacturer.Color
          }`
        "
      >
        <v-row no-gutters>
          <span class="heading h2 callsign" style="margin-left: 138px;">{{ mech.Name }}</span>
          <v-fade-transition>
            <span v-if="mech.IsActive" class="heading h2 callsign ml-auto pr-10">
              / / ACTIVE / /&nbsp;
            </span>
          </v-fade-transition>
        </v-row>
      </div>
      <div style="border-top: 0!important" class="light-panel clipped">
        <div style="margin-left: 138px; padding-left: 8px; min-height: 100px">
          <p class="flavor-text mb-0">
            <v-row no-gutters justify="end">
              <v-col cols="auto">
                <b>{{ mech.Name }}</b>
                //
                <b>{{ mech.Frame.Source }} {{ mech.Frame.Name }}</b>
                <br />
                Equipped Loadout: {{ mech.ActiveLoadout ? mech.ActiveLoadout.Name : 'ERR' }}
              </v-col>
              <v-col cols="auto" class="ml-auto mr-4">
                <cc-tooltip v-if="!mech.IsActive" simple content="Set as Active">
                  <v-icon size="50" class="fadeSelect" @click.stop="$emit('set-active', mech)">
                    cci-activate
                  </v-icon>
                </cc-tooltip>
                <v-icon v-else size="50" color="success">cci-activate</v-icon>
              </v-col>
            </v-row>
            <v-row dense>
              <v-col cols="auto">
                <span class="overline">STR</span>
                <br />
                <b>{{ mech.CurrentStructure }}</b>
                <span class="subtle--text ml-n2">/{{ mech.MaxStructure }}</span>
              </v-col>
              <v-divider vertical class="mx-2" />
              <v-col cols="auto">
                <span class="overline">HP</span>
                <br />
                <b>{{ mech.CurrentHP }}</b>
                <span class="subtle--text ml-n2">/{{ mech.MaxHP }}</span>
              </v-col>
              <v-divider vertical class="mx-2" />
              <v-col cols="auto">
                <span class="overline">Stress</span>
                <br />
                <b>{{ mech.CurrentStress }}</b>
                <span class="subtle--text ml-n2">/{{ mech.MaxStress }}</span>
              </v-col>
              <v-divider vertical class="mx-2" />
              <v-col cols="auto">
                <span class="overline">Heat</span>
                <br />
                <b>{{ mech.CurrentHeat }}</b>
                <span class="subtle--text ml-n2">/{{ mech.HeatCapacity }}</span>
              </v-col>
              <v-divider vertical class="mx-2" />
              <v-col cols="auto">
                <span class="overline">RepCap</span>
                <br />
                <b>{{ mech.CurrentRepairs }}</b>
                <span class="subtle--text ml-n2">/{{ mech.RepairCapacity }}</span>
              </v-col>
              <v-col cols="auto" class="white--text flavor-text">
                <v-alert v-if="mech.Destroyed" color="error" dense tile class="text-center">
                  <span style="letter-spacing: 5px">// DESTROYED //</span>
                </v-alert>
                <v-alert v-if="mech.MeltdownImminent" color="orange" dense tile class="text-center">
                  <span style="letter-spacing: 5px">// REACTOR CRITICAL //</span>
                </v-alert>
                <v-alert v-if="mech.ReactorDestroyed" color="accent" dense tile class="text-center">
                  <span style="letter-spacing: 5px">// REACTOR DESTROYED //</span>
                </v-alert>
              </v-col>
              <v-col cols="auto" class="ml-auto mr-4 mt-2">
                <cc-tooltip simple inline content="Delete Mech">
                  <v-btn
                    small
                    icon
                    class="fadeSelect"
                    color="error"
                    @click.stop="$refs.delete.show()"
                  >
                    <v-icon>delete</v-icon>
                  </v-btn>
                </cc-tooltip>
                <cc-tooltip simple inline content="Duplicate Mech">
                  <v-btn small icon class="fadeSelect" @click.stop="$refs.copy.show()">
                    <v-icon>mdi-content-copy</v-icon>
                  </v-btn>
                </cc-tooltip>
                <cc-tooltip simple inline content="Print Mech Sheet">
                  <v-btn small icon class="fadeSelect" @click.stop="$refs.print.show()">
                    <v-icon>mdi-printer</v-icon>
                  </v-btn>
                </cc-tooltip>
              </v-col>
            </v-row>
          </p>
        </div>
      </div>
    </div>
    <copy-mech-dialog ref="copy" :mech="mech" @copy="$emit('copy', mech)" />
    <delete-mech-dialog ref="delete" :mech="mech" @delete="$emit('delete', mech)" />
    <print-dialog ref="print" :pilot="mech.Pilot" />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import CopyMechDialog from './CopyMechDialog.vue'
import DeleteMechDialog from './DeleteMechDialog.vue'
import PrintDialog from '../../../components/PrintDialog.vue'

export default Vue.extend({
  name: 'mech-list-item',
  components: { CopyMechDialog, DeleteMechDialog, PrintDialog },
  props: {
    mech: {
      type: Object,
      required: true,
    },
  },
})
</script>

<style scoped>
#pc-wrapper {
  position: relative;
  min-height: 138px;
  min-width: 100%;
  cursor: pointer;
  margin-bottom: 12px;
}

.callsign {
  color: white;
  max-height: 32px;
  min-height: 32px;
  line-height: 28px;
}

#interior {
  position: absolute;
  top: 2px;
  left: 2px;
  bottom: 2px;
  right: 2px;
  background-color: var(--v-light-panel-base);
}

.overlay {
  filter: brightness(70%);
  transition: filter 0.3s ease-in-out;
}

#pc-wrapper:hover .overlay {
  filter: brightness(100%);
}
</style>
