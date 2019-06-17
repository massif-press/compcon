<template>
  <div>
    <v-card flat :color="tableItem ? 'grey lighten-4' : ''">
      <v-card-text class="pa-0 pb-2 pl-2">
        <p
          class="pa-0 pt-2 ml-3 mr-3 mt-1 mb-2 fluff-text"
          v-if="itemData.description"
          v-html="itemData.description"
        />
        <!-- Armor -->
        <div v-if="itemData.ItemType === 'PilotArmor'">
          <v-card color="grey lighten-2" class="mt-3 pt-1 pb-1 mb-2" flat>
            <v-layout class="effect-text text-xs-center">
              <v-flex v-if="itemData.HPBonus">HP Bonus</v-flex>
              <v-flex>Armor</v-flex>
              <v-flex>Evasion</v-flex>
              <v-flex v-if="itemData.evasion_bonus">Evasion Bonus</v-flex>
              <v-flex>E-Defense</v-flex>
              <v-flex>Speed</v-flex>
              <v-flex v-if="itemData.speed_bonus">Speed Bonus</v-flex>
            </v-layout>
          </v-card>
          <v-layout class="title text-xs-center pa-0 ma-0 mb-2">
            <v-flex v-if="itemData.HPBonus">+{{ itemData.hp_bonus }}</v-flex>
            <v-flex>+{{ itemData.Armor || 0 }}</v-flex>
            <v-flex>{{ itemData.Evasion || 'N/A' }}</v-flex>
            <v-flex v-if="itemData.EvasionBonus">
              +{{ itemData.EvasionBonus }}
            </v-flex>
            <v-flex>{{ itemData.Edefense || 'N/A' }}</v-flex>
            <v-flex>{{ itemData.Speed }}</v-flex>
            <v-flex v-if="itemData.SpeedBonus">{itemData.SpeedBonus}}</v-flex>
          </v-layout>
        </div>
        <!-- Weapon -->
        <div v-else-if="itemData.ItemType === 'PilotWeapon'">
          <v-layout class="ml-2">
            <v-flex>
              <damage-element :dmg="itemData.Damage" />
              <range-element :range="itemData.Range" />
            </v-flex>
          </v-layout>
        </div>
        <!-- Gear -->
        <div v-else>
          <p
            v-if="itemData.Uses"
            class="ml-2 effect-text"
            v-html="`${itemData.Uses} Uses`"
          />
        </div>
        <p
          v-if="itemData.Effect"
          class="ml-2 effect-text"
          v-html="itemData.Effect"
        />
        <v-layout class="ml-2">
          <item-tag v-for="t in itemData.Tags" :key="t.id" :tag-obj="t" />
        </v-layout>
      </v-card-text>
    </v-card>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { RangeElement, DamageElement } from './'
import ItemTag from './ItemTag.vue'
import { Pilot } from '@/class'
export default Vue.extend({
  name: 'gear-card',
  components: { DamageElement, RangeElement, ItemTag },
  props: {
    itemData: Object,
    tableItem: Boolean,
  },
})
</script>
