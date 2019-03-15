<template>
    <v-layout fill-height>
      <v-flex xs2>
        <v-tooltip top>
          <v-btn slot="activator" color="blue-grey darken-1" v-if="!item" block @click="clicked" class="ma-0 pa-0" style="height:100%">{{ fittingType }} Weapon</v-btn>
          <v-btn slot="activator" color="blue-grey darken-1" v-else block @click="clicked" class="ma-0 pa-0" style="height:100%">{{ fittingType }}</v-btn>
          <span v-if="!item">Equip {{fittingType}} Mech Weapon</span>
          <span v-else>Change Equipped {{fittingType}} Mech Weapon</span>
        </v-tooltip>
      </v-flex>
      <v-flex xs10>
        <div v-if="!item">
          <v-expansion-panel class="ma-0">
            <v-expansion-panel-content disabled>
              <span slot="header" class="subheading"> EMPTY </span> 
            </v-expansion-panel-content>
          </v-expansion-panel>
        </div>
        <div v-else>
          <v-expansion-panel class="m-0">
              <v-expansion-panel-content>
            <v-layout slot="header"> 
              <span class="subheading font-weight-bold">{{itemData.name}}</span> 
              <v-spacer />
              <span class="mr-5" style="display: inline-flex;">
                <range-element dark small :range="itemData.range" :neurolinked="hasNeurolinked" />
                &emsp;&mdash;&emsp;
                <damage-element dark small size="16" :dmg="itemData.damage" />
              </span>
            </v-layout>
                <weapon-card :itemData="itemData"/>
              </v-expansion-panel-content>
            </v-expansion-panel>
        </div>
      </v-flex>
    </v-layout>
</template>

<script>
import WeaponCard from '../../UI/WeaponCard'
import RangeElement from '../../UI/RangeElement'
import DamageElement from '../../UI/DamageElement'

export default {
  name: 'mech-weapon-item',
  components: { WeaponCard, RangeElement, DamageElement },
  props: {
    item: Object,
    fittingType: String,
    index: Number
  },
  computed: {
    itemData () {
      if (!this.item) return {}
      return this.$store.getters.getItemById('MechWeapons', this.item.id)
    },
    hasNeurolinked: function () {
      return this.$store.getters.getPilot.core_bonuses.includes('neurolinked')
    }
  },
  methods: {
    clicked () {
      this.$emit('clicked')
    }
  }
}
</script>
