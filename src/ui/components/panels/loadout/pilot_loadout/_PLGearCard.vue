<template>
  <pl-card-base
    ref="base"
    title="PILOT GEAR"
    :extended="extended"
    :item="item"
    :readonly="readonly"
    @remove="$emit('remove', item)"
    @save="$emit('save')">
    <template v-if="item" #title-items>
      <div class="text-overline mb-n4">ITEM USES</div>
      <div class="text-right">
        <v-icon
          color="secondary"
          class="mt-2"
          :icon="!item.MaxUses ? 'mdi-infinity' : 'mdi-hexagon-slice-6'" />
      </div>
    </template>

    <div
      v-if="item"
      class="text-left"
      style="cursor: pointer !important"
      @click="($refs as any).base.openDetail()">
      <v-card-text class="py-0">
        <div v-html-safe="item.Description" />
      </v-card-text>
      <cc-tags small :tags="item.Tags" color="secondary" />
    </div>
    <template #selector>
      <cc-compendium-browser
        :items="gear"
        item-type="PilotGear"
        :options="options"
        equippable
        :table-headers="headers"
        @equip="equip($event)">
        <template #header>
          <div class="heading h4 text-center text-accent">Select Pilot Equipment</div>
        </template>

        <template #top>
          <div v-if="item">
            <span class="text-overline">
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
            <div class="flavor-text overline mt-n1" style="display: block">CURRENTLY EQUIPPED</div>
          </div>
          <div v-else>
            <span class="text-overline">
              GMS EQUIPMENT AUTHORIZATION: PILOT/ADDITIONAL GEAR (ANY)
            </span>
            <br />
            <span class="heading h1 text-disabled text--lighten-1" style="line-height: 20px">
              NO SELECTION
            </span>
            <span class="flavor-text overline mt-n1 text-error" style="display: block">
              [ EQUIPMENT ID INVALID OR MISSING ]
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
import { PilotGear, CompendiumItem, ItemType, PilotEquipment } from '@/class';
import { flavorID } from '@/io/Generators';

export default {
  name: 'pl-pilot-gear-card',
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
      { title: 'Uses', key: 'MaxUses' },
      { title: 'Tags', align: 'center', key: 'Tags' },
    ],
    options: {
      views: ['single', 'table', 'cards'],
      initialView: 'single',
      groups: ['lcp', 'type'],
      initialGroup: 'type',
      noSource: true,
    },
  }),
  computed: {
    exotics(): PilotGear[] {
      return this.pilot.SpecialEquipment.filter((x) => x.ItemType === 'PilotGear');
    },
    gear(): PilotGear[] {
      let gear = (CompendiumStore().PilotGear as PilotEquipment[]).filter(
        (x: PilotEquipment) => x.ItemType === ItemType.PilotGear && !x.IsHidden && !x.IsExotic
      ) as PilotGear[];

      if (this.exotics.length) {
        gear = gear.concat(this.exotics);
      }

      return gear;
    },
  },
  methods: {
    equip(item: PilotGear) {
      this.$emit('equip', CompendiumItem.Clone(item));
      this.$emit('save');
      (this.$refs.base as any).closeSelector();
      this.$notify({
        title: 'Pilot Gear Equipped',
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
