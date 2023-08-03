<template>
  <equipment-card-base :item="item">
    <v-row v-if="item.InLcp">
      <div class="heading h3 text-text">{{ item.LcpName }}</div>
    </v-row>
    <v-row>
      <v-container slot="statblock" grid-list-md class="mt-0 pt-1">
        <v-row dense justify="center">
          <cc-statblock-panel icon="$vuetify.icons.armor" name="Armor" :value="item.ArmorString" />
          <cc-statblock-panel
            icon="$vuetify.icons.hp"
            name="HP Bonus"
            :value="`+${item.HpString}`"
          />
          <cc-statblock-panel
            icon="$vuetify.icons.edef"
            name="E-Defense"
            :value="item.EdefString"
          />
          <cc-statblock-panel
            icon="$vuetify.icons.evasion"
            name="Evasion"
            :value="item.EvasionString"
          />
          <cc-statblock-panel icon="$vuetify.icons.speed" name="Speed" :value="item.SpeedString" />
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
})
</script>
