<template>
  <cc-selector-table :items="weapons" :headers="headers" @equip="$emit('equip', $event)">
    <div v-if="item">
      <span class="overline">
        UNION ARMORY PRINTID: {{ fID('ANN-NNN-NNN::AA//AA') }} &mdash;
        <span class="success--text text--darken-1">[ PILOT MATERIEL REGISTRATION VERIFIED ]</span>
      </span>
      <br />
      <span class="heading h1 primary--text" style="line-height: 20px">{{ item.Name }}</span>
      <span class="flavor-text overline mt-n1" style="display: block">CURRENTLY EQUIPPED</span>
    </div>
    <div v-else>
      <span class="overline">
        UNION ARMORY EQUIPMENT AUTHORIZATION: FRAME EQUIPMENT//WEAPON::{{ slot.Size }}
      </span>
      <br />
      <span class="heading h1 grey--text text--lighten-1" style="line-height: 20px">
        NO SELECTION
      </span>
      <span class="flavor-text overline mt-n1 error--text" style="display: block">
        [ MATERIEL ID INVALID OR MISSING ]
      </span>
    </div>
  </cc-selector-table>
</template>

<script lang="ts">
import Vue from 'vue'
import { getModule } from 'vuex-module-decorators'
import { CompendiumStore } from '@/store'

export default Vue.extend({
  name: 'weapon-selector',
  props: {
    slot: {
      type: Object,
      required: true,
    },
  },
  data: () => ({
    headers: [
      { text: 'Source', align: 'left', value: 'Source' },
      { text: 'Weapon', align: 'left', value: 'Name' },
      { text: 'License', align: 'left', value: 'LicenseString' },
      { text: 'Size', align: 'left', value: 'Size' },
      { text: 'Type', align: 'left', value: 'Type' },
      { text: 'Range', align: 'left', value: 'Range' },
      { text: 'Damage', align: 'left', value: 'Damage' },
    ],
    weapons: [],
  }),
  created() {
    const compendium = getModule(CompendiumStore, this.$store)
    this.weapons = compendium.MechWeapons.filter(x => x.Source)
  },
})
</script>
