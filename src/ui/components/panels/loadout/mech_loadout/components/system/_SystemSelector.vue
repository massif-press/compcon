<template>
  <cc-compendium-browser
    :items="availableSystems"
    item-type="MechSystem"
    :table-headers="headers"
    :options="options"
    equippable
    @equip="handleEquip($event)">
    <template #header><div class="heading h3 text-center text-accent">Mech SYSTEMS</div></template>
    <template #top>
      <v-row dense>
        <v-col>
          <div v-if="equipped">
            <div v-if="!mobile" class="text-cc-overline">
              UNION ARMORY PRINTID: {{ fID('ANN-NNN-NNN::AA//AA') }} &mdash;
              <span class="text-success">[ FRAME EQUIPMENT REGISTRATION VERIFIED ]</span>
            </div>
            <div class="heading h2 text-accent">
              {{ equipped.Name }}
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
              off-icon="mdi-lock">
              <template #label>
                <v-tooltip>
                  <v-icon :color="showOverSP ? 'warning' : 'success'" icon="cc:system_point" />
                </v-tooltip>
              </template>
            </cc-switch>
          </div>
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
      views: ['list', 'single', 'table', 'cards'],
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
  mounted() {
    this.options.initialView = this.mobile ? 'list' : 'single';
  },
  computed: {
    mobile(): boolean {
      return this.$vuetify.display.smAndDown;
    },
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
