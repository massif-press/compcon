<template>
    <v-layout fill-height>
      <v-flex xs2>
        <v-tooltip top>
          <v-btn slot="activator" color="indigo" v-if="empty" block @click="clicked" class="ma-0 pa-0" style="height:100%">{{ itemType }} Weapon</v-btn>
          <v-btn slot="activator" color="indigo" v-else block @click="clicked" class="ma-0 pa-0" style="height:100%">{{ itemType }}</v-btn>
          <span v-if="empty">Equip {{itemType}} Mech Weapon</span>
          <span v-else>Change Equipped {{itemType}} Mech Weapon</span>
        </v-tooltip>
      </v-flex>
      <v-flex xs10>
        <div v-if="empty">
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
              <span v-if="itemData.type === 'armor'" class="mr-5" style="display: inline-flex;"> 
                ARMOR: {{itemData.armor || 0}} // EDEF: {{itemData.edef || 0}} // EVASION: {{itemData.evasion || 0}} // SPEED: {{itemData.speed || 0}} 
              </span>
              <span v-else-if="itemData.type === 'weapon'" class="mr-5" style="display: inline-flex;">
                <range-element small :range="itemData.range" />
                &emsp;&mdash;&emsp;
                <damage-element small size="16" :dmg="itemData.damage" />
              </span>
              <span v-else class="mr-5" style="display: inline-flex;"> {{itemData.uses ? `${itemData.uses} Uses` : '' }} </span>
            </v-layout>
                <gear-card :itemData="itemData"/>
              </v-expansion-panel-content>
            </v-expansion-panel>
        </div>
      </v-flex>
    </v-layout>
</template>

<script>
import GearCard from '../../UI/GearCard'
import RangeElement from '../../UI/RangeElement'
import DamageElement from '../../UI/DamageElement'

export default {
  name: 'mech-weapon-item',
  components: { GearCard, RangeElement, DamageElement },
  props: {
    'item': Object,
    'empty': Boolean,
    'itemType': String
  },
  computed: {
    itemData () {
      if (this.empty) return {}
      return this.$store.getters.getItemById('PilotGear', this.item.id)
    }
  },
  methods: {
    clicked () {
      this.$emit('clicked')
    }
  }
}
</script>
