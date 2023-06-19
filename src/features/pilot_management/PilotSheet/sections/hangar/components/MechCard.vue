<template>
  <v-col
    cols="12"
    md=""
    :style="$vuetify.display.mdAndUp ? 'min-width: 400px; max-width: 50%' : ''"
  >
    <div
      v-if="mech"
      :style="`border: 2px solid ${
        mech.IsActive
          ? 'rgb(var(--v-theme-success))'
          : mech.Frame.Manufacturer.GetColor($vuetify.theme.current.dark)
      }`"
    >
      <v-hover>
        <template #default="{ hover }">
          <v-card height="300px" tile flat @click="$emit('go', mech)">
            <div
              class="clipped-large"
              :style="`z-index: 2; position: absolute; top: 0; left: -2px; right: -2px; height: 32px; background-color: ${
                mech.IsActive
                  ? 'rgb(var(--v-theme-success))'
                  : mech.Frame.Manufacturer.GetColor($vuetify.theme.current.dark)
              }`"
            >
              <span class="heading h2 text-white flavor-text ml-2" style="letter-spacing: 3px">
                {{ mech.Name }}
              </span>
            </div>
            <div
              :style="`z-index: 3; position: absolute; top: -5px; right: 20px; height: 32px; width:32px`"
            >
              <cc-logo
                size="xLarge"
                :source="mech.Frame.Manufacturer"
                color="white"
                :stroke="mech.Frame.Manufacturer.GetColor($vuetify.theme.current.dark)"
              />
            </div>
            <div
              v-if="mech.IsActive"
              class="text-overline"
              :style="`z-index: 3; position: absolute; top: 30px; left: 4px;`"
            >
              <b class="text-success">//ACTIVE</b>
            </div>
            <v-img :src="mech.Portrait" position="top center" height="100%" />
            <v-fade-transition>
              <v-overlay v-if="hover" absolute color="grey darken-3" opacity="0.8">
                <v-card flat tile class="flavor-text" light>
                  <v-card-text>
                    <b>{{ mech.Name }}</b>
                    //
                    <b>{{ mech.Frame.Source }} {{ mech.Frame.Name }}</b>
                    <br />
                    <fieldset>
                      <legend class="px-2">
                        Loadout//{{
                          mech.MechLoadoutController.ActiveLoadout
                            ? mech.MechLoadoutController.ActiveLoadout.Name
                            : 'ERR'
                        }}
                      </legend>
                      <div v-if="mech && mech.MechLoadoutController.ActiveLoadout">
                        <span v-for="(item, i) in loadoutWeapons">
                          {{ item }}
                        </span>
                        <br />
                        <span v-for="(item, i) in loadoutSystems">
                          {{ i > 0 ? ' - ' : '' }}{{ item }}
                        </span>
                      </div>
                    </fieldset>
                    <!-- TODO: add charts -->
                    <v-row no-gutters justify="space-between">
                      <v-col cols="auto">
                        <span class="text-overline">
                          STR
                          <b>{{ mech.MaxStructure }}</b>
                        </span>
                      </v-col>
                      <v-divider vertical class="mx-2" />
                      <v-col cols="auto">
                        <span class="text-overline">
                          HP
                          <b>{{ mech.MaxHP }}</b>
                        </span>
                      </v-col>
                      <v-divider vertical class="mx-2" />
                      <v-col cols="auto">
                        <span class="text-overline">
                          Stress
                          <b>{{ mech.MaxStress }}</b>
                        </span>
                      </v-col>
                      <v-divider vertical class="mx-2" />
                      <v-col cols="auto">
                        <span class="text-overline">
                          Heat
                          <b>{{ mech.HeatCapacity }}</b>
                        </span>
                      </v-col>
                      <v-divider vertical class="mx-2" />
                      <v-col cols="auto">
                        <span class="text-overline">
                          RepCap
                          <b>{{ mech.RepairCapacity }}</b>
                        </span>
                      </v-col>
                    </v-row>
                  </v-card-text>
                  <v-alert
                    v-if="mech.Destroyed"
                    color="error"
                    density="compact"
                    tile
                    class="text-center"
                  >
                    <span style="letter-spacing: 5px">// DESTROYED //</span>
                  </v-alert>
                  <v-alert
                    v-if="mech.ReactorDestroyed"
                    color="accent"
                    density="compact"
                    tile
                    class="text-center"
                  >
                    <span style="letter-spacing: 5px">// REACTOR DESTROYED //</span>
                  </v-alert>
                  <v-expand-transition>
                    <v-alert
                      v-if="mech.IsActive"
                      color="success"
                      density="compact"
                      tile
                      class="text-center"
                    >
                      <span style="letter-spacing: 5px">// ACTIVE //</span>
                    </v-alert>
                  </v-expand-transition>
                  <v-divider />
                  <v-card-actions>
                    <v-spacer />
                    <cc-tooltip simple inline content="Delete Mech">
                      <v-btn
                        small
                        icon
                        class="fade-select"
                        color="error"
                        @click.stop="$refs.delete.show()"
                      >
                        <v-icon icon="delete" />
                      </v-btn>
                    </cc-tooltip>
                    <cc-tooltip simple inline content="Duplicate Mech">
                      <v-btn small icon class="fade-select" @click.stop="$refs.copy.show()">
                        <v-icon icon="mdi-content-copy" />
                      </v-btn>
                    </cc-tooltip>
                    <cc-tooltip simple inline content="Print Mech Sheet">
                      <v-btn small icon class="fade-select" @click.stop="$refs.print.show()">
                        <v-icon icon="mdi-printer" />
                      </v-btn>
                    </cc-tooltip>
                    <cc-tooltip simple inline content="Set As Active Mech">
                      <v-btn
                        small
                        icon
                        class="fade-select"
                        :disabled="mech.Pilot.ActiveMech === mech"
                        @click.stop="mech.Pilot.ActiveMech = mech"
                      >
                        <v-icon icon="cc:activate" />
                      </v-btn>
                    </cc-tooltip>
                  </v-card-actions>
                </v-card>
              </v-overlay>
            </v-fade-transition>
          </v-card>
        </template>
      </v-hover>
    </div>
    <copy-mech-dialog ref="copy" :mech="mech" @copy="$emit('copy', mech)" />
    <delete-mech-dialog ref="delete" :mech="mech" @delete="$emit('delete', mech)" />
    <print-dialog ref="print" :pilot="mech.Pilot" />
  </v-col>
</template>

<script lang="ts">
import CopyMechDialog from './CopyMechDialog.vue';
import DeleteMechDialog from './DeleteMechDialog.vue';
import PrintDialog from '../../../components/PrintDialog.vue';

export default {
  name: 'mech-card',
  components: { CopyMechDialog, DeleteMechDialog, PrintDialog },
  props: {
    mech: {
      type: Object,
      required: true,
    },
  },
  computed: {
    loadoutWeapons() {
      const output = [];
      for (const mount of this.mech.MechLoadoutController.ActiveLoadout.AllEquippableMounts(
        this.mech.Pilot.has('CoreBonus', 'cb_improved_armament'),
        this.mech.Pilot.has('CoreBonus', 'cb_integrated_weapon'),
        this.mech.Pilot.has('CoreBonus', 'cb_superheavy_mounting')
      )) {
        if (!mount.IsLocked) {
          let str = `${mount.Name}:`;
          if (!mount.Weapons.length) str += ' EMPTY';
          else {
            mount.Weapons.forEach((w, i) => {
              str += ` ${w.Name}`;
              if (w.Mod) str += ` (${w.Mod.Name})`;
              if (i + 1 < mount.Weapons.length) str += '/';
            });
          }
          output.push(str);
        }
      }
      return output;
    },
    loadoutSystems() {
      return this.mech.MechLoadoutController.ActiveLoadout.AllActiveSystems.map((x) => x.Name);
    },
  },
};
</script>

<style scoped>
.card-outline {
  border: 1px solid;
}
</style>
