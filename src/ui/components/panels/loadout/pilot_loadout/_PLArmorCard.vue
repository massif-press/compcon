<template>
  <pl-card-base
    ref="base"
    title="PILOT ARMOR"
    :extended="extended"
    :item="item"
    :readonly="readonly"
    @remove="$emit('remove', item)"
    @save="$emit('save')"
    @propagate-click="($refs as any).base.openDetail()">
    <div v-if="item" style="cursor: pointer !important" @click="($refs as any).base.openDetail()">
      <v-row align="center" justify="space-around">
        <v-col class="my-auto">
          <v-tooltip text="Armor Bonus">
            <template #activator="{ props }">
              <v-icon v-bind="props" size="large" icon="mdi-shield-outline" />
            </template>
          </v-tooltip>
          <span class="stat-text">{{ item.Armor(pilot) }}</span>
        </v-col>
        <v-col class="my-auto">
          <v-tooltip text="HP Bonus">
            <template #activator="{ props }">
              <v-icon v-bind="props" size="large" icon="mdi-heart" />
            </template>
          </v-tooltip>
          <span class="stat-text">+{{ item.HPBonus(pilot) }}</span>
        </v-col>
        <v-col class="my-auto">
          <v-tooltip text="Electronic Defense">
            <template #activator="{ props }">
              <v-icon v-bind="props" size="large" icon="cc:e_def" />
            </template>
          </v-tooltip>
          <span class="stat-text">{{ item.EDefense(pilot) }}</span>
        </v-col>
        <v-col class="my-auto">
          <v-tooltip text="Evasion">
            <template #activator="{ props }">
              <v-icon v-bind="props" size="large" icon="cc:evasion" />
            </template>
          </v-tooltip>
          <span class="stat-text">{{ item.Evasion(pilot) }}</span>
        </v-col>
        <v-col class="my-auto">
          <v-tooltip text="Speed">
            <template #activator="{ props }">
              <v-icon v-bind="props" size="large" icon="mdi-arrow-right-bold-hexagon-outline" />
            </template>
          </v-tooltip>
          <span class="stat-text">{{ item.Speed(pilot) }}</span>
        </v-col>
      </v-row>
      <v-row v-if="item.Tags && item.Tags.length">
        <v-col>
          <cc-tags small :tags="item.Tags" color="secondary" />
        </v-col>
      </v-row>
    </div>

    <template #selector>
      <cc-compendium-browser
        :items="armor"
        item-type="PilotArmor"
        :options="options"
        equippable
        :table-headers="headers"
        @equip="equip($event)">
        <template #header>
          <div class="heading h4 text-center text-accent">Select Pilot Armor</div>
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
              GMS ARMORY EQUIPMENT AUTHORIZATION: PILOT/PERSONAL ARMOR::TI - TVII-A
            </span>
            <br />
            <span class="heading h1 text-disabled text--lighten-1" style="line-height: 20px">
              NO SELECTION
            </span>
            <span class="flavor-text overline mt-n1 text-error" style="display: block">
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
import { PilotArmor, CompendiumItem, ItemType, PilotEquipment } from '@/class';
import { flavorID } from '@/io/Generators';

export default {
  name: 'pl-pilot-armor-card',
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
      { title: 'Armor', key: 'ArmorString' },
      { title: 'HP Bonus', key: 'HpString' },
      { title: 'E-Defense', key: 'EdefString' },
      { title: 'Evasion', key: 'EvasionString' },
      { title: 'Speed', key: 'SpeedString' },
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
    exotics(): PilotArmor[] {
      return this.pilot.SpecialEquipment.filter((x) => x.ItemType === 'PilotArmor');
    },
    armor(): PilotArmor[] {
      let armor = (CompendiumStore().PilotGear as PilotEquipment[]).filter(
        (x: PilotEquipment) => x.ItemType === ItemType.PilotArmor && !x.IsHidden && !x.IsExotic
      ) as PilotArmor[];
      if (this.exotics.length) {
        armor = armor.concat(this.exotics);
      }

      return armor;
    },
  },
  methods: {
    equip(item: PilotArmor) {
      this.$emit('equip', CompendiumItem.Clone(item));
      this.$emit('save');
      (this.$refs.base as any).closeSelector();
      this.$notify({
        title: 'Pilot Armor Equipped',
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
