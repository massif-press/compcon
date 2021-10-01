<template>
  <div id="pc-wrapper" @click="$emit('go', mech)">
    <v-card
      tile
      :color="mech.IsActive ? 'success' : mech.Frame.Manufacturer.GetColor($vuetify.theme.dark)"
      style="position: absolute; z-index:5"
      class="overlay clipped-square-invert"
      min-width="138px"
      min-height="100%"
    >
      <div id="interior" class="clipped-square-invert">
        <v-img :src="mech.Portrait" position="top center" height="100%" />
      </div>
    </v-card>
    <div id="banner" style="width: 100%">
      <div
        style="width: 100%"
        class="overlay"
        :style="
          `background-color: ${
            mech.IsActive
              ? 'var(--v-success-base)'
              : mech.Frame.Manufacturer.GetColor($vuetify.theme.dark)
          }`
        "
      >
        <v-row no-gutters>
          <span class="heading h2 callsign" style="margin-left: 138px;">{{ mech.Name }}</span>
          <v-fade-transition>
            <span
              v-if="mech.IsActive"
              v-show="$vuetify.breakpoint.mdAndUp"
              class="heading h2 callsign ml-auto pr-10"
            >
              / / ACTIVE / /&nbsp;
            </span>
          </v-fade-transition>
        </v-row>
      </div>
      <div style="border-top: 0!important" class="light-panel clipped">
        <div style="margin-left: 138px; padding-left: 8px; min-height: 100px">
          <p class="flavor-text mb-0">
            <v-row no-gutters>
              <v-col cols="auto">
                <b>{{ mech.Frame.Source }} {{ mech.Frame.Name }}</b>
              </v-col>
              <v-col cols="auto" class="ml-auto mr-4">
                <cc-tooltip simple inline content="Delete Mech">
                  <v-btn
                    small
                    icon
                    class="fadeSelect"
                    color="error"
                    @click.stop="$refs.delete.show()"
                  >
                    <v-icon small>delete</v-icon>
                  </v-btn>
                </cc-tooltip>
                <cc-tooltip simple inline content="Duplicate Mech">
                  <v-btn small icon class="fadeSelect" @click.stop="$refs.copy.show()">
                    <v-icon small>mdi-content-copy</v-icon>
                  </v-btn>
                </cc-tooltip>
                <cc-tooltip simple inline content="Print Mech Sheet">
                  <v-btn small icon class="fadeSelect" @click.stop="$refs.print.show()">
                    <v-icon small>mdi-printer</v-icon>
                  </v-btn>
                </cc-tooltip>
                <cc-tooltip simple inline content="Set As Active Mech">
                  <v-btn
                    small
                    icon
                    class="fadeSelect"
                    :disabled="mech.Pilot.ActiveMech === mech"
                    @click.stop="mech.Pilot.State.ActiveMech = mech"
                  >
                    <v-icon>cci-activate</v-icon>
                  </v-btn>
                </cc-tooltip>
              </v-col>
            </v-row>
            <v-row no-gutters class="mt-n2">
              <v-col cols="auto">
                <fieldset class="px-3">
                  <legend class="px-2">
                    Loadout//{{ mech.ActiveLoadout ? mech.ActiveLoadout.Name : 'ERR' }}
                  </legend>
                  <div v-if="mech.ActiveLoadout">
                    <span v-for="(item, i) in loadoutWeapons" :key="`${mech.ID}_lw_${i}`">
                      {{ item }}
                    </span>
                    <br />
                    <span v-for="(item, i) in loadoutSystems" :key="`${mech.ID}_ls_${i}`">
                      {{ i > 0 ? ' - ' : '' }}{{ item }}
                    </span>
                  </div>
                </fieldset>
                <!-- TODO: add charts -->
                <v-row v-show="$vuetify.breakpoint.mdAndUp" no-gutters justify="space-around">
                  <v-col cols="auto">
                    <span class="overline">
                      STR
                      <b>{{ mech.MaxStructure }}</b>
                    </span>
                  </v-col>
                  <v-divider vertical class="mx-2" />
                  <v-col cols="auto">
                    <span class="overline">
                      HP
                      <b>{{ mech.MaxHP }}</b>
                    </span>
                  </v-col>
                  <v-divider vertical class="mx-2" />
                  <v-col cols="auto">
                    <span class="overline">
                      Stress
                      <b>{{ mech.MaxStress }}</b>
                    </span>
                  </v-col>
                  <v-divider vertical class="mx-2" />
                  <v-col cols="auto">
                    <span class="overline">
                      Heat
                      <b>{{ mech.HeatCapacity }}</b>
                    </span>
                  </v-col>
                  <v-divider vertical class="mx-2" />
                  <v-col cols="auto">
                    <span class="overline">
                      RepCap
                      <b>{{ mech.RepairCapacity }}</b>
                    </span>
                  </v-col>
                </v-row>
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
  computed: {
    loadoutWeapons() {
      const output = []
      for (const mount of this.mech.ActiveLoadout.AllEquippableMounts(
        this.mech.Pilot.has('CoreBonus', 'cb_improved_armament'),
        this.mech.Pilot.has('CoreBonus', 'cb_integrated_weapon')
      )) {
        if (!mount.IsLocked) {
          let str = `${mount.Name}:`
          if (!mount.Weapons.length) str += ' EMPTY'
          else {
            mount.Weapons.forEach((w, i) => {
              str += ` ${w.Name}`
              if (w.Mod) str += ` (${w.Mod.Name})`
              if (i + 1 < mount.Weapons.length) str += '/'
            })
          }
          output.push(str)
        }
      }
      return output
    },
    loadoutSystems() {
      return this.mech.ActiveLoadout.AllActiveSystems.map(x => x.Name)
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
