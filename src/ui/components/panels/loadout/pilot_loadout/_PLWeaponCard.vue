<template>
  <pl-card-base
    ref="base"
    title="PILOT WEAPON"
    :extended="extended"
    :item="item"
    :readonly="readonly"
    @remove="$emit('remove', item)"
    @save="$emit('save')">
    <div
      v-if="item"
      class="text-left mt-n4"
      style="cursor: pointer !important"
      @click="($refs as any).base.openDetail()">
      <v-row align="center" justify="space-around" dense>
        <v-col cols="auto">
          <cc-range-element :range="item.Range" />
        </v-col>
        <v-col cols="auto">
          <cc-damage-element :damage="item.Damage" :type-override="item.DamageTypeOverride" />
        </v-col>
      </v-row>
      <cc-tags size="small" :tags="item.Tags" color="secondary" />
      <v-row v-if="item.notes">
        <v-col v-for="n in item.notes">
          <cc-tooltip simple inline :content="n">
            <v-icon size="small" color="active">mdi-note</v-icon>
          </cc-tooltip>
        </v-col>
      </v-row>
    </div>

    <template #selector>
      <cc-compendium-browser
        :items="weapons"
        item-type="PilotWeapon"
        :options="options"
        equippable
        :table-headers="headers"
        @equip="equip($event)">
        <template #header>
          <div class="heading h4 text-center text-accent">Select Pilot Weapon</div>
        </template>

        <template #top>
          <div v-if="item">
            <span class="text-cc-overline">
              GMS ARMORY PRINTID: {{ fID('ANN-NNN-NNN::AA//AA') }} &mdash;
              <span class="text-success text--darken-1">
                [ PILOT MATERIEL REGISTRATION VERIFIED ]
              </span>
            </span>
            <br />
            <div class="heading h2 text-accent mt-n2">
              <cc-slashes />
              {{ item.Name }}
            </div>
            <div class="flavor-text text-cc-overline mt-n1" style="display: block">
              CURRENTLY EQUIPPED
            </div>
          </div>
          <div v-else>
            <span class="text-text-cc-overline">
              GMS ARMORY EQUIPMENT AUTHORIZATION: PILOT/PERSONAL ARMAMENT::S0 - S3(LTD)
            </span>
            <br />
            <span class="heading h1 text-disabled text--lighten-1" style="line-height: 20px">
              NO SELECTION
            </span>
            <span class="flavor-text text-cc-overline mt-n1 text-error" style="display: block">
              [ MATERIEL ID INVALID OR MISSING ]
            </span>
          </div>
        </template>
      </cc-compendium-browser>
    </template>
  </pl-card-base>
</template>

<script lang="ts">
import PlCardBase from './_PLCardBase.vue';

import { CompendiumStore } from '@/stores';
import { PilotWeapon, CompendiumItem, ItemType, PilotEquipment } from '@/class';
import { flavorID } from '@/io/Generators';

export default {
  name: 'pl-pilot-weapon-card',
  components: { PlCardBase },
  emits: ['equip', 'remove', 'save'],
  props: {
    item: {
      type: Object,
      required: false,
      default: null,
    },
    extended: {
      type: Boolean,
      required: false,
    },
    readonly: {
      type: Boolean,
    },
    pilot: {
      type: Object,
      required: true,
    },
  },
  data: () => ({
    headers: [
      { title: 'Content Pack', key: 'LcpName' },
      { title: 'Type', key: 'Type' },
      { title: 'Item', key: 'Name' },
      { title: 'Range', key: 'Range' },
      { title: 'Damage', key: 'Damage' },
      { title: 'Tags', align: 'center', key: 'Tags' },
    ],
    options: {
      views: ['single', 'table', 'cards', 'scatter', 'bar', 'compare'],
      initialView: 'single',
      groups: ['lcp', 'type'],
      initialGroup: 'type',
      noSource: true,
    },
  }),
  computed: {
    exotics(): PilotWeapon[] {
      return this.pilot.SpecialEquipment.filter((x) => x.ItemType === 'PilotWeapon');
    },
    weapons(): PilotWeapon[] {
      let weapon = (CompendiumStore().PilotGear as PilotEquipment[]).filter(
        (x: PilotEquipment) => x.ItemType === ItemType.PilotWeapon && !x.IsHidden && !x.IsExotic
      ) as PilotWeapon[];
      if (this.exotics.length) {
        weapon = weapon.concat(this.exotics);
      }

      return weapon;
    },
  },
  methods: {
    equip(item: PilotWeapon) {
      this.$emit('equip', CompendiumItem.Clone(item));
      this.$emit('save');

      (this.$refs.base as any).closeSelector();
      this.$notify({
        title: 'Pilot Weapon Equipped',
        text: `${item.Name} equipped to ${this.pilot.Name}.`,
        data: { icon: 'cc:pilot' },
      });
    },

    fID(template: string): string {
      return flavorID(template);
    },
  },
};
</script>
