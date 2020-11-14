<template>
  <pl-card-base
    ref="base"
    title="PILOT ARMOR"
    :extended="extended"
    :item="item"
    :readonly="readonly"
    @remove="$emit('remove')"
  >
    <div
      v-if="item"
      class="text-left"
      style="cursor: pointer!important; height:100%"
      @click="$refs.base.openDetail()"
    >
      <span :key="item.Name" class="h2 heading text--text" style="line-height: 35px">
        {{ item.Name }}
        <cc-tooltip v-if="item.Note" :key="item.Note.length" simple inline :content="item.Note">
          <v-icon small color="active">mdi-note</v-icon>
        </cc-tooltip>
      </span>
      <v-row dense style="height: calc(100% - 45px)">
        <v-col class="my-auto">
          <cc-tooltip simple inline content="Armor Bonus">
            <v-icon>mdi-shield-outline</v-icon>
          </cc-tooltip>
          <span class="stat-text">{{ armor }}</span>
        </v-col>
        <v-col class="my-auto">
          <cc-tooltip simple inline content="HP Bonus">
            <v-icon>mdi-heart</v-icon>
          </cc-tooltip>
          <span class="stat-text">+{{ hp }}</span>
        </v-col>
        <v-col class="my-auto">
          <cc-tooltip simple inline content="Electronic Defense">
            <v-icon>cci-edef</v-icon>
          </cc-tooltip>
          <span class="stat-text">{{ edef }}</span>
        </v-col>
        <v-col class="my-auto">
          <cc-tooltip simple inline content="Evasion">
            <v-icon>cci-evasion</v-icon>
          </cc-tooltip>
          <span class="stat-text">{{ evasion }}</span>
        </v-col>
        <v-col class="my-auto">
          <cc-tooltip simple inline content="Speed">
            <v-icon>$vuetify.icons.move</v-icon>
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
      <cc-selector-table no-filter :items="getArmor()" :headers="headers" @equip="equip($event)">
        <div v-if="item">
          <span class="overline">
            GMS ARMORY PRINTID: {{ fID('ANN-NNN-NNN::AA//AA') }} &mdash;
            <span class="success--text text--darken-1">
              [ PILOT MATERIEL REGISTRATION VERIFIED ]
            </span>
          </span>
          <br />
          <span class="heading h1 accent--text" style="line-height: 20px">{{ item.Name }}</span>
          <span class="flavor-text overline mt-n1" style="display: block">CURRENTLY EQUIPPED</span>
        </div>
        <div v-else>
          <span class="overline">
            GMS ARMORY EQUIPMENT AUTHORIZATION: PILOT/PERSONAL ARMOR::TI - TVII-A
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
import { PilotArmor, CompendiumItem, ItemType } from '@/class'
import { flavorID } from '@/io/Generators'

export default Vue.extend({
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
  },
  data: () => ({
    headers: [
      { text: 'Item', align: 'left', value: 'Name' },
      { text: 'Armor', align: 'center', value: 'Armor' },
      { text: 'HP Bonus', align: 'center', value: 'HPBonus' },
      { text: 'E-Defense', align: 'center', value: 'EDefense' },
      { text: 'Evasion', align: 'center', value: 'Evasion' },
      { text: 'Speed', align: 'center', value: 'Speed' },
      { text: 'Detail', align: 'center', value: 'Detail' },
    ],
  }),
  computed: {
    armor() {
      const attr = this.item.Bonuses.find(b => b.ID === 'pilot_armor')
      return attr ? attr.Value : 0
    },
    hp() {
      const attr = this.item.Bonuses.find(b => b.ID === 'pilot_hp')
      return attr ? attr.Value : 0
    },
    edef() {
      const attr = this.item.Bonuses.find(b => b.ID === 'pilot_edef')
      return attr ? attr.Value : 0
    },
    evasion() {
      const attr = this.item.Bonuses.find(b => b.ID === 'pilot_evasion')
      return attr ? attr.Value : 0
    },
    speed() {
      const attr = this.item.Bonuses.find(b => b.ID === 'pilot_speed')
      return attr ? attr.Value : 0
    },
  },
  methods: {
    equip(item: PilotArmor) {
      this.$emit('equip', this.$_.clone(item))
      this.$refs.base.closeSelector()
    },
    getArmor() {
      const compendium = getModule(CompendiumStore, this.$store)
      return compendium.PilotGear.filter((x: CompendiumItem) => x.ItemType === ItemType.PilotArmor)
    },
    fID(template: string): string {
      return flavorID(template)
    },
  },
})
</script>
