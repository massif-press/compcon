<template>
  <pl-card-base
    ref="base"
    title="PILOT WEAPON"
    :extended="extended"
    :item="item"
    :readonly="readonly"
    @remove="$emit('remove')"
    @save="$emit('save')"
  >
    <div
      v-if="item"
      class="text-left"
      style="cursor: pointer !important"
      @click="$refs.base.openDetail()"
    >
      <span class="h2 heading text-text" style="line-height: 35px">
        {{ item.Name }}
        <cc-tooltip v-if="item.Note" simple inline :content="item.Note">
          <v-icon small color="active">mdi-note</v-icon>
        </cc-tooltip>
      </span>
      <v-row density="compact" no-gutters class="mt-1">
        <v-col cols="2">
          <cc-range-element small :range="item.Range" />
        </v-col>
        <v-col cols="2">
          <cc-damage-element
            small
            :damage="item.Damage"
            :type-override="item.DamageTypeOverride"
          />
        </v-col>
        <v-col cols="7" class="text-right">
          <cc-tags small :tags="item.Tags" color="secondary" class="mt-n2" />
        </v-col>
      </v-row>
      <v-row v-if="item.notes">
        <v-col v-for="(n, i) in item.notes">
          <cc-tooltip simple inline :content="n">
            <v-icon small color="active">mdi-note</v-icon>
          </cc-tooltip>
        </v-col>
      </v-row>
    </div>
    <v-card-text slot="selector">
      <cc-selector-table
        no-filter
        no-extra
        :items="getWeapons()"
        :headers="headers"
        @equip="equip($event)"
      >
        <div v-if="item">
          <span class="overline">
            GMS ARMORY PRINTID: {{ fID('ANN-NNN-NNN::AA//AA') }} &mdash;
            <span class="text-success text--darken-1">
              [ PILOT ARMAMENT REGISTRATION VERIFIED ]
            </span>
          </span>
          <br />
          <span class="heading h1 text-accent" style="line-height: 20px">{{
            item.Name
          }}</span>
          <span class="flavor-text overline mt-n1" style="display: block"
            >CURRENTLY EQUIPPED</span
          >
        </div>
        <div v-else>
          <span class="overline">
            GMS ARMORY EQUIPMENT AUTHORIZATION: PILOT/PERSONAL ARMAMENT::S0 -
            S3(LTD)
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
import { PilotWeapon, CompendiumItem, ItemType } from '@/class';
import { flavorID } from '@/io/Generators';

export default {
  name: 'pl-pilot-weapon-card',
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
  },
  data: () => ({
    headers: [
      { title: 'Item', align: 'left', value: 'Name' },
      { title: 'Range', align: 'left', value: 'Range[0].Max' },
      { title: 'Damage', align: 'left', value: 'Damage[0].Max' },
      { title: 'Detail', align: 'center', value: 'Detail' },
      { title: '', align: 'center', value: 'Equip' },
    ],
  }),
  methods: {
    equip(item: PilotWeapon) {
      this.$emit('equip', { ...item });
      (this.$refs.base as any).closeSelector();
    },
    getWeapons() {
      const compendium = CompendiumStore();
      let gear = compendium.PilotGear.filter(
        (x: CompendiumItem) =>
          !x.IsHidden && !x.IsExotic && x.ItemType === ItemType.PilotWeapon
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
