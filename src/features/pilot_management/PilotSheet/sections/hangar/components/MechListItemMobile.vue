<template>
  <div class="top-element" style="position: relative">
    <div
      :style="`background-color: ${mech.Frame.Manufacturer.GetColor($vuetify.theme.current.dark)}`"
      class="pip" />
    <v-card
      id="pc-wrapper"
      variant="outlined"
      style="clip-path: polygon(18px 0, 100% 0, 100% 100%, 0 100%, 0 18px)"
      :color="mech.Frame.Manufacturer.GetColor($vuetify.theme.current.dark)"
      @click="$emit('go', mech)">
      <v-card
        tile
        :color="mech.Frame.Manufacturer.GetColor($vuetify.theme.current.dark)"
        style="
          position: absolute;
          z-index: 5;
          clip-path: polygon(20px 0, 100% 0, 100% 100%, 0 100%, 0 20px);
        "
        class="clipped-square-invert"
        min-width="75px"
        min-height="100%">
        <div id="interior" class="clipped-square-invert">
          <cc-img :src="mech.Portrait" position="top center" height="100%" cover />
        </div>
      </v-card>

      <div style="width: 100%">
        <v-toolbar
          class="px-1"
          height="22"
          :style="`background-color: ${mech.Frame.Manufacturer.GetColor(
            $vuetify.theme.current.dark
          )}`">
          <span class="heading text-cc-overline" style="margin-left: 75px">
            <v-icon :icon="mech.Frame.Manufacturer.Icon" />
            {{ mech.Name }}
          </span>
        </v-toolbar>

        <div style="border-top: 0" class="light-panel">
          <div style="margin-left: 74px; margin-top: -1px; padding-left: 8px; min-height: 100px">
            <div class="text-cc-overline pt-1">{{ mech.Frame.Source }} {{ mech.Frame.Name }}</div>
            <div class="text-disabled text-cc-overline pb-1">
              <v-icon icon="mdi-sword-cross" size="small" />
              loadout // {{ mech.MechLoadoutController.ActiveLoadout.Name || '---' }}
            </div>

            <v-row dense class="text-cc-overline" justify="space-around">
              <v-col cols="auto">
                <v-icon class="mr-1" icon="cc:structure" />
                <b class="text-accent">{{ mech.MaxStructure }}</b>
              </v-col>
              <v-col cols="auto">
                <v-icon class="mr-1" icon="mdi-shield-outline" />
                <b class="text-accent">{{ mech.Armor }}</b>
              </v-col>
              <v-col cols="auto">
                <v-icon class="mr-1" icon="mdi-heart-outline" />
                <b class="text-accent">{{ mech.MaxHP }}</b>
              </v-col>
              <v-col cols="auto">
                <v-icon class="mr-1" icon="cc:reactor" />
                <b class="text-accent">{{ mech.MaxStress }}</b>
              </v-col>
              <v-col cols="auto">
                <v-icon class="mr-1" icon="cc:heat" />
                <b class="text-accent">{{ mech.HeatCapacity }}</b>
              </v-col>
              <v-col cols="auto">
                <v-icon class="mr-1" icon="cc:repair" />
                <b class="text-accent">{{ mech.RepairCapacity }}</b>
              </v-col>
            </v-row>

            <v-row dense justify="space-around" style="position: absolute; bottom: 0">
              <v-col cols="auto">
                <cc-dialog
                  :close-on-click="false"
                  title="Delete Mech"
                  color="error"
                  icon="mdi-delete">
                  <template #activator="{ open }">
                    <v-tooltip text="Delete Mech">
                      <template #activator="{ props }">
                        <v-btn
                          size="x-small"
                          variant="text"
                          tile
                          v-bind="props"
                          icon="mdi-delete"
                          color="error"
                          @click.stop="open" />
                      </template>
                    </v-tooltip>
                  </template>
                  <cc-confirmation
                    :content="`Lancer, please confirm deletion of Mech Configuration:
          <span class='text-accent'>
            ${mech.Name} (${mech.Frame.Source}, ${mech.Frame.Name})
          </span>`"
                    @confirm="$emit('delete', mech)" />
                </cc-dialog>
              </v-col>

              <v-col cols="auto">
                <cc-dialog :close-on-click="false" title="Duplicate Mech" icon="mdi-content-copy">
                  <template #activator="{ open }">
                    <v-tooltip text="Duplicate Mech">
                      <template #activator="{ props }">
                        <v-btn
                          size="x-small"
                          variant="text"
                          tile
                          v-bind="props"
                          icon="mdi-content-copy"
                          @click.stop="open" />
                      </template>
                    </v-tooltip>
                  </template>
                  <cc-confirmation
                    :content="`Lancer, please confirm intention to create a duplicate of Mech Configuration:
          <span class='text-accent'>
            ${mech.Name} (${mech.Frame.Source}, ${mech.Frame.Name})
          </span>`"
                    @confirm="$emit('copy', mech)" />
                </cc-dialog>
              </v-col>

              <v-col cols="auto">
                <v-tooltip text="Print Mech Sheet">
                  <template #activator="{ props }">
                    <v-btn
                      size="x-small"
                      variant="text"
                      tile
                      v-bind="props"
                      icon="mdi-printer"
                      @click.stop="$router.push(`/print/${mech.Pilot.ID}/${mech.ID}`)" />
                  </template>
                </v-tooltip>
              </v-col>
            </v-row>
          </div>
        </div>
      </div>
    </v-card>
  </div>
</template>

<script lang="ts">
export default {
  name: 'mech-list-item',
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

#interior {
  position: absolute;
  top: 2px;
  left: 2px;
  bottom: 2px;
  right: 2px;
  background-color: rgb(var(--v-theme-light-panel));
}

.pip {
  width: 15px;
  height: 15px;
  position: absolute;
  top: 0px;
  left: 0px;
  opacity: 1;
  clip-path: polygon(0 50%, 50% 0, 100% 0, 0% 100%);
  transition: all 0.2s ease-in-out;
}

.top-element:hover .pip {
  filter: brightness(1.2) saturate(150%) hue-rotate(20deg);
  background-color: rgb(var(--v-theme-success)) !important;
}
</style>
