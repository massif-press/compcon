<template>
  <pl-card-base
    ref="base"
    title="PILOT WEAPON"
    :extended="extended"
    :item="item"
    :readonly="readonly"
    @remove="$emit('remove')"
  >
    <div
      v-if="item"
      class="text-left"
      style="cursor: pointer!important"
      @click="$refs.base.openDetail()"
    >
      <span :key="item.Name" class="h2 heading text--text" style="line-height: 35px">
        {{ item.Name }}
        <cc-tooltip v-if="item.Note" :key="item.Note.length" simple inline :content="item.Note">
          <v-icon small color="active">mdi-note</v-icon>
        </cc-tooltip>
      </span>
      <v-row dense no-gutters class="mt-1">
        <v-col cols="2">
          <cc-range-element small :range="item.Range" />
        </v-col>
        <v-col cols="2">
          <cc-damage-element small :damage="item.Damage" :type-override="item.DamageTypeOverride" />
        </v-col>
        <v-col cols="7" class="text-right">
          <cc-tags small :tags="item.Tags" color="secondary" class="mt-n2" />
        </v-col>
      </v-row>
      <v-row v-if="item.notes">
        <v-col v-for="(n, i) in item.notes" :key="`${item.Name}_n${i}`">
          <cc-tooltip simple inline :content="n">
            <v-icon small color="active">mdi-note</v-icon>
          </cc-tooltip>
        </v-col>
      </v-row>
    </div>
    <v-card-text slot="selector">
      <cc-selector-table no-filter :items="getWeapons()" :headers="headers" @equip="equip($event)">
        <div v-if="item">
          <span class="overline">
            GMS ARMORY PRINTID: {{ fID('ANN-NNN-NNN::AA//AA') }} &mdash;
            <span class="success--text text--darken-1">
              [ PILOT ARMAMENT REGISTRATION VERIFIED ]
            </span>
          </span>
          <br />
          <span class="heading h1 accent--text" style="line-height: 20px">{{ item.Name }}</span>
          <span class="flavor-text overline mt-n1" style="display: block">CURRENTLY EQUIPPED</span>
        </div>
        <div v-else>
          <span class="overline">
            GMS ARMORY EQUIPMENT AUTHORIZATION: PILOT/PERSONAL ARMAMENT::S0 - S3(LTD)
          </span>
          <br />
          <span class="heading h1 subtle--text text--lighten-1" style="line-height: 20px">
            NO SELECTION
          </span>
          <span class="flavor-text overline mt-n1 error--text" style="display: block">
            [ MATERIEL ID INVALID OR MISSING ]
          </span>
        </div>
      </cc-selector-table>
    </v-card-text>
  </pl-card-base>
</template>

<script lang="ts">
import Vue from 'vue'
import PlCardBase from './_PLCardBase.vue'
import { getModule } from 'vuex-module-decorators'
import { CompendiumStore } from '@/store'
import { PilotWeapon, CompendiumItem, ItemType } from '@/class'
import { flavorID } from '@/io/Generators'

export default Vue.extend({
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
  },
  data: () => ({
    headers: [
      { text: 'Item', align: 'left', value: 'Name' },
      { text: 'Range', align: 'left', value: 'Range[0].Max' },
      { text: 'Damage', align: 'left', value: 'Damage[0].Max' },
      { text: 'Detail', align: 'center', value: 'Detail' },
    ],
  }),
  methods: {
    equip(item: PilotWeapon) {
      this.$emit('equip', this.$_.clone(item))
      this.$refs.base.closeSelector()
    },
    getWeapons() {
      const compendium = getModule(CompendiumStore, this.$store)
      return compendium.PilotGear.filter((x: CompendiumItem) => x.ItemType === ItemType.PilotWeapon)
    },
    fID(template: string): string {
      return flavorID(template)
    },
  },
})
</script>
