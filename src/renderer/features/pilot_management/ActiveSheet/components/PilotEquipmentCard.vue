<template>
  <v-col v-if="item && show" cols="4">
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
          <v-row class="text-center font-weight-bold">
            <v-col v-if="item.HPBonus">HP</v-col>
            <v-col>ARMOR</v-col>
            <v-col>EVA</v-col>
            <v-col v-if="item.evasion_bonus">EVA Bonus</v-col>
            <v-col>EDEF</v-col>
            <v-col>SPD</v-col>
            <v-col v-if="item.speed_bonus">SPD Bonus</v-col>
          </v-row>
          <v-row class="text-center pa-0 ma-0">
            <v-col v-if="item.HPBonus">+{{ item.hp_bonus }}</v-col>
            <v-col>+{{ item.Armor || 0 }}</v-col>
            <v-col>{{ item.Evasion || 'N/A' }}</v-col>
            <v-col v-if="item.EvasionBonus">+{{ item.EvasionBonus }}</v-col>
            <v-col>{{ item.Edefense || 'N/A' }}</v-col>
            <v-col>{{ item.Speed }}</v-col>
            <v-col v-if="item.SpeedBonus">{item.SpeedBonus}}</v-col>
          </v-row>
        </div>
        <!-- Weapon -->
        <div v-else-if="item.ItemType === 'PilotWeapon'">
          <v-row>
            <v-col>
              <v-row justify-space-between>
                <v-col shrink>
                  <damage-element dark :dmg="item.Damage" />
                </v-col>
                <v-col shrink>
                  <range-element dark :range="item.Range" />
                </v-col>
              </v-row>
            </v-col>
          </v-row>
        </div>
        <!-- Gear -->
        <div v-else>
          <p v-if="!item.MaxUses" class="ma-3 text-center minor-title grey--text">
            Unlimited Uses
          </p>
          <div v-else>
            <v-row>
              <v-col shrink>
                <span class="caption grey--text">USES</span>
                <b class="warning--text">{{ item.Uses }} / {{ item.MaxUses }}</b>
              </v-col>
              <v-col grow>
                <v-divider class="mt-2 ml-3" />
              </v-col>
              <v-col cols="1"></v-col>
            </v-row>
            <v-row justify-start>
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
            </v-row>
          </div>
        </div>
        <p v-if="item.Effect" class="effect-text" v-html="item.Effect" />
      </v-card-text>
    </v-card>
  </v-col>
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
