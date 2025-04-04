<template>
  <cc-compendium-browser
    :items="availableMods"
    item-type="MechSystem"
    :table-headers="headers"
    :options="options"
    equippable>
    <template #header><div class="heading h3 text-center text-accent">Weapon Mods</div></template>
    <template #top>
      <v-row dense align="center">
        <v-col>
          <div v-if="weapon.Mod">
            <div v-if="!mobile" class="text-cc-overline">
              UNION ARMORY PRINTID: {{ fID('ANN-NNN-NNN::AA//AA') }} &mdash;
              <span class="text-success">[ FRAME EQUIPMENT REGISTRATION VERIFIED ]</span>
            </div>
            <div class="heading h2 text-accent">
              {{ weapon.Mod.Name }}
            </div>
            <div class="flavor-text overline" style="display: block">CURRENTLY EQUIPPED</div>
          </div>
          <div v-else-if="!mobile">
            <div class="text-cc-overline">
              UNION ARMORY EQUIPMENT AUTHORIZATION: FRAME EQUIPMENT//COMBAT SYSTEM
            </div>
            <div class="heading h2 text-disabled">NO SELECTION</div>
            <div class="flavor-text overline text-error" style="display: block">
              [ EQUIPMENT ID INVALID OR MISSING ]
            </div>
          </div>
        </v-col>
        <v-col cols="12" md="auto">
          <div class="text-right">
            <cc-switch
              v-model="showUnlicensed"
              :label="mobile && 'Show Unlicensed'"
              color="error"
              :tooltip="
                !mobile && showUnlicensed
                  ? 'Unlicensed equipment: SHOWN'
                  : 'Unlicensed equipment: HIDDEN'
              "
              :prepend-icon="!mobile && 'cc:system'"
              on-icon="mdi-lock-open"
              off-icon="mdi-lock" />
            <br />
            <cc-switch
              v-model="showOverSP"
              :label="mobile && 'Show Exceeds SP'"
              color="error"
              :tooltip="
                !mobile && showOverSP
                  ? 'Systems exceeding SP Capacity: SHOWN'
                  : 'Systems exceeding SP Capacity: HIDDEN'
              "
              :prepend-icon="!mobile && 'cc:system_point'"
              on-icon="mdi-lock-open"
              off-icon="mdi-lock" />
            <br />
            <cc-switch
              v-model="showIncompatible"
              :label="mobile && 'Show Exceeds SP'"
              color="error"
              :tooltip="
                !mobile && showIncompatible
                  ? 'Incompatible Mods: SHOWN'
                  : 'Incompatible Mods: HIDDEN'
              "
              :prepend-icon="!mobile && 'cc:status_downandout'"
              on-icon="mdi-lock-open"
              off-icon="mdi-lock" />
          </div>
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
      views: ['list', 'single', 'table', 'cards'],
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
  mounted() {
    this.options.initialView = this.mobile ? 'list' : 'single';
  },
  computed: {
    mobile(): boolean {
      return this.$vuetify.display.smAndDown;
    },
    freeSP(): number {
      return this.weapon.Mod ? this.mech.FreeSP + this.weapon.Mod.SP : this.mech.FreeSP;
    },
    mods(): WeaponMod[] {
      return CompendiumStore().WeaponMods as WeaponMod[];
    },
    availableMods(): WeaponMod[] {
      let i = this.mods.filter((x) => !x.IsHidden && !x.IsExotic);

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

      i = i.concat(this.mech.SpecialEquipment.filter((x) => x.ItemType === 'WeaponMod'));

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
