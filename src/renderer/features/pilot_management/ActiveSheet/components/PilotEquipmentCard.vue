<template>
  <v-flex v-if="item && show" xs4>
    <v-card dark color="grey darken-3" class="ma-1" height="100px" style="overflow: hidden">
      <v-card-title class="pa-1" :style="`background-color:${extended ? '#827717' : '#616161'}`">
        <b>{{ item.Name }}</b>
        <v-spacer />
        <v-dialog width="500">
          <template v-slot:activator="{ on }">
            <v-btn absolute right style="right: 0" icon flat dark v-on="on">
              <v-icon dark>mdi-information-outline</v-icon>
            </v-btn>
          </template>
          <v-card>
            <v-card-title class="headline teal darken-2 white--text">
              {{ item.Name }}
            </v-card-title>
            <v-card-text v-html="item.Description" />
          </v-card>
        </v-dialog>
      </v-card-title>
      <v-card-text class="pa-2">
        <!-- Armor -->
        <div v-if="item.ItemType === 'PilotArmor'">
          <v-layout class="text-center font-weight-bold">
            <v-flex v-if="item.HPBonus">HP</v-flex>
            <v-flex>ARMOR</v-flex>
            <v-flex>EVA</v-flex>
            <v-flex v-if="item.evasion_bonus">EVA Bonus</v-flex>
            <v-flex>EDEF</v-flex>
            <v-flex>SPD</v-flex>
            <v-flex v-if="item.speed_bonus">SPD Bonus</v-flex>
          </v-layout>
          <v-layout class="text-center pa-0 ma-0">
            <v-flex v-if="item.HPBonus">+{{ item.hp_bonus }}</v-flex>
            <v-flex>+{{ item.Armor || 0 }}</v-flex>
            <v-flex>{{ item.Evasion || 'N/A' }}</v-flex>
            <v-flex v-if="item.EvasionBonus">+{{ item.EvasionBonus }}</v-flex>
            <v-flex>{{ item.Edefense || 'N/A' }}</v-flex>
            <v-flex>{{ item.Speed }}</v-flex>
            <v-flex v-if="item.SpeedBonus">{item.SpeedBonus}}</v-flex>
          </v-layout>
        </div>
        <!-- Weapon -->
        <div v-else-if="item.ItemType === 'PilotWeapon'">
          <v-layout>
            <v-flex>
              <v-layout justify-space-between>
                <v-flex shrink>
                  <damage-element dark :dmg="item.Damage" />
                </v-flex>
                <v-flex shrink>
                  <range-element dark :range="item.Range" />
                </v-flex>
              </v-layout>
            </v-flex>
          </v-layout>
        </div>
        <!-- Gear -->
        <div v-else>
          <p v-if="!item.MaxUses" class="ma-3 text-center minor-title grey--text">
            Unlimited Uses
          </p>
          <div v-else>
            <v-layout>
              <v-flex shrink>
                <span class="caption grey--text">USES</span>
                <b class="warning--text">{{ item.Uses }} / {{ item.MaxUses }}</b>
              </v-flex>
              <v-flex grow>
                <v-divider class="mt-2 ml-3" />
              </v-flex>
              <v-flex xs1></v-flex>
            </v-layout>
            <v-layout justify-start>
              <limited-bar
                :key="item.Name + '_tb_' + item.Uses"
                :current="item.Uses"
                :max="item.MaxUses"
                large
                color="warning"
                bg-color="grey darken-1"
                empty-icon="mdi-hexagon-outline"
                full-icon="mdi-hexagon"
                @update="item.Uses = $event"
              />
            </v-layout>
          </div>
        </div>
        <p v-if="item.Effect" class="effect-text" v-html="item.Effect" />
      </v-card-text>
    </v-card>
  </v-flex>
</template>

<script lang="ts">
import Vue from 'vue'
import { DamageElement, RangeElement, LimitedBar } from '@/features/pilot_management/components/UI'
export default Vue.extend({
  name: 'pilot-equipment-card',
  components: { DamageElement, RangeElement, LimitedBar },
  props: {
    item: Object,
    show: Boolean,
    extended: Boolean,
  },
})
</script>
