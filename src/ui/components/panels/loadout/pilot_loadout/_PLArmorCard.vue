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
          <span class="stat-text">{{ armor }}</span>
        </v-col>
        <v-col class="my-auto">
          <cc-tooltip simple inline content="HP Bonus">
            <v-icon icon="mdi-heart" />
          </cc-tooltip>
          <span class="stat-text">+{{ hp }}</span>
        </v-col>
        <v-col class="my-auto">
          <cc-tooltip simple inline content="Electronic Defense">
            <v-icon icon="cc:edef" />
          </cc-tooltip>
          <span class="stat-text">{{ edef }}</span>
        </v-col>
        <v-col class="my-auto">
          <cc-tooltip simple inline content="Evasion">
            <v-icon icon="cc:evasion" />
          </cc-tooltip>
          <span class="stat-text">{{ evasion }}</span>
        </v-col>
        <v-col class="my-auto">
          <cc-tooltip simple inline content="Speed">
            <v-icon icon="$vuetify.icons.move" />
          </cc-tooltip>
          <span class="stat-text">{{ speed }}</span>
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
          <span class="overline">
            GMS ARMORY PRINTID: {{ fID('ANN-NNN-NNN::AA//AA') }} &mdash;
            <span class="text-success text--darken-1">
              [ PILOT MATERIEL REGISTRATION VERIFIED ]
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
            GMS ARMORY EQUIPMENT AUTHORIZATION: PILOT/PERSONAL ARMOR::TI -
            TVII-A
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
  },
  data: () => ({
    headers: [
      { text: 'Item', align: 'left', value: 'Name' },
      { text: 'Armor', align: 'center', value: 'Armor' },
      { text: 'HP Bonus', align: 'center', value: 'HPBonus' },
      { text: 'E-Defense', align: 'center', value: 'EDefense' },
      { text: 'Evasion', align: 'center', value: 'Evasion' },
      { text: 'Speed', align: 'center', value: 'Speed' },
      { text: '', align: 'center', value: 'Equip' },
    ],
  }),
  computed: {
    armor() {
      const attr = this.item.Bonuses.find((b) => b.ID === 'pilot_armor');
      return attr ? attr.Value : 0;
    },
    hp() {
      const attr = this.item.Bonuses.find((b) => b.ID === 'pilot_hp');
      return attr ? attr.Value : 0;
    },
    edef() {
      const attr = this.item.Bonuses.find((b) => b.ID === 'pilot_edef');
      return attr ? attr.Value : 0;
    },
    evasion() {
      const attr = this.item.Bonuses.find((b) => b.ID === 'pilot_evasion');
      return attr ? attr.Value : 0;
    },
    speed() {
      const attr = this.item.Bonuses.find((b) => b.ID === 'pilot_speed');
      return attr ? attr.Value : 0;
    },
  },
  methods: {
    equip(item: PilotArmor) {
      this.$emit('equip', { ...item });
      (this.$refs.base as any).closeSelector();
    },
    getArmor() {
      const compendium = CompendiumStore();
      let gear = compendium.PilotGear.filter(
        (x: CompendiumItem) =>
          !x.IsHidden && !x.IsExotic && x.ItemType === ItemType.PilotArmor
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
