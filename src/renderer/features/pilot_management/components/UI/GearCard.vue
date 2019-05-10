<template>
  <div>
    <v-card flat :color="tableItem ? 'grey lighten-4' : ''">
      <v-card-text class="pa-0 pb-2 pl-2">
        <p class="pa-0 pt-2 ml-3 mr-3 mt-1 mb-2 fluff-text" v-if="itemData.description" v-html="itemData.description" />
        <!-- Armor -->
        <div v-if="itemData.type === 'armor'">
          <v-card color="grey lighten-2" class="mt-3 pt-1 pb-1 mb-2" flat>
            <v-layout class="effect-text text-xs-center">
              <v-flex v-if="itemData.hp_bonus">HP Bonus</v-flex>
              <v-flex >Armor</v-flex>
              <v-flex>Evasion</v-flex>
              <v-flex v-if="itemData.evasion_bonus">Evasion Bonus</v-flex>
              <v-flex>E-Defense</v-flex>
              <v-flex>Speed</v-flex>
              <v-flex v-if="itemData.speed_bonus">Speed Bonus</v-flex>
            </v-layout>
          </v-card>
          <v-layout class="title text-xs-center pa-0 ma-0 mb-2">
            <v-flex v-if="itemData.hp_bonus">+{{itemData.hp_bonus}}</v-flex>
            <v-flex>+{{itemData.armor || 0}}</v-flex>
            <v-flex>{{itemData.evasion || 'N/A'}}</v-flex>
            <v-flex v-if="itemData.evasion_bonus">+{{itemData.evasion_bonus}}</v-flex>
            <v-flex>{{itemData.edef || 'N/A'}}</v-flex>
            <v-flex>{{itemData.speed}}</v-flex>
            <v-flex v-if="itemData.speed_bonus">{itemData.speed_bonus}}</v-flex>
          </v-layout>
        </div>
        <!-- Weapon -->
        <div v-else-if="itemData.type === 'weapon'">
          <v-layout class="ml-2">
            <v-flex>
              <damage-element :dmg="itemData.damage" />
              <range-element :range="itemData.range" />
            </v-flex>
          </v-layout>
        </div>
        <!-- Gear -->
        <div v-else>
          <p v-if="itemData.uses" class="ml-2 effect-text" v-html="`${itemData.uses} Uses`" />
        </div>
        <p v-if="itemData.effect" class="ml-2 effect-text" v-html="itemData.effect" />
        <v-layout class="ml-2">
          <item-tag v-for="t in itemData.tags" :key="t.id" :tag-obj="t"/>
        </v-layout>
      </v-card-text>
    </v-card>
  </div>
</template>

<script lang="ts">
  import Vue from 'vue'
  import {RangeElement, DamageElement} from './'
  import ItemTag from './ItemTag.vue'
 
  export default Vue.extend({
    name: 'gear-card',
    components: { DamageElement, RangeElement, ItemTag },
    props: {
      itemData: Object,
      tableItem: Boolean
    },
    computed: {
      pilot (): Pilot {
        return this.$store.getters['getPilot']
      }
    }
  })
</script>
