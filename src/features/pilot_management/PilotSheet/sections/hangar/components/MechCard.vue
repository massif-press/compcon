<template>
  <v-col cols="12" sm="6" class="top-element">
    <v-hover>
      <template v-slot="{ isHovering, props }">
        <div style="position: relative">
          <div
            :style="`background-color: ${mech.Frame.Manufacturer.GetColor(
              $vuetify.theme.current.dark
            )}`"
            :class="`pip bg-${isHovering ? 'success' : ''}`" />
          <div
            style="clip-path: polygon(24px 0, 100% 0, 100% 100%, 0 100%, 0 24px)"
            :style="`border: 2px solid ${mech.Frame.Manufacturer.GetColor(
              $vuetify.theme.current.dark
            )}; border-radius: 2px`">
            <v-card
              height="40vh"
              tile
              flat
              v-bind="props"
              style="clip-path: polygon(20px 0, 100% 0, 100% 100%, 0 100%, 0 20px)"
              @click="$emit('go', mech)">
              <v-toolbar
                density="compact"
                height="50"
                :color="mech.Frame.Manufacturer.GetColor($vuetify.theme.current.dark)"
                class="pl-6 pr-2 heading"
                :class="mobile ? 'mb-n3' : 'mb-n8 h3'">
                <span style="letter-spacing: 3px; line-height: 23px">
                  {{ mech.Name }}
                </span>
                <v-spacer />
                <v-icon :icon="mech.Frame.Manufacturer.Icon" color="white" />
              </v-toolbar>

              <cc-img :src="mech.Portrait" position="top center" height="100%">
                <v-expand-transition>
                  <v-card
                    v-if="isHovering"
                    class="flavor-text"
                    style="height: calc(100% - 32px); top: 32px; max-width: 100%; opacity: 0.9">
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
                            {{ i > 0 ? ' - ' : '' }}
                            <span v-html="item" />
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
                    <v-divider />
                    <v-card-actions v-if="!mech.Pilot.IsRemote">
                      <v-spacer />
                      <v-tooltip location="top" text="Delete Mech">
                        <template #activator="{ props }">
                          <v-btn
                            v-bind="props"
                            size="small"
                            icon
                            variant="plain"
                            color="error"
                            @click.stop="($refs as any).delete.open()">
                            <v-icon icon="mdi-delete" />
                          </v-btn>
                        </template>
                      </v-tooltip>
                      <v-tooltip location="top" text="Duplicate Mech">
                        <template #activator="{ props }">
                          <v-btn
                            v-bind="props"
                            size="small"
                            icon
                            variant="plain"
                            @click.stop="($refs as any).copy.open()">
                            <v-icon icon="mdi-content-copy" />
                          </v-btn>
                        </template>
                      </v-tooltip>
                      <v-tooltip location="top" text="Print Mech Sheet">
                        <template #activator="{ props }">
                          <v-btn
                            v-bind="props"
                            size="small"
                            icon
                            variant="plain"
                            @click.stop="$router.push(`/print/${mech.Pilot.ID}/${mech.ID}`)">
                            <v-icon icon="mdi-printer" />
                          </v-btn>
                        </template>
                      </v-tooltip>
                    </v-card-actions>
                  </v-card>
                </v-expand-transition>
              </cc-img>
            </v-card>
          </div>
        </div>
      </template>
    </v-hover>

    <cc-dialog
      ref="delete"
      :close-on-click="false"
      title="Delete Mech"
      color="error"
      icon="mdi-delete">
      <cc-confirmation
        :content="`Lancer, please confirm deletion of Mech Configuration:
          <span class='text-accent'>
            ${mech.Name} (${mech.Frame.Source}, ${mech.Frame.Name})
          </span>`"
        @confirm="$emit('delete', mech)" />
    </cc-dialog>

    <cc-dialog ref="copy" :close-on-click="false" title="Duplicate Mech" icon="mdi-content-copy">
      <cc-confirmation
        :content="`Lancer, please confirm intention to create a duplicate of Mech Configuration:
          <span class='text-accent'>
            ${mech.Name} (${mech.Frame.Source}, ${mech.Frame.Name})
          </span>`"
        @confirm="$emit('copy', mech)" />
    </cc-dialog>
  </v-col>
</template>

<script lang="ts">
export default {
  name: 'mech-card',
  props: {
    mech: {
      type: Object,
      required: true,
    },
  },
  computed: {
    mobile() {
      return this.$vuetify.display.smAndDown;
    },
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

.v-card {
  cursor: pointer;
  transition: all 0.2s ease-in-out;
}

.v-card:hover {
  filter: brightness(1.1) saturate(110%);
}

.pip {
  width: 17px;
  height: 17px;
  position: absolute;
  opacity: 1;
  clip-path: polygon(0 50%, 50% 0, 100% 0, 0% 100%);
  transition: filter 0.2s ease-in-out;
}

.top-element:hover .pip {
  filter: brightness(1.2) saturate(150%) hue-rotate(20deg);
}
</style>
