<template>
  <cc-compendium-browser
    :items="availableMods"
    item-type="MechSystem"
    :table-headers="headers"
    :options="options"
    equippable>
    <template #header><div class="heading h3 text-center text-accent">Weapon Mods</div></template>
    <template #top>
      <v-row>
        <v-col>
          <div v-if="weapon.Mod">
            <div class="text-overline">
              UNION ARMORY PRINTID: {{ fID('ANN-NNN-NNN::AA//AA') }} &mdash;
              <div class="text-success text--darken-1">[ EQUIPMENT MODIFICATION REGISTERED ]</div>
            </div>
            <br />
            <div class="heading h1 text-accent" style="line-height: 30px">
              {{ weapon.Mod.Name }}
            </div>
            <div class="flavor-text overline mt-n1" style="display: block">CURRENTLY INSTALLED</div>
          </div>
          <div v-else>
            <div class="text-overline">
              UNION ARMORY EQUIPMENT AUGMENTATION AUTHORIZATION: FRAME ARMAMENT//MODIFICATION
            </div>
            <div class="heading h1 text-disabled text--lighten-1" style="line-height: 30px">
              NO SELECTION
            </div>
            <div class="flavor-text overline text-error" style="display: block">
              [ MODIFICATION DATA INVALID OR MISSING ]
            </div>
          </div>
        </v-col>
        <v-col cols="auto">
          <v-switch v-model="showUnlicensed" density="compact" inset hide-details color="warning">
            <template #label>
              <cc-tooltip
                slot="label"
                inline
                :content="
                  showUnlicensed ? 'Unlicensed equipment: SHOWN' : 'Unlicensed equipment: HIDDEN'
                ">
                <v-icon
                  :color="showUnlicensed ? 'warning' : 'success'"
                  :icon="showUnlicensed ? 'mdi-lock-open' : 'mdi-lock'" />
              </cc-tooltip>
            </template>
          </v-switch>
          <v-switch v-model="showOverSP" density="compact" inset hide-details color="warning">
            <template #label>
              <cc-tooltip
                slot="label"
                inline
                :content="
                  showOverSP
                    ? 'Systems exceeding SP Capacity: SHOWN'
                    : 'Systems exceeding SP Capacity: HIDDEN'
                ">
                <v-icon :color="showOverSP ? 'warning' : 'success'" :icon="'cc:system_point'" />
              </cc-tooltip>
            </template>
          </v-switch>
          <v-switch v-model="showIncompatible" density="compact" inset hide-details color="warning">
            <template #label>
              <cc-tooltip
                slot="label"
                inline
                :content="
                  showIncompatible ? 'Incompatible Mods: SHOWN' : 'Incompatible Mods: HIDDEN'
                ">
                <v-icon
                  :color="showIncompatible ? 'warning' : 'success'"
                  :icon="'cc:status_downandout'" />
              </cc-tooltip>
            </template>
          </v-switch>
        </v-col>
      </v-row>
    </template>
  </cc-compendium-browser>
</template>

<script lang="ts">
import { CompendiumStore } from '@/stores';
import { Mech, MechSystem, WeaponMod } from '@/class';
import { flavorID } from '@/io/Generators';
import { Bonus } from '@/classes/components/feature/bonus/Bonus';

export default {
  name: 'mod-selector',
  props: {
    weapon: {
      type: Object,
      required: true,
    },
    mech: {
      type: Object,
      required: true,
    },
  },
  data: () => ({
    options: {
      views: ['single', 'table', 'cards'],
      initialView: 'single',
      groups: ['source', 'lcp', 'license'],
      initialGroup: 'none',
    },
    headers: [
      { title: 'Manufacturer', align: 'left', key: 'Source' },
      { title: 'System', align: 'left', key: 'Name' },
      { title: 'License', align: 'left', key: 'License' },
      { title: 'License Level', align: 'left', key: 'LicenseLevel' },
      { title: 'SP Cost', align: 'left', key: 'SP' },
    ],
    showUnlicensed: false,
    showIncompatible: false,
    showOverSP: false,
  }),
  computed: {
    freeSP(): number {
      return this.weapon.Mod ? this.mech.FreeSP + this.weapon.Mod.SP : this.mech.FreeSP;
    },
    mods(): WeaponMod[] {
      return CompendiumStore().WeaponMods as WeaponMod[];
    },
    availableMods(): WeaponMod[] {
      let i = this.mods.filter((x) => !x.IsHidden);

      if (!this.showIncompatible) {
        // filter by applied_to
        i = i.filter((x) => x.AllowedTypes && x.AllowedTypes.includes(this.weapon.ModType));
        i = i.filter((x) => x.AllowedSizes && x.AllowedSizes.includes(this.weapon.ModSize));

        // // filter out any mount restrictions
        i = i.filter((x) => !x.RestrictedTypes || !x.RestrictedTypes.includes(this.weapon.ModType));
        i = i.filter((x) => !x.RestrictedSizes || !x.RestrictedSizes.includes(this.weapon.ModSize));
      }

      // filter already equipped
      if (this.weapon.Mod) i = i.filter((x) => x.ID !== this.weapon.Mod.ID);

      // filter unique
      i = i.filter(
        (x) =>
          !this.mech.MechLoadoutController.ActiveLoadout.UniqueMods.map((y) => y.ID).includes(x.ID)
      );

      // filter ai
      if (
        this.mech.MechLoadoutController.ActiveLoadout.AICount >=
        1 + Bonus.get('ai_cap', this.mech as Mech)
      ) {
        i = i.filter((x) => !x.IsAI);
      }

      if (!this.showUnlicensed) {
        i = i.filter(
          (x) => !x.LicenseLevel || this.mech.Pilot.has('License', x.License, x.LicenseLevel)
        );
      }

      if (!this.showOverSP) {
        i = i.filter((x) => x.SP <= this.freeSP);
      }

      i = i.concat(this.mech.Pilot.SpecialEquipment.filter((x) => x.ItemType === 'WeaponMod'));

      return i;
    },
  },
  methods: {
    fID(template: string): string {
      return flavorID(template);
    },
  },
};
</script>
