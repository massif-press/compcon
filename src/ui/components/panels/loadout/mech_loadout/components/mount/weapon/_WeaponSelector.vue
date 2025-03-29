<template>
  <cc-compendium-browser
    :items="availableWeapons"
    item-type="MechWeapon"
    :table-headers="headers"
    :options="options"
    equippable
    @equip="handleEquip($event)">
    <template #header><div class="heading h3 text-center text-accent">Mech Weapons</div></template>
    <template #top>
      <v-row>
        <v-col>
          <div v-if="weaponSlot.Weapon">
            <div v-if="!mobile" class="text-cc-overline">
              UNION ARMORY PRINTID: {{ fID('ANN-NNN-NNN::AA//AA') }} &mdash;
              <span class="text-success">[ FRAME EQUIPMENT REGISTRATION VERIFIED ]</span>
            </div>
            <div class="heading h2 text-accent">
              {{ weaponSlot.Weapon.Name }}
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
          </div>
        </v-col>
      </v-row>
    </template>
  </cc-compendium-browser>
</template>

<script lang="ts">
import _ from 'lodash';

import { CompendiumStore } from '@/stores';
import { Rules, MechWeapon, Mech } from '@/class';
import { flavorID } from '@/io/Generators';
import { Bonus } from '@/classes/components/feature/bonus/Bonus';

export default {
  name: 'weapon-selector',
  props: {
    weaponSlot: {
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
      views: ['list', 'single', 'table', 'cards', 'scatter', 'bar', 'compare'],
      initialView: 'single',
      groups: ['source', 'lcp', 'license'],
      initialGroup: 'license',
    },
    headers: [
      { title: 'Manufacturer', align: 'left', key: 'Source' },
      { title: 'Weapon', align: 'left', key: 'Name' },
      { title: 'License', align: 'left', key: 'LicenseString' },
      { title: 'Size', align: 'left', key: 'Size' },
      { title: 'Type', align: 'left', key: 'WeaponTypes' },
      { title: 'Tags', align: 'center', key: 'Tags' },
      { title: 'Range', align: 'left', key: 'Range' },
      { title: 'Damage', align: 'left', key: 'Damage' },
    ],
    showUnlicensed: false,
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
      return this.weaponSlot.Weapon
        ? this.mech.FreeSP + this.weaponSlot.Weapon.SP
        : this.mech.FreeSP;
    },
    weapons(): MechWeapon[] {
      return CompendiumStore().MechWeapons;
    },
    availableWeapons(): MechWeapon[] {
      const fittings = Rules.MountFittings[this.weaponSlot.Size];
      // filter by fitting size
      let i = this.weapons.filter(
        (x) => x.Source && fittings.includes(x.Size) && !x.IsHidden && !x.IsExotic
      );

      // filter already equipped
      if (this.weaponSlot.Weapon) i = i.filter((x) => x.ID !== this.weaponSlot.Weapon.ID);

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

      i = i.concat(
        this.mech.Pilot.SpecialEquipment.filter(
          (x) => x.ItemType === 'MechWeapon' && fittings.includes(x.Size)
        )
      );

      // filter unique
      i = i.filter(
        (x) =>
          !this.mech.MechLoadoutController.ActiveLoadout.UniqueWeapons.map((y) => y.ID).includes(
            x.ID
          )
      );

      return i;
    },
  },
  methods: {
    fID(template: string): string {
      return flavorID(template);
    },
    handleEquip(event) {
      this.$emit('equip', event);
    },
  },
};
</script>
