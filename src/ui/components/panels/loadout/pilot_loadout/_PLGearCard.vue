<template>
  <pl-card-base
    ref="base"
    title="PILOT GEAR"
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
      <v-row dense>
        <v-col>
          <span :key="item.Name" class="h2 heading text--text" style="line-height: 35px">
            {{ item.Name }}
            <cc-tooltip v-if="item.Note" :key="item.Note.length" simple inline :content="item.Note">
              <v-icon small color="active">mdi-note</v-icon>
            </cc-tooltip>
          </span>
        </v-col>
        <v-col cols="auto" class="ml-auto text-right mt-n2">
          <span class="overline">ITEM USES</span>
          <br />
          <v-icon v-if="!item.MaxUses" color="secondary" class="mt-n2 mr-2">mdi-infinity</v-icon>
          <cc-item-uses v-else :item="item" color="secondary" class="mr-2" />
        </v-col>
      </v-row>
      <v-row v-if="!readonly" dense class="mt-2" style="max-height: 200px; overflow-y: scroll">
        <p class="text--text" v-html="item.Description" />
      </v-row>
      <v-row v-if="item.Notes">
        <v-col v-for="(n, i) in item.notes" :key="`${item.Name}_n${i}`">
          <cc-tooltip simple inline :content="n">
            <v-icon small color="active">mdi-note</v-icon>
          </cc-tooltip>
        </v-col>
      </v-row>
    </div>
    <v-card-text slot="selector">
      <cc-selector-table no-filter :items="getGear()" :headers="headers" @equip="equip($event)">
        <div v-if="item">
          <span class="overline">
            GMS EQUIPMENT CATALOG PRINTID: {{ fID('ANN-NNN-NNN::AA//AA') }} &mdash;
            <span class="success--text text--darken-1">
              [ PILOT EQUIPMENT REGISTRATION VERIFIED ]
            </span>
          </span>
          <br />
          <span class="heading h1 accent--text" style="line-height: 20px">{{ item.Name }}</span>
          <span class="flavor-text overline mt-n1" style="display: block">CURRENTLY EQUIPPED</span>
        </div>
        <div v-else>
          <span class="overline">GMS EQUIPMENT AUTHORIZATION: PILOT/ADDITIONAL GEAR (ANY)</span>
          <br />
          <span class="heading h1 subtle--text text--lighten-1" style="line-height: 20px">
            NO SELECTION
          </span>
          <span class="flavor-text overline mt-n1 error--text" style="display: block">
            [ EQUIPMENT ID INVALID OR MISSING ]
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
import { PilotGear, CompendiumItem, ItemType } from '@/class'
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
      { text: 'Uses', align: 'center', value: 'MaxUses' },
      { text: 'Detail', align: 'center', value: 'Detail' },
    ],
  }),
  methods: {
    equip(item: PilotGear) {
      this.$emit('equip', this.$_.clone(item))
      this.$refs.base.closeSelector()
    },
    getGear() {
      const compendium = getModule(CompendiumStore, this.$store)
      return compendium.PilotGear.filter((x: CompendiumItem) => x.ItemType === ItemType.PilotGear)
    },
    fID(template: string): string {
      return flavorID(template)
    },
  },
})
</script>
