<template>
  <equipment-card-base :item="item">
    <v-row v-if="item.InLcp">
      <div class="heading h3 text-text" >{{ item.LcpName }}</div>
    </v-row>
    <v-row>
      <v-container slot="statblock" grid-list-md class="mt-0 pt-1">
        <v-row dense justify="center">
          <cc-statblock-panel icon="$vuetify.icons.armor" name="Armor" :value="armor" />
          <cc-statblock-panel icon="$vuetify.icons.hp" name="HP Bonus" :value="`+${hp}`" />
          <cc-statblock-panel icon="$vuetify.icons.edef" name="E-Defense" :value="edef" />
          <cc-statblock-panel icon="$vuetify.icons.evasion" name="Evasion" :value="evasion" />
          <cc-statblock-panel icon="$vuetify.icons.speed" name="Speed" :value="speed" />
        </v-row>
      </v-container>
    </v-row>
  </equipment-card-base>
</template>

<script lang="ts">
import Vue from 'vue'
import EquipmentCardBase from './_EquipmentCardBase.vue'

export default Vue.extend({
  name: 'cc-mech-weapon-card',
  components: { EquipmentCardBase },
  props: {
    item: {
      type: Object,
      required: true,
    },
  },
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
})
</script>
