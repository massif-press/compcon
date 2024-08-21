<template>
  <cc-compendium-browser
    :items="availableSystems"
    item-type="MechSystem"
    :table-headers="headers"
    :options="options"
    equippable
    @equip="handleEquip($event)">
    <template #header><div class="heading h3 text-center text-accent">Mech Weapons</div></template>
    <template #top>
      <v-row>
        <v-col>
          <div v-if="equipped">
            <span class="text-overline">
              UNION ARMORY PRINTID: {{ fID('ANN-NNN-NNN::AA//AA') }} &mdash;
              <span class="text-success text--darken-1">
                [ FRAME EQUIPMENT REGISTRATION VERIFIED ]
              </span>
            </span>
            <br />
            <span class="heading h1 text-accent" style="line-height: 20px">
              {{ equipped.Name }}
            </span>
            <span class="flavor-text overline mt-n1" style="display: block">
              CURRENTLY EQUIPPED
            </span>
          </div>
          <div v-else>
            <span class="text-overline">
              UNION ARMORY EQUIPMENT AUTHORIZATION: FRAME EQUIPMENT//COMBAT SYSTEM
            </span>
            <br />
            <span class="heading h1 text-disabled text--lighten-1" style="line-height: 20px">
              NO SELECTION
            </span>
            <span class="flavor-text overline mt-n1 text-error" style="display: block">
              [ EQUIPMENT ID INVALID OR MISSING ]
            </span>
          </div>
        </v-col>
        <v-col cols="auto">
          <v-switch v-model="showUnlicensed" density="compact" inset hide-details color="warning">
            <template #label>
              <cc-tooltip
                slot="label"
                simple
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
                simple
                inline
                :content="
                  showOverSP
                    ? 'Systems exceeding SP Capacity: SHOWN'
                    : 'Systems exceeding SP Capacity: HIDDEN'
                ">
                <v-icon :color="showOverSP ? 'warning' : 'success'" icon="cc:system_point" />
              </cc-tooltip>
            </template>
          </v-switch>
        </v-col>
      </v-row>
    </template>
  </cc-compendium-browser>
</template>

<script lang="ts">
import _ from 'lodash';

import { CompendiumStore } from '@/stores';
import { Mech, MechSystem } from '@/class';
import { flavorID } from '@/io/Generators';
import { Bonus } from '@/classes/components/feature/bonus/Bonus';

export default {
  name: 'system-selector',
  props: {
    equipped: {
      type: Object,
      required: false,
      default: null,
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
      initialGroup: 'license',
    },
    headers: [
      { title: 'Manufacturer', align: 'left', key: 'Source' },
      { title: 'System', align: 'left', key: 'Name' },
      { title: 'License', align: 'left', key: 'License' },
      { title: 'Tags', align: 'center', key: 'Tags' },
      { title: 'License Level', align: 'left', key: 'LicenseLevel' },
      { title: 'SP Cost', align: 'left', key: 'SP' },
    ],
    showUnlicensed: false,
    showOverSP: false,
  }),
  emits: ['equip'],
  computed: {
    freeSP(): number {
      return this.equipped ? this.mech.FreeSP + this.equipped.SP : this.mech.FreeSP;
    },
    systems(): MechSystem[] {
      return CompendiumStore().MechSystems;
    },
    availableSystems(): MechSystem[] {
      // filter unique
      let i = this.systems.filter((x) => x.Source && !x.IsHidden && !x.IsExotic);

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

      i = i
        .concat(this.mech.Pilot.SpecialEquipment.filter((x) => x.ItemType === 'MechSystem'))
        .filter(
          (x) =>
            !this.mech.MechLoadoutController.ActiveLoadout.UniqueSystems.map((y) => y.ID).includes(
              x.ID
            )
        );

      return _.sortBy(i, ['Source', 'Name']);
    },
  },
  methods: {
    fID(template: string): string {
      return flavorID(template);
    },
    handleEquip(sys: MechSystem) {
      if (this.equipped) {
        this.mech.MechLoadoutController.ActiveLoadout.ChangeSystem(
          this.mech.MechLoadoutController.ActiveLoadout.UniqueSystems.indexOf(this.equipped),
          sys
        );
      } else {
        this.mech.MechLoadoutController.ActiveLoadout.AddSystem(sys);
      }

      this.$emit('equip', sys);
    },
  },
};
</script>
