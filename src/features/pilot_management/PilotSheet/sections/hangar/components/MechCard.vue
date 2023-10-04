<template>
  <v-col cols="12" style="min-width: 20%; max-width: 50%">
    <div
      :style="`border: 2px solid ${mech.Frame.Manufacturer.GetColor($vuetify.theme.current.dark)}`"
    >
      <v-hover>
        <template v-slot="{ isHovering, props }">
          <v-card height="40vh" flat v-bind="props" @click="$emit('go', mech)">
            <v-toolbar
              density="compact"
              :color="mech.Frame.Manufacturer.GetColor($vuetify.theme.current.dark)"
              class="mb-n10 px-2"
            >
              <span class="heading h2" style="letter-spacing: 3px">
                {{ mech.Name }}
              </span>
              <v-spacer />
              <v-icon size="50" :icon="mech.Frame.Manufacturer.Icon" color="white" />
            </v-toolbar>

            <v-img :src="mech.Portrait" position="top center" height="100%">
              <v-expand-transition>
                <v-card
                  v-if="isHovering"
                  class="flavor-text"
                  style="height: 100%; max-width: 100%; opacity: 0.9"
                >
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
                      <div v-if="mech.MechLoadoutController.ActiveLoadout" class="px-2 pb-2">
                        <span v-for="(item, i) in loadoutWeapons">
                          <span v-html="item" />
                          <cc-slashes v-if="i + 1 < loadoutWeapons.length" class="px-2" />
                        </span>
                        <br />
                        <span v-for="(item, i) in loadoutSystems">
                          {{ i > 0 ? ' - ' : '' }} <span v-html="item" />
                        </span>
                      </div>
                    </fieldset>
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
                        size="small"
                        icon
                        variant="plain"
                        color="error"
                        @click.stop="($refs as any).delete.show()"
                      >
                        <v-icon icon="mdi-delete" />
                      </v-btn>
                    </cc-tooltip>
                    <cc-tooltip simple inline content="Duplicate Mech">
                      <v-btn
                        size="small"
                        icon
                        variant="plain"
                        @click.stop="($refs as any).copy.show()"
                      >
                        <v-icon icon="mdi-content-copy" />
                      </v-btn>
                    </cc-tooltip>
                    <cc-tooltip simple inline content="Print Mech Sheet">
                      <v-btn
                        size="small"
                        icon
                        variant="plain"
                        @click.stop="$router.push(`/print/${mech.Pilot.ID}/${mech.ID}`)"
                      >
                        <v-icon icon="mdi-printer" />
                      </v-btn>
                    </cc-tooltip>
                    <cc-tooltip simple inline content="Set As Active Mech">
                      <v-btn
                        small
                        icon
                        variant="plain"
                        :disabled="mech.Pilot.ActiveMech === mech"
                        @click.stop="mech.Pilot.ActiveMech = mech"
                      >
                        <v-icon icon="cc:activate" />
                      </v-btn>
                    </cc-tooltip>
                  </v-card-actions>
                </v-card>
              </v-expand-transition>
            </v-img>
          </v-card>
        </template>
      </v-hover>
    </div>
    <copy-mech-dialog ref="copy" :mech="mech" @copy="$emit('copy', mech)" />
    <delete-mech-dialog ref="delete" :mech="mech" @delete="$emit('delete', mech)" />
  </v-col>
</template>

<script lang="ts">
import CopyMechDialog from './CopyMechDialog.vue';
import DeleteMechDialog from './DeleteMechDialog.vue';

export default {
  name: 'mech-card',
  components: { CopyMechDialog, DeleteMechDialog },
  props: {
    mech: {
      type: Object,
      required: true,
    },
  },
  computed: {
    loadoutWeapons() {
      const output = [] as string[];
      for (const mount of this.mech.MechLoadoutController.ActiveLoadout.AllEquippableMounts(
        this.mech.Pilot.has('CoreBonus', 'cb_improved_armament'),
        this.mech.Pilot.has('CoreBonus', 'cb_integrated_weapon'),
        this.mech.Pilot.has('CoreBonus', 'cb_superheavy_mounting')
      )) {
        if (!mount.IsLocked) {
          let str = `<i style="opacity:0.8">${mount.Name}</i>:`;
          if (!mount.Weapons.length) str += ' EMPTY';
          else {
            mount.Weapons.forEach((w, i) => {
              str += ` ${w.Name}`;
              if (w.Mod) str += ` (${w.Mod.Name})`;
              if (i + 1 < mount.Weapons.length) str += ' /';
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
