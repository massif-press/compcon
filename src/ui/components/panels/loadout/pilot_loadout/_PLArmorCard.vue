<template>
  <pl-card-base
    ref="base"
    title="PILOT ARMOR"
    :extended="extended"
    :item="item"
    :readonly="readonly"
    @remove="$emit('remove')"
    @save="$emit('save')"
  >
    <div
      v-if="item"
      class="text-left"
      style="cursor: pointer !important; height: 100%; min-height: 80px"
      @click="$refs.base.openDetail()"
    >
      <span class="h2 heading text-text" style="line-height: 35px">
        {{ item.Name }}
        <cc-tooltip v-if="item.Note" simple inline :content="item.Note">
          <v-icon small color="active">mdi-note</v-icon>
        </cc-tooltip>
      </span>
      <v-row density="compact" class="pb-2">
        <v-col class="my-auto">
          <cc-tooltip simple inline content="Armor Bonus">
            <v-icon icon="mdi-shield-outline" />
          </cc-tooltip>
          <span class="stat-text">{{ item.Armor(pilot) }}</span>
        </v-col>
        <v-col class="my-auto">
          <cc-tooltip simple inline content="HP Bonus">
            <v-icon icon="mdi-heart" />
          </cc-tooltip>
          <span class="stat-text">+{{ item.HPBonus(pilot) }}</span>
        </v-col>
        <v-col class="my-auto">
          <cc-tooltip simple inline content="Electronic Defense">
            <v-icon icon="cc:e_def" />
          </cc-tooltip>
          <span class="stat-text">{{ item.EDefense(pilot) }}</span>
        </v-col>
        <v-col class="my-auto">
          <cc-tooltip simple inline content="Evasion">
            <v-icon icon="cc:evasion" />
          </cc-tooltip>
          <span class="stat-text">{{ item.Evasion(pilot) }}</span>
        </v-col>
        <v-col class="my-auto">
          <cc-tooltip simple inline content="Speed">
            <v-icon icon="mdi-arrow-right-bold-hexagon-outline" />
          </cc-tooltip>
          <span class="stat-text">{{ item.Speed(pilot) }}</span>
        </v-col>
      </v-row>
      <v-row no-gutters class="mt-n3">
        <v-col cols="auto" class="ml-auto mr-4 mt-n2">
          <cc-tags small :tags="item.Tags" color="secondary" />
        </v-col>
      </v-row>
    </div>
    <v-card-text slot="selector">
      <cc-selector-table
        no-filter
        no-extra
        :items="getArmor()"
        :headers="headers"
        @equip="equip($event)"
      >
        <div v-if="item">
          <span class="text-overline">
            GMS ARMORY PRINTID: {{ fID('ANN-NNN-NNN::AA//AA') }} &mdash;
            <span class="text-success text--darken-1">
              [ PILOT MATERIEL REGISTRATION VERIFIED ]
            </span>
          </span>
          <br />
          <span class="heading h1 text-accent" style="line-height: 20px">{{ item.Name }}</span>
          <span class="flavor-text overline mt-n1" style="display: block">CURRENTLY EQUIPPED</span>
        </div>
        <div v-else>
          <span class="text-overline">
            GMS ARMORY EQUIPMENT AUTHORIZATION: PILOT/PERSONAL ARMOR::TI - TVII-A
          </span>
          <br />
          <span class="heading h1 text-subtle text--lighten-1" style="line-height: 20px">
            NO SELECTION
          </span>
          <span class="flavor-text overline mt-n1 text-error" style="display: block">
            [ MATERIEL ID INVALID OR MISSING ]
          </span>
        </div>
      </cc-selector-table>
    </v-card-text>
  </pl-card-base>
</template>

<script lang="ts">
import PlCardBase from './_PLCardBase.vue';

import { CompendiumStore } from '@/stores';
import { PilotArmor, CompendiumItem, ItemType } from '@/class';
import { flavorID } from '@/io/Generators';

export default {
  name: 'pl-pilot-armor-card',
  components: { PlCardBase },
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
    exotics: {
      type: Array,
      required: false,
      default: () => [],
    },
    pilot: {
      type: Object,
      required: true,
    },
  },
  data: () => ({
    headers: [
      { title: 'Item', align: 'left', value: 'Name' },
      { title: 'Armor', align: 'center', value: 'Armor' },
      { title: 'HP Bonus', align: 'center', value: 'HPBonus' },
      { title: 'E-Defense', align: 'center', value: 'EDefense' },
      { title: 'Evasion', align: 'center', value: 'Evasion' },
      { title: 'Speed', align: 'center', value: 'Speed' },
      { title: '', align: 'center', value: 'Equip' },
    ],
  }),
  methods: {
    equip(item: PilotArmor) {
      this.$emit('equip', { ...item });
      (this.$refs.base as any).closeSelector();
    },
    getArmor() {
      const compendium = CompendiumStore();
      let gear = compendium.PilotGear.filter(
        (x: CompendiumItem) => !x.IsHidden && !x.IsExotic && x.ItemType === ItemType.PilotArmor
      );
      if (this.exotics.length) {
        gear = gear.concat(this.exotics);
      }
      return gear;
    },
    fID(template: string): string {
      return flavorID(template);
    },
  },
};
</script>
