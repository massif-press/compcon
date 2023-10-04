<template>
  <v-card
    id="pc-wrapper"
    variant="outlined"
    :color="mech.Frame.Manufacturer.GetColor($vuetify.theme.current.dark)"
    @click="$emit('go', mech)"
  >
    <v-card
      tile
      :color="mech.Frame.Manufacturer.GetColor($vuetify.theme.current.dark)"
      style="position: absolute; z-index: 5"
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
        :style="`background-color: ${mech.Frame.Manufacturer.GetColor(
          $vuetify.theme.current.dark
        )}`"
      >
        <v-row no-gutters>
          <span class="heading h2 callsign" style="margin-left: 138px">{{ mech.Name }}</span>
        </v-row>
      </div>
      <div style="border-top: 0" class="light-panel">
        <div style="margin-left: 137px; margin-top: -1px; padding-left: 8px; min-height: 100px">
          <div class="flavor-text text-text">
            <v-row align="center">
              <v-col>
                <div class="heading h5 pt-1 mb-n1">
                  {{ mech.Frame.Source }} {{ mech.Frame.Name }}
                </div>

                <fieldset class="px-3">
                  <legend class="px-2">
                    Loadout//{{
                      mech.MechLoadoutController.ActiveLoadout
                        ? mech.MechLoadoutController.ActiveLoadout.Name
                        : 'ERR'
                    }}
                  </legend>
                  <div v-if="mech.MechLoadoutController.ActiveLoadout" class="pb-3">
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
                <v-row no-gutters justify="space-around">
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
              </v-col>
              <v-col cols="auto" class="pr-8">
                <cc-tooltip simple content="Delete Mech">
                  <v-btn
                    size="small"
                    icon
                    variant="plain"
                    color="error"
                    @click.stop="($refs as any).delete.show()"
                  >
                    <v-icon>mdi-delete</v-icon>
                  </v-btn>
                </cc-tooltip>
                <cc-tooltip simple content="Duplicate Mech">
                  <v-btn size="small" icon variant="plain" @click.stop="($refs as any).copy.show()">
                    <v-icon>mdi-content-copy</v-icon>
                  </v-btn>
                </cc-tooltip>
                <cc-tooltip simple content="Print Mech Sheet">
                  <v-btn
                    size="small"
                    icon
                    variant="plain"
                    @click.stop="$router.push(`/print/${mech.Pilot.ID}/${mech.ID}`)"
                  >
                    <v-icon>mdi-printer</v-icon>
                  </v-btn>
                </cc-tooltip>
              </v-col>
            </v-row>
          </div>
        </div>
      </div>
    </div>

    <copy-mech-dialog ref="copy" :mech="mech" @copy="$emit('copy', mech)" />
    <delete-mech-dialog ref="delete" :mech="mech" @delete="$emit('delete', mech)" />
  </v-card>
</template>

<script lang="ts">
import CopyMechDialog from './CopyMechDialog.vue';
import DeleteMechDialog from './DeleteMechDialog.vue';

export default {
  name: 'mech-list-item',
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
          let str = `<i style="opacity:0.5">${mount.Name}</i>:`;
          if (!mount.Weapons.length) str += ' EMPTY';
          else {
            mount.Weapons.forEach((w, i) => {
              str += ` ${w._name}`;
              if (w.Mod) str += ` (${w.Mod._name})`;
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
#pc-wrapper {
  position: relative;
  min-height: 138px;
  min-width: 100%;
  cursor: pointer;
  margin-bottom: 12px;
  border-radius: 0;
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
  background-color: rgb(var(--v-theme-light-panel));
}

.overlay {
  filter: brightness(70%);
  transition: filter 0.3s ease-in-out;
}

#pc-wrapper:hover .overlay {
  filter: brightness(100%);
}
</style>
