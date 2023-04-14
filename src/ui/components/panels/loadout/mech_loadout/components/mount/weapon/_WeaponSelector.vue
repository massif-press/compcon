<template>
  <div>
    <cc-selector-table
      :items="availableWeapons"
      :headers="headers"
      sp-disable
      :sp="freeSP"
      :sp-ignore="showOverSP"
      item-type-fallback="MechWeapon"
      @equip="$emit('equip', $event)"
    >
      <div v-if="weaponSlot.Weapon">
        <span class="overline">
          UNION ARMORY PRINTID: {{ fID('ANN-NNN-NNN::AA//AA') }} &mdash;
          <span class="text-success text--darken-1">
            [ FRAME EQUIPMENT REGISTRATION VERIFIED ]
          </span>
        </span>
        <br />
        <span class="heading h1 text-accent" style="line-height: 20px">
          {{ weaponSlot.Weapon.Name }}
        </span>
        <span class="flavor-text overline mt-n1" style="display: block"
          >CURRENTLY EQUIPPED</span
        >
      </div>
      <div v-else>
        <span class="overline">
          UNION ARMORY EQUIPMENT AUTHORIZATION: FRAME EQUIPMENT//ARMAMENT::{{
            weaponSlot.Size
          }}
          MOUNT
        </span>
        <br />
        <span
          class="heading h1 text-subtle text--lighten-1"
          style="line-height: 20px"
        >
          NO SELECTION
        </span>
        <span
          class="flavor-text overline mt-n1 text-error"
          style="display: block"
        >
          [ EQUIPMENT ID INVALID OR MISSING ]
        </span>
      </div>
      <div slot="extra-item" class="mt-2 mb-n2">
        <div class="mb-n2">
          <v-switch
            v-model="showUnlicensed"
            density="compact"
            inset
            hide-details
            color="warning"
            class="mr-3 d-inline"
          >
            <cc-tooltip
              slot="label"
              simple
              inline
              :content="
                showUnlicensed
                  ? 'Unlicensed equipment: SHOWN'
                  : 'Unlicensed equipment: HIDDEN'
              "
            >
              <v-icon
                class="ml-n2"
                :color="showUnlicensed ? 'warning' : 'success'"
                v-html="showUnlicensed ? 'mdi-lock-open' : 'mdi-lock'"
              />
            </cc-tooltip>
          </v-switch>
        </div>
        <div class="mt-n4">
          <v-switch
            v-model="showOverSP"
            density="compact"
            inset
            hide-details
            color="warning"
            class="mr-3 d-inline"
          >
            <cc-tooltip
              slot="label"
              simple
              inline
              :content="
                showOverSP
                  ? 'Systems exceeding SP Capacity: SHOWN'
                  : 'Systems exceeding SP Capacity: HIDDEN'
              "
            >
              <v-icon
                class="ml-n2"
                :color="showOverSP ? 'warning' : 'success'"
                v-html="'cc:system_point'"
              />
            </cc-tooltip>
          </v-switch>
        </div>
      </div>
    </cc-selector-table>
  </div>
</template>

<script lang="ts">
import _ from 'lodash';

import { CompendiumStore } from '@/stores';
import { Rules, MechWeapon } from '@/class';
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
    headers: [
      { title: 'Source', align: 'left', value: 'Source' },
      { title: 'Weapon', align: 'left', value: 'Name' },
      { title: 'License', align: 'left', value: 'LicenseString' },
      { title: 'Size', align: 'left', value: 'SizeInt' },
      { title: 'Type', align: 'left', value: 'WeaponType' },
      { title: 'Range', align: 'left', value: 'Range[0].Max' },
      { title: 'Damage', align: 'left', value: 'Damage[0].Max' },
      { title: 'SP', align: 'left', value: 'SP' },
      { title: '', align: 'center', value: 'Equip' },
    ],
    weapons: [],
    showUnlicensed: false,
    showOverSP: false,
  }),
  computed: {
    freeSP(): number {
      return this.weaponSlot.Weapon
        ? this.mech.FreeSP + this.weaponSlot.Weapon.SP
        : this.mech.FreeSP;
    },
    availableWeapons(): MechWeapon[] {
      const fittings = Rules.MountFittings[this.weaponSlot.Size];
      // filter by fitting size
      let i = this.weapons.filter(
        (x) => fittings.includes(x.Size) && !x.IsHidden && !x.IsExotic
      );

      // filter already equipped
      if (this.weaponSlot.Weapon)
        i = i.filter((x) => x.ID !== this.weaponSlot.Weapon.ID);

      // filter ai
      if (
        this.mech.MechLoadoutController.ActiveLoadout.AICount >=
        1 + Bonus.get('ai_cap', this.mech)
      ) {
        i = i.filter((x) => !x.IsAI);
      }

      if (!this.showUnlicensed) {
        i = i.filter(
          (x) =>
            !x.LicenseLevel ||
            this.mech.Pilot.has('License', x.License, x.LicenseLevel)
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
          !this.mech.MechLoadoutController.ActiveLoadout.UniqueWeapons.map(
            (y) => y.ID
          ).includes(x.ID)
      );

      return _.sortBy(i, ['Source', 'Name']);
    },
  },
  created() {
    const compendium = CompendiumStore();
    this.weapons = compendium.MechWeapons.filter((x) => x.Source);
  },
  methods: {
    fID(template: string): string {
      return flavorID(template);
    },
  },
};
</script>
